import React from 'react';
import type {ReactNode} from 'react';

interface KeyNumberProps {
  value: string;
  label: string;
  context?: ReactNode;
}

export default function KeyNumber({value, label, context}: KeyNumberProps) {
  return (
    <div className="key-number">
      <div className="key-number__value">{value}</div>
      <div className="key-number__label">{label}</div>
      {context && <div className="key-number__context">{context}</div>}
    </div>
  );
}

interface KeyNumberRowProps {
  children: ReactNode;
}

export function KeyNumberRow({children}: KeyNumberRowProps) {
  return <div className="key-number-row">{children}</div>;
}
