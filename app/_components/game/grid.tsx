import { Category, Word } from "@/app/_types";
import Cell from "./cell";
import ClearedCategory from "./cleared-category";

type GridProps = {
  words: Word[];
  clearedCategories: Category[];
  onClick: (word: Word) => void;
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
        />
      ))}
    </div>
  );
}
