import { Button, Image, Typography } from "antd";
import {
  ArrowLeft,
  Clock3,
  Facebook,
  Globe,
  HandPlatter,
  HeartPlus,
  Mail,
  MailPlus,
  MapPin,
  MapPinned,
  Phone,
  PhoneCall,
  Youtube,
  ImageOff,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { RestaurantPublicDetailResponseType } from "../../../../../types/RestaurantType";
import { openNotification } from "../../../../../utils/showNotificationUtil";
import { isRestaurantOpenNow } from "../restaurantUtils";

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
  const isOpen = isRestaurantOpenNow(restaurant);
  const address = [
    restaurant.houseNumber,
    restaurant.streetName,
    restaurant.ward,
    restaurant.province,
  ]
    .filter(Boolean)
    .join(", ");

  const handleReservation = () => {
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
  };

  return (
    <div className="header ve-restaurant-detail">
      <div className="ve-restaurant-detail__cover">
        {restaurant.thumbnail ? (
          <Image
            src={restaurant.thumbnail}
            alt={`Ảnh ${restaurant.name}`}
            className="ve-restaurant-detail__cover-image"
            width="100%"
            height="100%"
            style={{ objectFit: "cover" }}
            preview
          />
        ) : (
          <div className="ve-restaurant-detail__cover-fallback">
            <span>
              <ImageOff size={30} strokeWidth={1.5} />
            </span>
            <strong>Chưa có ảnh bìa</strong>
            <small>Ảnh nhà hàng sẽ hiển thị tại đây</small>
          </div>
        )}
        <div className="ve-restaurant-detail__cover-shade" />
        <Button
          className="ve-restaurant-detail__back"
          icon={<ArrowLeft size={17} />}
          onClick={() => {
            setShowReservation(false);
            setDrawRoute(false);
            onBack();
          }}
        >
          Danh sách nhà hàng
        </Button>
        <span className="ve-restaurant-detail__cover-label">
          VINAEATERY · KHÁM PHÁ ẨM THỰC
        </span>
      </div>

      <div className="ve-restaurant-detail__body">
        <div className="ve-restaurant-detail__heading">
          <span className="ve-restaurant-detail__eyebrow">NHÀ HÀNG</span>
          <Typography.Title level={2} className="ve-restaurant-detail__title">
            {restaurant.name}
          </Typography.Title>
          <div className="ve-restaurant-detail__status-line">
            <span
              className={`ve-restaurant-detail__status${isOpen ? " is-open" : ""}`}
            >
              <i /> {isOpen ? "Đang mở cửa" : "Đã đóng cửa"}
            </span>
            <span className="ve-restaurant-detail__hours">
              <Clock3 size={15} /> {restaurant.openAt} – {restaurant.closeAt}
            </span>
          </div>
        </div>

        <div className="ve-restaurant-detail__actions" aria-label="Thao tác nhà hàng">
          <Button
            type="primary"
            icon={<HandPlatter size={17} />}
            className="ve-restaurant-detail__action ve-restaurant-detail__action--primary"
            onClick={handleReservation}
          >
            Đặt bàn
          </Button>
          <Button
            color="green"
            variant="solid"
            icon={<PhoneCall size={17} />}
            className="ve-restaurant-detail__action"
            href={`tel:${restaurant.phone}`}
          >
            Gọi điện
          </Button>
          <Button
            color="blue"
            variant="solid"
            icon={<MailPlus size={17} />}
            className="ve-restaurant-detail__action"
            href={`mailto:${restaurant.email}`}
          >
            Gửi email
          </Button>
          <Button
            color="volcano"
            variant="solid"
            icon={<MapPinned size={17} />}
            className={`ve-restaurant-detail__action${drawRoute ? " is-active" : ""}`}
            onClick={() => setDrawRoute(!drawRoute)}
          >
            {drawRoute ? "Tắt chỉ đường" : "Chỉ đường"}
          </Button>
          <Button
            color="pink"
            variant="solid"
            icon={<HeartPlus size={17} />}
            className="ve-restaurant-detail__action"
          >
            Yêu thích
          </Button>
        </div>

        <div className="ve-restaurant-detail__facts">
          <div className="ve-restaurant-detail__fact ve-restaurant-detail__fact--address">
            <span className="ve-restaurant-detail__fact-icon">
              <MapPin size={18} />
            </span>
            <span>
              <small>Địa chỉ</small>
              <strong>{address || "Chưa cập nhật địa chỉ"}</strong>
            </span>
          </div>
          <div className="ve-restaurant-detail__fact">
            <span className="ve-restaurant-detail__fact-icon">
              <Phone size={17} />
            </span>
            <span>
              <small>Điện thoại</small>
              <strong>{restaurant.phone || "Chưa cập nhật"}</strong>
            </span>
          </div>
          <div className="ve-restaurant-detail__fact">
            <span className="ve-restaurant-detail__fact-icon">
              <Mail size={17} />
            </span>
            <span>
              <small>Email</small>
              <strong>{restaurant.email || "Chưa cập nhật"}</strong>
            </span>
          </div>
        </div>

        <div className="ve-restaurant-detail__links" aria-label="Liên kết">
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
            <Facebook size={15} /> Facebook
          </a>
          <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
            <Youtube size={15} /> Youtube
          </a>
          <a href="https://www.google.com/" target="_blank" rel="noreferrer">
            <Globe size={15} /> Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailHeaderComponent;
