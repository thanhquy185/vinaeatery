import RestaurantDetailTabOverviewComponent from "./RestaurantDetailTabOverviewComponent";
import RestaurantDetailTabIntroductionComponent from "./RestaurantDetailTabIntroductionComponent";
import RestaurantDetailTabPhotosComponent from "./RestaurantDetailTabPhotosComponent";
import RestaurantDetailTabMenuComponent from "./RestaurantDetailTabMenuComponent";
import RestaurantDetailTabReviewsComponent from "./RestaurantDetailTabReviewsComponent";
import { Tabs } from "antd";
import type { RestaurantPublicDetailResponseType } from "../../../types/RestaurantType";

type RestaurantDetailTabsComponentProps = {
  restaurant: RestaurantPublicDetailResponseType;
};

const RestaurantDetailTabsComponent: React.FC<
  RestaurantDetailTabsComponentProps
> = ({ restaurant }) => {
  return (
    <Tabs
      items={[
        {
          key: "overview",
          label: "Tổng quan",
          children: <RestaurantDetailTabOverviewComponent />,
        },
        {
          key: "introduction",
          label: "Giới thiệu",
          children: <RestaurantDetailTabIntroductionComponent />,
        },
        {
          key: "photos",
          label: "Hình ảnh",
          children: (
            <RestaurantDetailTabPhotosComponent
              restaurantImages={restaurant.restaurantImages}
            />
          ),
        },
        {
          key: "menu",
          label: "Thực đơn",
          children: (
            <RestaurantDetailTabMenuComponent foods={restaurant.foods} />
          ),
        },
        {
          key: "reviews",
          label: "Bài đánh giá",
          children: <RestaurantDetailTabReviewsComponent />,
        },
      ]}
    />
  );
};

export default RestaurantDetailTabsComponent;
