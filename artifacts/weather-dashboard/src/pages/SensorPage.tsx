import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Download, Filter, RotateCcw, TrendingUp, TableIcon,
  Thermometer, Wind, Sun, Cloud, Activity, Gauge, Droplets
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  useGetSensorLatest,
  useGetSensorData,
  useGetSensorParameters,
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

function formatTs(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
    });
  } catch { return iso; }
}

function formatFull(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
  } catch { return iso; }
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const ROWS_PER_PAGE = 20;

export function SensorPage({ sensorId }: { sensorId: string }) {
  const color = SENSOR_COLORS[sensorId] ?? "#0ea5e9";

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");
  const [selectedParam, setSelectedParam] = useState<string>("");
  const [page, setPage] = useState(0);

  const { data: parameters, isLoading: loadingParams } = useGetSensorParameters(sensorId, {
    query: { enabled: !!sensorId, queryKey: getGetSensorParametersQueryKey(sensorId) },
  });

  const { data: latest, isLoading: loadingLatest } = useGetSensorLatest(sensorId, {
    query: { enabled: !!sensorId, queryKey: getGetSensorLatestQueryKey(sensorId) },
  });

  const queryParams = useMemo(() => ({
    from: appliedFrom || undefined,
    to: appliedTo || undefined,
    limit: 500,
  }), [appliedFrom, appliedTo]);

  const { data: sensorData, isLoading: loadingData } = useGetSensorData(
    sensorId,
    queryParams,
    { query: { enabled: !!sensorId, queryKey: getGetSensorDataQueryKey(sensorId, queryParams) } }
  );

  const activeParam = selectedParam || (parameters?.[0]?.key ?? "");

  const chartData = useMemo(() => {
    if (!sensorData?.rows || !activeParam) return [];
    return sensorData.rows.map((row) => ({
      ts: formatTs(String(row["timestamp"])),
      value: typeof row[activeParam] === "number" ? row[activeParam] : parseFloat(String(row[activeParam])),
    }));
  }, [sensorData, activeParam]);

  const tableRows = sensorData?.rows ?? [];
  const totalPages = Math.ceil(tableRows.length / ROWS_PER_PAGE);
  const pageRows = tableRows.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);
  const tableColumns = parameters
    ? ["timestamp", ...parameters.map((p) => p.key)]
    : tableRows.length > 0
      ? Object.keys(tableRows[0])
      : [];

  function applyFilter() {
    setAppliedFrom(from);
    setAppliedTo(to);
    setPage(0);
  }

  function resetFilter() {
    setFrom(""); setTo(""); setAppliedFrom(""); setAppliedTo(""); setPage(0);
  }

  function handleExport() {
    const p = new URLSearchParams({ sensor: sensorId });
    if (appliedFrom) p.set("from", appliedFrom);
    if (appliedTo) p.set("to", appliedTo);
    window.open(`/api/export/excel?${p.toString()}`, "_blank");
  }

  const sensorLabel = sensorId.toUpperCase().replace("SMP10", "SMP10").replace("DR30", "DR30");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Parameters — {sensorId.toUpperCase()}_DATA
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {sensorData ? `${sensorData.total.toLocaleString()} records` : "Loading..."}
            {(appliedFrom || appliedTo) && " · filtered"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="self-start"
          data-testid="btn-export-sensor"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Excel
        </Button>
      </div>

      {/* Latest Reading Cards */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Latest Readings
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3"
        >
          {(loadingLatest || loadingParams)
            ? Array(6).fill(0).map((_, i) => (
                <Card key={i} className="border-border">
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
              ))
            : (parameters ?? []).map((param) => {
                const Icon = ICON_MAP[param.iconType] ?? Activity;
                const val = latest?.data?.[param.key];
                const displayVal = val !== undefined && val !== null
                  ? (typeof val === "number" ? val.toFixed(1) : String(val))
                  : "--";
                return (
                  <motion.div key={param.key} variants={item}>
                    <Card
                      className="border-border hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150"
                      data-testid={`card-param-${param.key.replace(/\s/g,"-").replace(/[^a-z0-9-]/gi,"")}`}
                    >
                      <CardContent className="p-4">
                        <div
                          className="h-8 w-8 rounded-lg flex items-center justify-center mb-2"
                          style={{ backgroundColor: `${color}18`, color }}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="text-lg font-bold text-foreground leading-tight">
                          {displayVal}
                          {param.unit && (
                            <span className="text-xs font-normal text-muted-foreground ml-1">{param.unit}</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 leading-tight line-clamp-2">{param.label}</div>
                        {latest?.timestamp && (
                          <div className="text-[10px] text-muted-foreground/70 mt-1">
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

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Filter className="h-4 w-4 text-primary" />
              Filter by date range
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-1">From</label>
                <input
                  type="datetime-local"
                  className="w-full text-sm border border-input rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ring"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  data-testid="input-filter-from"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-1">To</label>
                <input
                  type="datetime-local"
                  className="w-full text-sm border border-input rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ring"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  data-testid="input-filter-to"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={applyFilter} data-testid="btn-apply-filter">
                <Filter className="h-4 w-4 mr-1" /> Apply
              </Button>
              <Button size="sm" variant="outline" onClick={resetFilter} data-testid="btn-reset-filter">
                <RotateCcw className="h-4 w-4 mr-1" /> Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Parameter Chart
            </CardTitle>
            <Select value={activeParam} onValueChange={setSelectedParam}>
              <SelectTrigger className="w-full sm:w-72 bg-white" data-testid="select-chart-param">
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
          </div>
        </CardHeader>
        <CardContent>
          {loadingData ? (
            <Skeleton className="h-72 w-full rounded-lg" />
          ) : chartData.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-muted-foreground text-sm">
              No data available for the selected range.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="ts"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  interval={Math.floor(chartData.length / 8)}
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
                  type="monotone"
                  dataKey="value"
                  name={parameters?.find((p) => p.key === activeParam)?.label ?? activeParam}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TableIcon className="h-4 w-4 text-primary" />
              Data Table
            </span>
            {sensorData && (
              <span className="text-xs font-normal text-muted-foreground">
                {sensorData.total.toLocaleString()} rows
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingData ? (
            <div className="p-6 space-y-3">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
          ) : tableRows.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No data available.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-xs" data-testid="data-table">
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
                            {meta?.unit && <span className="font-normal ml-1 opacity-70">({meta.unit})</span>}
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
                          <td key={col} className="px-3 py-2 whitespace-nowrap text-foreground/80 font-mono">
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
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
                  <span className="text-xs text-muted-foreground">
                    Page {page + 1} of {totalPages} · {tableRows.length.toLocaleString()} rows
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page === 0}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      data-testid="btn-prev-page"
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      data-testid="btn-next-page"
                    >
                      Next
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
