export type Color = { r: number; g: number; b: number };
export type ColorCount = Map<
  string,
  { color: Color; count: number; key: string }
>;

export function getImageData(
  url: string,
  maxWidth: number = 300
): Promise<{ colorMatrix: Color[][]; colorCount: ColorCount }> {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  canvas.style.position = 'fixed';
  canvas.style.left = '-999999px';

  document.body.appendChild(canvas);

  return new Promise((resolve, reject) => {
    const image = new Image();
    const colorMatrix: Color[][] = [];
    const colorCount: ColorCount = new Map<
      string,
      { color: Color; count: number; key: '' }
    >();

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
          const color: Color = {
            r: data[i],
            g: data[i + 1],
            b: data[i + 2],
            // a: data[i + 3] / 255,
          };
          const colorStr = getColorKey(color);

          if (colorCount.has(colorStr)) {
            colorCount.get(colorStr).count = colorCount.get(colorStr).count + 1;
          } else {
            colorCount.set(colorStr, {
              color,
              count: 1,
              key: String(colorCount.size + 1),
            });
          }

          line.push(color);
        }

        colorMatrix.push(line);
      }

      resolve({
        colorMatrix,
        colorCount,
      });

      setTimeout(() => {
        document.body.removeChild(canvas);
      }, 0);
    };

    image.onerror = (err) => reject(err);

    image.src = url;
  });
}

export const getColorKey = ({ r, g, b }: Color): string => {
  return [r, g, b].join('-');
};
