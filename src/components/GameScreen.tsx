import { useEffect, useRef, useState } from "react";
import Fish, { type Scheme } from "./Fish";
import FishingRod from "./FishingRod";
import SignBoard from "./SignBoard";
import Stage from "./Stage";
import {
  generateQuestion,
  QUESTIONS_PER_LEVEL,
  QUESTION_TIME,
  type Question,
} from "../data/questions";
import { sound } from "../lib/sound";

const HOOK_REST = { x: 43, y: 46 };
const BUCKET = { x: 10.5, y: 32 };

const FISH_SPOTS = [
  { x: 41, y: 72, flip: false },
  { x: 58, y: 60, flip: true },
  { x: 74, y: 77, flip: false },
];
const SCHEMES: Scheme[] = ["orange", "blue", "purple"];

type FishState = "swim" | "hooked" | "caught" | "escaped" | "gone";
type FishDatum = {
  id: number;
  value: number;
  scheme: Scheme;
  x: number;
  y: number;
  flip: boolean;
  status: FishState;
};

type Phase = "question" | "casting" | "reeling" | "feedback";
type Feedback = { correct: boolean; title: string; sub?: string } | null;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeFish(q: Question): FishDatum[] {
  const schemes = shuffle(SCHEMES);
  const spots = shuffle(FISH_SPOTS);
  return q.options.map((opt, i) => ({
    id: i,
    value: opt,
    scheme: schemes[i],
    x: spots[i].x,
    y: spots[i].y,
    flip: spots[i].flip,
    status: "swim" as FishState,
  }));
}

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

type GameScreenProps = {
  level: number;
  muted: boolean;
  onToggleMute: () => void;
  onLevelComplete: (correct: number) => void;
  onHome: () => void;
};

