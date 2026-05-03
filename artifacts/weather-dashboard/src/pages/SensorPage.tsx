import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Download, Filter, TrendingUp, TableIcon, Eye, EyeOff,
  Thermometer, Wind, Sun, Cloud, Activity, Gauge, Droplets,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  useGetSensorLatest,
  useGetSensorData,
  useGetSensorParameters,
  useGetSensorsSummary,
  getGetSensorLatestQueryKey,
  getGetSensorDataQueryKey,
  getGetSensorParametersQueryKey,
} from "@workspace/api-client-react";

const ICON_MAP: Record<string, React.ElementType> = {
  thermometer: Thermometer,
  wind: Wind,
  sun: Sun,
  cloud: Cloud,
  gauge: Gauge,
  droplets: Droplets,
  activity: Activity,
  "cloud-rain": Cloud,
  compass: Wind,
  settings: Activity,
};

const SENSOR_COLORS: Record<string, string> = {
  aqt560: "#0ea5e9",
  ws500: "#10b981",
  smp10: "#f59e0b",
  dr30: "#8b5cf6",
};

const QUICK_RANGES = [
  { value: "2d",  label: "Last 2 days",   days: 2  },
  { value: "5d",  label: "Last 5 days",   days: 5  },
  { value: "1w",  label: "Last 1 week",   days: 7  },
  { value: "2w",  label: "Last 2 weeks",  days: 14 },
  { value: "3w",  label: "Last 3 weeks",  days: 21 },
  { value: "1m",  label: "Last 1 month",  days: 30 },
  { value: "custom", label: "Custom range", days: 0 },
] as const;

const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100] as const;

function formatTs(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch { return iso; }
}

function formatFull(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  } catch { return iso; }
}

