import React, { useEffect, useState } from 'react';
import './App.css';
import { Color, ColorCount, getImageData } from './utils/get-image-data';
import Game from './components/game-background/game';

function App() {
  const [colorMatrix, setColorMatrix] = useState<Color[][]>([]);
  const [colorCount, setColorCount] = useState<ColorCount>(null);

  useEffect(() => {
    getImageData(process.env.PUBLIC_URL + '/source.png', 30)
      .then(({ colorCount, colorMatrix }) => {
        setColorMatrix(colorMatrix);
        setColorCount(colorCount);
      })
      .catch((err) => console.error(err));
  }, []);

  if (colorMatrix.length === 0) return null;

  return (
    <div className="App">
      <Game colorCount={colorCount} colorMatrix={colorMatrix} />
    </div>
  );
}

export default App;
