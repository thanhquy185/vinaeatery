import { useEffect, useRef, useState, type FC } from "react";
import { Button, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { ImageSourcePath } from "../../../common/values";
import type { CallFoodLayoutProps } from "../../../layouts/call-food-layout";
import { openNotification } from "../../../utils/show-notification";
import { over, type Client } from "stompjs";
import SockJS from "sockjs-client";
import dayjs from "dayjs";

// Drawer Message
const DrawerMessage: FC<CallFoodLayoutProps> = ({
  queryClient,
  currentUseTable,
}) => {
  //
  const scrollBottomRef = useRef<HTMLDivElement | null>(null);
  const stompClientMessageRef = useRef<Client | null>(null);
  const [inputValue, setInputValue] = useState("");
  //
  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const client = stompClientMessageRef.current;
    if (!client || !client.connected) {
      console.warn("WebSocket chưa kết nối, không gửi được tin nhắn");
      return;
    }

    client.send(
      "/app/customer-send-message",
      {},
      JSON.stringify({
        useTableId: currentUseTable?.id,
        restaurantId: currentUseTable?.restaurantId,
        messageDetail: {
          sendAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          isAdminSend: false,
          content: inputValue,
        },
      }),
    );
    queryClient?.invalidateQueries({
      queryKey: ["current-use-table"],
    });
    setInputValue("");
  };
  //
  useEffect(() => {
    //
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    //
    const socket = new SockJS("http://localhost:8080/websocket");
    const client = over(socket);
    stompClientMessageRef.current = client;

    client.connect({}, () => {
      console.log("WebSocket connected");
      client.subscribe(
        `/topic/call-food-messages-use-table-${currentUseTable?.id}`,
        (message) => {
          if (message) {
            console.log(message);
            openNotification({
              type: "success",
              message: "Nhà hàng trả lời",
              description: "Nhà hàng đã trả lời tin nhắn của bạn!",
            });
          }

          queryClient?.invalidateQueries({
            queryKey: ["current-use-table"],
          });
        },
      );
    });

    return () => {
      if (client.connected) {
        client.disconnect(() => console.log("WebSocket disconnected"));
      }
    };
  }, []);
  //
  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentUseTable?.message]);

  return (
    <>
      <div className="drawer__message-content-warper">
        {currentUseTable?.message?.id ? (
          <>
            <div className="drawer__message-content">
              {currentUseTable?.message?.messageDetails?.map(
                (messageDetail) => (
                  <>
                    <div
                      className={
                        "drawer__message-bubble " +
                        (messageDetail?.isAdminSend ? "admin" : "customer")
                      }
                    >
                      <p>{messageDetail?.content}</p>
                      <span>{messageDetail?.sendAt?.split(" ")[1]}</span>
                    </div>
                  </>
                ),
              )}
            </div>
            <div ref={scrollBottomRef}></div>
          </>
        ) : (
          <div className="drawer__message-inform">
            <img src={ImageSourcePath + "message-question-icon.png"} alt="" />
            <p>
              Hãy nhắn tin cho cửa hàng về món ăn hoặc thắc mắc của bạn – chúng
              tôi sẽ phản hồi nhanh chóng.
            </p>
          </div>
        )}
      </div>
      <div className="drawer__message-action">
        <Input
          placeholder="Nhập tin nhắn..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button type="primary" onClick={sendMessage}>
          <FontAwesomeIcon icon={faPaperPlane} /> Gửi
        </Button>
      </div>
    </>
  );
};

export default DrawerMessage;
