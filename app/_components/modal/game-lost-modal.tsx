import { Word } from "@/app/_types";
import GameModal from "./game-modal";
import GuessHistory from "../guess-history";
import ControlButton from "../button/control-button";

type GameLostModalProps = {
  isOpen: boolean;
  onClick: () => void;
  guessHistory: Word[][];
};

export default function GameLostModal(props: GameLostModalProps) {
  return (
    <GameModal isOpen={props.isOpen}>
      <div className="flex flex-col items-center justify-center px-12">
        <h1 className="text-black text-4xl font-black my-4 ml-4">
          {"Better luck next time!"}
        </h1>
        <hr className="mb-2 md:mb-4 w-full"></hr>
        <GuessHistory guessHistory={props.guessHistory} />
        <ControlButton text="Exit" onClick={props.onClick} />
      </div>
    </GameModal>
  );
}
