import { Word } from "@/app/_types";
import ControlButton from "../button/control-button";
import GuessHistory from "../guess-history";
import GameModal from "./game-modal";

type GameLostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  guessHistory: Word[][];
};

export default function GameLostModal(props: GameLostModalProps) {
  return (
    <GameModal isOpen={props.isOpen} onClose={props.onClose}>
      <div className="flex flex-col items-center justify-center px-12">
        <h1 className="text-black text-3xl font-black my-4 ml-4">
          {"Next time!"}
        </h1>
        <hr className="mb-2 md:mb-4 w-full"></hr>
        <GuessHistory guessHistory={props.guessHistory} />
        <ControlButton text="Exit" onClick={props.onClose} />
      </div>
    </GameModal>
  );
}
