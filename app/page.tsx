"use client";

import { useEffect, useRef, useState } from "react";
import ControlButton from "./_components/button/control-button";
import Grid from "./_components/game/grid";
import GameLostModal from "./_components/modal/game-lost-modal";
import GameWonModal from "./_components/modal/game-won-modal";
import Popup from "./_components/popup";
import { categories } from "./_examples";
import usePopup from "./_hooks/use-popup";
import { Category, Word } from "./_types";
import { delay, getPerfection, shuffleArray } from "./_utils";

export default function Home() {
  const [gameWords, setGameWords] = useState<Word[]>([]);
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [clearedCategories, setClearedCategories] = useState<Category[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [mistakesRemaining, setMistakesRemaning] = useState(4);
  const [popupState, showPopup] = usePopup();
  const guessHistoryRef = useRef<Word[][]>([]);

  useEffect(() => {
    const words: Word[] = categories
      .map((category) =>
        category.items.map((word) => ({ word: word, level: category.level }))
      )
      .flat();
    setGameWords(shuffleArray(words));
  }, []);

  const handleCellClick = (word: Word): void => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((item) => item.word !== word.word));
    } else {
      if (selectedWords.length !== 4) {
        setSelectedWords([...selectedWords, word]);
      }
    }
  };

  const handleShuffle = () => {
    setGameWords([...shuffleArray(gameWords)]);
  };

  const handleDeselectAll = () => {
    setSelectedWords([]);
  };

  const handleCorrectGuess = (category: Category) => {
    setClearedCategories([...clearedCategories, category]);
    setGameWords(
      gameWords.filter((item) => !category.items.includes(item.word))
    );
    setSelectedWords([]);

    if (clearedCategories.length === 3) {
      setTimeout(() => setIsWon(true), 1000);
      showPopup(getPerfection(mistakesRemaining));
    }
  };

  const handleIncorrectGuess = (likeness: number) => {
    if (likeness === 3) {
      showPopup("One away...");
    }

    setMistakesRemaning(mistakesRemaining - 1);

    if (mistakesRemaining === 1) {
      handleLoss();
    }
  };

  const handleLoss = async () => {
    showPopup("Better luck next time!");

    const remainingCategories = categories.filter(
      (category) => !clearedCategories.includes(category)
    );

    handleDeselectAll();

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

  const handleSubmit = () => {
    const sameGuess = guessHistoryRef.current.some((guess) =>
      guess.every((word) => selectedWords.includes(word))
    );

    if (sameGuess) {
      showPopup("You've already guessed that!");
      return;
    }

    guessHistoryRef.current.push(selectedWords);

    // Compare two arrays, and count the number of elements that are the same
    const likenessCounts = categories.map((category) => {
      return selectedWords.filter((item) => category.items.includes(item.word))
        .length;
    });

    const maxLikeness = Math.max(...likenessCounts);
    const maxIndex = likenessCounts.indexOf(maxLikeness);

    if (maxLikeness === 4) {
      handleCorrectGuess(categories[maxIndex]);
    } else {
      handleIncorrectGuess(maxLikeness);
    }
  };

  return (
    <>
      <h1 className="text-black text-4xl font-black my-4 ml-4">Connections</h1>
      <hr className="mb-6 md:mb-12"></hr>
      <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-5/12 mx-auto">
        <h1 className="text-black mb-4">Create four groups of four!</h1>
        <div className="relative w-full">
          <Popup show={popupState.show} message={popupState.message} />
          <Grid
            words={gameWords}
            selectedWords={selectedWords}
            onClick={handleCellClick}
            clearedCategories={clearedCategories}
          />
        </div>
        <h2 className="text-black my-4 md:my-8 mx-8">
          Mistakes Remaining:{" "}
          {mistakesRemaining > 0 ? Array(mistakesRemaining).fill("•") : ""}
        </h2>
        <div className="flex gap-2 mb-12">
          <ControlButton text="Shuffle" onClick={handleShuffle} />
          <ControlButton text="Deselect All" onClick={handleDeselectAll} />
          <ControlButton
            text="Submit"
            unclickable={selectedWords.length !== 4}
            onClick={handleSubmit}
          />
        </div>
      </div>
      <GameWonModal
        isOpen={isWon}
        onClick={() => setIsWon(false)}
        guessHistory={guessHistoryRef.current}
        perfection={getPerfection(mistakesRemaining)}
      />
      <GameLostModal
        isOpen={isLost}
        onClick={() => setIsLost(false)}
        guessHistory={guessHistoryRef.current}
      />
    </>
  );
}
