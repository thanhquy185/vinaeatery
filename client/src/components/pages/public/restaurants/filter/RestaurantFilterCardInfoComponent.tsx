import { ClockCircleOutlined, EnvironmentOutlined, RightOutlined } from "@ant-design/icons";
import { ImageSourcePath } from "../../../../../constants/values";
import type { RestaurantPublicResponseType } from "../../../../../types/RestaurantType";
import { isRestaurantOpenNow } from "../restaurantUtils";

type RestaurantFilterCardInfoComponentProps = {
  selected: boolean;
  restaurant: RestaurantPublicResponseType;
  onClick: () => void;
};

const RestaurantFilterCardInfoComponent: React.FC<
  RestaurantFilterCardInfoComponentProps
> = ({ selected, restaurant, onClick }) => {
  const isOpen = isRestaurantOpenNow(restaurant);
  const address = [
    restaurant.houseNumber,
    restaurant.streetName,
    restaurant.ward,
    restaurant.province,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <button
      type="button"
      className={`ve-restaurant-card${selected ? " is-selected" : ""}`}
      onClick={onClick}
      aria-label={`Xem thông tin ${restaurant.name}`}
    >
      <span className="ve-restaurant-card__media">
        <img
          src={restaurant.thumbnail || ImageSourcePath + "no-image.png"}
          alt=""
          loading="lazy"
        />
        <span className={`ve-restaurant-card__status${isOpen ? " is-open" : ""}`}>
          <i /> {isOpen ? "Đang mở" : "Đã đóng"}
        </span>
      </span>
      <span className="ve-restaurant-card__content">
        <strong className="ve-restaurant-card__name">
          {restaurant.name}
        </strong>
        <span className="ve-restaurant-card__meta">
          <ClockCircleOutlined /> {restaurant.openAt} – {restaurant.closeAt}
        </span>
        <span className="ve-restaurant-card__meta ve-restaurant-card__address">
          <EnvironmentOutlined /> {address || "Chưa cập nhật địa chỉ"}
        </span>
        <span className="ve-restaurant-card__action">
          Xem nhà hàng <RightOutlined />
        </span>
      </span>
    </button>
  );
};

export default RestaurantFilterCardInfoComponent;
