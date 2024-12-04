import React from "react";

function WorkoutDisplay({ exercise, completedSets }) {
  return (
    <div className="workout-display">
      <h2>{exercise.exercise}</h2>
      <p>
        {exercise.reps} reps x {exercise.sets} sets @ {exercise.weight} lbs
      </p>
      <p>Completed Sets: {completedSets}</p>
    </div>
  );
}

export default WorkoutDisplay;

