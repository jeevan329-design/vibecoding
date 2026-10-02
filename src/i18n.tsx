import React, { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'en' | 'ne';

const D = {
  en: {
    brand: 'Common Thread', tagline: 'Neighbours helping neighbours',
    home: 'Home', requests: 'Requests', efforts: 'Efforts', resources: 'Resources', me: 'My Space',
    stories: 'Stories', explore: 'Community Map', more: 'More', search: 'Search',
    ask: 'Ask for help', offer: 'Offer help', theme: 'Switch theme', lang: 'भाषा',
    greeting: 'Namaste', welcome: 'What would you like to do today?',
    askDesc: 'Tell your neighbours what you need.', offerDesc: 'Share your time, skills or supplies.',
    openReq: 'Open requests', activeEff: 'Active efforts', helpers: 'Helpers', orgs: 'Groups',
    needsYou: 'Needs help now', seeAll: 'See all', happening: 'Happening in your community',
    progress: 'resolved', today: 'Today', this_week: 'This week', ongoing: 'Ongoing',
    storiesTitle: 'Learn from past efforts', storiesDesc: 'See what worked when neighbours came together.',
    exploreTitle: 'See the community map', exploreDesc: 'Explore people, groups and needs nearby.',
    trust: 'Trust & Privacy', reset: 'Reset demo', footer: 'A shared space for community care',
    skip: 'Skip to content', empty: 'Nothing here yet.',
  },
  ne: {
    brand: 'साझा धागो', tagline: 'छिमेकीले छिमेकीलाई सहयोग',
    home: 'गृहपृष्ठ', requests: 'अनुरोध', efforts: 'अभियान', resources: 'स्रोत', me: 'मेरो ठाउँ',
    stories: 'कथाहरू', explore: 'समुदाय नक्सा', more: 'थप', search: 'खोज्नुहोस्',
    ask: 'सहयोग माग्नुहोस्', offer: 'सहयोग गर्नुहोस्', theme: 'थिम बदल्नुहोस्', lang: 'Language',
    greeting: 'नमस्ते', welcome: 'आज तपाईं के गर्न चाहनुहुन्छ?',
    askDesc: 'आफूलाई के चाहिन्छ छिमेकीलाई बताउनुहोस्।', offerDesc: 'आफ्नो समय, सीप वा सामग्री बाँड्नुहोस्।',
    openReq: 'खुला अनुरोध', activeEff: 'सक्रिय अभियान', helpers: 'सहयोगी', orgs: 'समूह',
    needsYou: 'अहिले सहयोग चाहिएको', seeAll: 'सबै हेर्नुहोस्', happening: 'तपाईंको समुदायमा के भइरहेको छ',
    progress: 'समाधान भयो', today: 'आज', this_week: 'यो हप्ता', ongoing: 'निरन्तर',
    storiesTitle: 'विगतका अभियानबाट सिक्नुहोस्', storiesDesc: 'छिमेकीहरू मिल्दा के सफल भयो हेर्नुहोस्।',
    exploreTitle: 'समुदायको नक्सा हेर्नुहोस्', exploreDesc: 'नजिकका मानिस, समूह र आवश्यकता खोज्नुहोस्।',
    trust: 'विश्वास र गोपनीयता', reset: 'डेमो रिसेट', footer: 'समुदायको हेरचाहको साझा थलो',
    skip: 'सामग्रीमा जानुहोस्', empty: 'अहिलेसम्म केही छैन।',
  },
};
export type Key = keyof typeof D.en;

const Ctx = createContext<{ lang: Lang; toggleLang: () => void; t: (k: Key) => string }>(null as any);

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    try { return localStorage.getItem('ct-lang') === 'ne' ? 'ne' : 'en'; } catch { return 'en'; }
  });
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('ct-lang', lang); } catch {}
  }, [lang]);
  return (
    <Ctx.Provider value={{ lang, toggleLang: () => setLang(l => (l === 'en' ? 'ne' : 'en')), t: k => D[lang][k] }}>
      {children}
    </Ctx.Provider>
  );
};
export const useT = () => useContext(Ctx);
