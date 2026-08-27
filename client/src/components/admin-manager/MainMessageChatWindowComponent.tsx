import dayjs from "dayjs";
import { useState } from "react";
import { Button, Input } from "antd";
import { Send } from "lucide-react";
import { actionIndexes } from "../../utils/defaultActionsUtil";
import { hasPermission } from "../../utils/hasPermissionsUtil";
import { openNotification } from "../../utils/showNotificationUtil";
import type { QueryClient } from "@tanstack/react-query";
import type { Client } from "stompjs";
import type { MessageSummaryResponseType } from "../../types/MessageType";
import type { RestaurantSendMessageRequestType } from "../../types/SocketType";

type MainMessageChatWindowComponentProps = {
  nameEN: string;
  isManager: boolean;
  validActions: string;
  restaurantIdForCrud: number;
  queryClient: QueryClient;
  stompClientRef: React.RefObject<Client | null>;
  scrollBottomRef: React.RefObject<HTMLDivElement | null>;
  selectedMessage: MessageSummaryResponseType | undefined;
};

const MainMessageChatWindowComponent: React.FC<
  MainMessageChatWindowComponentProps
> = ({
  nameEN,
  isManager,
  validActions,
  restaurantIdForCrud,
  queryClient,
  stompClientRef,
  scrollBottomRef,
  selectedMessage,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  // Hàm gửi tin nhắn
  const sendMessage = () => {
    if (!inputValue.trim()) return;
    if (!selectedMessage?.id) {
      openNotification({
        type: "warning",
        message: "Cảnh báo",
        description: "Bạn chưa chọn cuộc trò chuyện để gửi tin nhắn!",
      });

      return;
    }

    const client = stompClientRef.current;
    if (!client || !client.connected) {
      console.warn("WebSocket chưa kết nối");
      return;
    }

    client.send(
      "/app/restaurant-send-message",
      {},
      JSON.stringify({
        messageId: selectedMessage.id,
        messageDetail: {
          sendAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          isRestaurantSend: true,
          content: inputValue,
        },
      } as RestaurantSendMessageRequestType),
    );

    queryClient.invalidateQueries({ queryKey: [nameEN] });
    setInputValue("");
  };

  return (
    <div className="manager-chat__window">
      <div className="manager-chat__header">
        {selectedMessage?.id && (
          <b>{selectedMessage?.useTable.table.name} - </b>
        )}
      </div>
      <div className="manager-chat__messages">
        {selectedMessage?.messageDetails.map((messageDetail, index) => (
          <div
            key={index}
            className={`manager-chat__bubble ${
              messageDetail.isRestaurantSend ? "admin" : "customer"
            }`}
          >
            <p>{messageDetail.content}</p>
            <span>{messageDetail?.sendAt?.split(" ")[1]}</span>
          </div>
        ))}
        <div ref={scrollBottomRef}></div>
      </div>
      <div className="manager-chat__input">
        {hasPermission({
          isManager,
          restaurantIdForCrud,
          validActions,
          requiredActionId: actionIndexes.create,
        }) ? (
          <>
            <Input
              placeholder="Nhập tin nhắn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button type="primary" onClick={sendMessage}>
              <Send />
              <span>Gửi</span>
            </Button>
          </>
        ) : (
          <>
            <p className="inform">Bạn không có quyền gửi tin nhắn !</p>
          </>
        )}
      </div>
    </div>
  );
};

export default MainMessageChatWindowComponent;
