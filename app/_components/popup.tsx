import React from "react";

type PopupProps = {
  show: boolean;
  message: string;
};

function Popup(props: PopupProps) {
  if (!props.show) {
    return null;
  } else {
    return (
      <div className="absolute inset-x-0 -top-20 px-3 py-2 bg-black text-white rounded-lg mx-auto text-center max-w-max">
        {props.message}
      </div>
    );
  }
}

export default Popup;
