"use client";

import { Word } from "@/app/_types";

type CellProps = {
  cellValue: Word;
  onClick: (word: Word) => void;
  isClicked: boolean;
};

export default function Cell(props: CellProps) {
  const bgColor = props.isClicked ? "bg-stone-500" : "bg-stone-200";
  const textColor = props.isClicked ? "text-stone-100" : "text-black";

  const handleClick = () => {
    props.onClick(props.cellValue);
  };

  return (
    <button
      className={`${bgColor} py-6 rounded-md break-all px-1`}
      onClick={handleClick}
    >
      <h2 className={`${textColor} text-lg text-center font-bold`}>
        {props.cellValue.word.toUpperCase()}
      </h2>
    </button>
  );
}
