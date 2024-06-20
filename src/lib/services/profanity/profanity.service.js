import wordlist from './bad-words.js';
class ProfanityService {
  phrase;
  config;
  censuredPhrase = '';
  wordlist = wordlist;
  constructor(inputStr = '', config) {
    const configDefaults = {
      enabled: true,
      placeHolder: '*',
      replaceRegex: /[\w\-À-ž]/g,
      separatorRegex: /[\w\-À-ž]+|[^\w\s]|\s+/g
    };
    this.phrase = inputStr;
    this.config = { ...configDefaults, ...config };
  }
  scan() {
    const separatorRegex = this.config?.separatorRegex ?? /[\w\-À-ž]+|[^\w\s]|\s+/g;
    this.censuredPhrase = this.phrase
      .match(separatorRegex)
      ?.map((value) => {
        return this.isProfane(value) ? this.censureWord(value) : value;
      })
      .reduce((current, next) => current + next, '');
    return this;
  }
  censureWord(word) {
    return word[0] + word.substring(1).replace(this.config?.replaceRegex, this.config?.placeHolder);
  }
  censor(str) {
    if (!this.config?.enabled) {
      return this.phrase;
    }
    if (str?.trim())
      this.phrase = str;
    this.scan();
    return this.censuredPhrase;
  }
  isProfane(value) {
    return this.wordlist.filter((word) => {
      const regex = new RegExp(`\\b${word.replace(/([^\wÀ-ź\-])/, '')}\\b`, 'gi');
      return regex.test(value);
    }).length > 0;
  }
}
export default ProfanityService;
