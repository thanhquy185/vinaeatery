import L from "leaflet";
import RestaurantSidebarComponent from "./RestaurantSidebarComponent";
import RoutingMachineComponent from "../../../shared/RoutingMachineComponent";
import { useEffect, useRef, useState } from "react";
import {
  CloseOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import {
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { ReactNode } from "react";
import type { Marker as LeafletMarker } from "leaflet";
import { getCurrentLocation } from "../../../shared/CurrentLocationButtonComponent";
import type { RestaurantPublicResponseType } from "../../../../types/RestaurantType";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import type { CustomerDetailResponseType } from "../../../../types/CustomerType";

type RestaurantMapComponentProps = {
  isCustomer: boolean;
  customerLogin: CustomerDetailResponseType;
  restaurants: RestaurantPublicResponseType[];
};

const markerIcon = L.divIcon({
  className: "restaurant-map-marker",
  html: `
    <div class="restaurant-map-marker-wrapper">
      <div class="restaurant-map-marker-pulse"></div>
      <div class="restaurant-map-marker-card">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils-crossed">
          <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
          <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" />
          <path d="m2.1 21.8 6.4-6.3" />
          <path d="m19 5-7 7" />
        </svg>
      </div>
    </div>
  `,
  iconSize: [48, 60],
  iconAnchor: [24, 60],
});

const selectedMarkerIcon = L.divIcon({
  ...markerIcon.options,
  className: "restaurant-map-marker restaurant-map-marker--selected",
});

const currentLocationIcon = L.divIcon({
  className: "",
  html: `
    <div style="width:18px;height:18px;border-radius:50%;background:#1677ff;border:3px solid white;box-shadow:0 0 10px rgba(22,119,255,.6);"></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const ResizeMap = ({ showFilter }: { showFilter: boolean }) => {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(timer);
  }, [map, showFilter]);

  return null;
};

const ChangeMapView = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, 14, { duration: 1.2 });
  }, [center, map]);

  return null;
};

const FlyToRestaurant = ({
  restaurant,
}: {
  restaurant: RestaurantPublicResponseType;
}) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo([restaurant.latitude, restaurant.longitude - 0.010], 16, {
      duration: 1.2,
    });
  }, [restaurant, map]);

  return null;
};

const MapOverlay = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    L.DomEvent.disableClickPropagation(ref.current);
    L.DomEvent.disableScrollPropagation(ref.current);
  }, []);

  return <div ref={ref}>{children}</div>;
};

const RestaurantMapComponent: React.FC<RestaurantMapComponentProps> = ({
  isCustomer,
  customerLogin,
  restaurants,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<
    RestaurantPublicResponseType | undefined
  >(undefined);
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const [drawRoute, setDrawRoute] = useState(false);

  const markerRefs = useRef<Record<number, LeafletMarker | null>>({});

  useEffect(() => {
    getCurrentLocation((latitude, longitude) => {
      setCurrentLocation([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    Object.values(markerRefs.current).forEach((marker) => marker?.closePopup());
    if (selectedRestaurant) {
      markerRefs.current[selectedRestaurant.id]?.openPopup();
    }
  }, [selectedRestaurant]);

  return (
    <MapContainer
      center={currentLocation ?? [10.7769, 106.7009]}
      zoom={14}
      className="ve-restaurants-map"
    >
      <ResizeMap showFilter={showFilter} />
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Bản đồ">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Vệ tinh">
          <TileLayer
            attribution="Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Sáng">
          <TileLayer
            attribution="Carto"
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Tối">
          <TileLayer
            attribution="Carto"
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {selectedRestaurant && <FlyToRestaurant restaurant={selectedRestaurant} />}
      {!selectedRestaurant && currentLocation && (
        <ChangeMapView center={currentLocation} />
      )}
      {currentLocation && (
        <Marker position={currentLocation} icon={currentLocationIcon} />
      )}
      {currentLocation && selectedRestaurant && drawRoute && (
        <RoutingMachineComponent
          from={currentLocation}
          to={[selectedRestaurant.latitude, selectedRestaurant.longitude]}
          onRouteFound={() => undefined}
        />
      )}

      <MapOverlay>
        <RestaurantSidebarComponent
          isCustomer={isCustomer}
          customerLogin={customerLogin}
          showFilter={showFilter}
          restaurants={restaurants}
          selectedRestaurant={selectedRestaurant}
          setSelectedRestaurant={setSelectedRestaurant}
          drawRoute={drawRoute}
          setDrawRoute={setDrawRoute}
        />
        {!selectedRestaurant && (
          <Button
            type="primary"
            icon={showFilter ? <CloseOutlined /> : <FilterOutlined />}
            className="ve-restaurants-map__toggle"
            onClick={() => setShowFilter((visible) => !visible)}
            aria-label={showFilter ? "Ẩn danh sách nhà hàng" : "Tìm nhà hàng"}
          >
            {showFilter ? "Đóng danh sách" : "Tìm nhà hàng"}
          </Button>
        )}
      </MapOverlay>

      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          ref={(ref) => {
            markerRefs.current[restaurant.id] = ref;
          }}
          position={[restaurant.latitude, restaurant.longitude]}
          icon={
            selectedRestaurant?.id === restaurant.id
              ? selectedMarkerIcon
              : markerIcon
          }
          eventHandlers={{
            click: () => {
              setShowFilter(true);
              setSelectedRestaurant(restaurant);
            },
          }}
        />
      ))}
    </MapContainer>
  );
};

export default RestaurantMapComponent;
