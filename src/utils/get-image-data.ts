export type Color = { r: number; g: number; b: number; a: number };

export function getImageData(
  url: string,
  maxWidth: number = 300
): Promise<Color[][]> {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  canvas.style.position = 'fixed';
  canvas.style.left = '-999999px';

  document.body.appendChild(canvas);

  return new Promise((resolve, reject) => {
    const image = new Image();
    const colorList: Color[][] = [];

    image.onload = () => {
      const width = Math.min(maxWidth, image.naturalWidth);
      const height = (width / image.naturalWidth) * image.naturalHeight;

      canvas.width = width;
      canvas.height = height;

      context.drawImage(image, 0, 0, width, height);

      for (let i = 0; i < height; i++) {
        const { data } = context.getImageData(0, i, width, 1);
        const line = [];
        for (let i = 0; i < data.length; i += 4) {
          line.push({
            r: data[i],
            g: data[i + 1],
            b: data[i + 2],
            a: data[i + 3] / 255,
          });
        }

        colorList.push(line);
      }

      resolve(colorList);

      setTimeout(() => {
        document.body.removeChild(canvas);
      }, 0);
    };

    image.onerror = (err) => reject(err);

    image.src = url;
  });
}
