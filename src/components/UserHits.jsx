import React, { useEffect } from 'react';
import ReactGA from 'react-ga';

const App = () => {
  useEffect(() => {
    ReactGA.initialize('G-2GRMRT1ZC4'); 
    ReactGA.pageview(window.location.pathname);
  }, []);

  return (
    <>
      {/* Your app content */}
    </>
  );
};

export default App;
