import React from 'react';
import styles from './Keypad.module.scss';
import Button from './Keypad/Button';

const BUTTON_NAMES = [
  ['7', '8', '9', '+'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '='],
  ['C', '0'],
];


function Keypad({ onClick }: { onClick: (_: string) => void }) {
  const handleKeypadClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON') {
      onClick(target.textContent!);
    }
  };

  return (
    <div className={styles.keypad} onClick={handleKeypadClick}>
      {BUTTON_NAMES.map((buttonRow, index) => (
        <div key={index}>
          {buttonRow.map(name =>
            <Button key={name} name={name} />
          )}
        </div>
      ))}
    </div>
  );
}

export default Keypad;