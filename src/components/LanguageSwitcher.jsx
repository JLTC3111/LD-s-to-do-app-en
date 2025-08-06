import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { Sun, MoonStar, ChevronDownIcon } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', flag: '/flags/gb.svg', name: 'English', label: 'English' },
    { code: 'vi', flag: '/flags/vn.svg', name: 'Tiếng Việt', label: 'Tiếng Việt' },
    { code: 'ru', flag: '/flags/ru.svg', name: 'Русский', label: 'Русский' },
    { code: 'fr', flag: '/flags/fr.svg', name: 'Français', label: 'Français' },
    { code: 'de', flag: '/flags/de.svg', name: 'Deutsch', label: 'Deutsch' },
    { code: 'es', flag: '/flags/es.svg', name: 'Español', label: 'Español' },
    { code: 'ja', flag: '/flags/jp.svg', name: '日本語', label: '日本語' },
    { code: 'zh', flag: '/flags/cn.svg', name: '中文', label: '中文' },
    { code: 'th', flag: '/flags/th.svg', name: 'ไทย', label: 'ไทย' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const handleToggleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleLanguageClick = (e, lng) => {
    e.preventDefault();
    e.stopPropagation();
    changeLanguage(lng);
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
        onClick={handleToggleClick}
        title={t('language.selectLanguage')}
        type="button"
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
          <img 
            src={languages.find(l => l.code === i18n.language)?.flag}
            alt={languages.find(l => l.code === i18n.language)?.label}
            style={{ width: '1.25em', height: '1.25em', objectFit: 'contain' }}
          />
          <span style={{ flexGrow: 1 }}>{languages.find(l => l.code === i18n.language)?.label}</span>
          <ChevronDownIcon size={16} />
        </span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown-menu">
          {languages.map((lang) => (
            <button 
              key={lang.code}
              className={`language-option ${lang.code === i18n.language ? 'active' : ''}`}
              onClick={(e) => handleLanguageClick(e, lang.code)}
              type="button"
            >
              <img 
                src={lang.flag} 
                alt={lang.label} 
                style={{ width: '1.5em', height: '1.5em', objectFit: 'contain' }}
              />
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 