import React from "react";

function WorkoutDisplay({ exercise, completedSets, isTimerRunning }) {
  return (
    <div className="workout-display">
      <h2>{exercise.exercise.toUpperCase()}</h2>
      <p>
        {exercise.reps} reps x {exercise.sets} sets{renderWeight(exercise.weight)}
      </p>
      <p>
        {isTimerRunning
          ? `Completed Sets: ${completedSets + 1}/${exercise.sets}`
          : `Current Set: ${completedSets + 1}/${exercise.sets}`}
      </p>
    </div>
  );
}

function renderWeight(weight) {
  if (weight > 0.5) {
    return `. Use ${weight.toString()} lbs.`; // Correct interpolation
  }
  return ''; // Return an empty string if weight is <= 0.5
}

export default WorkoutDisplay;
