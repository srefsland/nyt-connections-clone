import { CellAnimationState, Category, Word } from "@/app/_types";
import Cell from "./cell";
import ClearedCategory from "./cleared-category";

type GridProps = {
  words: Word[];
  selectedWords: Word[];
  clearedCategories: Category[];
  onClick: (word: Word) => void;
  guessAnimationState: CellAnimationState;
  wrongGuessAnimationState: boolean;
};

export default function Grid(props: GridProps) {
  return (
    <div className="grid grid-cols-4 gap-2 w-full">
      {props.clearedCategories.map((category) => (
        <ClearedCategory key={category.category} category={category} />
      ))}
      {props.words.map((item) => (
        <Cell
          key={item.word}
          cellValue={item}
          onClick={props.onClick}
          animateGuess={
            props.guessAnimationState.show &&
            props.guessAnimationState.index ===
              props.selectedWords.indexOf(item)
          }
          animateWrongGuess={
            props.wrongGuessAnimationState && props.selectedWords.includes(item)
          }
        />
      ))}
    </div>
  );
}
