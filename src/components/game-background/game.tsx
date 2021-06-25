import React, { useEffect, useRef, useState } from 'react';
import { Color, ColorCount, getColorKey } from '../../utils/get-image-data';

export interface GameProps {
  colorMatrix: Color[][];
  colorCount: ColorCount;
  squareSize?: number;
}

function drawSquare(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: Color,
  opacity: number = 0.5
) {
  const { r, g, b } = color;

  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  ctx.fillRect(x, y, size, size);
}

export default function Game(props: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { colorMatrix, colorCount, squareSize = 40 } = props;
  const stateRef = useRef<Map<string, boolean>>(new Map<string, boolean>());

  const [size, setSize] = useState<{ height: number; width: number }>({
    height: 0,
    width: 0,
  });

  const renderImage = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.font = '12px monospace';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      const m = colorMatrix.length;
      const n = colorMatrix[0].length;

      for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
          const color = colorMatrix[i][j];

          drawSquare(
            context,
            j * squareSize,
            i * squareSize,
            squareSize,
            color
          );

          context.fillStyle = '#666';
          context.fillText(
            colorCount.get(getColorKey(colorMatrix[i][j])).key,
            j * squareSize + squareSize / 2,
            i * squareSize + squareSize / 2
          );

          context.strokeStyle = '#eee';
          context.lineWidth = 0.5;
          context.strokeRect(
            j * squareSize,
            i * squareSize,
            squareSize,
            squareSize
          );
        }
      }
    }
  };

  useEffect(() => {
    if (colorMatrix.length === 0 || !colorCount) return;

    setSize({
      width: colorMatrix[0].length * squareSize,
      height: colorMatrix.length * squareSize,
    });

    setTimeout(() => {
      renderImage();
    }, 100);
  }, [colorMatrix, squareSize, colorCount]);

  return (
    <div
      style={{ width: size.width }}
      onClick={(e) => {
        const [x, y] = [
          Math.floor(e.pageX / squareSize),
          Math.floor(e.pageY / squareSize),
        ];

        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          const key = `${x}-${y}`;

          ctx.clearRect(x * squareSize, y * squareSize, squareSize, squareSize);
          if (stateRef.current.get(key)) {
            drawSquare(
              ctx,
              x * squareSize,
              y * squareSize,
              squareSize,
              colorMatrix[y][x],
              0.5
            );

            stateRef.current.set(key, false);
          } else {
            stateRef.current.set(key, true);

            drawSquare(
              ctx,
              x * squareSize,
              y * squareSize,
              squareSize,
              colorMatrix[y][x],
              1
            );
          }
        }
      }}
    >
      <canvas {...size} ref={canvasRef} />
    </div>
  );
}
