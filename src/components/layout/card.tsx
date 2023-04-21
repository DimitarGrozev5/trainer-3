import { type CSSProperties } from "react";

type Props = {
  className?: HTMLDivElement["className"];
  style?: CSSProperties;
} & React.PropsWithChildren;

const Card: React.FC<Props> = ({ className = "", style = {}, children }) => {
  return (
    <div className={`rounded-xl bg-white p-4 ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Card;
