import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';

import Game from "./Game";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);

  return (
    <div>
      {data ? data : 'Loading...'}
      <Game />
    </div>
  );
}

export default App;
