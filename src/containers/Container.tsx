import React, { useState, useRef } from 'react';
import Board from '../components/Board';
import GameInfo, {GameStatus} from '../components/GameInfo';
import RestartButton from '../components/RestartButton';
import styles from './Container.module.scss';


const PLAYER_NAMES = ['X', 'O'] as const;

type CellValue = typeof PLAYER_NAMES[number] | null;

export default function Container(): React.JSX.Element {
  // создание экземпляров классов PlayerManager и TicTacToeBoard
  const playerManager = useRef(new PlayerManager(PLAYER_NAMES)).current;
  const ticTacToeBoard = useRef(new TicTacToeBoard()).current;

  const [strPlayerSymbol, setPlayerSymbol] = useState(playerManager.togglePlayerAndGetName());
  const [gameStatus, setGameStatus] = useState<GameStatus>('ongoing');
  const [, setCellMatrixValues] = useState(ticTacToeBoard.board);


  function cellClickHandler(uintX: number, uintY: number): void {
    // не требуются изменения если игра завершена или произошел клик в ячейку, где значение уже есть
    if (!gameStatus || ticTacToeBoard.board[uintY][uintX] !== null) {
      return;
    }

    // изменение отдельного значения в матрице
    ticTacToeBoard.setBoardCell(uintY, uintX, strPlayerSymbol as CellValue);

    // чтобы избежать только мутации нет прямой передачи ticTacToeBoard.board
    const newBoard = ticTacToeBoard.board.map(row => [...row]);
    setCellMatrixValues(newBoard);

    // выход если завершение игры
    const newGameStatus = ticTacToeBoard.checkWinCondition();
    if (newGameStatus !== 'ongoing') {
      setGameStatus(newGameStatus);
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
    setGameStatus('ongoing');
  }


  return (
    <div className={styles.container}>
      <RestartButton onButtonClick={resetGame} />
      <GameInfo playerName={strPlayerSymbol} gameStatus={gameStatus} />
      <Board board={ticTacToeBoard.board} onCellClick={cellClickHandler} />
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

  checkWinCondition(): GameStatus {
    const board = this.board;

    // проверка строк
    for (let i = 0; i < 3; i++) {
      if (board[i][0] !== null && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        return 'win';
      }
    }

    // проверка столбцов
    for (let i = 0; i < 3; i++) {
      if (board[0][i] !== null && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        return 'win';
      }
    }

    // проверка диагоналей
    if (board[0][0] !== null && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return 'win';
    }
    if (board[0][2] !== null && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return 'win';
    }

    // проверка на ничью: если все клетки заполнены и нет победителя
    let allCellsFilled = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === null) {
          allCellsFilled = false;
          break;
        }
      }
      if (!allCellsFilled) {
        break;
      }
    }

    if (allCellsFilled) {
      return 'draw';
    }

    return 'ongoing';
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