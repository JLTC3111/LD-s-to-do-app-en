import React, { createContext, useContext, useState } from 'react';
import simpleSoundManager from '../utils/simpleSounds';

// Create context for sound management
const SoundContext = createContext();

export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSoundContext must be used within a SoundProvider');
  }
  return context;
};

export const SoundProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeAmbients, setActiveAmbients] = useState(new Map());

  // Play sound using simple sound manager
  const playSound = (soundName) => {
    if (!soundEnabled) return;
    simpleSoundManager.playSound(soundName);
  };

  // Play ambient sound
  const playAmbient = (soundName) => {
    if (!soundEnabled) return null;
    
    // Stop existing ambient if playing
    if (activeAmbients.has(soundName)) {
      stopAmbient(soundName);
      return null;
    }
    
    const audio = simpleSoundManager.playAmbient(soundName, true);
    if (audio) {
      setActiveAmbients(prev => new Map(prev).set(soundName, audio));
    }
    return audio;
  };

  // Stop ambient sound
  const stopAmbient = (soundName) => {
    if (activeAmbients.has(soundName)) {
      const audio = activeAmbients.get(soundName);
      audio.pause();
      audio.currentTime = 0;
      setActiveAmbients(prev => {
        const newMap = new Map(prev);
        newMap.delete(soundName);
        return newMap;
      });
    }
  };

  // Stop all ambient sounds
  const stopAllAmbients = () => {
    activeAmbients.forEach((audio, name) => {
      audio.pause();
      audio.currentTime = 0;
    });
    setActiveAmbients(new Map());
  };

  // Toggle sound on/off
  const toggleSound = () => {
    const newEnabled = !soundEnabled;
    setSoundEnabled(newEnabled);
    simpleSoundManager.setEnabled(newEnabled);
  };

  const value = {
    soundEnabled,
    playSound,
    playAmbient,
    stopAmbient,
    stopAllAmbients,
    toggleSound,
    activeAmbients
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
}; 