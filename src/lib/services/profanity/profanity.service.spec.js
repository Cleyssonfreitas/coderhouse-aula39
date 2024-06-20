import { beforeEach, describe, it, expect } from "vitest";
import ProfanityService from "./profanity.service.js";
import badWords from "./bad-words.js";

describe("ChatService", () => {
  describe("Profanity", () => {
    let profanity;
    beforeEach(() => {
      profanity = new ProfanityService();
    });
    it("should censure a word from the bad words dictionary", () => {
      const badWord = badWords[Math.floor(Math.random() * badWords.length)];
      const censored = profanity.isProfane(badWord);
      expect(censored).toBe(true);
      const expectedCensored = badWord[0] + '*'.repeat(badWord.length - 1);
      expect(profanity.censor(badWord)).toBe(expectedCensored);
    });
    it("should maintain not profane words in a sentence", () => {
      const badWord = badWords[Math.floor(Math.random() * badWords.length)];
      const phrase = `This is a phrase with a ${badWord} in it`;
      const expectedCensoredWord = badWord[0] + '*'.repeat(badWord.length - 1);
      const expectedCensoredPhrase = `This is a phrase with a ${expectedCensoredWord} in it`;
      expect(profanity.censor(phrase)).toBe(expectedCensoredPhrase);
    });
  });
});

