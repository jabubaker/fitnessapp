import React, { useState, useEffect } from "react";
import "./App.css";
import Timer from "./components/Timer";
import WorkoutInput from "./components/WorkoutInput";
import WorkoutDisplay from "./components/WorkoutDisplay";

function App() {
  const [program, setProgram] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showTimer, setShowTimer] = useState(false);

  // Parse workout input to structured data
  const parseWorkout = (input) => {
    const lines = input.split("\n");
    return lines.map((line) => {
      const match = line.match(/(\d+)x(\d+)\s+(.+?)\s+(\d+(?:\.\d+)?)#/);
      if (match) {
        return {
          sets: parseInt(match[1], 10),
          reps: parseInt(match[2], 10),
          exercise: match[3].trim(),
          weight: parseFloat(match[4]),
          completedSets: 0,
        };
      }
      return null;
    }).filter(Boolean);
  };

  // Handle workout input change
  const handleInput = (input) => {
    setProgram(parseWorkout(input));
    setCurrentExerciseIndex(0); // Reset to start from the first exercise
  };

  // Increment completed set and show timer or next exercise
  const incrementSet = () => {
    const updatedProgram = [...program];
    const exercise = updatedProgram[currentExerciseIndex];
    exercise.completedSets += 1;

    if (exercise.completedSets < exercise.sets) {
      setShowTimer(true);
    } else {
      setShowTimer(false);
      setCurrentExerciseIndex((prev) => prev + 1);
    }
    setProgram(updatedProgram);
  };

  return (
    <div className="app">
      <h1>💪 Workout Tracker</h1>
      <WorkoutInput onSubmit={handleInput} />
      {program.length > 0 && currentExerciseIndex < program.length && (
        <WorkoutDisplay
          exercise={program[currentExerciseIndex]}
          completedSets={program[currentExerciseIndex].completedSets}
        />
      )}
      {showTimer ? (
        <Timer duration={60} onComplete={incrementSet} />
      ) : (
        currentExerciseIndex < program.length && (
          <button className="next-set-button" onClick={incrementSet}>
            Complete Set
          </button>
        )
      )}
      {program.length > 0 && currentExerciseIndex >= program.length && (
        <div className="completion-message">
          🎉 Workout Complete! Great job! 🎉
        </div>
      )}
    </div>
  );
}

export default App;

