type SignBoardProps = {
  a: number;
  b: number;
};

export default function SignBoard({ a, b }: SignBoardProps) {
  return (
    <div className="sign-board">
      {/* hanging ropes */}
      <div className="rope rope-left" />
      <div className="rope rope-right" />
      <div className="sign-inner">
        <div className="sign-equation">
          <span className="sign-num">{a}</span>
          <span className="sign-op">−</span>
          <span className="sign-num">{b}</span>
          <span className="sign-op">=</span>
          <span className="sign-q">?</span>
        </div>
      </div>
    </div>
  );
}
