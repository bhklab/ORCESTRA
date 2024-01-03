import { useState, useEffect } from 'react';
/*
* return the current size of the active window,
* can be used to dynamically change the elements on the page
*/
function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth]);

  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerWidth]);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

export default useWindowSize;