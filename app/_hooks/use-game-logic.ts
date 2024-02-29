import { useEffect, useRef, useState } from "react";
import { categories } from "../_examples";
import { Category, SubmitResult, Word } from "../_types";
import { delay, shuffleArray } from "../_utils";

export default function useGameLogic() {
  const [gameWords, setGameWords] = useState<Word[]>([]);
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [clearedCategories, setClearedCategories] = useState<Category[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [mistakesRemaining, setMistakesRemaning] = useState(4);
  const guessHistoryRef = useRef<Word[][]>([]);

  useEffect(() => {
    const words: Word[] = categories
      .map((category) =>
        category.items.map((word) => ({ word: word, level: category.level }))
      )
      .flat();
    setGameWords(shuffleArray(words));
  }, []);

  const addWord = (word: Word): void => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((item) => item.word !== word.word));
    } else {
      if (selectedWords.length !== 4) {
        setSelectedWords([...selectedWords, word]);
      }
    }
  };

  const shuffleWords = () => {
    setGameWords([...shuffleArray(gameWords)]);
  };

  const deselectAllWords = () => {
    setSelectedWords([]);
  };

  const getSubmitResult = (): SubmitResult => {
    const sameGuess = guessHistoryRef.current.some((guess) =>
      guess.every((word) => selectedWords.includes(word))
    );

    console.log(sameGuess);
    console.log(guessHistoryRef.current);
    console.log(selectedWords);

    if (sameGuess) {
      console.log("Same!");
      return { result: "same" };
    }

    guessHistoryRef.current.push(selectedWords);

    const likenessCounts = categories.map((category) => {
      return selectedWords.filter((item) => category.items.includes(item.word))
        .length;
    });

    const maxLikeness = Math.max(...likenessCounts);
    const maxIndex = likenessCounts.indexOf(maxLikeness);

    if (maxLikeness === 4) {
      return getCorrectResult(categories[maxIndex]);
    } else {
      return getIncorrectResult(maxLikeness);
    }
  };

  const getCorrectResult = (category: Category): SubmitResult => {
    setClearedCategories([...clearedCategories, category]);
    setGameWords(
      gameWords.filter((item) => !category.items.includes(item.word))
    );
    setSelectedWords([]);

    if (clearedCategories.length === 3) {
      return { result: "win" };
    } else {
      return { result: "correct" };
    }
  };

  const getIncorrectResult = (maxLikeness: number): SubmitResult => {
    setMistakesRemaning(mistakesRemaining - 1);

    if (maxLikeness === 3) {
      return { result: "one-away" };
    } else if (mistakesRemaining === 1) {
      return { result: "loss" };
    } else {
      return { result: "incorrect" };
    }
  };

  const handleLoss = async () => {
    const remainingCategories = categories.filter(
      (category) => !clearedCategories.includes(category)
    );

    deselectAllWords();

    for (const category of remainingCategories) {
      await delay(1000);
      setClearedCategories((prevClearedCategories) => [
        ...prevClearedCategories,
        category,
      ]);
      setGameWords((prevGameWords) =>
        prevGameWords.filter((item) => !category.items.includes(item.word))
      );
    }

    await delay(1000);
    setIsLost(true);
  };

  const handleWin = async () => {
    await delay(1000);
    setIsWon(true);
  };

  return {
    gameWords,
    selectedWords,
    clearedCategories,
    mistakesRemaining,
    guessHistoryRef,
    addWord,
    shuffleWords,
    deselectAllWords,
    getSubmitResult,
    handleLoss,
    handleWin,
  };
}
