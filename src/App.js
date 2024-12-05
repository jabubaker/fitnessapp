import React, { useState } from "react";
import "./App.css";
import Timer from "./components/Timer";
import WorkoutInput from "./components/WorkoutInput";
import WorkoutDisplay from "./components/WorkoutDisplay";

function App() {
  const [program, setProgram] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const parseWorkout = (input) => {
    const lines = input.split("\n");
    return lines.map((line) => {
 const match = line.match(/(\d+)x(\d+)\s+(.+?)(?:\s+(\d+(?:\.\d+)?))?$/);
    if (match) {
      return {
        sets: parseInt(match[1], 10),
        reps: parseInt(match[2], 10),
        exercise: match[3].trim(),
        weight: match[4] ? parseFloat(match[4], 10) : 0, // Default weight to 0 if not provided
        completedSets: 0,        
};
      }
      return null;
    }).filter(Boolean);
  };

  const handleInput = (input) => {
    const parsedProgram = parseWorkout(input);
    if (parsedProgram.length === 0) {
      alert("Please enter a valid workout program. Example format: 3x10 squats 135#");
      return;
    }
    setProgram(parsedProgram);
    setCurrentExerciseIndex(0);
    setShowTimer(false);
    setIsTimerRunning(false);
  };

  const moveToNextExercise = () => {
    if (currentExerciseIndex < program.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      return true;
    }
    return false;
  };

  const handleSetCompletion = () => {
    setShowTimer(true);
    setIsTimerRunning(true);
  };

 const handleTimerComplete = () => {
  const updatedProgram = [...program];
  const exercise = updatedProgram[currentExerciseIndex];
  exercise.completedSets += 1;

  setIsTimerRunning(false);
  setShowTimer(false);

  if (exercise.completedSets >= exercise.sets) {
    if (currentExerciseIndex === program.length - 1) {
      // Mark the workout as complete
      setIsWorkoutComplete(true);
    } else {
      // Move to the next exercise
      setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
    }
  }

  setProgram(updatedProgram);
};
  const skipTimer = () => {
    setIsTimerRunning(false);
    setShowTimer(false);
    handleTimerComplete();
  };

  const currentExercise = program[currentExerciseIndex];

  return (
    <div className="app">
      <div className="app-container">
        <h1>💪 Workout Tracker</h1>
        <WorkoutInput onSubmit={handleInput} />
        
        {program.length > 0 && !isWorkoutComplete && (
          <>
            <WorkoutDisplay
              exercise={currentExercise}
              completedSets={currentExercise.completedSets}
              isTimerRunning={isTimerRunning}
            />
            
            {showTimer ? (
              <div className="timer-container">
                <Timer duration={60} onComplete={handleTimerComplete} />
                <button className="skip-timer-button" onClick={skipTimer}>
                  Skip Rest
                </button>
              </div>
            ) : (
              <button 
                className="next-set-button" 
                onClick={handleSetCompletion}
                disabled={currentExercise.completedSets >= currentExercise.sets}
              >
                Complete Set
              </button>
            )}
          </>
        )}

        {isWorkoutComplete && program.length > 0 && (
          <div className="completion-message">
            🎉 Workout Complete! Great job! 🎉
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
