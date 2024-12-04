import React from "react";

function WorkoutDisplay({ exercise, completedSets, isTimerRunning }) {
  return (
    <div className="workout-display">
      <h2>{exercise.exercise.toUpperCase()}</h2>
      <p>
        {exercise.reps} reps x {exercise.sets} sets @ {exercise.weight} lbs
      </p>
      <p>
        {isTimerRunning ? 
          `Completed Sets: ${completedSets + 1}/${exercise.sets}` :
          `Current Set: ${completedSets + 1}/${exercise.sets}`
        }
      </p>
    </div>
  );
}

export default WorkoutDisplay;
