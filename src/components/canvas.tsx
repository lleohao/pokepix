import React, { useEffect, useRef } from 'react';

import styles from './canvas.module.css';

interface CanvasProps {}

export default function Canvas(props: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);

  const renderImage = (url: string) => {
    const image = new Image();

    image.onload = (e) => {
      const ctx = canvasContextRef.current as CanvasRenderingContext2D;
      const width = document.body.offsetWidth - 32;
      const height = (width / image.naturalWidth) * image.naturalHeight;

      // ctx.drawImage(image, 16, 100, width, height);
      //
      // for (let i = 16; i <= width; i += 8) {
      //   for (let j = 100; j <= Math.floor(height); j += 8) {
      //     console.log(ctx.getImageData(i, j, 8, 8));
      //   }
      // }
    };

    image.src = url;
  };

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = document.body.offsetWidth;
      canvasRef.current.height = document.body.offsetHeight;

      canvasContextRef.current = canvasRef.current.getContext('2d');

      renderImage(process.env.PUBLIC_URL + '/source.jpg');
    }
  }, []);

  return (
    <div className={styles.wrap}>
      <canvas ref={canvasRef} />
    </div>
  );
}
