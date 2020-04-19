import { useState, useEffect } from 'react';

// custom hook trick to perform some operation before render
// use only for light processing
export default (execute) => {
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => setHasRendered(true), [hasRendered]);

  if (!hasRendered) {
    execute();
  }
};
