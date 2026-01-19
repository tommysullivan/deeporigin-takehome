import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useClerk,
} from "@clerk/clerk-react";
import { getClickAnalytics } from "@/data/getClickAnalytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";

export const Route = createFileRoute("/analytics/$id")({
  component: DashboardDetails,
});

function DashboardDetails() {
  const { id } = Route.useParams();
  const { redirectToSignIn } = useClerk();
  const [analytics, setAnalytics] = useState<{
    buckets: { bucket: Date; count: number }[];
    startTime: string;
    endTime: string;
    totalClicks: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"all" | "7d" | "30d" | "custom">(
    "all",
  );
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const fetchAnalytics = () => {
    setLoading(true);

    let startTime: string | undefined;
    let endTime: string | undefined;

    if (timeRange === "7d") {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      startTime = start.toISOString();
      endTime = end.toISOString();
    } else if (timeRange === "30d") {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      startTime = start.toISOString();
      endTime = end.toISOString();
    } else if (timeRange === "custom" && customStart && customEnd) {
      startTime = new Date(customStart).toISOString();
      endTime = new Date(customEnd).toISOString();
    }

    getClickAnalytics({ data: { urlId: Number(id), startTime, endTime } })
      .then(setAnalytics)
      .catch((error: any) => {
        console.error("Error fetching analytics:", error);
        if (error.message === "Unauthorized") {
          redirectToSignIn();
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnalytics();
  }, [id, timeRange]);

  const handleCustomRangeApply = () => {
    if (customStart && customEnd) {
      setTimeRange("custom");
      fetchAnalytics();
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Calculate bucket size and whether we should show times
  const timeRangeMs = analytics
    ? new Date(analytics.endTime).getTime() -
      new Date(analytics.startTime).getTime()
    : 0;
  const bucketSizeMs = timeRangeMs / 30;
  const showTimes = timeRangeMs < 3 * 24 * 60 * 60 * 1000; // Show times if range < 3 days

  const chartData =
    analytics?.buckets.map((bucket) => {
      const startTime = new Date(bucket.bucket);
      const endTime = new Date(startTime.getTime() + bucketSizeMs);

      return {
        time: startTime.getTime(),
        endTime: endTime.getTime(),
        clicks: bucket.count,
        startLabel: showTimes
          ? formatTime(startTime)
          : formatDateShort(startTime),
        fullRange: `${formatDate(startTime)} - ${formatDate(endTime)}`,
      };
    }) || [];

  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800">
      <nav className="text-right p-3">
        <Nav />
      </nav>
      <SignedIn>
        <main className="flex justify-center p-4">
          <div className="w-full max-w-6xl">
            <div className="flex items-center gap-4 mb-6">
              <Link
                to="/dashboard"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold">Click Analytics</h1>
            </div>

            {loading ? (
              <p>Loading analytics...</p>
            ) : !analytics ? (
              <p className="text-gray-400">No analytics data available.</p>
            ) : (
              <>
                <div className="bg-slate-700 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        Total Clicks
                      </h2>
                      <p className="text-4xl font-bold text-blue-400">
                        {analytics.totalClicks}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-400">
                      <div>From: {formatDate(analytics.startTime)}</div>
                      <div>To: {formatDate(analytics.endTime)}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Time Range</h3>
                  {analytics && (
                    <div className="mb-2 text-sm text-gray-300">
                      Viewing:{" "}
                      <span className="font-mono">
                        {formatDate(analytics.startTime)}
                      </span>{" "}
                      to{" "}
                      <span className="font-mono">
                        {formatDate(analytics.endTime)}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => setTimeRange("all")}
                      className={`px-4 py-2 rounded transition-colors ${
                        timeRange === "all"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                      }`}
                    >
                      All Time
                    </button>
                    <button
                      onClick={() => setTimeRange("7d")}
                      className={`px-4 py-2 rounded transition-colors ${
                        timeRange === "7d"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                      }`}
                    >
                      Last 7 Days
                    </button>
                    <button
                      onClick={() => setTimeRange("30d")}
                      className={`px-4 py-2 rounded transition-colors ${
                        timeRange === "30d"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                      }`}
                    >
                      Last 30 Days
                    </button>
                  </div>

                  <div className="border-t border-slate-600 pt-4">
                    <h4 className="text-sm font-semibold mb-2 text-gray-300">
                      Custom Range
                    </h4>
                    <div className="flex flex-wrap gap-2 items-end">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Start Date
                        </label>
                        <input
                          type="datetime-local"
                          value={customStart}
                          onChange={(e) => setCustomStart(e.target.value)}
                          className="bg-slate-800 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          End Date
                        </label>
                        <input
                          type="datetime-local"
                          value={customEnd}
                          onChange={(e) => setCustomEnd(e.target.value)}
                          className="bg-slate-800 text-white px-3 py-2 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={handleCustomRangeApply}
                        disabled={!customStart || !customEnd}
                        className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Click Distribution
                  </h3>
                  {chartData.length === 0 ? (
                    <p className="text-gray-400">
                      No clicks in the selected time range.
                    </p>
                  ) : (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis
                          dataKey="time"
                          stroke="#94a3b8"
                          angle={-45}
                          textAnchor="end"
                          tickFormatter={(time) => {
                            const d = new Date(time);
                            return showTimes
                              ? formatTime(d)
                              : formatDateShort(d);
                          }}
                          height={80}
                        />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#334155",
                            border: "1px solid #475569",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#e2e8f0" }}
                          itemStyle={{ color: "#60a5fa" }}
                          labelFormatter={(value, payload) => {
                            if (payload && payload[0]) {
                              return payload[0].payload.fullRange;
                            }
                            return formatDate(new Date(value));
                          }}
                        />
                        <Bar dataKey="clicks" fill="#60a5fa" />
                        <Brush
                          dataKey="time"
                          height={30}
                          stroke="#60a5fa"
                          fill="#1e293b"
                          tickFormatter={(time) => {
                            const d = new Date(time);
                            return showTimes
                              ? formatTime(d)
                              : formatDateShort(d);
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </SignedIn>
      <SignedOut>
        <main className="flex justify-center p-4">
          <div className="w-full max-w-4xl text-center">
            <h1 className="text-3xl font-bold mb-6">Click Analytics</h1>
            <p className="text-gray-400 mb-4">
              This page requires you to{" "}
              <SignInButton>
                <span className="text-blue-300 hover:underline cursor-pointer">
                  sign in
                </span>
              </SignInButton>
            </p>
          </div>
        </main>
      </SignedOut>
    </div>
  );
}
