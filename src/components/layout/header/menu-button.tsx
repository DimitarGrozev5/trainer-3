import React, { useRef } from "react";

import {
  type AriaButtonProps,
  type OverlayTriggerProps,
  useButton,
} from "react-aria";
import { useOverlayTrigger } from "react-aria";
import { useOverlayTriggerState } from "react-stately";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popover from "../popover";

const MenuButton: React.FC = (props: AriaButtonProps<"button">) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);

  return (
    <button
      {...buttonProps}
      className="mr-4 cursor-default rounded-full active:ring-2 active:ring-gray-300"
    >
      <MoreVertIcon sx={{ fontSize: "1.8rem" }} />
    </button>
  );
};

// export default MenuButton;

type PopoverTriggerProps = {
  children: React.ReactElement;
} & OverlayTriggerProps;

function PopoverTrigger({ children, ...props }: PopoverTriggerProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const state = useOverlayTriggerState(props);
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: "dialog" },
    state,
    ref
  );

  return (
    <>
      <MenuButton {...triggerProps} buttonRef={ref} />
      {state.isOpen && (
        <Popover {...props} triggerRef={ref} state={state}>
          {React.cloneElement(children, overlayProps)}
        </Popover>
      )}
    </>
  );
}

export default PopoverTrigger;