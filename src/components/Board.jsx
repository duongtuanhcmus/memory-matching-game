import React from "react";
import Card from "./Card";

const Board = ({ cards, flipped, matched, onCardClick }) => {
  return (
    <div className="board">
      {cards.map((card, index) => (
        <Card
          key={index}
          index={index}
          card={card}
          isFlipped={flipped.includes(index) || matched.includes(index)}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
};

export default Board;
