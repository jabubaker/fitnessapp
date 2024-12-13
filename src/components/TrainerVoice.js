import React, { useEffect, useState } from 'react';

export const useTrainerVoice = () => {
  const [voice, setVoice] = useState(null);
  const [recentPhrases, setRecentPhrases] = useState(new Set());
  const [synth, setSynth] = useState(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSynth(window.speechSynthesis);
      
      // Force cleanup any stuck synthesis state
      window.speechSynthesis.cancel();

      // Handle page visibility changes
      const handleVisibilityChange = () => {
        if (document.hidden) {
          window.speechSynthesis.cancel();
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        window.speechSynthesis.cancel();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, []);

  useEffect(() => {
    const initVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferredVoices = [
        voices.find(v => v.name.includes('Samantha')),
        voices.find(v => v.name.includes('Karen')),
        voices.find(v => v.name.includes('Jenny')),
        voices.find(v => v.name.includes('Aria')),
        voices.find(v => v.name.includes('Google US English')),
        voices.find(v => v.lang === 'en-US' && v.name.includes('Female')),
        voices.find(v => v.lang === 'en-GB' && v.name.includes('Female')),
        voices[0]
      ];
      
      const selectedVoice = preferredVoices.find(v => v);
      setVoice(selectedVoice);
    };

    if (synth) {
      // Try immediate initialization
      if (synth.getVoices().length > 0) {
        initVoice();
      }
      
      // Also listen for voices changed event
      synth.onvoiceschanged = initVoice;
      
      return () => {
        if (synth) {
          synth.onvoiceschanged = null;
        }
      };
    }
  }, [synth]);

  const phrases = {
    exerciseTransition: [
      "Next exercise:",
      "Moving on to:",
      "Let's switch to:",
      "Time for:",
      "Up next:",
      "Changing it up with:",
      "Now we're doing:",
      "Transitioning to:"
    ],
    restStart: [
      "Nice set! Take a breather",
      "Good work! Quick rest",
      "Solid effort! Take thirty",
      "Great job! Rest time",
      "Strong set! Catch your breath",
      "Well done! Short break",
      "Excellent! Take a moment",
      "Perfect! Rest up"
    ],
    lastSet: [
      "Last set, give it everything!",
      "Final set, make it count!",
      "One more set, finish strong!",
      "Last push, you've got this!",
      "Final set, leave nothing behind!",
      "Last one, best one!",
      "Final effort, push through!",
      "Last set, show what you've got!"
    ],
    nextSet: [
      "Let's keep this momentum going",
      "Back at it, stay strong",
      "Time to push again",
      "Let's hit this next set",
      "Ready to work",
      "Keep that energy up",
      "Let's maintain this pace",
      "Back to business"
    ],
    completion: [
      "Workout complete! You crushed it today!",
      "Great session! Way to push through!",
      "That's a wrap! Outstanding effort!",
      "Workout finished! You brought your A-game!",
      "All done! Impressive work today!",
      "Complete! You should be proud!",
      "Finished! Way to dominate!",
      "Done! You conquered this workout!"
    ]
  };


  const getPhrase = (type) => {
    if (!phrases[type]) return '';
    
    const availablePhrases = phrases[type].filter(phrase => !recentPhrases.has(phrase));
    
    if (availablePhrases.length === 0) {
      setRecentPhrases(new Set());
      return phrases[type][Math.floor(Math.random() * phrases[type].length)];
    }

    const phrase = availablePhrases[Math.floor(Math.random() * availablePhrases.length)];
    
    setRecentPhrases(prev => {
      const updated = new Set(prev);
      updated.add(phrase);
      if (updated.size > 3) {
        const [firstPhrase] = updated;
        updated.delete(firstPhrase);
      }
      return updated;
    });

    return phrase;
  };

  const announceExercise = (exerciseDetails) => {
    const transitionPhrase = getPhrase('exerciseTransition');
    return `${transitionPhrase} ${exerciseDetails}`;
  };

  const speak = (text, type) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    let finalText = text;
    
    // Add variety based on type
    switch (type) {
      case 'exercise':
        finalText = announceExercise(text);
        break;
      case 'rest':
        finalText = getPhrase('restStart');
        break;
      case 'lastSet':
        finalText = getPhrase('lastSet');
        break;
      case 'nextSet':
        finalText = `${getPhrase('nextSet')}. Set ${text}`;
        break;
      case 'completion':
        finalText = getPhrase('completion');
        break;
    }

    const utterance = new SpeechSynthesisUtterance(finalText);
    
    if (voice) {
      utterance.voice = voice;
    }

    // Configure voice parameters based on message type
    switch (type) {
      case 'exercise':
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        break;
      case 'rest':
      case 'nextSet':
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
        break;
      case 'lastSet':
      case 'completion':
        utterance.rate = 1.1;
        utterance.pitch = 1.15;
        break;
      default:
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
    }

    window.speechSynthesis.speak(utterance);
  };

  return { speak };
};