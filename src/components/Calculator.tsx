import React from 'react';
import Keypad from './Calculator/Keypad';
import Display from './Calculator/Display';
import styles from './Calculator.module.scss';

function handleButtonClick(name: string) {
  console.log(name);  
}

function Calculator() {
  return (
    <div className={styles.calculator}>
      <Display value={'0'} isResult={false} />
      <Keypad onClick={handleButtonClick}/>
    </div>
  );
}

export default Calculator;