// version đơn giản (không contextHolder)
import { notification } from "antd";
import type { ReactNode } from "react";

// Kiểu dữ liệu các tham số truyền vào
type openNotificationWithIconProps = {
  type: "success" | "info" | "warning" | "error";
  message?: string;
  description?: string | ReactNode[];
  duration?: number;
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
  type,
  message,
  description,
  duration = 1,
  placement = "topRight",
  className = "notification",
}: openNotificationWithIconProps) => {
  notification[type]({
    message: message!,
    description: description!,
    duration: duration!,
    placement: placement!,
    className: className!,
  });
};
