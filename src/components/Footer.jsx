import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      {t('footer.by')} <a target="_blank" href="https://github.com/JLTC3111">{t('footer.github')}</a> {t('footer.copyright')}
    </footer>
  );
} 