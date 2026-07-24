import React, { useId } from 'react';

export function Field({ label, children, className = "" }) {
  const id = useId();
  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      {React.cloneElement(children, { id, 'aria-label': label })}
    </div>
  );
}
