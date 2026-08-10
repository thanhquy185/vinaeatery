import useEntityQuery from "../../hooks/useEntityQuery2";
import RestaurantDetailHeaderComponent from "./restaurant-detail/RestaurantDetailHeaderComponent";
import RestaurantDetailTabsComponent from "./restaurant-detail/RestaurantDetailTabsComponent";
import RestaurantApiService from "../../services/api/v1/RestaurantApiService";
import { Divider, Spin } from "antd";
import type { Dispatch, SetStateAction } from "react";
import type {
  RestaurantPublicDetailResponseType,
  RestaurantPublicResponseType,
} from "../../types/RestaurantType";

type RestaurantDetailComponentProps = {
  isCustomer: boolean;
  restaurant: RestaurantPublicResponseType;
  showReservation: boolean;
  setShowReservation: Dispatch<SetStateAction<boolean>>;
  drawRoute: boolean;
  setDrawRoute: Dispatch<SetStateAction<boolean>>;
  onBack: () => void;
};

const RestaurantDetailComponent: React.FC<RestaurantDetailComponentProps> = ({
  isCustomer,
  restaurant,
  showReservation,
  setShowReservation,
  drawRoute,
  setDrawRoute,
  onBack,
}) => {
  const { data: restaurantPublicDetail, isLoading } =
    useEntityQuery<RestaurantPublicDetailResponseType>({
      keys: ["restaurant-public", restaurant.id],
      params: { id: restaurant.id },
      api: RestaurantApiService.handleGetPublicDetail,
    });

  return (
    <Spin spinning={!restaurantPublicDetail || isLoading}>
      {restaurantPublicDetail && (
        <div className="restaurant-detail-card">
          <RestaurantDetailHeaderComponent
            isCustomer={isCustomer}
            restaurant={restaurantPublicDetail}
            showReservation={showReservation}
            setShowReservation={setShowReservation}
            drawRoute={drawRoute}
            setDrawRoute={setDrawRoute}
            onBack={onBack}
          />
          <Divider
            style={{
              margin: 0,
            }}
          />
          <RestaurantDetailTabsComponent restaurant={restaurantPublicDetail} />
        </div>
      )}
    </Spin>
  );
};

export default RestaurantDetailComponent;
