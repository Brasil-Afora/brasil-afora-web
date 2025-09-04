import React, { useState, useEffect } from 'react';

const FadeInOnScroll = ({ children }) => {
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  return (
    <div
      className={`
        transform transition-all duration-1000 ease-in-out
        ${hasLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
    >
      {children}
    </div>
  );
};

export default FadeInOnScroll;