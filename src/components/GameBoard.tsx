'use client';

import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import styles from './GameBoard.module.css';

const GRID_SIZE = 4;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

// Function to check if the puzzle is solvable
const isSolvable = (tiles: number[]) => {
  let inversions = 0;
  for (let i = 0; i < TILE_COUNT - 1; i++) {
    for (let j = i + 1; j < TILE_COUNT; j++) {
      if (tiles[i] > 0 && tiles[j] > 0 && tiles[i] > tiles[j]) {
        inversions++;
      }
    }
  }
  const emptyTileRow = Math.floor(tiles.indexOf(0) / GRID_SIZE);
  // For a grid of even size, the puzzle is solvable if:
  // - the number of inversions is even and the empty tile is on an odd row from the bottom.
  // - the number of inversions is odd and the empty tile is on an even row from the bottom.
  // Rows are counted from the bottom (1-based).
  const emptyRowFromBottom = GRID_SIZE - emptyTileRow;
  if (emptyRowFromBottom % 2 === 1) { // odd row from bottom
    return inversions % 2 === 0;
  } else { // even row from bottom
    return inversions % 2 === 1;
  }
};


// Function to create and shuffle the tiles
const shuffleTiles = () => {
  let tiles: number[];
  do {
    tiles = Array.from(Array(TILE_COUNT).keys()).sort(() => Math.random() - 0.5);
  } while (!isSolvable(tiles));
  return tiles;
};

const GameBoard = () => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setTiles(shuffleTiles());
    setIsSolved(false);
  };

  const handleTileClick = (index: number) => {
    if (isSolved) return;

    const emptyIndex = tiles.indexOf(0);
    const { row, col } = getTilePosition(index);
    const { row: emptyRow, col: emptyCol } = getTilePosition(emptyIndex);

    // Check if the clicked tile is adjacent to the empty tile
    if (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    ) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      checkIfSolved(newTiles);
    }
  };

  const getTilePosition = (index: number) => {
    return {
      row: Math.floor(index / GRID_SIZE),
      col: index % GRID_SIZE,
    };
  };

  const checkIfSolved = (currentTiles: number[]) => {
    for (let i = 0; i < TILE_COUNT - 1; i++) {
      if (currentTiles[i] !== i + 1) {
        setIsSolved(false);
        return;
      }
    }
    setIsSolved(true);
  };

  return (
    <div>
      <div className={styles.board}>
        {tiles.map((number, index) => (
          <Tile
            key={index}
            number={number}
            onClick={() => handleTileClick(index)}
          />
        ))}
      </div>
      {isSolved && <p className={styles.winMessage}>You won!</p>}
      <button onClick={resetGame} className={styles.shuffleButton}>
        Shuffle
      </button>
    </div>
  );
};

export default GameBoard;
