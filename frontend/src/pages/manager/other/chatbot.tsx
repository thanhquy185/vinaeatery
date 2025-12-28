import {
  faArrowRight,
  faMicrophone,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input } from "antd";
import { useState } from "react";

const ManagerChatbot = () => {
  const [chatbotSupports, setChatbotSupports] = useState<string[]>([]);

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">Chatbot hỗ trợ</h2>
        </div>
        <div className="main__body manager-chatbot">
          <div className="manager-chatbot__window">
            <div className="manager-chatbot__messages">
              {chatbotSupports && chatbotSupports.length > 0 ? (
                <>123</>
              ) : (
                <div className="inform">
                  <img src="/src/assets/images/others/chatbot-icon.png" alt="" />
                  <p>Chào bạn! Hiện tại bạn chưa yêu cầu thông tin nào. Bạn có muốn kiểm tra doanh thu, tồn kho, hay tình hình nhân viên hôm nay không ?</p>
                </div>
              )}
            </div>
          </div>
          <div className="manager-chatbot__actions">
            <Button variant="text" className="plus">
              <FontAwesomeIcon icon={faPlus} />
            </Button>
            <Input placeholder="Hỏi bất kỳ điều gì" />
            <Button variant="text" className="micro">
              <FontAwesomeIcon icon={faMicrophone} />
            </Button>
            <Button type="primary" className="enter">
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default ManagerChatbot;
