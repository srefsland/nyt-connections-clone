import { Word } from "../_types";
import { getWordColor } from "../_utils";

type GuessHistoryProps = {
  guessHistory: Word[][];
};

export default function GuessHistory(props: GuessHistoryProps) {
  return (
    <div className="grid grid-cols-4 gap-y-1 mb-12">
      {props.guessHistory.map((guesses) =>
        guesses.map((word, index) => (
          <div
            key={index}
            className={`size-12 rounded-md ${getWordColor(word.level)}`}
          ></div>
        ))
      )}
    </div>
  );
}
