import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { Button, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { ImageSourcePath } from "../../../constants/values";
import type { Client } from "stompjs";
import type { CallFoodPageProps } from "../../../constants/props";
import type { CustomerSendMessageRequestType } from "../../../types/SocketType";

const DrawerMessageComponent: React.FC<CallFoodPageProps> = ({
  queryKey,
  queryClient,
  currentUseTable,
}) => {
  //
  const scrollBottomRef = useRef<HTMLDivElement | null>(null);
  const stompClientMessageRef = useRef<Client | null>(null);

  //
  const [inputValue, setInputValue] = useState<string>("");

  //
  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const client = stompClientMessageRef.current;
    if (!client || !client.connected) {
      console.warn("WebSocket chưa kết nối");
      return;
    }

    client.send(
      "/app/customer-send-message",
      {},
      JSON.stringify({
        restaurantId: currentUseTable?.restaurant.id,
        useTableId: currentUseTable?.id,
        messageDetail: {
          sendAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          isRestaurantSend: false,
          content: inputValue,
        },
      } as CustomerSendMessageRequestType),
    );

    setInputValue("");
    setTimeout(() => {
      queryClient?.invalidateQueries({
        queryKey: queryKey,
      });
    }, 500);
  };

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentUseTable?.message]);

  return (
    <>
      <div className="drawer__message-content-warper">
        {currentUseTable?.message?.id ? (
          <>
            <div className="drawer__message-content">
              {currentUseTable?.message.messageDetails.map((messageDetail) => (
                <>
                  <div
                    className={
                      "drawer__message-bubble " +
                      (messageDetail.isRestaurantSend ? "admin" : "customer")
                    }
                  >
                    <p>{messageDetail.content}</p>
                    <span>{messageDetail.sendAt?.split(" ")[1]}</span>
                  </div>
                </>
              ))}
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
          <FontAwesomeIcon icon={faPaperPlane} />
          &nbsp;Gửi
        </Button>
      </div>
    </>
  );
};

export default DrawerMessageComponent;
