// Simple sound utility using HTML5 Audio API
class SimpleSoundManager {
  constructor() {
    this.sounds = new Map();
    this.enabled = true;
    this.preloadSounds();
  }

  async preloadSounds() {
    const soundFiles = {
      // Todo actions
      add: '/sounds/add-todo.mp3',
      complete: '/sounds/completed.mp3',
      delete: '/sounds/trash.mp3',
      edit: '/sounds/keystroke_soft.mp3',
      undo: '/sounds/portal_opening.mp3',
      completed: '/sounds/completed.mp3',
      coin_bling: '/sounds/coin_bling.mp3',
      panel_expand: '/sounds/panel_expand.mp3',
      miss: '/sounds/miss.mp3',
      screenshot: '/sounds/screenshot.mp3',
      boot_up: '/sounds/boot_up.mp3',
      
      // UI interactions
      button: '/sounds/button_soft.mp3',
      toggle: '/sounds/toggle_on.mp3',
      popup: '/sounds/popup.mp3',
      popupOpen: '/sounds/popup_open.mp3',
      popupClose: '/sounds/popup_close.mp3',
      
      // Navigation
      tabSwitch: '/sounds/tab_open.mp3',
      tabClose: '/sounds/tab_close.mp3',
      
      // Success/Error
      success: '/sounds/success.mp3',
      successBling: '/sounds/success_bling.mp3',
      error: '/sounds/error.mp3',
      warning: '/sounds/warning.mp3',
      
      // Input/Form
      inputFocus: '/sounds/input_focus.mp3',
      submit: '/sounds/submit.mp3',
      
      // Notifications
      notification: '/sounds/notification.mp3',
      message: '/sounds/message.mp3',
      
      // Ambient sounds
      rain: '/sounds/rain.mp3',
      wind: '/sounds/wind.mp3',
      campfire: '/sounds/campfire.mp3',
      waterStream: '/sounds/water_stream.mp3',
      heartbeat: '/sounds/heartbeat.mp3'
    };

    // Preload all sounds
    for (const [name, path] of Object.entries(soundFiles)) {
      try {
        const audio = new Audio(path);
        audio.preload = 'auto';
        this.sounds.set(name, audio);
        console.log(`Preloaded sound: ${name}`);
      } catch (error) {
        console.warn(`Failed to preload sound: ${name}`, error);
      }
    }
  }

  playSound(soundName) {
    if (!this.enabled) return;
    
    const audio = this.sounds.get(soundName);
    if (audio) {
      try {
        // Clone the audio to allow multiple simultaneous plays
        const audioClone = audio.cloneNode();
        audioClone.volume = 0.5;
        audioClone.play().catch(error => {
          console.warn(`Failed to play sound ${soundName}:`, error);
        });
        console.log(`Playing sound: ${soundName}`);
      } catch (error) {
        console.warn(`Error playing sound ${soundName}:`, error);
      }
    } else {
      console.warn(`Sound not found: ${soundName}`);
    }
  }

  playAmbient(soundName, loop = true) {
    if (!this.enabled) return null;
    
    const audio = this.sounds.get(soundName);
    if (audio) {
      try {
        const audioClone = audio.cloneNode();
        audioClone.volume = 0.3;
        audioClone.loop = loop;
        audioClone.play().catch(error => {
          console.warn(`Failed to play ambient sound ${soundName}:`, error);
        });
        console.log(`Playing ambient sound: ${soundName}`);
        return audioClone;
      } catch (error) {
        console.warn(`Error playing ambient sound ${soundName}:`, error);
      }
    } else {
      console.warn(`Ambient sound not found: ${soundName}`);
    }
    return null;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

// Create a singleton instance
const simpleSoundManager = new SimpleSoundManager();

export default simpleSoundManager; 