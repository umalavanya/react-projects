import React, { useState, useEffect, useRef } from 'react';
import './MouseTracker.css';

const MouseTracker = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [clickHistory, setClickHistory] = useState([]);
  const [trail, setTrail] = useState([]);
  const containerRef = useRef(null);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Add to trail (limit trail length)
      setTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }];
        return newTrail.slice(-20); // Keep last 20 positions
      });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Handle clicks
  const handleClick = (e) => {
    const newClick = {
      x: e.clientX,
      y: e.clientY,
      timestamp: new Date().toLocaleTimeString(),
      id: Date.now()
    };
    
    setClickPosition({ x: e.clientX, y: e.clientY });
    setClickHistory(prev => [newClick, ...prev.slice(0, 9)]); // Keep last 10 clicks
  };

  // Clear trail and click history
  const clearHistory = () => {
    setClickHistory([]);
    setTrail([]);
  };

  return (
    <div 
      ref={containerRef}
      className="mouse-tracker-container" 
      onClick={handleClick}
    >
      {/* Mouse coordinates display */}
      <div className="coordinates-panel">
        <h2>🐭 Mouse Tracker</h2>
        <div className="coordinates">
          <div className="coordinate-item">
            <span className="label">X:</span>
            <span className="value">{mousePosition.x}px</span>
          </div>
          <div className="coordinate-item">
            <span className="label">Y:</span>
            <span className="value">{mousePosition.y}px</span>
          </div>
          <div className="coordinate-item">
            <span className="label">Status:</span>
            <span className={`value ${isClicking ? 'clicking' : ''}`}>
              {isClicking ? 'Clicking' : 'Moving'}
            </span>
          </div>
        </div>
        
        {clickPosition.x > 0 && (
          <div className="last-click">
            Last Click: {clickPosition.x}, {clickPosition.y}
          </div>
        )}
        
        <button className="clear-btn" onClick={clearHistory}>
          Clear History
        </button>
      </div>

      {/* Click history */}
      {clickHistory.length > 0 && (
        <div className="history-panel">
          <h3>Recent Clicks ({clickHistory.length})</h3>
          <div className="click-list">
            {clickHistory.map((click, index) => (
              <div key={click.id} className="click-item">
                <span className="click-number">{index + 1}.</span>
                <span className="click-coords">
                  ({click.x}, {click.y})
                </span>
                <span className="click-time">{click.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual tracker */}
      <div 
        className="mouse-tracker"
        style={{
          left: mousePosition.x - 15,
          top: mousePosition.y - 15,
          backgroundColor: isClicking ? '#ff4444' : '#4CAF50'
        }}
      >
        <div className="tracker-pulse"></div>
      </div>

      {/* Mouse trail */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="trail-dot"
          style={{
            left: point.x - 2,
            top: point.y - 2,
            opacity: (index + 1) / trail.length
          }}
        />
      ))}

      {/* Click markers */}
      {clickHistory.map((click) => (
        <div
          key={click.id}
          className="click-marker"
          style={{
            left: click.x - 10,
            top: click.y - 10
          }}
        >
          <div className="ripple"></div>
        </div>
      ))}

      {/* Grid background */}
      <div className="grid-overlay"></div>
    </div>
  );
};

export default MouseTracker;