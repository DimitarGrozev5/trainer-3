type Props = React.PropsWithChildren;

const Card: React.FC<Props> = ({ children }) => {
  return <div className="rounded-xl bg-white p-4">{children}</div>;
};

export default Card;
