import React, { useState, useRef } from 'react';
import Board from '../components/Board';
import GameInfo from '../components/GameInfo';
import RestartButton from '../components/RestartButton';
import styles from './Container.module.scss';


const PLAYER_NAMES = ['X', 'O'] as const;

const INITIAL_MATRIX_VALUES = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
] as const;

type CellValue = typeof PLAYER_NAMES[number] | null;
type CellMatrix = Array<Array<CellValue>>;

export default function Container() {
  // создание экземпляра класса PlayerManager
  const playerManagerRef = useRef(new PlayerManager(PLAYER_NAMES)).current;

  const [strPlayerSymbol, setPlayerSymbol] = useState(playerManagerRef.togglePlayerAndGetName());
  const [isGameActive, setIsGameActive] = useState(true);

  // константа INITIAL_MATRIX_VALUES существует только для инициализации, а потому клонируем ее как новый объект, а не передаем саму
  // (делать эту константу переменной не выход, захватывать и менять внешнее окружение из функции плохая практика в функ. программировании)
  const [cellMatrixValues, setCellMatrixValues] = useState<CellValue[][]>(INITIAL_MATRIX_VALUES.map(row => [...row]));


  function cellClickHandler(uintX: number, uintY: number) {
    // выход или игра завершена или случился клик в ячейку, где состояние уже есть
    if (!isGameActive || cellMatrixValues[uintY][uintX] !== null) {
      return;
    }

    // создание новой копии матрицы
    const newCellMatrixValues = cellMatrixValues.map(row => [...row]);

    // изменение значения в копии матрицы
    newCellMatrixValues[uintY][uintX] = strPlayerSymbol as CellValue;

    // установка нового состояния на основе измененной матрицы
    setCellMatrixValues(newCellMatrixValues);

    // проверка условий победы
    const isWinCondition = checkWinCondition(newCellMatrixValues);
    if (isWinCondition) {
      setIsGameActive(false);
      return;
    }

    // смена текущего игрока
    const nextPlayer = playerManagerRef.togglePlayerAndGetName();
    setPlayerSymbol(nextPlayer);
  }


  function resetGame() {
    playerManagerRef.resetByDefault();
    // сброс значений в клетках
    setCellMatrixValues(INITIAL_MATRIX_VALUES.map(row => [...row]));

    // сброс очереди ходить
    setPlayerSymbol(playerManagerRef.togglePlayerAndGetName());

    // сброс статуса игры на "не завершена"
    if (!isGameActive) {
      setIsGameActive(true);
    }
  }


  return (
    <div className={styles.container}>
      <RestartButton onButtonClick={resetGame} />
      <GameInfo playerName={strPlayerSymbol} isGameActive={isGameActive} />
      <Board board={cellMatrixValues} onCellClick={cellClickHandler} />
    </div>
  );
}


// принимает массив имен игроков, отсортированный в порядке очереди ходить, призван следить за очередью хода
class PlayerManager {
  playerNames: readonly string[];
  #uintMaxPlayerIndex: number;
  #uintCurrentPlayerIndex: number = 0;

  constructor(playerNames: readonly string[]) {
    this.playerNames = playerNames;
    this.#uintMaxPlayerIndex = playerNames.length;
  }

  // передать очередь хода
  togglePlayerAndGetName() {
    const strActivePlayerName = this.getActivePlayerName()
    this.#uintCurrentPlayerIndex = (this.#uintCurrentPlayerIndex + 1) % this.#uintMaxPlayerIndex;
    return strActivePlayerName;
  }

  // сбросить очередь ходов на первоначальные
  resetByDefault() {
    this.#uintCurrentPlayerIndex = 0;
  }

  // имя текущего игрока
  getActivePlayerName() {
    return this.playerNames[this.#uintCurrentPlayerIndex]
  }
}


function checkWinCondition(board: CellMatrix): boolean {
  // Проверка строк
  for (let i = 0; i < 3; i++) {
    if (board[i][0] !== null && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
      return true;
    }
  }

  // Проверка столбцов
  for (let i = 0; i < 3; i++) {
    if (board[0][i] !== null && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
      return true;
    }
  }

  // Проверка диагоналей
  if (board[0][0] !== null && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    return true;
  }
  if (board[0][2] !== null && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    return true;
  }

  return false;
}