import { useState } from "react";

export default function usePopup() {
  const [popupState, setPopupState] = useState({ show: false, message: "" });

  const showPopup = (message: string) => {
    setPopupState({ show: true, message: message });
    setTimeout(() => setPopupState({ show: false, message: "" }), 2000);
  };

  return [popupState, showPopup] as const;
}
