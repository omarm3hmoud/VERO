import React from 'react';

const Loader = ({ progress, isHidden }) => {
  return (
    <div id="loader" className={isHidden ? 'hidden' : ''} style={{ display: isHidden ? 'none' : 'flex' }}>
      <img src="/logo.jpg" className="loader-logo" alt="VERO" />
      <div className="loader-text">جاري التحميل...</div>
      <div className="loader-bar-wrap">
        <div className="loader-bar" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default Loader;
