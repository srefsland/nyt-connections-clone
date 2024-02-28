export default function ControlButton(props: {
  text: string;
  onClick: () => void;
  unclickable?: boolean;
}) {
  const click = props.unclickable ? "pointer-events-none" : "";
  const textColor = props.unclickable ? "border-stone-500" : "border-black";
  const borderColor = props.unclickable ? "text-stone-500" : "text-black";

  return (
    <button
      className={`${borderColor} border rounded-full ${textColor} font-medium py-3 px-4 text-l ${click}`}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}
