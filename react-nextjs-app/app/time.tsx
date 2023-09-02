"use client";

import { useState } from "react";
import { useEffect } from "react";

import axios from "axios";

import { RotateCwIcon, FrownIcon } from "lucide-react";

import StopwatchComponent from "./stopwatch";

export default function TimeComponent() {
  // Manage loading state
  const [isLoading, setIsLoading] = useState(true);

  // API data handling
  const [serverEpoch, setServerEpoch] = useState(0);
  const [clientEpoch, setClientEpoch] = useState(0);
  const [epochDiff, setEpochDiff] = useState(0);

  // Error handling
  const [apiMessage, setApiMessage] = useState("");
  const [apiSuccess, setApiSuccess] = useState(true);

  // Function to get the current client time in epoch seconds
  const getClientEpoch = () => {
    return Math.round(Date.now() / 1000);
  };

  const fetchServerTime = async () => {
    setIsLoading(true);

    const config = {
      headers: {
        "Content-Type": `application/json`,
        Authorization: process.env.NEXT_PUBLIC_AUTH,
      },
    };

    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URI}/time`, config)
      .then((e) => {
        if (e.data.epoch === undefined) {
          throw new Error("Epoch time not found");
        }
        setServerEpoch(e.data.epoch);
        const clientEpochSec = getClientEpoch();
        setClientEpoch(clientEpochSec);

        // Calculating time difference between client and server
        const diff = Math.abs(clientEpochSec - e.data.epoch);
        setEpochDiff(diff);

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
    fetchServerTime();

    // Fetching data every 30 seconds
    const intervalId = setInterval(() => {
      fetchServerTime();
    }, 30000);

    return () => clearInterval(intervalId);
  });

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

  return (
    <>
      <h1 className="font-bold text-lg bg-lime-50 p-5">GET /time</h1>
      <div className="h-screen flex items-center">
        {isLoading && (
          <>
            <div className="flex justify-center items-center p-5">
              <RotateCwIcon className="mr-2 h-10 w-10 animate-spin text-lime-600" />
              <h2 className="text-xl font-medium">Loading...</h2>
            </div>
          </>
        )}

        {!isLoading && apiSuccess && (
          <div className="p-5">
            <p>Server Time: {serverEpoch}</p>
            <p>Client Time: {clientEpoch}</p>
            <p>Time Diff: {getStopwatchTime(epochDiff)}</p>
            <p className="text-green-600 font-extrabold text-lg">
              Stopwatch Time:{" "}
              <StopwatchComponent props={{ seconds: epochDiff }} />
            </p>
          </div>
        )}

        {!apiSuccess && (
          <div className="flex justify-center items-center p-5">
            <FrownIcon className="mr-2 h-10 w-10 text-lime-600" />
            <h2 className="text-xl font-medium">Error: {apiMessage}</h2>
          </div>
        )}
      </div>
    </>
  );
}
