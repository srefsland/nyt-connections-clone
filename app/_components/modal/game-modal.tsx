"use client";

import React from "react";

type GameModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export default function GameModal(props: GameModalProps) {
  // dialog ref
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  // Open close
  React.useEffect(() => {
    if (props.isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [props.isOpen]);

  // If clicked outside bounding rect, close
  const handleClickOutside = (e: React.MouseEvent<HTMLDialogElement>) => {
    const boundingBox = dialogRef.current?.getBoundingClientRect();
    if (!boundingBox) return;

    if (
      e.clientX < boundingBox?.left ||
      e.clientX > boundingBox?.right ||
      e.clientY < boundingBox?.top ||
      e.clientY > boundingBox?.bottom
    ) {
      props.onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleClickOutside}
      className={`backdrop:bg-black backdrop:opacity-75 rounded-md p-8`}
    >
      {props.children}
    </dialog>
  );
}
