import React from 'react';
import type {ReactNode} from 'react';
import ReadingProgress from '../components/ReadingProgress';

export default function Root({children}: {children: ReactNode}): ReactNode {
  return (
    <>
      <ReadingProgress />
      {children}
    </>
  );
}
