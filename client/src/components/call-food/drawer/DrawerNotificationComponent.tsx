import { Button } from "antd";
import { openNotification } from "../../../utils/showNotificationUtil";
import { openConfirmation } from "../../../utils/showConfirmationUtil";
import type { CallFoodPageProps } from "../../../constants/props";

const DrawerNotificationComponent: React.FC<CallFoodPageProps> = ({
  currentUseTable,
  stomp,
}) => {
  return (
    <>
      <p className="drawer__paragraph">Bạn cần nhân viên hỗ trợ ?</p>
      <Button
        className="drawer__button btn"
        onClick={async (e) => {
          const button = e.currentTarget;
          button.classList.add("active");

          const answer = await openConfirmation({
            title: "Bạn có chắc chắn gọi ?",
            content: "Hành động này không thể hoàn tác.",
          });
          if (answer) {
            const client = stomp?.current;
            if (!client || !client.connected) {
              console.warn("WebSocket chưa kết nối");
              return;
            }

            client.send(
              "/app/customer-call-employee",
              {},
              currentUseTable.table.name,
            );

            openNotification({
              type: "success",
              message: "Thành công",
              description: "Đã gọi nhân viên hỗ trợ",
            });
          }

          button.classList.remove("active");
        }}
      >
        Gửi yêu cầu
      </Button>
    </>
  );
};

export default DrawerNotificationComponent;
