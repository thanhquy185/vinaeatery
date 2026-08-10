import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import SockJS from "sockjs-client";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainMessageChatHistoryComponent from "../../../components/admin-manager/MainMessageChatHistoryComponent";
import MainMessageChatWindowComponent from "../../../components/admin-manager/MainMessageChatWindowComponent";
import MessageApiService from "../../../services/api/v1/MessageApiService";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Client, over } from "stompjs";
import { Spin } from "antd";
import { getVietnamCurrentDate } from "../../../utils/dayjs";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { MessageSummaryResponseType } from "../../../types/MessageType";
import type { RestaurantReadMessageRequestType } from "../../../types/SocketType";

const ManagerMessagesPage: React.FC<AdminManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );

  // Dữ liệu Tin nhắn
  const { data: messageData, isLoading } = useEntityQuery<
    PageResponseType<MessageSummaryResponseType>
  >({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      timeValue: [getVietnamCurrentDate(), ""],
      restaurantId: restaurantIdForCrud,
    },
    api: MessageApiService.handleGetSummary,
  });

  const [selectedMessage, setSelectedMessage] =
    useState<MessageSummaryResponseType>();

  //
  const stompClientRef = useRef<Client | null>(null);
  const currentSubscriptionRef = useRef<any | null>(null);
  const scrollBottomRef = useRef<HTMLDivElement | null>(null);

  // Chạy 1 lần
  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });

    const socket = new SockJS("http://localhost:8080/websocket"); // Docker-safe
    const client = over(socket);
    stompClientRef.current = client;

    client.connect({}, () => {
      client.subscribe(`/topic/manager-messages`, () => {
        queryClient.invalidateQueries({
          queryKey: [nameEN, restaurantIdForCrud],
        });
      });

      client.subscribe(`/topic/customer-send-message`, () => {
        queryClient.invalidateQueries({
          queryKey: [nameEN, restaurantIdForCrud],
        });
      });
    });

    return () => {
      if (client.connected) {
        client.disconnect(() => console.log("WebSocket disconnected"));
      }
    };
  }, []);
  // Xử lý khi thay đổi cuộc trò chuyện
  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });

    const client = stompClientRef.current;
    if (!client || !client.connected || !selectedMessage?.useTable?.id) return;

    if (currentSubscriptionRef.current) {
      currentSubscriptionRef.current.unsubscribe();
    }

    // Đánh dấu đã đọc
    if (!selectedMessage.isRead) {
      client.send(
        "/app/restaurant-read-message",
        {},
        JSON.stringify({
          messageId: selectedMessage.id,
        } as RestaurantReadMessageRequestType),
      );
    }
  }, [selectedMessage]);
  // Cập nhật mỗi khi messages thay đổi
  useEffect(() => {
    if (selectedMessage) {
      setSelectedMessage(
        messageData?.content?.find(
          (message) => message.id === selectedMessage.id,
        ),
      );
    } else {
      // setSelectedMessage(
      //   messageData?.content && messageData?.content.length > 0
      //     ? messageData.content[0]
      //     : undefined,
      // );
    }
  }, [messageData]);

  return (
    <Spin spinning={!messageData || isLoading}>
      <main className="admin-manager-main">
        <MainHeaderComponent title={nameVN} />
        <div className="admin-manager-main__body manager-chat">
          <MainMessageChatHistoryComponent
            messages={messageData?.content || []}
            selectedMessage={selectedMessage}
            setSelectedMessage={setSelectedMessage}
          />
          <MainMessageChatWindowComponent
            nameEN={nameEN}
            isManager={isManager}
            validActions={validActions}
            restaurantIdForCrud={restaurantIdForCrud}
            queryClient={queryClient}
            stompClientRef={stompClientRef}
            scrollBottomRef={scrollBottomRef}
            selectedMessage={selectedMessage}
          />
        </div>
      </main>
    </Spin>
  );
};

export default ManagerMessagesPage;
