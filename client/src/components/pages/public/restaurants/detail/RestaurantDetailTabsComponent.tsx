import RestaurantDetailTabOverviewComponent from "./RestaurantDetailTabOverviewComponent";
import RestaurantDetailTabIntroductionComponent from "./RestaurantDetailTabIntroductionComponent";
import RestaurantDetailTabPhotosComponent from "./RestaurantDetailTabPhotosComponent";
import RestaurantDetailTabMenuComponent from "./RestaurantDetailTabMenuComponent";
import RestaurantDetailTabReviewsComponent from "./RestaurantDetailTabReviewsComponent";
import { Tabs } from "antd";
import {
  Images,
  Info,
  MessageSquareText,
  ScrollText,
  UtensilsCrossed,
} from "lucide-react";
import type { RestaurantPublicDetailResponseType } from "../../../../../types/RestaurantType";

type RestaurantDetailTabsComponentProps = {
  restaurant: RestaurantPublicDetailResponseType;
};

const RestaurantDetailTabsComponent: React.FC<
  RestaurantDetailTabsComponentProps
> = ({ restaurant }) => {
  return (
    <section className="ve-restaurant-tabs-section">
      <div className="ve-restaurant-tabs-section__heading">
        <span>KHÁM PHÁ THÊM</span>
        <h3>Thông tin nhà hàng</h3>
        <p>Xem tổng quan, hình ảnh, thực đơn và trải nghiệm từ khách hàng.</p>
      </div>
      <Tabs
        className="ve-restaurant-tabs"
        tabBarGutter={8}
        items={[
          {
            key: "overview",
            label: <span className="ve-restaurant-tabs__label"><Info size={16} />Tổng quan</span>,
            children: <RestaurantDetailTabOverviewComponent />,
          },
          {
            key: "introduction",
            label: <span className="ve-restaurant-tabs__label"><ScrollText size={16} />Giới thiệu</span>,
            children: <RestaurantDetailTabIntroductionComponent />,
          },
          {
            key: "photos",
            label: (
              <span className="ve-restaurant-tabs__label">
                <Images size={16} />Hình ảnh
                {restaurant.restaurantImages.length > 0 && (
                  <small>{restaurant.restaurantImages.length}</small>
                )}
              </span>
            ),
            children: (
              <RestaurantDetailTabPhotosComponent
                restaurantImages={restaurant.restaurantImages}
              />
            ),
          },
          {
            key: "menu",
            label: (
              <span className="ve-restaurant-tabs__label">
                <UtensilsCrossed size={16} />Thực đơn
                {restaurant.foods.length > 0 && <small>{restaurant.foods.length}</small>}
              </span>
            ),
            children: (
              <RestaurantDetailTabMenuComponent foods={restaurant.foods} />
            ),
          },
          {
            key: "reviews",
            label: <span className="ve-restaurant-tabs__label"><MessageSquareText size={16} />Bài đánh giá</span>,
            children: <RestaurantDetailTabReviewsComponent />,
          },
        ]}
      />
    </section>
  );
};

export default RestaurantDetailTabsComponent;
