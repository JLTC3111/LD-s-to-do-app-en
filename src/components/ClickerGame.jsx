
import { useState } from "react";

export function ClickerGame() {
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  function handleClick() {
    setScore(prevScore => prevScore + multiplier);
  }

  function upgradeMultiplier() {
    setScore(prevScore => {
      if (prevScore >= 10) {
        setMultiplier(prevMultiplier => prevMultiplier + 1);
        return prevScore - 10;
      }
      return prevScore;
    });
  }

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white max-w-sm mx-auto text-center">
      <h2 className="text-lg font-bold">Productivity Clicker</h2>
      <p className="text-xl font-semibold">Score: {score}</p>
      <button onClick={handleClick} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Click Me!
      </button>
      <button
        onClick={upgradeMultiplier}
        disabled={score < 10}
        className="mt-2 ml-2 px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
      >
        Upgrade (10 pts)
      </button>
    </div>
  );
}
