import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Cloud, Wind, Sun, Download, Settings,
  Activity, Clock, Database, ArrowRight, RefreshCw, CheckCircle2, HardDrive
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  useGetSensorsSummary,
  useGetLoggerInterval,
  useSetLoggerInterval,
} from "@workspace/api-client-react";

const SENSOR_ICONS: Record<string, React.ElementType> = {
  aqt560: Cloud,
  ws500: Wind,
  smp10: Sun,
  dr30: Sun,
};

const SENSOR_ROUTES: Record<string, string> = {
  aqt560: "/sensors/aqt560",
  ws500: "/sensors/ws500",
  smp10: "/sensors/smp10",
  dr30: "/sensors/dr30",
};

const INTERVALS = [
  { label: "Every 15 minutes", code: "15M" },
  { label: "Every 30 minutes", code: "30M" },
  { label: "Every 45 minutes", code: "45M" },
  { label: "Every 1 hour", code: "1H" },
  { label: "Every 2 hours", code: "2H" },
  { label: "Every 3 hours", code: "3H" },
  { label: "Every 4 hours", code: "4H" },
  { label: "Every 1 day", code: "1D" },
];

const SENSOR_NAMES = ["All Sensors", "AQT560_DATA", "WS500_DATA", "SMP10_DATA", "DR30_DATA"];
const SENSOR_IDS = ["all", "aqt560", "ws500", "smp10", "dr30"];

