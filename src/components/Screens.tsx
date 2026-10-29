import Stage from "./Stage";

function Stars({ count }: { count: number }) {
  return (
    <div className="stars-row">
      {[0, 1, 2].map((i) => (
        <span key={i} className={`star ${i < count ? "" : "off"}`}>
          ⭐
        </span>
      ))}
    </div>
  );
}

export function starsFor(correct: number): number {
  if (correct >= 9) return 3;
  if (correct >= 7) return 2;
  if (correct >= 4) return 1;
  return 0;
}

type LevelCompleteProps = {
  level: number;
  correct: number;
  isLast: boolean;
  canContinue: boolean;
  onNext: () => void;
  onRetry: () => void;
  onHome: () => void;
};

export function LevelCompleteScreen({
  level,
  correct,
  isLast,
  canContinue,
  onNext,
  onRetry,
  onHome,
}: LevelCompleteProps) {
  const stars = starsFor(correct);
  return (
    <Stage>
      <div className="screen">
        <div className="panel">
          <div style={{ fontSize: "3.2rem", lineHeight: 1 }}>
            {stars === 3 ? "🏆" : stars >= 1 ? "🎉" : "💪"}
          </div>
          <h2 className="panel-title">Level {level} Selesai!</h2>
          <Stars count={stars} />
          <p className="panel-sub">
            Jawaban benar: <b>{correct}</b> / 10
          </p>
          {!canContinue && (
            <p className="panel-sub" style={{ color: "#dc2626" }}>
              Jawab minimal 4 soal dengan benar untuk membuka level berikutnya. Ayo coba lagi! 💪
            </p>
          )}
          <div style={{ marginTop: "0.8rem" }}>
            {canContinue && (
              <button className="btn btn-green" onClick={onNext}>
                {isLast ? "🏁 Lihat Hasil" : "➡ Lanjut Level " + (level + 1)}
              </button>
            )}
            <button className="btn btn-amber" onClick={onRetry}>
              🔄 Main Lagi
            </button>
            <button className="btn btn-red" onClick={onHome}>
              🏠 Dashboard
            </button>
          </div>
        </div>
      </div>
    </Stage>
  );
}

type GameCompleteProps = {
  totalStars: number;
  onRestart: () => void;
  onHome: () => void;
};

export function GameCompleteScreen({
  totalStars,
  onRestart,
  onHome,
}: GameCompleteProps) {
  return (
    <Stage>
      <div className="screen">
        <div className="panel">
          <div style={{ fontSize: "3.6rem", lineHeight: 1 }}>🏆🎣🏆</div>
          <h2 className="panel-title">Selamat, Juara Memancing!</h2>
          <p className="panel-sub">
            Kamu telah menyelesaikan semua 5 level dengan luar biasa!
          </p>
          <div
            className="stars-row"
            style={{ fontSize: "clamp(2.6rem,6vw,4rem)" }}
          >
            {Array.from({ length: totalStars }).map((_, i) => (
              <span key={i} className="star">
                ⭐
              </span>
            ))}
            <span
              style={{
                color: "#b45309",
                fontWeight: 800,
                alignSelf: "center",
                fontSize: "0.5em",
              }}
            >
              {" "}
              {totalStars}/15
            </span>
          </div>
          <div style={{ marginTop: "0.8rem" }}>
            <button className="btn btn-green" onClick={onRestart}>
              🔄 Main Lagi
            </button>
            <button className="btn btn-blue" onClick={onHome}>
              🏠 Dashboard
            </button>
          </div>
        </div>
      </div>
    </Stage>
  );
}
