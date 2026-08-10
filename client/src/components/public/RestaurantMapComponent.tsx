import L from "leaflet";
import RestaurantSidebarComponent from "./RestaurantSidebarComponent";
import RoutingMachineComponent from "../RoutingMachineComponent";
import { useEffect, useRef, useState } from "react";
import {
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
} from "react-leaflet";
import { Button } from "antd";
import { FilterOutlined, CloseOutlined } from "@ant-design/icons";
import { getCurrentLocation } from "../CurrentLocationButtonComponent";
import type { Marker as LeafletMarker } from "leaflet";
import type { RestaurantPublicResponseType } from "../../types/RestaurantType";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import type { CustomerDetailResponseType } from "../../types/CustomerType";

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-utensils-crossed-icon lucide-utensils-crossed"
          >
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
const currentLocationIcon = L.divIcon({
  className: "",
  html: `
    <div
      style="
        width:18px;
        height:18px;
        border-radius:50%;
        background:#1677ff;
        border:3px solid white;
        box-shadow:0 0 10px rgba(22,119,255,.6);
      "
    ></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const ResizeMap = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
};
const ChangeMapView = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo([center[0], center[1]], 18, {
      duration: 1.5,
    });
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
    if (restaurant) {
      map.flyTo([restaurant.latitude, restaurant.longitude - 0.0022], 18, {
        duration: 1.5,
      });
    }
  }, [restaurant, map]);

  return null;
};
const MapOverlay = ({ children }: { children: React.ReactNode }) => {
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
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<
    RestaurantPublicResponseType | undefined
  >(undefined);
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const [drawRoute, setDrawRoute] = useState<boolean>(false);

  const markerRefs = useRef<Record<number, LeafletMarker | null>>({});

  useEffect(() => {
    getCurrentLocation((lat, lng) => {
      setCurrentLocation([lat, lng]);
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
      style={{
        width: "100%",
        height: "calc(100vh - 90px)",
      }}
    >
      <ResizeMap />
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Normal">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            attribution="Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Light">
          <TileLayer
            attribution="Carto"
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Dark">
          <TileLayer
            attribution="Carto"
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      {selectedRestaurant && (
        <FlyToRestaurant restaurant={selectedRestaurant} />
      )}
      {currentLocation && <ChangeMapView center={currentLocation} />}
      {currentLocation && (
        <Marker position={currentLocation} icon={currentLocationIcon} />
      )}
      {currentLocation && selectedRestaurant && drawRoute && (
        <RoutingMachineComponent
          from={currentLocation}
          to={[selectedRestaurant.latitude, selectedRestaurant.longitude]}
          onRouteFound={(route) => {
            console.log(route);
          }}
        />
      )}
      {showFilter && selectedRestaurant ? (
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
        </MapOverlay>
      ) : (
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
      )}
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          ref={(ref) => {
            markerRefs.current[restaurant.id] = ref;
          }}
          position={[restaurant.latitude, restaurant.longitude]}
          icon={markerIcon}
          eventHandlers={{
            click: () => {
              setShowFilter(true);
              setSelectedRestaurant(restaurant);
            },
          }}
        />
      ))}
      <Button
        type="primary"
        icon={showFilter ? <CloseOutlined /> : <FilterOutlined />}
        style={{
          position: "absolute",
          top: 85,
          left: 12,
          zIndex: 1000,
        }}
        onClick={() => {
          setShowFilter(!showFilter);
          // setSelectedRestaurant(undefined);
          // setDrawRoute(false);
        }}
      />
    </MapContainer>
  );
};

export default RestaurantMapComponent;
