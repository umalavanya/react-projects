import React, { useState, useEffect } from 'react';
import './DigitalClock.css';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(true);
  const [showSeconds, setShowSeconds] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [alarmTime, setAlarmTime] = useState('');
  const [isAlarmSet, setIsAlarmSet] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Alarm functionality
  useEffect(() => {
    if (isAlarmSet && alarmTime) {
      const now = new Date();
      const [hours, minutes] = alarmTime.split(':');
      const alarmDate = new Date();
      alarmDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      if (
        now.getHours() === alarmDate.getHours() &&
        now.getMinutes() === alarmDate.getMinutes() &&
        now.getSeconds() === 0
      ) {
        playAlarm();
      }
    }
  }, [time, isAlarmSet, alarmTime]);

  const playAlarm = () => {
    // Create alarm sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    oscillator.start();
    
    setTimeout(() => {
      oscillator.stop();
      setIsAlarmSet(false);
    }, 2000);
  };

  const formatTime = () => {
    let hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');

    if (!is24Hour) {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours.toString().padStart(2, '0')}:${minutes}${showSeconds ? `:${seconds}` : ''} ${ampm}`;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}${showSeconds ? `:${seconds}` : ''}`;
  };

  const formatDate = () => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return time.toLocaleDateString(undefined, options);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleAlarmSet = () => {
    if (alarmTime && !isAlarmSet) {
      setIsAlarmSet(true);
    } else {
      setIsAlarmSet(false);
    }
  };

  const themes = [
    { name: 'dark', background: '#1a1a1a', color: '#00ff00' },
    { name: 'blue', background: '#001f3f', color: '#7FDBFF' },
    { name: 'red', background: '#300', color: '#ff4444' },
    { name: 'purple', background: '#2d1b69', color: '#9b59b6' },
    { name: 'matrix', background: '#001100', color: '#ff00ff' },
    { name: 'ocean', background: '#006994', color: '#87CEEB' }
  ];

  const currentTheme = themes.find(t => t.name === theme) || themes[0];

  return (
    <div 
      className={`digital-clock ${theme} ${isFullscreen ? 'fullscreen' : ''}`}
      style={{
        '--bg-color': currentTheme.background,
        '--text-color': currentTheme.color
      }}
    >
      <div className="clock-container">
        {/* Main Time Display */}
        <div className="time-display">
          <div className="time">{formatTime()}</div>
          {showDate && (
            <div className="date">{formatDate()}</div>
          )}
        </div>

        {/* Controls Panel */}
        <div className="controls-panel">
          <div className="control-group">
            <h3>Settings</h3>
            
            <div className="control-row">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={is24Hour}
                  onChange={() => setIs24Hour(!is24Hour)}
                />
                <span className="slider"></span>
                <span className="label-text">24-Hour Format</span>
              </label>
            </div>

            <div className="control-row">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={showSeconds}
                  onChange={() => setShowSeconds(!showSeconds)}
                />
                <span className="slider"></span>
                <span className="label-text">Show Seconds</span>
              </label>
            </div>

            <div className="control-row">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={showDate}
                  onChange={() => setShowDate(!showDate)}
                />
                <span className="slider"></span>
                <span className="label-text">Show Date</span>
              </label>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="control-group">
            <h3>Themes</h3>
            <div className="theme-buttons">
              {themes.map(themeOption => (
                <button
                  key={themeOption.name}
                  className={`theme-btn ${theme === themeOption.name ? 'active' : ''}`}
                  onClick={() => setTheme(themeOption.name)}
                  style={{
                    backgroundColor: themeOption.background,
                    borderColor: themeOption.color
                  }}
                  title={themeOption.name}
                >
                  <div 
                    className="theme-preview"
                    style={{ backgroundColor: themeOption.color }}
                  ></div>
                </button>
              ))}
            </div>
          </div>

          {/* Alarm Section */}
          <div className="control-group">
            <h3>Alarm</h3>
            <div className="alarm-controls">
              <input
                type="time"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                disabled={isAlarmSet}
                className="time-input"
              />
              <button 
                className={`alarm-btn ${isAlarmSet ? 'active' : ''}`}
                onClick={handleAlarmSet}
              >
                {isAlarmSet ? '🔔 Alarm Set' : '⏰ Set Alarm'}
              </button>
              {isAlarmSet && (
                <div className="alarm-status">
                  Alarm set for: {alarmTime}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="control-group">
            <h3>Actions</h3>
            <div className="action-buttons">
              <button className="action-btn" onClick={toggleFullscreen}>
                {isFullscreen ? '📱 Exit Fullscreen' : '🖥️ Fullscreen'}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="additional-info">
          <div className="info-item">
            <span className="label">Timezone:</span>
            <span className="value">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
          </div>
          <div className="info-item">
            <span className="label">UTC:</span>
            <span className="value">{time.toUTCString().split(' ')[4]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;