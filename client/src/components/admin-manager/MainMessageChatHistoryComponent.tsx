import { MessagesSquareIcon } from "lucide-react";
import { ImageSourcePath } from "../../constants/values";
import type { Dispatch, SetStateAction } from "react";
import type { MessageSummaryResponseType } from "../../types/MessageType";

type MainMessageChatHistoryComponentProps = {
  messages: MessageSummaryResponseType[];
  selectedMessage: MessageSummaryResponseType | undefined;
  setSelectedMessage: Dispatch<
    SetStateAction<MessageSummaryResponseType | undefined>
  >;
};

const MainMessageChatHistoryComponent: React.FC<
  MainMessageChatHistoryComponentProps
> = ({ messages, selectedMessage, setSelectedMessage }) => {
  return (
    <div className="manager-chat__history">
      <h2 className="title">
        <MessagesSquareIcon />
        <span>Lịch sử trò chuyện</span>
      </h2>
      {messages && messages.length > 0 ? (
        <div className="manager-chat__list">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`manager-chat__item ${
                selectedMessage?.id === message.id ? "active" : ""
              }`}
              onClick={() => setSelectedMessage(message)}
            >
              <div className="info">
                <b>{message.useTable.table.name}</b>
                <p>
                  {
                    message.messageDetails[message.messageDetails.length - 1]
                      .content
                  }
                </p>
              </div>
              <span className="time">
                {
                  message.messageDetails[
                    message.messageDetails.length - 1
                  ].sendAt.split(" ")[1]
                }
              </span>
              {!message.isRead && <span className="dot"></span>}
            </div>
          ))}
        </div>
      ) : (
        <div className="manager-chat__inform">
          <img
            src={ImageSourcePath + "message-question-icon.png"}
            alt="message-question-icon.png"
          />
          <p>Hôm nay, không có khách hàng gửi lời nhắn</p>
        </div>
      )}
    </div>
  );
};

export default MainMessageChatHistoryComponent;
