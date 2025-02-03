import { BANNED_WORDS } from '../utils/constants';

export const containsBannedWords = (text) => {
  if (!text) return false;
  
  const normalizedText = text.toLowerCase().trim();
  
  // Розбиваємо текст на слова, видаляючи зайві пробіли
  const words = normalizedText.split(/\s+/);
  
  return BANNED_WORDS.some(bannedWord => 
    words.some(word => {
      // Видаляємо спеціальні символи для перевірки спроб обходу фільтра
      const cleanWord = word.replace(/[.,!?*@#$%^&()_+\-=\[\]{};':"\\|,.<>\/?\s]/g, '');
      
      // Створюємо регулярний вираз, який шукає слово з можливими символами між літерами
      const letterArray = bannedWord.split('');
      const regexPattern = letterArray.map(letter => `${letter}`).join('[^a-zа-яіїєґ]*');
      const regex = new RegExp(regexPattern, 'i');
      
      return (
        word === bannedWord || // Точне співпадіння
        cleanWord === bannedWord || // Співпадіння після очистки
        word.includes(bannedWord) || // Містить заборонене слово
        cleanWord.replace(/[*@$#]/g, '') === bannedWord || // Перевірка на навмисну заміну літер
        regex.test(word) // Перевірка на розділені символами літери
      );
    })
  );
};

export const maskBannedWords = (text) => {
  if (!text) return '';
  
  let maskedText = text.toLowerCase();
  BANNED_WORDS.forEach(word => {
    // Створюємо регулярний вираз для пошуку слова з можливими символами між літерами
    const letterArray = word.split('');
    const regexPattern = letterArray.map(letter => `${letter}`).join('[^a-zа-яіїєґ]*');
    const regex = new RegExp(regexPattern, 'gi');
    
    // Знаходимо всі співпадіння
    const matches = maskedText.match(regex);
    if (matches) {
      matches.forEach(match => {
        maskedText = maskedText.replace(match, '*'.repeat(match.length));
      });
    }
    
    // Також замінюємо точні співпадіння
    const exactRegex = new RegExp(word, 'gi');
    maskedText = maskedText.replace(exactRegex, '*'.repeat(word.length));
  });
  
  return maskedText;
};