import { useEffect, useState } from "react";
import GameScreen from "./components/GameScreen";
import Dashboard from "./components/Dashboard";
import {
  LevelCompleteScreen,
  GameCompleteScreen,
  starsFor,
} from "./components/Screens";
import { LEVEL_COUNT } from "./data/questions";
import { sound } from "./lib/sound";

type Screen = "dashboard" | "game" | "levelComplete" | "gameComplete";

const STORAGE_KEY = "mancing-pengurangan-stars";

function loadStars(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length === LEVEL_COUNT) return arr.map((n) => Number(n) || 0);
    }
  } catch {
    /* ignore */
  }
  return Array(LEVEL_COUNT).fill(0);
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [level, setLevel] = useState(1);
  const [runId, setRunId] = useState(0);
  const [muted, setMuted] = useState(false);
  const [levelStars, setLevelStars] = useState<number[]>(loadStars);
  const [lastCorrect, setLastCorrect] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(levelStars));
    } catch {
      /* ignore */
    }
  }, [levelStars]);

  // a level unlocks once the previous one earned at least 1 star
  let unlocked = 1;
  for (let i = 0; i < LEVEL_COUNT - 1; i++) {
    if (levelStars[i] > 0) unlocked = i + 2;
    else break;
  }

  const toggleMute = () => {
    setMuted((m) => {
      sound.setMuted(!m);
      return !m;
    });
  };

  const startLevel = (lvl: number) => {
    setLevel(lvl);
    setRunId((r) => r + 1);
    setScreen("game");
  };

  const handleLevelComplete = (correct: number) => {
    setLastCorrect(correct);
    setLevelStars((prev) => {
      const next = [...prev];
      next[level - 1] = Math.max(next[level - 1], starsFor(correct));
      return next;
    });
    sound.levelUp();
    setScreen("levelComplete");
  };

  const goDashboard = () => {
    sound.click();
    setScreen("dashboard");
  };

  const totalStars = levelStars.reduce((a, b) => a + b, 0);
  const isLast = level >= LEVEL_COUNT;
  const passed = starsFor(lastCorrect) > 0;

  return (
    <div className="app-root">
      {screen === "dashboard" && (
        <Dashboard
          levelStars={levelStars}
          unlocked={unlocked}
          muted={muted}
          onToggleMute={toggleMute}
          onPlay={startLevel}
          onResetProgress={() => setLevelStars(Array(LEVEL_COUNT).fill(0))}
        />
      )}

      {screen === "game" && (
        <GameScreen
          key={`${level}-${runId}`}
          level={level}
          muted={muted}
          onToggleMute={toggleMute}
          onLevelComplete={handleLevelComplete}
          onHome={goDashboard}
        />
      )}

      {screen === "levelComplete" && (
        <LevelCompleteScreen
          level={level}
          correct={lastCorrect}
          isLast={isLast}
          canContinue={passed}
          onNext={() => {
            if (isLast) {
              sound.click();
              setScreen("gameComplete");
            } else {
              startLevel(level + 1);
            }
          }}
          onRetry={() => startLevel(level)}
          onHome={goDashboard}
        />
      )}

      {screen === "gameComplete" && (
        <GameCompleteScreen
          totalStars={totalStars}
          onRestart={() => startLevel(1)}
          onHome={goDashboard}
        />
      )}
    </div>
  );
}
