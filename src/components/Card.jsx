import React from "react";

const Card = ({ card, index, isFlipped, onClick }) => {
  return (
    <div className="card" onClick={() => onClick(index)}>
      {isFlipped ? (
        <img src={card.img} alt={card.name} />
      ) : (
        <div className="back" />
      )}
    </div>
  );
};

export default Card;
