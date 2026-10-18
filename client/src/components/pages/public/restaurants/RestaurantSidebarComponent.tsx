import RestaurantFilterComponent from "./RestaurantFilterComponent";
import RestaurantDetailComponent from "./RestaurantDetailComponent";
import RestaurantDetailHeaderReservationComponent from "./detail/RestaurantDetailHeaderReservationComponent";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { RestaurantPublicResponseType } from "../../../../types/RestaurantType";
import type { CustomerDetailResponseType } from "../../../../types/CustomerType";

type RestaurantSidebarComponentProps = {
  isCustomer: boolean;
  customerLogin: CustomerDetailResponseType;
  showFilter: boolean;
  restaurants: RestaurantPublicResponseType[];
  selectedRestaurant: RestaurantPublicResponseType | undefined;
  setSelectedRestaurant: Dispatch<
    SetStateAction<RestaurantPublicResponseType | undefined>
  >;
  drawRoute: boolean;
  setDrawRoute: Dispatch<SetStateAction<boolean>>;
};

const RestaurantSidebarComponent: React.FC<RestaurantSidebarComponentProps> = ({
  isCustomer,
  customerLogin,
  showFilter,
  restaurants,
  selectedRestaurant,
  setSelectedRestaurant,
  drawRoute,
  setDrawRoute,
}) => {
  const [viewMode, setViewMode] = useState<"filter" | "detail">("filter");
  const [showReservation, setShowReservation] = useState(false);

  useEffect(() => {
    if (showFilter && selectedRestaurant) {
      setViewMode("detail");
      setShowReservation(false);
    }
  }, [showFilter, selectedRestaurant]);

  return (
    <>
      <div
        className={`ve-restaurants-sidebar${showFilter ? " is-open" : ""}`}
        aria-hidden={!showFilter}
      >
        {selectedRestaurant && viewMode === "detail" && showReservation ? (
          <RestaurantDetailHeaderReservationComponent
            customerLogin={customerLogin}
            restaurant={selectedRestaurant}
            setShowReservation={setShowReservation}
          />
        ) : selectedRestaurant && viewMode === "detail" ? (
          <RestaurantDetailComponent
            isCustomer={isCustomer}
            restaurant={selectedRestaurant}
            showReservation={showReservation}
            setShowReservation={setShowReservation}
            drawRoute={drawRoute}
            setDrawRoute={setDrawRoute}
            onBack={() => {
              setSelectedRestaurant(undefined);
              setViewMode("filter");
              setShowReservation(false);
            }}
          />
        ) : (
          <RestaurantFilterComponent
            restaurants={restaurants}
            selectedRestaurant={selectedRestaurant}
            setSelectedRestaurant={setSelectedRestaurant}
            setViewMode={setViewMode}
          />
        )}
      </div>
    </>
  );
};

export default RestaurantSidebarComponent;
