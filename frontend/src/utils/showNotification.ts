// version đơn giản (không contextHolder)
import { notification } from "antd";
import type { ReactNode } from "react";

// Kiểu dữ liệu các tham số truyền vào
type openNotificationWithIconProps = {
  key?: string
  type: "success" | "info" | "warning" | "error";
  icon?: ReactNode;
  message?: string;
  description?: string | ReactNode[];
  duration?: number | null | undefined;
  placement?:
    | "topLeft"
    | "topRight"
    | "top"
    | "bottom"
    | "bottomLeft"
    | "bottomRight"
    | undefined;
  className?: string;
};

export const openNotification = ({
  key,
  type,
  icon = null,
  message,
  description,
  duration = 1,
  placement = "topRight",
  className = "notification",
}: openNotificationWithIconProps) => {
  notification[type!]({
    key: key,
    icon: icon,
    message: message!,
    description: description!,
    duration: duration!,
    placement: placement!,
    className: className!,
  });
};