function formatTimestamp(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatCsvUpdate(iso: string | null | undefined) {
  if (!iso) return "Not available";
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  } catch {
    return "Not available";
  }
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: summary, isLoading: loadingSummary } = useGetSensorsSummary();
  const { data: loggerInterval } = useGetLoggerInterval();
  const setIntervalMutation = useSetLoggerInterval();

  const [selectedInterval, setSelectedInterval] = useState<string>("");
  const [exportSensor, setExportSensor] = useState("all");
  const [exportFrom, setExportFrom] = useState("");
  const [exportTo, setExportTo] = useState("");

  function handleApplyInterval() {
    const found = INTERVALS.find((i) => i.code === selectedInterval);
    if (!found) {
      toast({ title: "Select an interval", description: "Please choose an interval first.", variant: "destructive" });
      return;
    }
    setIntervalMutation.mutate(
      { data: { intervalLabel: found.label, intervalCode: found.code } },
      {
        onSuccess: () => {
          toast({ title: "Interval Updated", description: "Sampling interval saved. DT80W command integration can be connected later." });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to update interval.", variant: "destructive" });
        },
      }
    );
  }

  function handleExport() {
    const params = new URLSearchParams();
    params.set("sensor", exportSensor);
    if (exportFrom) params.set("from", exportFrom);
    if (exportTo) params.set("to", exportTo);
    window.open(`/api/export/excel?${params.toString()}`, "_blank");
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Hero Description Banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 lg:p-8 shadow-lg"
        style={{ background: "linear-gradient(135deg, #0c4a6e 0%, #075985 40%, #0e7490 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-30%] right-[-10%] w-48 h-48 rounded-full bg-cyan-300/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[10%] w-40 h-40 rounded-full bg-sky-300/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide leading-tight">
              Welcome to Smart Weather Station Dashboard
            </h1>
            <p className="text-cyan-200 text-sm font-medium mt-1">Environmental Monitoring Dashboard</p>
          </div>

          <div className="max-w-2xl">
            <p className="text-white/85 text-sm leading-relaxed">
              This dashboard provides a clear overview of environmental and air quality readings
              from the Smart Weather Station. Users can monitor sensor records, view trends,
              filter data by date and time, and download Excel reports for analysis.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mt-1">
            {[
              { label: "4 Active Sensors", icon: Activity },
              { label: "Live CSV Data", icon: Database },
              { label: "Excel Export", icon: Download },
            ].map(({ label, icon: Icon }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-medium border border-white/20 backdrop-blur-sm"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sensor Status Overview */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          Sensor Status Overview
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {loadingSummary
            ? Array(4).fill(0).map((_, i) => (
                <Card key={i} className="border-border">
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-8 w-full mt-2" />
                  </CardContent>
                </Card>
              ))
            : (summary ?? []).map((sensor) => {
                const Icon = SENSOR_ICONS[sensor.id] ?? Activity;
                return (
                  <motion.div key={sensor.id} variants={item}>
                    <Card
                      className="border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                      style={{ borderTopColor: sensor.color, borderTopWidth: 3 }}
                      onClick={() => setLocation(SENSOR_ROUTES[sensor.id])}
                    >
                      <CardContent className="p-5">
                        <div className="flex flex-col items-center mb-3">
                          <div
                            className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${sensor.color}20`, color: sensor.color }}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <h3 className="font-bold text-sm leading-tight text-center mt-1.5" style={{ color: sensor.color }}>
                            {sensor.displayName}
                          </h3>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Last Record
                            </span>
                            <span className="font-medium text-foreground text-right">
                              {sensor.latestTimestamp !== "N/A"
                                ? formatTimestamp(sensor.latestTimestamp)
                                : "No data"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Parameters</span>
                            <span className="font-semibold" style={{ color: sensor.color }}>
                              {sensor.parameterCount}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Records</span>
                            <span className="font-semibold" style={{ color: sensor.color }}>
                              {sensor.rowCount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                              <CheckCircle2 className="h-3 w-3" />
                              Active
                            </span>
                          </div>
                          <div className="flex items-start justify-between border-t border-border pt-1.5 mt-1 gap-2">
                            <span className="text-muted-foreground flex items-center gap-1 shrink-0">
                              <HardDrive className="h-3 w-3" /> Last CSV Update
                            </span>
                            <span className="font-medium text-foreground text-right text-[11px] leading-tight">
                              {formatCsvUpdate(sensor.lastCsvUpdate)}
                            </span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full mt-4 h-8 text-xs font-medium text-primary hover:text-primary group-hover:bg-primary/5 border border-primary/20"
                          onClick={(e) => { e.stopPropagation(); setLocation(SENSOR_ROUTES[sensor.id]); }}
                        >
                          View Details
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
        </motion.div>
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logger Interval */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4 text-primary" />
              Data Logger Sampling Interval
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loggerInterval && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                <RefreshCw className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Current:</span>
                <span className="font-semibold text-foreground">{loggerInterval.intervalLabel}</span>
                <span className="ml-auto font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {loggerInterval.intervalCode}
                </span>
              </div>
            )}
            <Select value={selectedInterval} onValueChange={setSelectedInterval}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select new interval..." />
              </SelectTrigger>
              <SelectContent>
                {INTERVALS.map((i) => (
                  <SelectItem key={i.code} value={i.code}>
                    {i.label} ({i.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleApplyInterval}
              disabled={!selectedInterval || setIntervalMutation.isPending}
              className="w-full"
            >
              {setIntervalMutation.isPending ? (
                <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Applying...</>
              ) : (
                <><Settings className="h-4 w-4 mr-2" /> Apply Interval to Logger</>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Interval is saved locally. Real DT80W command integration will be connected later via FTP/TCP.
            </p>
          </CardContent>
        </Card>

        {/* Excel Export */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Download className="h-4 w-4 text-primary" />
              Download Excel Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={exportSensor} onValueChange={setExportSensor}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SENSOR_NAMES.map((name, i) => (
                  <SelectItem key={SENSOR_IDS[i]} value={SENSOR_IDS[i]}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-1">From</label>
                <input
                  type="datetime-local"
                  className="w-full text-sm border border-input rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ring"
                  value={exportFrom}
                  onChange={(e) => setExportFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-1">To</label>
                <input
                  type="datetime-local"
                  className="w-full text-sm border border-input rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ring"
                  value={exportTo}
                  onChange={(e) => setExportTo(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleExport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
