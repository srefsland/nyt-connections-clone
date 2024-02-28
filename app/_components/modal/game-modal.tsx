import React from "react";

type GameModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
};

export default function GameModal(props: GameModalProps) {
  const modalState = props.isOpen ? "block" : "hidden";

  return (
    <dialog className={`fixed z-10 inset-0 overflow-y-auto ${modalState}`}>
      <div className="flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-75"></div>
        <div className="bg-white rounded-lg p-8 z-10">{props.children}</div>
      </div>
    </dialog>
  );
}
