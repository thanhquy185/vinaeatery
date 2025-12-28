import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input } from "antd";
import { faComments, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { MessagesFormatType } from "../../../common/types";
import type { ManagerPageProps } from "../../../common/props";
import { getActionsString } from "../../../services/employee-login";
import { getActionNameVn } from "../../../services/default-actions";
import { FindMessageFormatUseTableIsNull } from "../../../services/api";
import { openNotification } from "../../../utils/showNotification";
import SockJS from "sockjs-client";
import { Client, over } from "stompjs";
import dayjs from "dayjs";
import { UserRoleValue } from "../../../common/values";

// Manager Messages
const ManagerMessages = ({ infoLogin, functionId }: ManagerPageProps) => {
  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Có là chủ nhà hàng đăng nhập
  const isManager = infoLogin?.user?.role === UserRoleValue.manager;
  // Mã nhà hàng được chọn (dành cho chủ nhà hàng)
  const selectedRestaurantId = Number(
    sessionStorage.getItem("selected-restaurant-id")
  );
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["messages"] });
  }, [selectedRestaurantId]);
  // Danh sách tác vụ mà nhân viên có thể thực hiện theo mã chức năng
  const validActions = getActionsString({ currentFunctionId: functionId });

  // Dữ liệu về tin nhắn
  const { data: messages } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await FindMessageFormatUseTableIsNull({
        restaurantId: isManager
          ? selectedRestaurantId
          : infoLogin?.restaurantId,
      });
      if (res.status === 200) {
        return res.data;
      } else {
        openNotification({
          type: "error",
          message: "Truy vấn dữ liệu thất bại",
          description: String(res.data) || "Lỗi phát sinh khi truy vấn dữ liệu",
          duration: 2,
        });

        throw res;
      }
    },
  });

  console.log(messages);
  console.log(selectedRestaurantId);

  //
  const [selectedChat, setSelectedChat] = useState<MessagesFormatType>();
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
        description: "Bạn chưa chọn cuộc trò chuyện để gửi tin nhắn !",
        duration: 1.5,
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
      })
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
          }
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
      }
    );

    // Đánh dấu đã đọc
    if (!selectedChat.isRead) {
      client.send(
        "/app/admin-read-message",
        {},
        JSON.stringify({ id: selectedChat.id })
      );
    }
  }, [selectedChat]);
  // Cập nhật mỗi khi messages thay đổi
  useEffect(() => {
    if (selectedChat) {
      setSelectedChat(
        messages?.find((message) => message.id === selectedChat.id)
      );
    } else {
      setSelectedChat(messages && messages.length > 0 ? messages[0] : {});
    }
  }, [messages]);

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">Trò chuyện</h2>
        </div>
        <div className="main__body admin-chat">
          <div className="admin-chat__history">
            <h2 className="admin-chat__history-title">
              <FontAwesomeIcon icon={faComments} /> Lịch sử trò chuyện
            </h2>
            {messages && messages?.length > 0 ? (
              <div className="admin-chat__list">
                {messages?.map((message: MessagesFormatType) => (
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
                        {message?.useTable?.customer?.fullname}
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
                  src="/src/assets/images/others/message-question-icon.png"
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
                  {selectedChat?.useTable?.customer?.fullname}
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
              {isManager || validActions?.includes(getActionNameVn(1)) ? (
                <>
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button type="primary" onClick={sendMessage}>
                    <FontAwesomeIcon icon={faPaperPlane} /> Gửi
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
