import RestaurantFilterComponent from "./RestaurantFilterComponent";
import RestaurantDetailComponent from "./RestaurantDetailComponent";
import RestaurantDetailHeaderReservationComponent from "./restaurant-detail/RestaurantDetailHeaderReservationComponent";
import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { RestaurantPublicResponseType } from "../../types/RestaurantType";
import type { CustomerDetailResponseType } from "../../types/CustomerType";

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
  const [showReservation, setShowReservation] = useState<boolean>(false);

  useMemo(() => {
    if (showFilter && selectedRestaurant) {
      setViewMode("detail");
      setShowReservation(false);
      // setDrawRoute(false);
    }
  }, [showFilter, selectedRestaurant]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 55,
          zIndex: 1000,
          background: "#fff",
          width: "50%",
          height: "92%",
          borderRadius: 12,
          overflowY: "auto",
          opacity: showFilter ? 1 : 0,
          transform: showFilter ? "translateX(0)" : "translateX(-30px)",
          transition: "all 0.3s ease",
          pointerEvents: showFilter ? "auto" : "none",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          cursor: "auto",
        }}
      >
        {selectedRestaurant && viewMode === "detail" ? (
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
      {customerLogin && selectedRestaurant && viewMode === "detail" && (
        <RestaurantDetailHeaderReservationComponent
          customerLogin={customerLogin}
          restaurant={selectedRestaurant}
          showReservation={showReservation}
          setShowReservation={setShowReservation}
        />
      )}
    </>
  );
};

export default RestaurantSidebarComponent;
