import React from 'react';
import styles from './RestartButton.module.scss';


type RestartButtonProps = {
  onButtonClick: () => void;
}


export default function RestartButton({ onButtonClick }: RestartButtonProps) {
  return (
    <button className={styles.restartButton} onClick={() => onButtonClick()}>
      Новая игра
    </button>
  )
}