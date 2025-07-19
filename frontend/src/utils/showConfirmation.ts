import { Modal } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import React from "react";

type ConfirmOptions = {
  title: string;
  content?: React.ReactNode;
  okText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
};

export const openConfirmation = ({
  title,
  content,
  okText = "Yes",
  cancelText = "No",
  icon = React.createElement(QuestionCircleOutlined, {
    style: { color: "red" },
  }),
}: ConfirmOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    Modal.confirm({
      title,
      icon,
      content,
      okText,
      cancelText,
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
};
