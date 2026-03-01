import type { FC } from "react";
import { Button } from "antd";
import type { CallFoodLayoutProps } from "../../../layouts/call-food-layout";
import { openNotification } from "../../../utils/show-notification";
import { openConfirmation } from "../../../utils/show-confirmation";

// Drawer Notification
const DrawerNotification: FC<CallFoodLayoutProps> = ({
  currentUseTable,
  stomp,
}) => {
  return (
    <>
      <p className="drawer__paragraph">Bạn cần nhân viên hỗ trợ ?</p>
      <Button
        className="drawer__button btn"
        onClick={async (e) => {
          // Nút hiện tại
          const button = e.currentTarget;
          // Thêm class 'active' thể hiện nút đang được nhấn
          button.classList.add("active");

          // Hỏi trước khi xử khi xử lý ?
          const answer = await openConfirmation({
            title: "Bạn có chắc chắn gọi ?",
            content: "Hành động này không thể hoàn tác.",
          });
          if (answer) {
            const client = stomp?.current;
            if (!client || !client.connected) {
              console.warn("WebSocket chưa kết nối, không gửi được tin nhắn");
              return;
            }

            client.send(
              "/app/customer-call-employee",
              {},
              currentUseTable?.table?.name,
            );

            openNotification({
              type: "success",
              message: "Thành công",
              description: "Đã gọi nhân viên hỗ trợ",
            });
          }

          // Xoá class 'active' thể hiện nút không còn được nhấn
          button.classList.remove("active");
        }}
      >
        Gửi yêu cầu
      </Button>
    </>
  );
};

export default DrawerNotification;
