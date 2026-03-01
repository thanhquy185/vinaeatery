import React, { useState } from "react";
import { Button, Drawer } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

type CustomDrawerProps = {
  prefixClassName?: string;
  icon?: IconProp;
  title?: string;
  size?: "default" | "large" | undefined;
  children?: React.ReactNode;
};

// Custome Drawer
const CustomDrawer: React.FC<CustomDrawerProps> = ({
  prefixClassName,
  icon,
  title,
  size = "default",
  children,
}) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={prefixClassName! + "action"}
        onClick={showDrawer}
      >
        <FontAwesomeIcon icon={icon!} className={prefixClassName! + "icon"} />
      </button>
      <Drawer
        title={title!}
        size={size!}
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={open}
        className="drawer"
      >
        {children!}
      </Drawer>
    </>
  );
};

export default CustomDrawer;
