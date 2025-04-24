import { useState, useEffect } from "react";

export function BalloonPopGame() {
  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBalloon = {
        id: Date.now(),
        left: Math.random() * 80 + 10, // Random horizontal position
        bottom: 0, // Start at the bottom
      };
      setBalloons((prevBalloons) => [...prevBalloons, newBalloon]);
      console.log("New balloon:", newBalloon); // Debugging output
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setBalloons((prevBalloons) =>
        prevBalloons
          .map((balloon) => ({
            ...balloon,
            bottom: balloon.bottom + 10, // Move up by 10px
          }))
          .filter((balloon) => balloon.bottom < window.innerHeight) // Remove when off screen
      );
    }, 100);

    return () => clearInterval(moveInterval);
  }, []);

  function popBalloon(id) {
    setBalloons((prevBalloons) => prevBalloons.filter((balloon) => balloon.id !== id));
    setScore((prev) => prev + 1);
  }

  return (
    <div className="relative w-full h-screen bg-blue-200 border-2 border-black overflow-hidden">
      <h2 className="text-lg font-bold text-center">Balloon Pop Game</h2>
      <p className="text-xl font-semibold text-center">Score: {score}</p>


      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          className="absolute w-12 h-16 bg-red-500 rounded-full cursor-pointer border-4 border-black"
          style={{
            left: `${balloon.left}%`,
            bottom: `${balloon.bottom || 10}px`, // Ensure bottom exists
            zIndex: 50, // Ensure balloons appear on top
            transition: "bottom 0.1s linear", // Smooth animation
          }}
          onClick={() => popBalloon(balloon.id)}
        />
      ))}
    </div>
  );
}
