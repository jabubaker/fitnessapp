import React, { useState, useEffect } from 'react';

const VoiceControl = ({ onCommand, isListening }) => {
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
        onCommand(command);
      };

      recognition.onerror = (event) => {
        setError(event.error);
        console.error('Speech recognition error:', event.error);
      };

      setRecognition(recognition);
    } else {
      setError('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onCommand]);

  useEffect(() => {
    if (recognition) {
      try {
        if (isListening) {
          recognition.start();
        } else {
          recognition.stop();
        }
      } catch (e) {
        // Handle cases where recognition is already started/stopped
        console.log("Recognition state already set:", e);
      }
    }
  }, [isListening, recognition]);

  return (
    <div className="voice-control">
      {error && <p className="error">{error}</p>}
      <div className={`voice-indicator ${isListening ? 'active' : ''}`}>
        {isListening ? '🎤 Listening...' : '🎤 Voice control off'}
      </div>
    </div>
  );
};

export default VoiceControl;