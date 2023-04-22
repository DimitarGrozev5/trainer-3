import { useRef } from "react";
import { type AriaButtonProps, useButton } from "react-aria";

function Button(props: AriaButtonProps<"button">) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);

  return (
    <button {...buttonProps} ref={ref}>
      {props.children}
    </button>
  );
}

export default Button;
