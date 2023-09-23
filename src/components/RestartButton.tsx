import React from 'react';
import styles from './RestartButton.module.scss';


export default function RestartButton() {
  return (
    <button className={styles.restartButton}>
      Новая игра
    </button>
  )
}