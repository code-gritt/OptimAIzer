"use client";

import React from "react";

interface LoaderProps {
  show: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="bg-black/70 fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
      <div className="loader">
        <div className="loader_overlay"></div>
        <div className="loader_cogs">
          {/* Top Cog */}
          <div className="loader_cogs__top">
            <div className="top_part"></div>
            <div className="top_part"></div>
            <div className="top_part"></div>
            <div className="top_hole"></div>
          </div>
          {/* Left Cog */}
          <div className="loader_cogs__left">
            <div className="left_part"></div>
            <div className="left_part"></div>
            <div className="left_part"></div>
            <div className="left_hole"></div>
          </div>
          {/* Bottom Cog */}
          <div className="loader_cogs__bottom">
            <div className="bottom_part"></div>
            <div className="bottom_part"></div>
            <div className="bottom_part"></div>
            <div className="bottom_hole"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css?family=Montserrat:400,700");

        .loader {
          position: relative;
          width: 80vw;
          max-width: 400px;
          height: 300px;
          margin: auto;
        }

        .loader_overlay {
          width: 150px;
          height: 150px;
          background: transparent;
          box-shadow: 0px 0px 0px 1000px rgba(0, 0, 0, 0.6),
            0px 0px 19px 0px rgba(0, 0, 0, 0.5) inset;
          border-radius: 100%;
          position: absolute;
          inset: 0;
          margin: auto;
          z-index: -1;
        }

        .loader_cogs {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 100px;
          height: 100px;
          z-index: -2;
        }

        .loader_cogs__top {
          position: relative;
          width: 100px;
          height: 100px;
          transform-origin: 50px 50px;
          animation: rotate 10s infinite linear;
        }

        .loader_cogs__top .top_part {
          width: 100px;
          height: 100px;
          background: #f98db9;
          border-radius: 10px;
          position: absolute;
        }

        .loader_cogs__top .top_part:nth-of-type(1) {
          transform: rotate(30deg);
        }
        .loader_cogs__top .top_part:nth-of-type(2) {
          transform: rotate(60deg);
        }
        .loader_cogs__top .top_part:nth-of-type(3) {
          transform: rotate(90deg);
        }

        .top_hole {
          width: 50px;
          height: 50px;
          border-radius: 100%;
          background: black;
          position: absolute;
          inset: 0;
          margin: auto;
        }

        .loader_cogs__left {
          position: relative;
          width: 80px;
          height: 80px;
          left: -24px;
          top: 28px;
          transform: rotate(16deg);
          transform-origin: 40px 40px;
          animation: rotate_left 10s 0.1s infinite reverse linear;
        }

        .loader_cogs__left .left_part {
          width: 80px;
          height: 80px;
          background: #97ddff;
          border-radius: 6px;
          position: absolute;
        }

        .loader_cogs__left .left_part:nth-of-type(1) {
          transform: rotate(30deg);
        }
        .loader_cogs__left .left_part:nth-of-type(2) {
          transform: rotate(60deg);
        }
        .loader_cogs__left .left_part:nth-of-type(3) {
          transform: rotate(90deg);
        }

        .left_hole {
          width: 40px;
          height: 40px;
          border-radius: 100%;
          background: black;
          position: absolute;
          inset: 0;
          margin: auto;
        }

        .loader_cogs__bottom {
          position: relative;
          width: 60px;
          height: 60px;
          top: -65px;
          left: 79px;
          transform: rotate(4deg);
          transform-origin: 30px 30px;
          animation: rotate_left 10.2s 0.4s infinite linear;
        }

        .loader_cogs__bottom .bottom_part {
          width: 60px;
          height: 60px;
          background: #ffcd66;
          border-radius: 5px;
          position: absolute;
        }

        .loader_cogs__bottom .bottom_part:nth-of-type(1) {
          transform: rotate(30deg);
        }
        .loader_cogs__bottom .bottom_part:nth-of-type(2) {
          transform: rotate(60deg);
        }
        .loader_cogs__bottom .bottom_part:nth-of-type(3) {
          transform: rotate(90deg);
        }

        .bottom_hole {
          width: 30px;
          height: 30px;
          border-radius: 100%;
          background: black;
          position: absolute;
          inset: 0;
          margin: auto;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotate_left {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
