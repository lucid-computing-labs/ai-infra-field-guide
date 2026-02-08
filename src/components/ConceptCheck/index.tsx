import React, {useState, type ReactNode} from 'react';

interface Option {
  label: string;
  correct?: boolean;
}

interface ConceptCheckProps {
  question: string;
  options: Option[];
  explanation: ReactNode;
}

export default function ConceptCheck({question, options, explanation}: ConceptCheckProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  return (
    <div className="concept-check">
      <div className="concept-check__header">Check your understanding</div>
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
              <input
                type="radio"
                name={`cc-${question.slice(0, 20)}`}
                style={{marginRight: '0.5rem'}}
                checked={selected === i}
                onChange={() => !answered && setSelected(i)}
                disabled={answered}
              />
              {opt.label}
            </label>
          );
        })}
      </div>
      {answered && (
        <div className="concept-check__explanation">{explanation}</div>
      )}
    </div>
  );
}
