import React, { useState, useEffect } from "react";

function Timer({ duration, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onComplete]);

  return (
    <div className="timer">
      Rest Time: <span className="timer-countdown">{timeLeft}s</span>
    </div>
  );
}

export default Timer;

