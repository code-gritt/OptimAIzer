"use client";

import React from "react";

interface LoaderProps {
  show: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ show }) => {
  if (!show) return null;

  const balls = [
    { color: "#ff6347", size: 13, duration: 6.8 },
    { color: "#00ced1", size: 19, duration: 3.5 },
    { color: "#adff2f", size: 11, duration: 4.9 },
    { color: "#9370db", size: 17, duration: 9.3 },
    { color: "#ff1493", size: 14, duration: 2.7 },
    { color: "#00bfff", size: 10, duration: 5.1 },
    { color: "#7fff00", size: 16, duration: 6.6 },
    { color: "#dc143c", size: 18, duration: 7.2 },
    { color: "#8a2be2", size: 12, duration: 8.4 },
    { color: "#48d1cc", size: 20, duration: 3.9 },
    { color: "#ff4500", size: 15, duration: 4.6 },
    { color: "#00ff7f", size: 19, duration: 5.7 },
    { color: "#ba55d3", size: 11, duration: 7.1 },
    { color: "#1e90ff", size: 13, duration: 9.7 },
    { color: "#ffa500", size: 10, duration: 6.2 },
    { color: "#ff69b4", size: 14, duration: 3.4 },
    { color: "#00fa9a", size: 17, duration: 8.9 },
    { color: "#9400d3", size: 12, duration: 7.6 },
    { color: "#ffb6c1", size: 16, duration: 4.3 },
    { color: "#20b2aa", size: 18, duration: 2.8 },
  ];

  return (
    <div className="bg-black/50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <aside
        className="relative flex h-[200px] w-[200px] flex-wrap justify-center"
        style={{ transform: "translateX(-50%)" }}
      >
        {balls.map((ball, index) => (
          <article
            key={index}
            className="absolute rounded-full mix-blend-difference"
            style={{
              width: `calc(200px + ${ball.size}px)`,
              height: `calc(200px + ${ball.size}px)`,
              backgroundColor: ball.color,
              animation: `move ${ball.duration}s linear infinite ${
                index % 2 === 0 ? "normal" : "reverse"
              }`,
              transformOrigin: "200px",
              filter: "blur(28px)",
            }}
          ></article>
        ))}
      </aside>

      <style jsx>{`
        @keyframes move {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(359deg);
          }
        }
      `}</style>
    </div>
  );
};
