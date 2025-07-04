import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import { shuffleCards } from "./utils/shuffle";
import cardImages from "./assets/cardImages";

const App = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [gameTimes, setGameTimes] = useState([]);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameComplete(true);
      const finish = Date.now();
      setEndTime(finish);
      const timeTaken = ((finish - startTime) / 1000).toFixed(2);
      setGameTimes((prev) => [...prev, timeTaken]);
    }
  }, [matched, cards]);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].name === cards[second].name) {
        setMatched([...matched, first, second]);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  };

  const startNewGame = () => {
    const shuffled = shuffleCards(cardImages);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setGameComplete(false);
    setStartTime(Date.now());
    setEndTime(null);
  };

  return (
    <div className="app">
      <h1>Memory Matching Game</h1>
      {gameComplete && (
        <div className="notification">
          🎉 You matched all cards in {(endTime - startTime) / 1000}s! 🎉
        </div>
      )}
      <button onClick={startNewGame}>Reset Game</button>
      <Board cards={cards} flipped={flipped} matched={matched} onCardClick={handleCardClick} />
      <h2>Completed Game Times (seconds):</h2>
      <ul>
        {gameTimes.map((time, index) => (
          <li key={index}>{time}s</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
