"use client";

import { useCallback, useState } from "react";
import ControlButton from "./_components/button/control-button";
import Grid from "./_components/game/grid";
import GameLostModal from "./_components/modal/game-lost-modal";
import GameWonModal from "./_components/modal/game-won-modal";
import Popup from "./_components/popup";
import useGameLogic from "./_hooks/use-game-logic";
import usePopup from "./_hooks/use-popup";
import { CellAnimationState, SubmitResult, Word } from "./_types";
import { delay, getPerfection } from "./_utils";
import useAnimation from "./_hooks/use-animation";

export default function Home() {
  const [popupState, showPopup] = usePopup();
  const {
    gameWords,
    selectedWords,
    clearedCategories,
    mistakesRemaining,
    guessHistoryRef,
    selectWord,
    shuffleWords,
    deselectAllWords,
    getSubmitResult,
    handleWin,
    handleLoss,
  } = useGameLogic();

  const [showGameWonModal, setShowGameWonModal] = useState(false);
  const [showGameLostModal, setShowGameLostModal] = useState(false);

  const {
    guessAnimationState,
    wrongGuessAnimationState,
    animateGuess,
    animateWrongGuess,
  } = useAnimation();

  const handleSubmit = async () => {
    await animateGuess(selectedWords);

    const result: SubmitResult = getSubmitResult();

    switch (result.result) {
      case "same":
        showPopup("You've already guessed that!");
        break;
      case "one-away":
        animateWrongGuess();
        showPopup("One away...");
        break;
      case "loss":
        showPopup("Better luck next time!");
        await handleLoss();
        setShowGameLostModal(true);
        break;
      case "win":
        showPopup(getPerfection(mistakesRemaining));
        await handleWin();
        setShowGameWonModal(true);
        break;
      case "incorrect":
        animateWrongGuess();
        break;
    }
  };

  const onClickCell = useCallback(
    (word: Word) => {
      selectWord(word);
    },
    [selectWord]
  );

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
            onClick={onClickCell}
            clearedCategories={clearedCategories}
            guessAnimationState={guessAnimationState}
            wrongGuessAnimationState={wrongGuessAnimationState}
          />
        </div>
        <h2 className="text-black my-4 md:my-8 mx-8">
          Mistakes Remaining:{" "}
          {mistakesRemaining > 0 ? Array(mistakesRemaining).fill("•") : ""}
        </h2>
        <div className="flex gap-2 mb-12">
          <ControlButton text="Shuffle" onClick={shuffleWords} />
          <ControlButton text="Deselect All" onClick={deselectAllWords} />
          <ControlButton
            text="Submit"
            unclickable={selectedWords.length !== 4}
            onClick={() => handleSubmit()}
          />
        </div>
      </div>
      <GameWonModal
        isOpen={showGameWonModal}
        onClick={() => setShowGameWonModal(false)}
        guessHistory={guessHistoryRef.current}
        perfection={getPerfection(mistakesRemaining)}
      />
      <GameLostModal
        isOpen={showGameLostModal}
        onClick={() => setShowGameLostModal(false)}
        guessHistory={guessHistoryRef.current}
      />
    </>
  );
}