function downsample<T>(arr: T[], maxPoints: number): T[] {
  if (arr.length <= maxPoints) return arr;
  const step = arr.length / maxPoints;
  return Array.from({ length: maxPoints }, (_, i) => arr[Math.round(i * step)]);
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export function SensorPage({ sensorId }: { sensorId: string }) {
  const color = SENSOR_COLORS[sensorId] ?? "#0ea5e9";

  const [quickRange, setQuickRange] = useState<string>("2d");
  const [customFrom, setCustomFrom]  = useState("");
  const [customTo,   setCustomTo]    = useState("");
  const [showChart,  setShowChart]   = useState(true);
  const [selectedParam, setSelectedParam] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(0);

  const { data: allSummaries } = useGetSensorsSummary();
  const csvUpdate = allSummaries?.find((s) => s.id === sensorId)?.lastCsvUpdate ?? null;

  const { data: parameters, isLoading: loadingParams } = useGetSensorParameters(sensorId, {
    query: { enabled: !!sensorId, queryKey: getGetSensorParametersQueryKey(sensorId) },
  });

  const { data: latest, isLoading: loadingLatest } = useGetSensorLatest(sensorId, {
    query: { enabled: !!sensorId, queryKey: getGetSensorLatestQueryKey(sensorId) },
  });

  const { effectiveFrom, effectiveTo } = useMemo(() => {
    if (quickRange === "custom") {
      return { effectiveFrom: customFrom || undefined, effectiveTo: customTo || undefined };
    }
    if (!latest?.timestamp) return { effectiveFrom: undefined, effectiveTo: undefined };
    const days = QUICK_RANGES.find((r) => r.value === quickRange)?.days ?? 2;
    const latestDate = new Date(latest.timestamp);
    const fromDate  = new Date(latestDate.getTime() - days * 86_400_000);
    const fmt = (d: Date) => d.toISOString().slice(0, 16);
    return { effectiveFrom: fmt(fromDate), effectiveTo: fmt(latestDate) };
  }, [quickRange, customFrom, customTo, latest?.timestamp]);

  const queryParams = useMemo(() => ({
    from: effectiveFrom,
    to:   effectiveTo,
  }), [effectiveFrom, effectiveTo]);

  const dataEnabled = !!sensorId && (quickRange === "custom" || !loadingLatest);

  const { data: sensorData, isLoading: loadingData } = useGetSensorData(
    sensorId,
    queryParams,
    { query: { enabled: dataEnabled, queryKey: getGetSensorDataQueryKey(sensorId, queryParams) } },
  );

  const activeParam = selectedParam || (parameters?.[0]?.key ?? "");
  const allRows   = sensorData?.rows ?? [];
  const csvTotal  = sensorData?.csvTotal;

  const chartData = useMemo(() => {
    if (!allRows.length || !activeParam) return [];
    const mapped = allRows.map((row) => ({
      ts:    formatTs(String(row["timestamp"])),
      value: typeof row[activeParam] === "number"
        ? (row[activeParam] as number)
        : parseFloat(String(row[activeParam])),
    }));
    return downsample(mapped, 500);
  }, [allRows, activeParam]);

  const totalPages = Math.ceil(allRows.length / rowsPerPage);
  const pageRows   = allRows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const tableColumns = parameters
    ? ["timestamp", ...parameters.map((p) => p.key)]
    : allRows.length > 0 ? Object.keys(allRows[0]) : [];

  const rangeLabel = quickRange === "custom"
    ? "Custom range"
    : QUICK_RANGES.find((r) => r.value === quickRange)?.label ?? "";

  function handleRangeChange(val: string) { setQuickRange(val); setPage(0); }

  function handleExport() {
    const p = new URLSearchParams({ sensor: sensorId });
    if (effectiveFrom) p.set("from", effectiveFrom);
    if (effectiveTo)   p.set("to",   effectiveTo);
    window.open(`/api/export/excel?${p.toString()}`, "_blank");
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {sensorId.toUpperCase()}_DATA — Parameters
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loadingData
              ? "Loading..."
              : `${(sensorData?.total ?? 0).toLocaleString()} filtered rows${
                  csvTotal !== undefined ? ` of ${csvTotal.toLocaleString()} total CSV rows` : ""
                }`}
          </p>
          <span className="inline-flex items-center gap-1 mt-1.5 text-xs text-muted-foreground bg-muted/50 border border-border rounded-full px-2.5 py-0.5">
            <Activity className="h-3 w-3 shrink-0" />
            CSV Updated:{" "}
            {csvUpdate
              ? new Date(csvUpdate).toLocaleString("en-GB", {
                  day: "2-digit", month: "short", year: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit",
                })
              : "Not available"}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="self-start">
          <Download className="h-4 w-4 mr-2" /> Export Excel
        </Button>
      </div>

      {/* Latest Reading Cards */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Latest Readings
        </h2>
        <motion.div
          variants={container} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3"
        >
          {(loadingLatest || loadingParams)
            ? Array(6).fill(0).map((_, i) => (
                <Card key={i} className="border-border">
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-24" /><Skeleton className="h-6 w-16" /><Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
              ))
            : (parameters ?? []).map((param) => {
                const Icon = ICON_MAP[param.iconType] ?? Activity;
                const val = latest?.data?.[param.key];
                const displayVal = val !== undefined && val !== null
                  ? (typeof val === "number" ? (val as number).toFixed(1) : String(val))
                  : "--";
                return (
                  <motion.div key={param.key} variants={item}>
                    <Card className="border-border hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150">
                      <CardContent className="p-4">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center mb-2"
                          style={{ backgroundColor: `${color}18`, color }}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="text-lg font-bold text-foreground leading-tight">
                          {displayVal}
                          {param.unit && (
                            <span className="text-xs font-normal text-muted-foreground ml-1">{param.unit}</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 leading-tight line-clamp-2">
                          {param.label}
                        </div>
                        {latest?.timestamp && (
                          <div className="text-[10px] text-muted-foreground/60 mt-1">
                            {formatFull(latest.timestamp)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
        </motion.div>
      </div>

      {/* Date Range Selector */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground shrink-0">
              <Filter className="h-4 w-4 text-primary" /> Date Range
            </div>
            <Select value={quickRange} onValueChange={handleRangeChange}>
              <SelectTrigger className="w-44 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QUICK_RANGES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {quickRange === "custom" && (
              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="text-xs text-muted-foreground font-medium block mb-1">From</label>
                  <input
                    type="datetime-local"
                    className="text-sm border border-input rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ring"
                    value={customFrom}
                    onChange={(e) => { setCustomFrom(e.target.value); setPage(0); }}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium block mb-1">To</label>
                  <input
                    type="datetime-local"
                    className="text-sm border border-input rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ring"
                    value={customTo}
                    onChange={(e) => { setCustomTo(e.target.value); setPage(0); }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Parameter Chart
              {showChart && allRows.length > 500 && (
                <span className="text-xs font-normal text-muted-foreground">(max 500 points shown)</span>
              )}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {showChart && (
                <Select value={activeParam} onValueChange={(v) => { setSelectedParam(v); }}>
                  <SelectTrigger className="w-full sm:w-64 bg-white">
                    <SelectValue placeholder="Select parameter..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(parameters ?? []).map((p) => (
                      <SelectItem key={p.key} value={p.key}>
                        {p.label}{p.unit ? ` (${p.unit})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button
                size="sm" variant="outline"
                onClick={() => setShowChart((v) => !v)}
                className="flex items-center gap-1.5 shrink-0"
              >
                {showChart ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showChart ? "Hide Chart" : "Show Chart"}
              </Button>
            </div>
          </div>
        </CardHeader>
        {showChart && (
          <CardContent>
            {loadingData ? (
              <Skeleton className="h-72 w-full rounded-lg" />
            ) : chartData.length === 0 ? (
              <div className="h-72 flex items-center justify-center text-muted-foreground text-sm">
                No data available for the selected period.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="ts"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    interval={Math.max(0, Math.floor(chartData.length / 8))}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255,255,255,0.95)",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone" dataKey="value"
                    name={parameters?.find((p) => p.key === activeParam)?.label ?? activeParam}
                    stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        )}
      </Card>

      {/* Data Table */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TableIcon className="h-4 w-4 text-primary" /> Data Table
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground shrink-0">Rows per page:</span>
              <Select
                value={String(rowsPerPage)}
                onValueChange={(v) => { setRowsPerPage(Number(v)); setPage(0); }}
              >
                <SelectTrigger className="w-20 bg-white h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROWS_PER_PAGE_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {!loadingData && sensorData && (
            <p className="text-xs text-muted-foreground mt-1">
              Showing {pageRows.length.toLocaleString()} of{" "}
              {allRows.length.toLocaleString()} filtered rows
              {csvTotal !== undefined && ` | Total CSV rows: ${csvTotal.toLocaleString()}`}
              {` | Range: ${rangeLabel}`}
            </p>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {loadingData ? (
            <div className="p-6 space-y-3">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
          ) : allRows.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No data available for the selected period.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      {tableColumns.map((col) => {
                        const meta = parameters?.find((p) => p.key === col);
                        return (
                          <th
                            key={col}
                            className="px-3 py-2.5 text-left font-semibold text-muted-foreground whitespace-nowrap"
                          >
                            {meta ? meta.label : col === "timestamp" ? "Timestamp" : col}
                            {meta?.unit && (
                              <span className="font-normal ml-1 opacity-60">({meta.unit})</span>
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        {tableColumns.map((col) => (
                          <td
                            key={col}
                            className="px-3 py-2 whitespace-nowrap text-foreground/80 font-mono"
                          >
                            {col === "timestamp"
                              ? formatFull(String(row[col]))
                              : String(row[col] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
                  <span className="text-xs text-muted-foreground">
                    Page {page + 1} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm" variant="outline"
                      disabled={page === 0}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm" variant="outline"
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

    </motion.div>
  );
}
