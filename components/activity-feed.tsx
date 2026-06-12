"use client";

import { useEffect, useState } from "react";

type Activity = {
  id: number;
  message: string;
  time: string;
  status: "success" | "warning" | "critical";
};

const initialActivities: Activity[] = [
  {
    id: 1,
    message:
      "AI detected nitrogen stress in Sector B2",
    time: "2m ago",
    status: "critical",
  },
  {
    id: 2,
    message:
      "Irrigation cycle completed in Field A3",
    time: "5m ago",
    status: "success",
  },
  {
    id: 3,
    message:
      "Sensor SM-04 disconnected",
    time: "9m ago",
    status: "warning",
  },
];

const liveMessages = [
  {
    message:
      "Moisture stabilized in Sector D4",
    status: "success",
  },
  {
    message:
      "Temperature spike detected in Field C1",
    status: "warning",
  },
  {
    message:
      "AI updated crop yield prediction",
    status: "success",
  },
  {
    message:
      "Critical water stress detected",
    status: "critical",
  },
];

export default function ActivityFeed() {
  const [activities, setActivities] =
    useState(initialActivities);

  useEffect(() => {
    const interval = setInterval(() => {
      const random =
        liveMessages[
          Math.floor(
            Math.random() *
              liveMessages.length
          )
        ];

      const newActivity = {
        id: Date.now(),
        message: random.message,
        time: "just now",
        status: random.status as
          | "success"
          | "warning"
          | "critical",
      };

      setActivities((current) => [
        newActivity,
        ...current.slice(0, 5),
      ]);
    }, 5000);

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-green-400">
            Live Activity
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            System Feed
          </h2>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

          <span className="text-sm font-medium text-green-300">
            Live
          </span>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 rounded-2xl border border-white/5 bg-slate-900/50 p-4 transition hover:border-white/10"
          >
            <div
              className={`mt-1 h-3 w-3 rounded-full ${
                activity.status ===
                "success"
                  ? "bg-green-400"
                  : activity.status ===
                    "warning"
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
            />

            <div className="flex-1">
              <p className="text-sm leading-6 text-slate-200">
                {activity.message}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}