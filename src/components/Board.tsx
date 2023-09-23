import React from 'react';
import styles from './Board.module.scss';


type CellValue = 'X' | 'O' | null;
export type CellMatrix = Array<Array<CellValue>>;


type CellProps = {
  cellValue: CellValue;
  onClick: () => void;
}


type BoardProps = {
  board: CellMatrix;
  onCellClick: (_uintX: number, _uintY: number) => void;
}


export function Board({ board, onCellClick }: BoardProps) {
  return (
    <div className={styles.board}>
      {
        board.map((row, uintY) => (
          <div key={uintY} className={styles.row}>
            {
              row.map((cell, uintX) => (
                <Cell key={uintX} cellValue={cell} onClick={() => onCellClick(uintX, uintY)}/>
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
    <button className={styles.cell} onClick={onClick}>
      {cellValue}
    </button>
  )
}