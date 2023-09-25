import React from 'react';
import styles from './Board.module.scss';


type ValidValue = string | number | null;


type CellProps = {
  cellValue: ValidValue;
  onClick: () => void;
}


type BoardProps = {
  board: Array<Array<ValidValue>>;
  onCellClick: (_uintX: number, _uintY: number) => void;
}


export default function Board({ board, onCellClick }: BoardProps) {
  return (
    <div className={styles.board}>
      {
        board.map((row, uintY) => (
          <div key={uintY} className={styles.row}>
            {
              row.map((cell, uintX) => (
                <Cell key={uintX} cellValue={cell} onClick={() => onCellClick(uintX, uintY)} />
              ))
            }
          </div>
        ))
      }
    </div>
  )
}


function Cell({ cellValue, onClick }: CellProps) {
  return (
    <button className={styles['row__cell']} onClick={onClick}>
      {cellValue}
    </button>
  )
}