import en from '@/locale/en.json';
import th from '@/locale/th.json';

const translations: any = {
    en,
    th
}
export function getDictionary(locale: string) {
    return translations[locale] || translations.en
}