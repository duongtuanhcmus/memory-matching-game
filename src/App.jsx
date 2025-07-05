import React, { useState, useEffect, useRef } from "react";
import Board from "./components/Board";
import { shuffleCards } from "./utils/shuffle";
import techImages from "./assets/techImages";

import matchSound from "./assets/match.mp3";
import noMatchSound from "./assets/nomatch.mp3";

const levels = {
  1: { rows: 4, cols: 4, multiplier: 1.0 },
  2: { rows: 4, cols: 5, multiplier: 1.25 },
  3: { rows: 6, cols: 6, multiplier: 1.5 },
  4: { rows: 6, cols: 8, multiplier: 1.75 },
  5: { rows: 8, cols: 8, multiplier: 2.0 },
};

const BASE_SCORE = 1000;
const MOVE_PENALTY = 10;
const TIME_PENALTY = 1;

const App = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [level, setLevel] = useState(1);

  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [gameTimes, setGameTimes] = useState([]);
  const timerRef = useRef(null);

  const matchAudio = new Audio(matchSound);
  const noMatchAudio = new Audio(noMatchSound);

  useEffect(() => {
    startNewGame(level);
    return () => clearInterval(timerRef.current);
  }, [level]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameComplete(true);
      clearInterval(timerRef.current);

      const multiplier = levels[level].multiplier;
      const rawScore = BASE_SCORE - moves * MOVE_PENALTY - timer * TIME_PENALTY;
      const finalScore = Math.max(0, Math.floor(rawScore * multiplier));
      setScore(finalScore);

      setGameTimes((prev) => [
        ...prev,
        `Level ${level}: ${formatTime(timer)} | ${moves} moves | Score: ${finalScore}`,
      ]);

      if (level < 5) {
        setTimeout(() => setLevel((prev) => prev + 1), 2000);
      }
    }
  }, [matched, cards]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
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

  const startNewGame = (lvl) => {
    const { rows, cols } = levels[lvl];
    const totalCards = rows * cols;
    const numPairs = totalCards / 2;

    const shuffled = shuffleCards(techImages, numPairs);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setGameComplete(false);
    setMoves(0);
    setTimer(0);
    setScore(0);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  return (
    <div className="app">
      <h1>Memory Matching Game</h1>

      <div className="status-bar">
        <span>🧩 Level {level}</span>
        <span>⏱ Time: {formatTime(timer)}</span>
        <span>🎯 Moves: {moves}</span>
        <span>🏆 Score: {score}</span>
      </div>

      {gameComplete && (
        <div className="notification">
          🎉 Level {level} Complete in {formatTime(timer)} with {moves} moves!<br />
          Final Score: {score}
          {level < 5 ? " – Get ready for the next level..." : " 🎉 Game complete!"}
        </div>
      )}

      <button onClick={() => startNewGame(level)}>🔁 Restart Level</button>

      <Board
        cards={cards}
        flipped={flipped}
        matched={matched}
        onCardClick={handleCardClick}
        gridSize={levels[level]}
      />

      <h2>Completed Times:</h2>
      <ul>
        {gameTimes.map((time, index) => (
          <li key={index}>{time}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
