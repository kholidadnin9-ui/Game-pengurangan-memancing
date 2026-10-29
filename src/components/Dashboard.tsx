import { useState } from "react";
import Fish from "./Fish";
import Stage from "./Stage";
import { LEVEL_COUNT } from "../data/questions";
import { sound } from "../lib/sound";

const LEVEL_INFO = [
  { title: "Pemula", desc: "Pengurangan sampai 10", icon: "🐟" },
  { title: "Penjelajah", desc: "Pengurangan sampai 20", icon: "🐠" },
  { title: "Pemberani", desc: "Pengurangan dengan meminjam", icon: "🐡" },
  { title: "Ahli", desc: "Pengurangan sampai 50", icon: "🦈" },
  { title: "Juara", desc: "Pengurangan sampai 100", icon: "🐋" },
];

type View = "menu" | "levels" | "help";

type DashboardProps = {
  levelStars: number[];
  unlocked: number;
  muted: boolean;
  onToggleMute: () => void;
  onPlay: (level: number) => void;
  onResetProgress: () => void;
};

export default function Dashboard({
  levelStars,
  unlocked,
  muted,
  onToggleMute,
  onPlay,
  onResetProgress,
}: DashboardProps) {
  const [view, setView] = useState<View>("menu");
  const totalStars = levelStars.reduce((a, b) => a + b, 0);
  const completed = levelStars.filter((s) => s > 0).length;
  const go = (v: View) => {
    sound.click();
    setView(v);
  };

  return (
    <Stage>
      {/* decorative swimming fish */}
      <div className="float-fish" style={{ top: "68%", left: "4%", animation: "swim 3.6s ease-in-out infinite" }}>
        <Fish scheme="orange" number={4} swimming={false} />
      </div>
      <div className="float-fish" style={{ top: "74%", left: "84%", animation: "swim 3.2s ease-in-out infinite", animationDelay: "0.8s" }}>
        <Fish scheme="purple" number={7} flip swimming={false} />
      </div>

      <div className="screen dash-screen">
        {/* top bar */}
        <div className="dash-topbar">
          <div className="dash-chip">⭐ {totalStars}/{LEVEL_COUNT * 3}</div>
          <button className="icon-btn btn-sound" onClick={() => { sound.click(); onToggleMute(); }} aria-label="suara">
            {muted ? "🔇" : "🔊"}
          </button>
        </div>

        {view === "menu" && (
          <div className="panel dash-panel">
            <div className="dash-badge">🎣 DASHBOARD</div>
            <h1 className="home-title">
              Petualangan <span className="accent">Memancing</span> Ikan
            </h1>
            <div className="panel-title dash-subtitle">Game Pengurangan</div>

            <div className="dash-stats">
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-val">{completed}/{LEVEL_COUNT}</div>
                <div className="stat-lbl">Level Selesai</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-val">{totalStars}</div>
                <div className="stat-lbl">Bintang</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔓</div>
                <div className="stat-val">Level {unlocked}</div>
                <div className="stat-lbl">Terbuka</div>
              </div>
            </div>

            <div className="dash-menu">
              <button className="btn btn-green dash-btn" onClick={() => { sound.click(); onPlay(unlocked); }}>
                ▶ {completed > 0 ? `Lanjutkan Level ${unlocked}` : "Mulai Bermain"}
              </button>
              <button className="btn btn-blue dash-btn" onClick={() => go("levels")}>
                🗺️ Pilih Level
              </button>
              <button className="btn btn-amber dash-btn" onClick={() => go("help")}>
                📖 Cara Bermain
              </button>
            </div>
          </div>
        )}

        {view === "levels" && (
          <div className="panel dash-panel">
            <h2 className="panel-title">🗺️ Pilih Level</h2>
            <div className="level-grid">
              {LEVEL_INFO.map((info, i) => {
                const lvl = i + 1;
                const locked = lvl > unlocked;
                const stars = levelStars[i] ?? 0;
                return (
                  <button
                    key={lvl}
                    className={`level-card ${locked ? "locked" : ""}`}
                    disabled={locked}
                    onClick={() => { sound.click(); onPlay(lvl); }}
                  >
                    <div className="lc-num">{locked ? "🔒" : lvl}</div>
                    <div className="lc-icon">{info.icon}</div>
                    <div className="lc-title">{info.title}</div>
                    <div className="lc-desc">{info.desc}</div>
                    <div className="lc-stars">
                      {[0, 1, 2].map((s) => (
                        <span key={s} className={s < stars ? "" : "off"}>⭐</span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: "1cqw" }}>
              <button className="btn btn-red" onClick={() => go("menu")}>⬅ Kembali</button>
              {totalStars > 0 && (
                <button
                  className="btn btn-amber"
                  onClick={() => {
                    if (window.confirm("Hapus semua progres permainan?")) onResetProgress();
                  }}
                >
                  ♻ Reset Progres
                </button>
              )}
            </div>
          </div>
        )}

        {view === "help" && (
          <div className="panel dash-panel">
            <h2 className="panel-title">📖 Cara Bermain</h2>
            <ol className="help-list">
              <li><span>1</span> Baca soal pengurangan di papan kayu.</li>
              <li><span>2</span> Hitung jawabannya di dalam hati atau di kertas.</li>
              <li><span>3</span> <b>Klik ikan</b> yang membawa angka jawaban yang benar.</li>
              <li><span>4</span> Jawaban benar ✅ ikan tertarik pancing & masuk keranjang!</li>
              <li><span>5</span> Jawaban salah ❌ ikan melepaskan diri dan kabur.</li>
              <li><span>6</span> Setiap soal punya waktu 30 detik ⏰. Ada 10 soal per level.</li>
              <li><span>7</span> Benar 4+ = ⭐, 7+ = ⭐⭐, 9+ = ⭐⭐⭐. Dapatkan minimal 1 bintang untuk membuka level berikutnya.</li>
            </ol>
            <button className="btn btn-green" onClick={() => go("menu")}>👍 Mengerti!</button>
          </div>
        )}
      </div>
    </Stage>
  );
}
