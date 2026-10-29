import type { ReactNode } from "react";
import bgUrl from "../assets/background.jpg";

type StageProps = {
  children: ReactNode;
};

export default function Stage({ children }: StageProps) {
  return (
    <div className="stage" style={{ backgroundImage: `url(${bgUrl})` }}>
      {children}
      <div className="credit">created by: Widodo guru SD</div>
    </div>
  );
}
