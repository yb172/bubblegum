import React, { useState } from "react";

const startGumSize = 16;
export const gumElementId = "TheGum";
const impurityStep = 0.005;
const guaranteedBubbleSize = 20;

const getRandomVisibleChar = (seed: number): string => {
  const asciiStart = 32; // space
  const asciiEnd = 126; // tilde

  // Generate random number between asciiStart and asciiEnd
  const randomNum = Math.floor(seed * (asciiEnd - asciiStart + 1)) + asciiStart;

  // Convert to character and return
  return String.fromCharCode(randomNum);
};

const convertToFontWeight = (value: number): number => {
  return Math.ceil(value * 8) * 100;
};

function gradient(start: string, end: string, steps: number) {
  const startHex = start.replace("#", "");
  const endHex = end.replace("#", "");

  // Convert the hex colors to RGB
  const startRgb = {
    r: parseInt(startHex.substring(0, 2), 16),
    g: parseInt(startHex.substring(2, 4), 16),
    b: parseInt(startHex.substring(4, 6), 16),
  };
  const endRgb = {
    r: parseInt(endHex.substring(0, 2), 16),
    g: parseInt(endHex.substring(2, 4), 16),
    b: parseInt(endHex.substring(4, 6), 16),
  };

  // Calculate the difference between the start and end RGB values
  const diffR = endRgb.r - startRgb.r;
  const diffG = endRgb.g - startRgb.g;
  const diffB = endRgb.b - startRgb.b;

  // Divide the difference by the number of steps to get the step size for each color
  const stepSizeR = diffR / steps;
  const stepSizeG = diffG / steps;
  const stepSizeB = diffB / steps;

  // Initialize the array of gradient colors
  const gradientColors = [];

  // Generate the gradient colors
  for (let i = 0; i < steps; i++) {
    const hexR = Math.round(startRgb.r + stepSizeR * i).toString(16);
    const hexG = Math.round(startRgb.g + stepSizeG * i).toString(16);
    const hexB = Math.round(startRgb.b + stepSizeB * i).toString(16);
    gradientColors.push(`#${hexR}${hexG}${hexB}`);
  }

  return gradientColors;
}

const pinkColors = gradient("#FFB6C1", "#FFFFFF", 40);

const setGumSize = (size: number) => {
  const theGum = document.getElementById(gumElementId);
  if (theGum == null) {
    return;
  }
  theGum.style.fontSize = `${size}px`;
  theGum.style.lineHeight = `${size}px`;
  theGum.style.letterSpacing = `${size - 15}px`;
};

const setGumColor = (idx: number) => {
  if (idx === pinkColors.length) {
    return;
  }
  const theGum = document.getElementById(gumElementId);
  if (theGum == null) {
    return;
  }
  theGum.style.backgroundColor = pinkColors[idx];
};

const getFontWeight = (
  x: number,
  y: number,
  maxX: number,
  maxY: number
): number => {
  return convertToFontWeight((maxX - x + maxY - y + 1) / (maxX + maxY + 1));
};

interface GumParticle {
  look: string;
  impurityProbability: number;
}

export const Gum = () => {
  const [particle, setParticle] = useState<GumParticle>({
    look: "-",
    impurityProbability: 0,
  });

  let intervalId = 0;
  let gumSize = startGumSize;
  let colorIdx = 0;
  let ticks = 1;

  const beginBubble = () => {
    window.clearInterval(intervalId);
    intervalId = window.setInterval(() => {
      gumSize++;
      setGumSize(gumSize);
      colorIdx++;
      setGumColor(colorIdx);
      ticks++;
      if (
        ticks > guaranteedBubbleSize &&
        Math.random() < 1 - particle.impurityProbability
      ) {
        endBubble();
      }
    }, 200);
  };

  const endBubble = () => {
    setParticle({
      look: getRandomVisibleChar(Math.random()),
      impurityProbability: particle.impurityProbability + ticks * impurityStep,
    });
    window.clearInterval(intervalId);
    gumSize = startGumSize;
    setGumSize(gumSize);
    colorIdx = 0;
    setGumColor(colorIdx);
  };

  const colNum = Math.ceil(window.innerHeight / 12);
  const rowNum = Math.ceil(window.innerWidth / 7);

  const renderParticle = (particle: GumParticle): string => {
    const r = Math.random();
    if (r < particle.impurityProbability) {
      return getRandomVisibleChar(r);
    }
    return particle.look;
  };

  return (
    <div
      onPointerDown={beginBubble}
      onPointerUp={endBubble}
      className="gum"
      id={gumElementId}
    >
      <div className="gum-col">
        {Array.from(Array(colNum), (e, i) => (
          <div key={i} className="gum-row">
            {Array.from(Array(rowNum), (e, j) => (
              <div
                key={j}
                className="gum-cell"
                style={{
                  fontWeight: getFontWeight(j, i, colNum, rowNum),
                }}
              >
                {renderParticle(particle)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
