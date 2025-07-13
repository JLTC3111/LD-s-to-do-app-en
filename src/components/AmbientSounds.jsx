import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSoundContext } from './SoundProvider';

export function AmbientSounds() {
  const { t } = useTranslation();
  const { soundEnabled, playSound, playAmbient, stopAmbient, stopAllAmbients, activeAmbients } = useSoundContext();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const ambientOptions = [
    { id: 'rain', name: t('ambient.rain'), icon: '🌧️' },
    { id: 'wind', name: t('ambient.wind'), icon: '💨' },
    { id: 'campfire', name: t('ambient.campfire'), icon: '🔥' },
    { id: 'waterStream', name: t('ambient.waterStream'), icon: '🌊' },
    { id: 'heartbeat', name: t('ambient.heartbeat'), icon: '💓' }
  ];



  // Outside click handler to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup handled by react-sounds
    };
  }, []);

  // Keyboard shortcuts for ambient sounds
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!soundEnabled) return;
      
      // Only trigger if not typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.key.toLowerCase()) {
        case '1':
          playAmbient('rain');
          break;
        case '2':
          playAmbient('wind');
          break;
        case '3':
          playAmbient('campfire');
          break;
        case '4':
          playAmbient('waterStream');
          break;
        case '5':
          playAmbient('heartbeat');
          break;
        case '0':
          stopAllAmbients();
          break;
        case 't':
          // Test multiple ambients
          playAmbient('rain');
          setTimeout(() => playAmbient('wind'), 1000);
          setTimeout(() => playAmbient('campfire'), 2000);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [soundEnabled, activeAmbients, playAmbient, stopAllAmbients]);

  return (
    <div className="ambient-sounds" ref={menuRef}>
      <button 
        className="ambient-toggle btn-hover-effect"
        onClick={() => setIsOpen(!isOpen)}
        title={`${t('ambient.title')} (1-5: Toggle, 0: Stop All)`}
      >
        <img src="/img/lullaby.png" alt="Music" style={{ width: '20px', height: '20px' }} />
        {activeAmbients.size > 0 && (
          <span className="ambient-count">
            {activeAmbients.size}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="ambient-menu">
          <div className="ambient-header">
            <h6>{t('ambient.title')}</h6>
            <button 
              onClick={stopAllAmbients}
              onMouseDown={() => soundEnabled && playSound('button')}
              className="stop-ambient"
              title={t('ambient.stopAll')}
            >
              ⏹️
            </button>
          </div>
          
          {ambientOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => playAmbient(option.id)}
              onMouseDown={() => soundEnabled && playSound('button')}
              className={`ambient-option ${activeAmbients.has(option.id) ? 'active' : ''}`}
            >
              <span className="ambient-icon">{option.icon}</span>
              <span className="ambient-name">{option.name}</span>
              {activeAmbients.has(option.id) && (
                <span className="ambient-status">●</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 