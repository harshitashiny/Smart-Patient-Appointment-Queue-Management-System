import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ta', 'te', 'kn'],
    preload: ['en', 'ta', 'te', 'kn'],
    ns: ['common', 'auth', 'appointment', 'queue', 'notification'],
    defaultNS: 'common',
    backend: {
      loadPath: path.join(__dirname, '../../locales/{{lng}}/{{ns}}.json'),
    },
    detection: {
      order: ['querystring', 'header'],
      lookupQuerystring: 'lang',
      lookupHeader: 'accept-language',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export const i18nMiddleware = middleware.handle(i18next);
export default i18next;
