import React, { useState } from "react";

function WorkoutInput({ onSubmit }) {
  const [input, setInput] = useState("");

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleBlur = () => {
    onSubmit(input);
  };

  return (
    <div className="workout-input">
      <textarea
        placeholder="Enter your program here (e.g., 3x10 leg extensions 20#)"
        value={input}
        onChange={handleChange}
        onBlur={handleBlur}
        rows={5}
        cols={40}
      />
    </div>
  );
}

export default WorkoutInput;

