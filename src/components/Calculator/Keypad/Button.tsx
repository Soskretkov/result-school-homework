import React from 'react';
import styles from './Button.module.scss';

function Button({name}: {name: string}) {
  return (
    <button className={styles.button}>
      {name}
    </button>
  );
}

export default Button;