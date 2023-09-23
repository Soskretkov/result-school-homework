import React from 'react';
import styles from './GameInfo.module.scss';

type GameInfoProps = { playerName: string, isGameActive: boolean };

export default function GameInfo({ playerName, isGameActive }: GameInfoProps) {
  const strMsgPrefix = isGameActive ? 'очередь ходить: ' : 'победу одержал: ';
  const strClassName = isGameActive ? '' : styles['gameInfo--win'];


  return (
    <div className={`${styles.gameInfo} ${strClassName}`}>
      {strMsgPrefix + playerName}
    </div>
  )
}