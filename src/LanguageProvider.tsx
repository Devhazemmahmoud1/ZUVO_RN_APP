import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as RNLocalize from 'react-native-localize';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import i18n from './localization/i18n';
import { resources } from './localization/translator'; // wherever your resources live

type Lang = keyof typeof resources; // e.g. 'en' | 'ar'
type Ctx = { language: Lang; isRTL: boolean; setLanguage: (lang: Lang) => Promise<void> };

const LanguageContext = createContext<Ctx | null>(null);
const KEY = 'app:language';
const isLangRTL = (l: string) => ['ar', 'he', 'fa', 'ur'].includes(l);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Lang>('en');
  const isRTL = isLangRTL(language);

  useEffect(() => {
    (async () => {
      const saved = (await AsyncStorage.getItem(KEY)) as Lang | null;

      // figure out best device language among supported keys
      const supported = Object.keys(resources) as Lang[];
      const best = RNLocalize.findBestLanguageTag(supported);
      // normalize to base code like 'en' from 'en-US'
      const detected = (best?.languageTag.split('-')[0] as Lang) ?? 'en';
      const initial: Lang = saved ?? detected;

      await i18n.changeLanguage(initial);
      setLanguageState(initial);

      const shouldRTL = isLangRTL(initial);
      if (I18nManager.isRTL !== shouldRTL) {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(shouldRTL);
        setTimeout(() => RNRestart.Restart(), 50);
      }
    })();
  }, []);

  const setLanguage = useCallback(async (lang: Lang) => {
    await AsyncStorage.setItem(KEY, lang);
    await i18n.changeLanguage(lang);
    setLanguageState(lang);

    const shouldRTL = isLangRTL(lang);
    if (I18nManager.isRTL !== shouldRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(shouldRTL);
      setTimeout(() => RNRestart.Restart(), 50);
    }
  }, []);

  const value = useMemo<Ctx>(() => ({ language, isRTL, setLanguage }), [language, isRTL, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
