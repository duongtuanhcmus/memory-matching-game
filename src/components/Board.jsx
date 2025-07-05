import React from "react";
import Card from "./Card";
import "../styles/Board.css";

const Board = ({ cards, flipped, matched, onCardClick, gridSize }) => {
  const { rows, cols } = gridSize;

  return (
    <div
      className="board"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: "10px",
      }}
    >
      {cards.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          index={index}
          isFlipped={flipped.includes(index) || matched.includes(index)}
          onClick={() => onCardClick(index)}
        />
      ))}
    </div>
  );
};

export default Board;
