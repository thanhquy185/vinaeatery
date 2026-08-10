import { Space, Button, Image, Typography, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Phone,
  Mail,
  MapPin,
  PhoneCall,
  MailPlus,
  MapPinned,
  HeartPlus,
  HandPlatter,
  Clock,
  Facebook,
  Youtube,
  Globe,
} from "lucide-react";
import { ImageSourcePath } from "../../../constants/values";
import { getVietnamCurrentTime } from "../../../utils/dayjs";
import type { Dispatch, SetStateAction } from "react";
import type { RestaurantPublicDetailResponseType } from "../../../types/RestaurantType";
import { openNotification } from "../../../utils/showNotification";

type RestaurantDetailHeaderComponentProps = {
  isCustomer: boolean;
  restaurant: RestaurantPublicDetailResponseType;
  showReservation: boolean;
  setShowReservation: Dispatch<SetStateAction<boolean>>;
  drawRoute: boolean;
  setDrawRoute: Dispatch<SetStateAction<boolean>>;
  onBack: () => void;
};

const RestaurantDetailHeaderComponent: React.FC<
  RestaurantDetailHeaderComponentProps
> = ({
  isCustomer,
  restaurant,
  showReservation,
  setShowReservation,
  drawRoute,
  setDrawRoute,
  onBack,
}) => {
  const currentTime = getVietnamCurrentTime();
  const isOpen =
    currentTime >= restaurant.openAt && currentTime <= restaurant.closeAt;

  return (
    <div className="header">
      <div className="content">
        <Space>
          <Button
            color="primary"
            variant="filled"
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              setShowReservation(false);
              setDrawRoute(false);
              onBack();
            }}
          />
          <Typography.Title level={3}>{restaurant.name}</Typography.Title>
        </Space>
        <div className="info">
          <p>
            <Clock />
            <span>
              {restaurant.openAt} - {restaurant.closeAt}
            </span>
            <Tag
              color={isOpen ? "green" : "red"}
              bordered={false}
              style={{ fontSize: 15 }}
            >
              {isOpen ? "Đang mở cửa" : "Đã đóng cửa"}
            </Tag>
          </p>
          <p>
            <Phone />
            <span>{restaurant.phone}</span>
          </p>
          <p>
            <Mail />
            <span>{restaurant.email}</span>
          </p>
          <p>
            <MapPin />
            <span>
              {restaurant.houseNumber} {restaurant.streetName},{" "}
              {restaurant.ward}, {restaurant.province}
            </span>
          </p>
          <p>
            <Facebook />
            <a href="https://www.facebook.com/" target="_blank">
              Facebook
            </a>
          </p>
          <p>
            <Youtube />
            <a href="https://www.youtube.com/" target="_blank">
              Youtube
            </a>
          </p>
          <p>
            <Globe />
            <a href="https://www.google.com/" target="_blank">
              Browser
            </a>
          </p>
        </div>
        <Space
          style={{
            marginTop: 16,
          }}
        >
          <Button
            type="primary"
            icon={<HandPlatter />}
            className="has-icon"
            onClick={() => {
              if (!isCustomer) {
                openNotification({
                  type: "warning",
                  message: "Cảnh báo!",
                  description:
                    "Bạn phải đăng nhập tài khoản khách hàng mới có thể đặt bàn!",
                });

                return;
              }

              setShowReservation(!showReservation);
            }}
          >
            Đặt bàn
          </Button>
          <Button
            color="green"
            variant="solid"
            icon={<PhoneCall />}
            className="has-icon"
            href={`tel:${restaurant.phone}`}
          >
            Gọi điện thoại
          </Button>
          <Button
            color="blue"
            variant="solid"
            icon={<MailPlus />}
            className="has-icon"
            href={`mailto:${restaurant.email}`}
          >
            Gửi mail
          </Button>
          <Button
            color="volcano"
            variant="solid"
            icon={<MapPinned />}
            className="has-icon"
            onClick={() => setDrawRoute(!drawRoute)}
          >
            Chỉ đường
          </Button>
          <Button
            color="pink"
            variant="solid"
            icon={<HeartPlus />}
            className="has-icon"
          >
            Yêu thích
          </Button>
        </Space>
      </div>
      <Image
        src={restaurant.thumbnail ?? ImageSourcePath + "no-image.png"}
        className="thumbnail"
      />
    </div>
  );
};

export default RestaurantDetailHeaderComponent;
