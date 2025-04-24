import { useState, useEffect } from "react";

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          clearInterval(timer);
          setIsBreak(!isBreak);
          return isBreak ? 25 * 60 : 5 * 60; // Switch between work and break
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, isBreak]);

  function toggleTimer() {
    setIsRunning(!isRunning);
  }

  function resetTimer() {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setIsBreak(false);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white max-w-sm mx-auto text-center">
      <h2 className="text-lg font-bold">{isBreak ? "Break Time!" : "Work Session"}</h2>
      <p className="text-xl font-semibold">{formatTime(timeLeft)}</p>
      <button onClick={toggleTimer} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        {isRunning ? "Pause" : "Start"}
      </button>
      <button onClick={resetTimer} className="mt-2 ml-2 px-4 py-2 bg-red-500 text-white rounded">
        Reset
      </button>
    </div>
  );
}
