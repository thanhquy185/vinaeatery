import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import type { FC, ReactNode } from "react";

dayjs.locale("vi");

const ConfigVNComponent: FC<{ children: ReactNode }> = ({ children }) => {
  return <ConfigProvider locale={viVN}>{children}</ConfigProvider>;
};

export default ConfigVNComponent;
