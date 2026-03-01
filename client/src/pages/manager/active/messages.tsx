import { useEffect, useRef, useState, type FC } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Input } from "antd";
import { MessagesSquareIcon, Send } from "lucide-react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faComments, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import type { MessageType } from "../../../common/types";
import type { ManagerPageProps } from "../../../common/props";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import { FindMessageFormatUseTableIsNull } from "../../../requests/messages";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { actionIndexes } from "../../../utils/default-actions";
import { hasPermission } from "../../../utils/has-permissions";
import { openNotification } from "../../../utils/show-notification";
import { Client, over } from "stompjs";
import SockJS from "sockjs-client";
import dayjs from "dayjs";
import { ImageSourcePath } from "../../../common/values";

// Manager Messages
const ManagerMessages: FC<ManagerPageProps> = ({
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
  // useEffect(() => {
  //   queryClient.invalidateQueries({ queryKey: [nameEN] });
  // }, [selectedRestaurantId]);

  // Dữ liệu về tin nhắn
  const {
    data: messages,
    isLoading,
    isError,
    error,
  } = useEntityQuery<MessageType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindMessageFormatUseTableIsNull,
  });

  //
  const [selectedChat, setSelectedChat] = useState<MessageType>();
  const stompClientRef = useRef<Client | null>(null);
  const currentSubscriptionRef = useRef<any | null>(null);
  const scrollBottomRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  // Hàm gửi tin nhắn
  const sendMessage = () => {
    if (!inputValue.trim()) return;
    if (!selectedChat?.id) {
      openNotification({
        type: "warning",
        message: "Cảnh báo",
        description: "Bạn chưa chọn cuộc trò chuyện để gửi tin nhắn!",
      });

      return;
    }

    const client = stompClientRef.current;
    if (!client || !client.connected) {
      console.warn("WebSocket chưa kết nối, không gửi được tin nhắn");
      return;
    }

    client.send(
      "/app/admin-send-message",
      {},
      JSON.stringify({
        id: selectedChat.id,
        useTableId: selectedChat?.useTable?.id,
        isRead: true,
        messageDetail: {
          sendAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          isAdminSend: true,
          content: inputValue,
        },
      }),
    );

    queryClient.invalidateQueries({ queryKey: ["messages"] });
    setInputValue(""); // xóa input
  };
  // Chạy 1 lần
  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });

    const socket = new SockJS("http://localhost:8080/websocket"); // Docker-safe
    const client = over(socket);
    stompClientRef.current = client;

    client.connect({}, () => {
      console.log("WebSocket connected");

      // Subscribe chung cho admin messages
      client.subscribe("/topic/admin-messages", () => {
        queryClient.invalidateQueries({ queryKey: ["messages"] });
      });

      // Nếu đã có selectedChat khi connect, subscribe luôn
      if (selectedChat?.useTable?.id) {
        currentSubscriptionRef.current = client.subscribe(
          `/topic/use-table-${selectedChat.useTable.id}`,
          (payload) => {
            console.log("Tin nhắn mới:", payload.body);
            queryClient.invalidateQueries({ queryKey: ["messages"] });
          },
        );
      }
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
    if (!client || !client.connected || !selectedChat?.useTable?.id) return;

    // Hủy subscription cũ nếu có
    if (currentSubscriptionRef.current) {
      currentSubscriptionRef.current.unsubscribe();
    }

    // Subscribe mới
    currentSubscriptionRef.current = client.subscribe(
      `/topic/use-table-${selectedChat.useTable.id}`,
      (payload) => {
        console.log("Tin nhắn mới:", payload.body);
        queryClient.invalidateQueries({ queryKey: ["messages"] });
      },
    );

    // Đánh dấu đã đọc
    if (!selectedChat.isRead) {
      client.send(
        "/app/admin-read-message",
        {},
        JSON.stringify({ id: selectedChat.id }),
      );
    }
  }, [selectedChat]);
  // Cập nhật mỗi khi messages thay đổi
  useEffect(() => {
    if (selectedChat) {
      setSelectedChat(
        messages?.find((message) => message.id === selectedChat.id),
      );
    } else {
      setSelectedChat(messages && messages.length > 0 ? messages[0] : {});
    }
  }, [messages]);

  return (
    <>
      <main className="admin-manager-main">
        <AdminManagerMainHeader title={nameVN} />
        <div className="admin-manager-main__body admin-chat">
          <div className="admin-chat__history">
            <h2 className="title">
              {/* <FontAwesomeIcon icon={faComments} /> */}
              <MessagesSquareIcon />
              <span>Lịch sử trò chuyện</span>
            </h2>
            {messages && messages?.length > 0 ? (
              <div className="admin-chat__list">
                {messages?.map((message: MessageType) => (
                  <div
                    key={message.id}
                    className={`admin-chat__item ${
                      selectedChat?.id === message.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedChat(message)}
                  >
                    <div className="info">
                      <b>
                        {message?.useTable?.table?.name} -{" "}
                        {/* {message?.useTable?.customer?.fullname} */}
                      </b>
                      <p>
                        {
                          message?.messageDetails![
                            message?.messageDetails!.length - 1
                          ]?.content
                        }
                      </p>
                    </div>
                    <span className="time">
                      {
                        message?.messageDetails![
                          message?.messageDetails!.length - 1
                        ]?.sendAt?.split(" ")[1]
                      }
                    </span>
                    {!message?.isRead && <span className="dot"></span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-chat__inform">
                <img
                  src={ImageSourcePath + "message-question-icon.png"}
                  alt=""
                />
                <p>Hôm nay khách hàng chưa gửi lời nhắn nào.</p>
              </div>
            )}
          </div>
          <div className="admin-chat__window">
            <div className="admin-chat__header">
              {selectedChat?.id && (
                <b>
                  {selectedChat?.useTable?.table?.name} -{" "}
                  {/* {selectedChat?.useTable?.customer?.fullname} */}
                </b>
              )}
            </div>
            <div className="admin-chat__messages">
              {selectedChat?.messageDetails?.map((messageDetail, index) => (
                <div
                  key={index}
                  className={`admin-chat__bubble ${
                    messageDetail.isAdminSend ? "admin" : "customer"
                  }`}
                >
                  <p>{messageDetail.content}</p>
                  <span>{messageDetail?.sendAt?.split(" ")[1]}</span>
                </div>
              ))}
              <div ref={scrollBottomRef}></div>
            </div>
            <div className="admin-chat__input">
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
                    {/* <FontAwesomeIcon icon={faPaperPlane} /> Gửi */}
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
        </div>
      </main>
    </>
  );
};

export default ManagerMessages;
