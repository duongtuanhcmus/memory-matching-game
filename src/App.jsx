import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import { shuffleCards } from "./utils/shuffle";
import cardImages from "./assets/cardImages";

// ✅ Sound effects (keep these if you’re using them)
import matchSound from "./assets/match.mp3";
import noMatchSound from "./assets/nomatch.mp3";

const App = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [gameTimes, setGameTimes] = useState([]);
  const [bestTime, setBestTime] = useState(
    localStorage.getItem("bestTime")
      ? parseFloat(localStorage.getItem("bestTime"))
      : null
  );

  // ✅ Sound instances (optional)
  const matchAudio = new Audio(matchSound);
  const noMatchAudio = new Audio(noMatchSound);

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

      // ✅ Check & update best time
      if (!bestTime || timeTaken < bestTime) {
        setBestTime(timeTaken);
        localStorage.setItem("bestTime", timeTaken);
      }
    }
  }, [matched, cards]);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;

      if (cards[first].name === cards[second].name) {
        matchAudio.currentTime = 0;
        matchAudio.play();
        setMatched([...matched, first, second]);
      } else {
        noMatchAudio.currentTime = 0;
        noMatchAudio.play();
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

      <Board
        cards={cards}
        flipped={flipped}
        matched={matched}
        onCardClick={handleCardClick}
      />

      <h2>Completed Game Times (seconds):</h2>
      <ul>
        {gameTimes.map((time, index) => (
          <li key={index}>{time}s</li>
        ))}
      </ul>

      {bestTime && (
        <h2>🏆 Best Time: {bestTime}s</h2>
      )}
    </div>
  );
};

export default App;
