import { useState } from "react";
import { Drawer } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

type DrawerComponentProps = {
  prefixClassName?: string;
  icon?: IconProp;
  title?: string;
  size?: "default" | "large" | undefined;
  children?: React.ReactNode;
};

const DrawerComponent: React.FC<DrawerComponentProps> = ({
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

export default DrawerComponent;
