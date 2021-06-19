import React, { useEffect, useRef, useState } from 'react';
import { Color, ColorCount, getColorKey } from '../../utils/get-image-data';

export interface GameBackgroundProps {
  colorMatrix: Color[][];
  colorCount: ColorCount;
  squareSize?: number;
}

export default function GameBackground(props: GameBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { colorMatrix, colorCount, squareSize = 40 } = props;

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
          const { r, g, b } = colorMatrix[i][j];
          context.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;

          context.fillRect(
            j * squareSize,
            i * squareSize,
            squareSize,
            squareSize
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
      height: colorMatrix[0].length * squareSize,
      width: colorMatrix.length * squareSize,
    });

    setTimeout(() => {
      renderImage();
    }, 100);
  }, [colorMatrix, squareSize, colorCount]);

  return (
    <div>
      <canvas {...size} ref={canvasRef} />
    </div>
  );
}
