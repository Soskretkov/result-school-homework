import React, { useState } from 'react';
import { Board, CellMatrix } from '../components/Board';
import GameInfo from '../components/GameInfo';
import RestartButton from '../components/RestartButton';
import styles from './Container.module.scss';


const INITIAL_MATRIX_VALUES: CellMatrix = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];


export default function Container() {
  const [isGameActive, setIsGameActive] = useState(true);
  const [strPlayerSumbol, setPlayerSumbol] = useState(tooglePlayer());
  const [cellMatrixValues, setCellMatrixValues] = useState(INITIAL_MATRIX_VALUES);

  return (
    <div className={styles.container}>
      <RestartButton />
      <GameInfo playerName={strPlayerSumbol} isGameActive={isGameActive} />
      <Board board={cellMatrixValues} onCellClick={cellClickHandler} />
    </div>
  );
}


// заглушка
function cellClickHandler(uintX: number, uintY: number) {
  console.log(`x = ${uintX}, y = ${uintY}`);
}


function tooglePlayer() {
  const strPlayer1_sumbol = 'X';
  const strPlayer2_sumbol = 'O';
  let isPlayer1 = true;

  return () => {
    const strPlayerSumbol = isPlayer1 ? strPlayer1_sumbol : strPlayer2_sumbol;
    isPlayer1 = !isPlayer1;
    return strPlayerSumbol;
  }
}