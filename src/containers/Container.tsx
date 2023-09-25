import React, { useState, useRef } from 'react';
import Board from '../components/Board';
import GameInfo from '../components/GameInfo';
import RestartButton from '../components/RestartButton';
import styles from './Container.module.scss';


const PLAYER_NAMES = ['X', 'O'] as const;

type CellValue = typeof PLAYER_NAMES[number] | null;

export default function Container(): React.JSX.Element {
  // создание экземпляров классов PlayerManager и TicTacToeBoard
  const playerManager = useRef(new PlayerManager(PLAYER_NAMES)).current;
  const ticTacToeBoard = useRef(new TicTacToeBoard()).current;

  const [strPlayerSymbol, setPlayerSymbol] = useState(playerManager.togglePlayerAndGetName());
  const [isGameActive, setIsGameActive] = useState(true);
  const [cellMatrixValues, setCellMatrixValues] = useState(ticTacToeBoard.board);


  function cellClickHandler(uintX: number, uintY: number): void {
    // не требуются изменения если игра завершена или произошел клик в ячейку, где значение уже есть
    if (!isGameActive || cellMatrixValues[uintY][uintX] !== null) {
      return;
    }

    // изменение отдельного значения в матрице
    ticTacToeBoard.setBoardCell(uintY, uintX, strPlayerSymbol as CellValue);

    // чтобы избежать только мутации избегаем прямой передачи ticTacToeBoard.board
    // и перепаковываем его в новые объекты (хотя и без этого работает)
    const newBoard = ticTacToeBoard.board.map(row => [...row]);
    setCellMatrixValues(newBoard);

    // обработка победы
    if (ticTacToeBoard.checkWinCondition()) {
      setIsGameActive(false);
      return;
    }

    // смена текущего игрока
    const nextPlayer = playerManager.togglePlayerAndGetName();
    setPlayerSymbol(nextPlayer);
  }


  function resetGame(): void {
    // обнуление очерди ходов и игровой доски
    playerManager.resetByDefault();
    ticTacToeBoard.resetAllBoardValues();

    // сброс значений в клетках
    setCellMatrixValues(ticTacToeBoard.board);

    // сброс очереди ходить
    setPlayerSymbol(playerManager.togglePlayerAndGetName());

    // сброс статуса игры на "не завершена"
    setIsGameActive(true);
  }


  return (
    <div className={styles.container}>
      <RestartButton onButtonClick={resetGame} />
      <GameInfo playerName={strPlayerSymbol} isGameActive={isGameActive} />
      <Board board={cellMatrixValues} onCellClick={cellClickHandler} />
    </div>
  );
}


class TicTacToeBoard {
  board: CellValue[][];

  constructor() {
    this.board = [];
    this.resetAllBoardValues();
  }

  resetAllBoardValues(): void {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  }

  setBoardCell(uintY: number, uintX: number, strPlayerSymbol: CellValue): void {
    this.board[uintY][uintX] = strPlayerSymbol;
  }

  checkWinCondition(): boolean {
    const board = this.board;
    // проверка строк
    for (let i = 0; i < 3; i++) {
      if (board[i][0] !== null && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        return true;
      }
    }

    // проверка столбцов
    for (let i = 0; i < 3; i++) {
      if (board[0][i] !== null && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        return true;
      }
    }

    // проверка диагоналей
    if (board[0][0] !== null && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return true;
    }
    if (board[0][2] !== null && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return true;
    }

    return false;
  }
}


// принимает массив имен игроков, отсортированный в порядке очереди ходов, призван следить за очередью хода
class PlayerManager {
  playerNames: readonly string[];
  #uintMaxPlayerIndex: number;
  #uintCurrentPlayerIndex: number = 0;

  constructor(playerNames: readonly string[]) {
    this.playerNames = playerNames;
    this.#uintMaxPlayerIndex = playerNames.length;
  }

  // передать очередь хода
  togglePlayerAndGetName(): string {
    const strActivePlayerName = this.getActivePlayerName()
    this.#uintCurrentPlayerIndex = (this.#uintCurrentPlayerIndex + 1) % this.#uintMaxPlayerIndex;
    return strActivePlayerName;
  }

  // сбросить очередь ходов на первоначальные
  resetByDefault(): void {
    this.#uintCurrentPlayerIndex = 0;
  }

  // имя текущего игрока
  getActivePlayerName(): string {
    return this.playerNames[this.#uintCurrentPlayerIndex]
  }
}