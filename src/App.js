import React, { useState } from "react";
import "./App.css";
import Timer from "./components/Timer";
import WorkoutInput from "./components/WorkoutInput";
import WorkoutDisplay from "./components/WorkoutDisplay";
import VoiceControl from "./components/VoiceControl";
import { useTrainerVoice } from "./components/TrainerVoice";

function App() {
  const [program, setProgram] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const { speak } = useTrainerVoice();

  const announceExercise = (exercise, isFirstExercise = false) => {
    const weightAnnouncement = exercise.weight !== null ? ` with ${exercise.weight} pounds` : '';
    const exerciseDetails = `${exercise.exercise}: ${exercise.sets} sets of ${exercise.reps} reps${weightAnnouncement}`;

    if (isFirstExercise) {
      speak(`Let's start your workout! ${exerciseDetails}`, 'exercise');
    } else {
      speak(exerciseDetails, 'exercise');
    }
  };

  const handleSetCompletion = () => {
    setShowTimer(true);
    setIsTimerRunning(true);
    const currentExercise = program[currentExerciseIndex];
    const nextSet = currentExercise.completedSets + 1;

    if (nextSet === currentExercise.sets) {
      speak(null, 'lastSet');
    } else {
      speak(null, 'rest');
    }
  };

  const handleTimerComplete = () => {
    const updatedProgram = [...program];
    const exercise = updatedProgram[currentExerciseIndex];
    exercise.completedSets += 1;
    setIsTimerRunning(false);
    setShowTimer(false);

    if (exercise.completedSets >= exercise.sets) {
      if (currentExerciseIndex === program.length - 1) {
        setIsWorkoutComplete(true);
        speak(null, 'completion');
      } else {
        setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
        const nextExercise = updatedProgram[currentExerciseIndex + 1];
        announceExercise(nextExercise);
      }
    } else {
      speak(`${exercise.completedSets + 1} of ${exercise.sets}`, 'nextSet');
    }
    setProgram(updatedProgram);
  };

  const parseWorkout = (input) => {
    const lines = input.split("\n");
    return lines.map((line) => {
      const match = line.match(/(\d+)x(\d+)\s+(.+?)(?:\s+(\d+(?:\.\d+)?)#)?$/);
      if (match) {
        return {
          sets: parseInt(match[1], 10),
          reps: parseInt(match[2], 10),
          exercise: match[3].trim(),
          weight: match[4] ? parseFloat(match[4]) : null,
          completedSets: 0,
        };
      }
      return null;
    }).filter(Boolean);
  };

  const handleInput = (input) => {
    const parsedProgram = parseWorkout(input);
    if (parsedProgram.length === 0) {
      alert("Please enter a valid workout program.\nFormat examples:\n3x10 pushups\n3x10 squats 135#");
      return;
    }
    setProgram(parsedProgram);
    setCurrentExerciseIndex(0);
    setShowTimer(false);
    setIsTimerRunning(false);
    setIsWorkoutComplete(false);

    // Announce first exercise
    announceExercise(parsedProgram[0], true);
  };

  const skipTimer = () => {
    setIsTimerRunning(false);
    setShowTimer(false);
    speak("Let's keep moving!", 'motivation');
    handleTimerComplete();
  };

  // Handle voice commands
  const handleVoiceCommand = (command) => {
    const currentExercise = program[currentExerciseIndex];

    switch (command.trim()) {
      case 'start listening':
      case 'start voice':
      case 'voice on':
        if (!isListening) {
          setIsListening(true);
          speak('Voice control activated');
        }
        break;
      case 'stop listening':
      case 'stop voice':
      case 'voice off':
        if (isListening) {
          setIsListening(false);
          speak('Voice control deactivated');
        }
        break;
      case 'what exercise':
      case 'repeat exercise':
      case 'what\'s next':
        if (currentExercise) {
          announceExercise(currentExercise);
        }
        break;
      case 'complete set':
      case 'next set':
      case 'done':
        if (!isTimerRunning && !isWorkoutComplete && currentExercise?.completedSets < currentExercise?.sets) {
          handleSetCompletion();
        }
        break;
      case 'skip timer':
      case 'skip rest':
      case 'skip':
        if (isTimerRunning) {
          skipTimer();
        }
        break;
      default:
        if (command.includes('input') || command.includes('enter')) {
          const workoutText = command.replace(/input|enter|workout/g, '').trim();
          if (workoutText) {
            handleInput(workoutText);
          }
        }
    }
  };

  const toggleVoiceControl = () => {
    const newState = !isListening;
    setIsListening(newState);
    if (newState) {
      speak('Voice control activated');
    } else {
      speak('Voice control deactivated');
    }
  };


  const currentExercise = program[currentExerciseIndex];

  return (
    <div className="app">
      <div className="app-container">
        <h1>💪 Workout Tracker</h1>
        <button
          className="voice-control-button"
          onClick={toggleVoiceControl}
          aria-label={isListening ? 'Stop voice control' : 'Start voice control'}
        >
          {isListening ? '🎤 Stop Voice Control' : '🎤 Start Voice Control'}
        </button>
        <VoiceControl onCommand={handleVoiceCommand} isListening={isListening} />
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