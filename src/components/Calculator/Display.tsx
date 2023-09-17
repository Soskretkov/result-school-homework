import React from 'react';
import styles from './Display.module.scss';

type DisplayProps = {
  value?: string;
  isResult: boolean;
};

function Display({ value='ERROR', isResult }: DisplayProps) {
  const displayClass = isResult ? styles.result : styles.input;

  return (
    <div className={`${displayClass} ${styles.display}`}>
      {value}
    </div>
  );
}

export default Display;