import React, { useState } from 'react';
import Keypad from './Calculator/Keypad';
import Display from './Calculator/Display';
import styles from './Calculator.module.scss';

function Calculator() {
  const [currentValue, setCurrentValue] = useState(0);
  const [intermediateValue, setIntermediateValue] = useState(0);
  const [displayValue, setDisplayValue] = useState('0');
  const [operation, setOperation] = useState<null | '+' | '-'>(null);
  const [isResult, setIsResult] = useState(false);

  const handleButtonClick = (name: string) => {
    if (name === 'C') {
      setCurrentValue(0);
      setIntermediateValue(0);
      setDisplayValue('0');
      setOperation(null);
      setIsResult(false);
      return;
    }

    if (name === '+' || name === '-') {
      if (operation) {
        const newIntermediateValue = operation === '+' ? intermediateValue + currentValue : intermediateValue - currentValue;
        setIntermediateValue(newIntermediateValue);
        setDisplayValue(String(newIntermediateValue));
      } else {
        setIntermediateValue(currentValue);
      }
      setCurrentValue(0);
      setOperation(name);
      setIsResult(false);
      return;
    }

    if (name === '=') {
      if (operation && intermediateValue !== null) {
        const result = operation === '+' ? intermediateValue + currentValue : intermediateValue - currentValue;
        setCurrentValue(result);
        setDisplayValue(String(result));
        setIsResult(true);

        // сброс на дефолтные значения
        setOperation(null);
        setIntermediateValue(0);
      }
      return;
    }

    // ввод цифры при отображении прошлого результата
    if (isResult) {
      const newCurrentValue = Number(name);
      setCurrentValue(newCurrentValue);
      setDisplayValue(String(newCurrentValue));
      setIsResult(false);
      return;
    }

    const newCurrentValue = currentValue === 0 ? Number(name) : (currentValue * 10) + Number(name);
    setCurrentValue(newCurrentValue);
    setDisplayValue(String(newCurrentValue));
  };

  return (
    <div className={styles.calculator}>
      <Display value={displayValue} isResult={isResult} />
      <Keypad onClick={handleButtonClick} />
    </div>
  );
}

export default Calculator;
