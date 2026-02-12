import React, {useState, type ReactNode} from 'react';

interface Option {
  label: string;
  correct?: boolean;
}

interface ConceptCheckProps {
  question: string;
  options: Option[];
  explanation: ReactNode;
  hint?: ReactNode;
}

export default function ConceptCheck({question, options, explanation, hint}: ConceptCheckProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const answered = selected !== null;
  const isCorrect = answered && options[selected]?.correct;

  return (
    <div className={`concept-check${answered ? (isCorrect ? ' concept-check--correct' : ' concept-check--incorrect') : ''}`}>
      <div className="concept-check__header">
        <span className="concept-check__header-icon">{answered ? (isCorrect ? '\u2713' : '\u2717') : '\u2753'}</span>
        {' '}Check your understanding
      </div>
      <div className="concept-check__question">{question}</div>
      <div>
        {options.map((opt, i) => {
          let className = 'concept-check__option';
          if (answered && i === selected) {
            className += opt.correct
              ? ' concept-check__option--correct'
              : ' concept-check__option--incorrect';
          }
          if (answered && opt.correct && i !== selected) {
            className += ' concept-check__option--correct';
          }
          return (
            <label key={i} className={className}>
              <span className="concept-check__radio">
                <input
                  type="radio"
                  name={`cc-${question.slice(0, 20)}`}
                  checked={selected === i}
                  onChange={() => !answered && setSelected(i)}
                  disabled={answered}
                />
                <span className="concept-check__radio-custom" />
              </span>
              <span className="concept-check__option-text">{opt.label}</span>
              {answered && i === selected && !opt.correct && (
                <span className="concept-check__icon concept-check__icon--wrong">{'\u2717'}</span>
              )}
              {answered && opt.correct && (
                <span className="concept-check__icon concept-check__icon--right">{'\u2713'}</span>
              )}
            </label>
          );
        })}
      </div>
      {!answered && hint && (
        <div className="concept-check__hint-area">
          <button
            className="concept-check__hint-btn"
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? 'Hide hint' : 'Show hint'}
          </button>
          {showHint && (
            <div className="concept-check__hint">{hint}</div>
          )}
        </div>
      )}
      {answered && (
        <div className={`concept-check__result ${isCorrect ? 'concept-check__result--correct' : 'concept-check__result--incorrect'}`}>
          <div className="concept-check__result-header">
            {isCorrect ? 'Correct!' : 'Not quite \u2014 review the explanation below.'}
          </div>
          <div className="concept-check__explanation">{explanation}</div>
        </div>
      )}
    </div>
  );
}
