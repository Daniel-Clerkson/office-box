"use client"
import React, { useState, useEffect } from "react";

const AutoTypingEffect = ({ words, typingSpeed }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);

  useEffect(() => {
    let wordInterval;

    if (currentLetterIndex < words[currentWordIndex].length) {
      wordInterval = setInterval(() => {
        setCurrentWord(
          (prevWord) => prevWord + words[currentWordIndex][currentLetterIndex]
        );
        setCurrentLetterIndex((prevIndex) => prevIndex + 1);
      }, typingSpeed);
    } else {
      // Clear the interval if the word is fully typed
      clearInterval(wordInterval);
      // Delay before moving to the next word (adjust timing as needed)
      setTimeout(() => {
        setCurrentLetterIndex(0);
        setCurrentWord("");
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      }, 2000); // 1-second delay before moving to the next word
    }

    return () => {
      clearInterval(wordInterval);
    };
  }, [currentLetterIndex, currentWordIndex, words, typingSpeed]);

  return (
    <span className="">
      <span>{currentWord}<span className=" text-primary lg:text-[3rem] text-[2rem] font-black">.</span></span>
      <span className="animate-blink text-primary">|</span>
    </span>
  );
};

export default AutoTypingEffect;
