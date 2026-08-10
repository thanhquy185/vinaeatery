import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import {
  faArrowRight,
  faMicrophone,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Button, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ImageSourcePath } from "../../../constants/values";
import type { AdminManagerPageProps } from "../../../constants/props";

const ManagerChatbotPage: React.FC<AdminManagerPageProps> = ({ nameVN }) => {
  const [chatbotSupports, setChatbotSupports] = useState<string[]>([]);

  return (
    <>
      <main className="admin-manager-main">
        <MainHeaderComponent title={nameVN} />
        <div className="admin-manager-main__body chatbot">
          <div className="chatbot__window">
            <div className="chatbot__messages">
              {chatbotSupports && chatbotSupports.length > 0 ? (
                <>123</>
              ) : (
                <div className="inform">
                  <img src={ImageSourcePath + "chatbot-icon.png"} alt="" />
                  <p>
                    Chào bạn! Hiện tại bạn chưa yêu cầu thông tin nào. Bạn có
                    muốn kiểm tra doanh thu, tồn kho, hay tình hình nhân viên
                    hôm nay không ?
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="chatbot__actions">
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

export default ManagerChatbotPage;
