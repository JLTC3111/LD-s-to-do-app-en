import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', flag: 'gb', name: 'English' },
    { code: 'vi', flag: 'vn', name: 'Tiếng Việt' },
    { code: 'ru', flag: 'ru', name: 'Русский' },
    { code: 'fr', flag: 'fr', name: 'Français' },
    { code: 'de', flag: 'de', name: 'Deutsch' },
    { code: 'es', flag: 'es', name: 'Español' },
    { code: 'ja', flag: 'jp', name: '日本語' },
    { code: 'zh', flag: 'cn', name: '中文' },
    { code: 'th', flag: 'th', name: 'ไทย' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="language-dropdown" ref={dropdownRef}>
      <button 
        className="language-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Select Language"
      >
        <span className={`flag-icon flag-icon-${currentLanguage.flag}`}></span>
        <span className="current-language-name">{currentLanguage.name}</span>
        <span className="dropdown-arrow">▼</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown-menu">
          {languages.map((lang) => (
            <button 
              key={lang.code}
              className={`language-option ${lang.code === i18n.language ? 'active' : ''}`}
              onClick={() => changeLanguage(lang.code)}
            >
              <span className={`flag-icon flag-icon-${lang.flag}`}></span>
              <span className="language-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 