"use client";

import { useState } from "react";
import { useEffect } from "react";

export default function StopwatchComponent({ props }: { props: any }) {
  const { seconds } = props;

  const [time, setTime] = useState(seconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setIsRunning(true);

    // Update stopwatch every second
    let stopwatchIntervalId: string | number | NodeJS.Timeout | undefined;
    if (isRunning) {
      stopwatchIntervalId = setInterval(() => {
        setTime((prevTime: number) => prevTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(stopwatchIntervalId);
    };
  }, [isRunning, time]);

  // Function to convert seconds into a stopwatch format
  const getStopwatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = secondsLeft.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return <>{getStopwatchTime(time)}</>;
}
