"use client";

import { useState } from "react";
import { useEffect } from "react";

import axios from "axios";

import { ScrollArea } from "@/components/ui/scroll-area";

import { RotateCwIcon, FrownIcon } from "lucide-react";

export default function MetricsComponent() {
  // Manage loading state
  const [isLoading, setIsLoading] = useState(true);

  // API data handling
  const [metricsInfo, setMetricsInfo] = useState("");

  // Error handling
  const [apiMessage, setApiMessage] = useState("");
  const [apiSuccess, setApiSuccess] = useState(true);

  const fetchMetrics = async () => {
    setIsLoading(true);

    const config = {
      headers: {
        "Content-Type": `application/json`,
        Authorization: process.env.NEXT_PUBLIC_AUTH,
      },
    };

    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URI}/metrics`, config)
      .then((e) => {
        setMetricsInfo(e.data);

        // Reset Loading state
        setIsLoading(false);
      })
      .catch((e) => {
        setApiMessage(
          e.response?.data?.error
            ? e.response.data.error
            : e.message
            ? e.message
            : "Unknown error"
        );
        setApiSuccess(false);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchMetrics();

    // Fetching data every 30 seconds
    const intervalId = setInterval(() => {
      fetchMetrics();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <h1 className="font-bold text-lg bg-red-50 p-5">GET /metrics</h1>
      <div className="h-screen flex items-center">
        {isLoading && (
          <>
            <div className="flex justify-center items-center p-5">
              <RotateCwIcon className="mr-2 h-10 w-10 animate-spin text-red-600" />
              <h2 className="text-xl font-medium">Loading...</h2>
            </div>
          </>
        )}

        {!isLoading && apiSuccess && (
          <div className="p-5">
            <ScrollArea className="rounded-md h-[700px] bg-slate-50 p-3">
              <pre>
                <code className="text-xs">{metricsInfo}</code>
              </pre>
            </ScrollArea>
          </div>
        )}

        {!apiSuccess && (
          <div className="flex justify-center items-center p-5">
            <FrownIcon className="mr-2 h-10 w-10 text-red-600" />
            <h2 className="text-xl font-medium">Error: {apiMessage}</h2>
          </div>
        )}
      </div>
    </>
  );
}
