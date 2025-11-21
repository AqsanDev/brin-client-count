"use client";

import { useState, useEffect, useCallback } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { ChartViewControl } from "@/components/Chart-view-control";
import { Button } from "@/components/ui/button";
import { appConfig, DEFAULT_SESSION, type Session } from "@/lib/config";

interface RawClientCountItem {
  id?: string;
  kawasan?: string;
  session?: Session;
  dhcp?: number;
  dynamic?: number;
  hotspot?: number;
  guest?: number;
  createdAt?: string;
}

interface ChartDataPoint {
  id: string;
  timestamp: number;
  total: number;
  dhcp: number;
  dynamic: number;
  hotspot: number;
  guest: number;
}

interface ApiClientCountResponse {
  status: "success" | "error";
  message?: string;
  data?: {
    location: string;
    session: Session;
    clientCount: RawClientCountItem[];
  };
}

interface ChartProps {
  initialLocation?: string;
  initialSession?: Session;
  initialDataLimit?: number | "all" | "custom";
  initialCustomLimit?: number;
}

export function Chart({
  initialLocation,
  initialSession = DEFAULT_SESSION,
  initialDataLimit = 10,
  initialCustomLimit = 10,
}: ChartProps = {}) {
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || appConfig.locations[0] || ""
  );
  const [selectedSession, setSelectedSession] = useState<Session>(initialSession);
  const [dataLimit, setDataLimit] = useState<number | "all" | "custom">(initialDataLimit);
  const [customLimit, setCustomLimit] = useState(initialCustomLimit);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const timeFormatter = useCallback((value: number | string, options?: Intl.DateTimeFormatOptions) => {
    const date = new Date(typeof value === "number" ? value : Number(value));
    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      ...options,
    }).format(date);
  }, []);

  const fetchData = useCallback(async () => {
    if (!selectedLocation) {
      setError("Lokasi belum dipilih");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        location: selectedLocation,
        session: selectedSession,
      });
      const limitValue =
        dataLimit === "all" ? "all" : dataLimit === "custom" ? String(customLimit) : String(dataLimit);
      params.set("limit", limitValue);

      const response = await fetch(`/api/client-count?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const payload = (await response.json()) as ApiClientCountResponse;

      if (payload.status !== "success") {
        throw new Error(payload.message ?? "Gagal memuat data client count");
      }

      const clientCountArray = Array.isArray(payload.data?.clientCount)
        ? payload.data?.clientCount ?? []
        : [];

      const processedData: ChartDataPoint[] = clientCountArray.map((item, index) => {
        const createdAtDate = item.createdAt ? new Date(item.createdAt) : new Date();
        const timestamp = createdAtDate.getTime() || Date.now();
        const dhcp = Number(item.dhcp ?? 0);
        const dynamic = Number(item.dynamic ?? 0);
        const hotspot = Number(item.hotspot ?? 0);
        const guest = Number(item.guest ?? 0);
        const total = dhcp + dynamic + hotspot + guest;

        return {
          id: item.id ?? `client-${index}`,
          timestamp,
          total,
          dhcp,
          dynamic,
          hotspot,
          guest,
        };
      });

      // Sort by timestamp if possible
      processedData.sort((a, b) => {
        const aTime = new Date(a.timestamp).getTime();
        const bTime = new Date(b.timestamp).getTime();
        if (!isNaN(aTime) && !isNaN(bTime)) {
          return aTime - bTime;
        }
        return 0;
      });

      setChartData(processedData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLocation, selectedSession, dataLimit, customLimit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartConfig = {
    dhcp: {
      label: "DHCP",
      color: "#ff6b6b",
    },
    dynamic: {
      label: "Dynamic",
      color: "#00c389",
    },
    hotspot: {
      label: "Hotspot",
      color: "#1f9dff",
    },
    guest: {
      label: "Guest",
      color: "#d946ef",
    },
  } satisfies ChartConfig;

  const calculateTrend = () => {
    if (chartData.length < 2) return null;
    const first = chartData[0].total;
    const last = chartData[chartData.length - 1].total;
    const diff = last - first;
    const percent = first !== 0 ? ((diff / first) * 100).toFixed(1) : "0";
    return { diff, percent, isPositive: diff >= 0 };
  };

  const trend = calculateTrend();
  const totalClients = chartData.reduce((sum, item) => sum + item.total, 0);
  const averageClients = chartData.length > 0 ? (totalClients / chartData.length).toFixed(1) : "0";
  const latestSnapshot = chartData[chartData.length - 1];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Client Count - {selectedLocation ? selectedLocation.charAt(0).toUpperCase() + selectedLocation.slice(1) : "Loading..."}
              </CardTitle>
              <CardDescription className="mt-1">
                Data untuk sesi {selectedSession === "pagi" ? "Pagi" : "Siang"}
                {lastUpdated && (
                  <span className="ml-2 text-xs">
                    (Diperbarui:{" "}
                    {new Intl.DateTimeFormat("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }).format(lastUpdated)}
                    )
                  </span>
                )}
              </CardDescription>
            </div>
            <Button
              onClick={fetchData}
              disabled={loading}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <ChartViewControl
            selectedLocation={selectedLocation}
            selectedSession={selectedSession}
            dataLimit={dataLimit}
            customLimit={customLimit}
            onLocationChange={setSelectedLocation}
            onSessionChange={setSelectedSession}
            onDataLimitChange={setDataLimit}
            onCustomLimitChange={setCustomLimit}
          />

          {/* Error State */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Chart */}
          {!error && (
            <>
              {loading && chartData.length === 0 ? (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Memuat data...</p>
                  </div>
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  <p>Tidak ada data untuk ditampilkan</p>
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                  <LineChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                      left: 12,
                      right: 12,
                      top: 12,
                      bottom: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      minTickGap={20}
                      tickFormatter={(value) =>
                        timeFormatter(value, {
                          day: "2-digit",
                          month: "short",
                        })
                      }
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <ChartTooltip
                      cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }}
                      content={
                        <ChartTooltipContent
                          indicator="line"
                          labelFormatter={(value) =>
                            timeFormatter(value, {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          }
                        />
                      }
                    />
                    <ChartLegend verticalAlign="top" content={<ChartLegendContent />} />
                    <Line
                      dataKey="dhcp"
                      name="DHCP"
                      type="monotone"
                      stroke="var(--color-dhcp)"
                      strokeWidth={3}
                      strokeLinecap="round"
                      dot={{ r: 4, strokeWidth: 2, stroke: "var(--color-dhcp)", fill: "#fff" }}
                      activeDot={{ r: 6, strokeWidth: 2.5, stroke: "var(--color-dhcp)", fill: "#fff" }}
                    />
                    <Line
                      dataKey="dynamic"
                      name="Dynamic"
                      type="monotone"
                      stroke="var(--color-dynamic)"
                      strokeWidth={3}
                      strokeLinecap="round"
                      dot={{ r: 4, strokeWidth: 2, stroke: "var(--color-dynamic)", fill: "#fff" }}
                      activeDot={{ r: 6, strokeWidth: 2.5, stroke: "var(--color-dynamic)", fill: "#fff" }}
                    />
                    <Line
                      dataKey="hotspot"
                      name="Hotspot"
                      type="monotone"
                      stroke="var(--color-hotspot)"
                      strokeWidth={3}
                      strokeLinecap="round"
                      dot={{ r: 4, strokeWidth: 2, stroke: "var(--color-hotspot)", fill: "#fff" }}
                      activeDot={{ r: 6, strokeWidth: 2.5, stroke: "var(--color-hotspot)", fill: "#fff" }}
                    />
                    <Line
                      dataKey="guest"
                      name="Guest"
                      type="monotone"
                      stroke="var(--color-guest)"
                      strokeWidth={3}
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                      dot={{ r: 4, strokeWidth: 2, stroke: "var(--color-guest)", fill: "#fff" }}
                      activeDot={{ r: 6, strokeWidth: 2.5, stroke: "var(--color-guest)", fill: "#fff" }}
                    />
                  </LineChart>
                </ChartContainer>
              )}
            </>
          )}
        </CardContent>
        {!error && chartData.length > 0 && (
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex items-center gap-4 w-full">
              <div className="flex-1">
                <div className="text-muted-foreground">Total Client</div>
                <div className="text-2xl font-bold">{totalClients.toLocaleString()}</div>
              </div>
              <div className="flex-1">
                <div className="text-muted-foreground">Rata-rata</div>
                <div className="text-2xl font-bold">{averageClients}</div>
              </div>
              {trend && (
                <div className="flex-1">
                  <div className="text-muted-foreground">Tren</div>
                  <div className={`flex items-center gap-1 text-2xl font-bold ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                    {trend.isPositive ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                    {trend.isPositive ? "+" : ""}{trend.percent}%
                  </div>
                </div>
              )}
            </div>
            {latestSnapshot && (
              <div className="w-full">
                <div className="text-muted-foreground text-xs uppercase tracking-wide mb-2">
                  Snapshot terakhir ({timeFormatter(latestSnapshot.timestamp)})
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "DHCP", value: latestSnapshot.dhcp },
                    { label: "Dynamic", value: latestSnapshot.dynamic },
                    { label: "Hotspot", value: latestSnapshot.hotspot },
                    { label: "Guest", value: latestSnapshot.guest },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border bg-muted/30 p-3">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        {item.label}
                      </div>
                      <div className="text-xl font-semibold">
                        {item.value.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