export default function GameScreen({
  level,
  muted,
  onToggleMute,
  onLevelComplete,
  onHome,
}: GameScreenProps) {
  const [qIndex, setQIndex] = useState(0);
  const [question, setQuestion] = useState<Question>(() =>
    generateQuestion(level)
  );
  const [fish, setFish] = useState<FishDatum[]>(() =>
    makeFish(generateQuestion(level))
  );
  const [phase, setPhase] = useState<Phase>("question");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [hookTarget, setHookTarget] = useState(HOOK_REST);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [caught, setCaught] = useState(0);
  const [results, setResults] = useState<("correct" | "wrong")[]>([]);

  const correctRef = useRef(0);
  const resultsRef = useRef<("correct" | "wrong")[]>([]);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };
  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  // Load a fresh question whenever the index or level changes
  useEffect(() => {
    const q = generateQuestion(level);
    setQuestion(q);
    setFish(makeFish(q));
    setPhase("question");
    setFeedback(null);
    setHookTarget(HOOK_REST);
    setTimeLeft(QUESTION_TIME);
    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex, level]);

  useEffect(() => () => clearTimers(), []);

  // Countdown timer per question
  useEffect(() => {
    if (phase !== "question") return;
    if (timeLeft <= 0) {
      handleWrong(null);
      return;
    }
    const id = window.setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  function recordResult(kind: "correct" | "wrong") {
    resultsRef.current = [...resultsRef.current, kind];
    setResults(resultsRef.current);
  }

  function advance() {
    clearTimers();
    if (resultsRef.current.length >= QUESTIONS_PER_LEVEL) {
      onLevelComplete(correctRef.current);
      return;
    }
    setQIndex((i) => i + 1);
  }

  function handleCorrect(fishId: number) {
    sound.correct();
    setPhase("reeling");
    setHookTarget(BUCKET);
    setFish((prev) =>
      prev.map((f) =>
        f.id === fishId ? { ...f, status: "caught", x: BUCKET.x, y: BUCKET.y } : f
      )
    );
    later(() => {
      // fish drops into the basket -> fade out
      setFish((prev) =>
        prev.map((f) => (f.id === fishId ? { ...f, status: "gone" } : f))
      );
      correctRef.current += 1;
      setCaught(correctRef.current);
      recordResult("correct");
      setFeedback({
        correct: true,
        title: "Benar! 🎉",
        sub: "Ikan masuk keranjang!",
      });
      setPhase("feedback");
      later(() => advance(), 1150);
    }, 780);
  }

  function handleWrong(fishId: number | null) {
    if (fishId !== null) {
      sound.escape();
      setFish((prev) =>
        prev.map((f) => (f.id === fishId ? { ...f, status: "escaped" } : f))
      );
    } else {
      sound.wrong();
    }
    recordResult("wrong");
    setFeedback({
      correct: false,
      title: fishId !== null ? "Coba Lagi! 😅" : "Waktu Habis! ⏰",
      sub: `Jawaban benar: ${question.a} − ${question.b} = ${question.answer}`,
    });
    setPhase("feedback");
    later(() => advance(), 1500);
  }

  function handleFishClick(f: FishDatum) {
    if (phase !== "question") return;
    clearTimers();
    sound.cast();
    setPhase("casting");
    setFish((prev) =>
      prev.map((x) => (x.id === f.id ? { ...x, status: "hooked" } : x))
    );
    setHookTarget({ x: f.x, y: f.y });
    later(() => {
      if (f.value === question.answer) handleCorrect(f.id);
      else handleWrong(f.id);
    }, 620);
  }

  const urgent = timeLeft <= 5;

  return (
    <Stage>
      {/* Question sign */}
      <SignBoard a={question.a} b={question.b} />

      {/* HUD: level badge */}
      <div className="hud level-badge">
        <span className="level-star">⭐</span>
        <div>
          <div className="level-text">Level {level}</div>
          <div className="level-dots">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`level-dot ${
                  i + 1 < level ? "done" : i + 1 === level ? "active" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* HUD: timer + buttons */}
      <div className="hud hud-right">
        <div className={`timer ${urgent ? "urgent" : ""}`}>
          <span>⏰</span>
          <span>{fmt(Math.max(0, timeLeft))}</span>
        </div>
        <button
          className="icon-btn btn-sound"
          onClick={() => {
            sound.click();
            onToggleMute();
          }}
          aria-label="suara"
        >
          {muted ? "🔇" : "🔊"}
        </button>
        <button
          className="icon-btn btn-home"
          onClick={() => {
            sound.click();
            onHome();
          }}
          aria-label="beranda"
        >
          🏠
        </button>
      </div>

      {/* Fishing rod + hook */}
      <FishingRod target={hookTarget} />

      {/* Fish (answer options) */}
      {fish.map((f) => (
        <div
          key={`${qIndex}-${f.id}`}
          className="fish-slot"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            opacity: f.status === "gone" ? 0 : 1,
          }}
        >
          <button
            className="fish-btn"
            disabled={phase !== "question"}
            onClick={() => handleFishClick(f)}
            aria-label={`jawaban ${f.value}`}
          >
            <Fish
              scheme={f.scheme}
              number={f.value}
              flip={f.flip}
              swimming={f.status === "swim"}
              className={f.status === "escaped" ? "fish-escaped" : ""}
            />
          </button>
        </div>
      ))}

      {/* Bottom bar: caught count + question progress */}
      <div className="hud bottom-bar">
        <div className="caught-pill">
          <span style={{ fontSize: "1.4em", lineHeight: 1 }}>🧺</span>
          <span>
            {caught}/{QUESTIONS_PER_LEVEL}
          </span>
        </div>
        <div className="progress-pill">
          <span>
            Soal {Math.min(qIndex + 1, QUESTIONS_PER_LEVEL)}/{QUESTIONS_PER_LEVEL}
          </span>
          <div className="progress-track">
            {Array.from({ length: QUESTIONS_PER_LEVEL }).map((_, i) => {
              const r = results[i];
              return (
                <span
                  key={i}
                  className={`pip ${
                    r === "correct"
                      ? "done"
                      : r === "wrong"
                      ? "wrong"
                      : i === qIndex
                      ? "current"
                      : ""
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Feedback popup */}
      {feedback && (
        <div className={`feedback ${feedback.correct ? "correct" : "wrong"}`}>
          <div className="fb-title">{feedback.title}</div>
          {feedback.sub && <div className="fb-sub">{feedback.sub}</div>}
        </div>
      )}
    </Stage>
  );
}
