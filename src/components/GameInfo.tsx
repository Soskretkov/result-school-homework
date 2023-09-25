import React from 'react';
import styles from './GameInfo.module.scss';

export type GameStatus = 'win' | 'draw' | 'ongoing';
type GameInfoProps = { playerName: string, gameStatus: GameStatus };

export default function GameInfo({ playerName, gameStatus }: GameInfoProps) {
  const strGameStatus = gameStatus === 'draw' ? 'ничья' :
    (gameStatus === 'ongoing' ? 'очередь ходить: ' : 'победу одержал: ') + playerName;

  const strClassName = gameStatus === 'ongoing' ? '' : styles['gameInfo--endGame'];

  return (
    <div className={`${styles.gameInfo} ${strClassName}`}>
      {strGameStatus}
    </div>
  )
}