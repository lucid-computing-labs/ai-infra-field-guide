import React, {useState, type ReactNode} from 'react';

interface ScenarioProps {
  title: string;
  prompt: ReactNode;
  questions: string[];
  hints?: ReactNode;
}

export default function Scenario({title, prompt, questions, hints}: ScenarioProps) {
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="scenario">
      <div className="scenario__header">What Would You Do?</div>
      <h4 style={{marginTop: 0}}>{title}</h4>
      <div className="scenario__prompt">{prompt}</div>
      <ul className="scenario__questions">
        {questions.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ul>
      {hints && (
        <>
          <button
            className="scenario__toggle"
            onClick={() => setShowHints(!showHints)}
          >
            {showHints ? 'Hide discussion notes' : 'Show discussion notes'}
          </button>
          {showHints && <div className="scenario__hints">{hints}</div>}
        </>
      )}
    </div>
  );
}
