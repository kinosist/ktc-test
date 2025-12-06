import React from 'react';
import styles from './Tile.module.css';

interface TileProps {
  number: number;
  onClick: () => void;
}

const Tile: React.FC<TileProps> = ({ number, onClick }) => {
  if (number === 0) {
    // This is the empty tile
    return <div className={`${styles.tile} ${styles.empty}`}></div>;
  }

  return (
    <div className={styles.tile} onClick={onClick}>
      {number}
    </div>
  );
};

export default Tile;
