import { useState } from "react";
import { CellAnimationState, Word } from "../_types";
import { delay } from "../_utils";

export default function useAnimation() {
  const [guessAnimationState, setGuessAnimationState] =
    useState<CellAnimationState>({
      show: false,
      index: -1,
    });
  const [wrongGuessAnimationState, setWrongGuessAnimationState] =
    useState(false);

  const animateGuess = async (selectedWords: Word[]) => {
    for (let i = 0; i < selectedWords.length; i++) {
      if (selectedWords[i].selected) {
        setGuessAnimationState({ show: true, index: i });
        await delay(100);
      }
    }

    setGuessAnimationState({ show: false, index: -1 });
    await delay(500);
  };

  const animateWrongGuess = async () => {
    setWrongGuessAnimationState(true);
    await delay(225);
    setWrongGuessAnimationState(false);
  };

  return {
    guessAnimationState,
    wrongGuessAnimationState,
    animateGuess,
    animateWrongGuess,
  };
}
