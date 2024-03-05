import { useState } from "react";
import { delay } from "../_utils";

export default function usePopup() {
  const [popupState, setPopupState] = useState({ show: false, message: "" });

  const showPopup = async (message: string) => {
    setPopupState({ show: true, message: message });
    await delay(1500);
    setPopupState({ show: false, message: "" });
  };

  return [popupState, showPopup] as const;
}
