import { Card, Rate, Tag, Typography } from "antd";
import { ImageSourcePath } from "../../../constants/values";
import { getVietnamCurrentTime } from "../../../utils/dayjsUtil";
import type { RestaurantPublicResponseType } from "../../../types/RestaurantType";

type RestaurantFilterCardInfoComponentProps = {
  selected: boolean;
  restaurant: RestaurantPublicResponseType;
};

const RestaurantFilterCardInfoComponent: React.FC<
  RestaurantFilterCardInfoComponentProps
> = ({ selected, restaurant }) => {
  const currentTime = getVietnamCurrentTime();
  const isOpen =
    currentTime >= restaurant.openAt && currentTime <= restaurant.closeAt;

  return (
    <Card
      hoverable
      bodyStyle={{
        padding: 16,
      }}
      style={{
        background: selected ? "#e6f4ff" : "#fff",
        borderRadius: 12,
        transition: "background-color 0.2s",
      }}
      className="restaurant-filter-card-info"
    >
      <Typography.Title level={5}>{restaurant.name}</Typography.Title>
      <img
        src={
          restaurant.thumbnail
            ? restaurant.thumbnail
            : ImageSourcePath + "no-image.png"
        }
        alt=""
      />
      <div className="star">
        <span>4.8</span>
        <Rate value={4.8} />
        <span className="description">(125)</span>
      </div>
      <p>
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
      <p className="address">
        <span>
          {restaurant.houseNumber} {restaurant.streetName}, {restaurant.ward},{" "}
          {restaurant.province}
        </span>
      </p>
    </Card>
  );
};

export default RestaurantFilterCardInfoComponent;
