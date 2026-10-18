import axios from "axios";
import L from "leaflet";
import CurrentLocationButtonComponent from "./CurrentLocationButtonComponent";
import { useEffect, useState } from "react";
import { Input } from "antd";
import {
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface RestaurantLocationPickerComponentPropsLocationData {
  latitude: number;
  longitude: number;
  houseNumber: string;
  streetName: string;
  ward: string;
  province: string;
}

interface RestaurantLocationPickerComponentProps {
  type?: "detail" | "update";
  height?: number;
  marginTop?: number;
  isDefaultLocation?: boolean;
  isShowInfo?: boolean;
  latitude?: number;
  longitude?: number;
  onChange?: (
    location: RestaurantLocationPickerComponentPropsLocationData,
  ) => void;
}

const markerIcon = L.divIcon({
  className: "restaurant-location-picker-marker",
  html: `
    <div class="restaurant-location-picker-wrapper">
      <div class="restaurant-location-picker-pulse"></div>
      <div class="restaurant-location-picker-pin">
        <div class="restaurant-location-picker-center"></div>
      </div>
    </div>
  `,
  iconSize: [60, 60],
  iconAnchor: [30, 30],
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
    map.setView(center);
  }, [center, map]);

  return null;
};
const LocationSelector = ({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
};

const RestaurantLocationPickerComponent: React.FC<
  RestaurantLocationPickerComponentProps
> = ({
  type = "update",
  height = 525,
  marginTop = 0,
  isDefaultLocation = false,
  isShowInfo = true,
  latitude = 10.777059740594654,
  longitude = 106.69539996568201,
  onChange,
}) => {
  const isReadOnly = type === "detail";

  const [position, setPosition] = useState<[number, number]>([
    latitude,
    longitude,
  ]);
  const [locationData, setLocationData] =
    useState<RestaurantLocationPickerComponentPropsLocationData>();
  const [searchText, setSearchText] = useState<string>("");

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: {
            lat: latitude,
            lon: longitude,
            format: "json",
            addressdetails: 1,
          },
        },
      );

      const address = response.data.address;

      const location: RestaurantLocationPickerComponentPropsLocationData = {
        latitude,
        longitude,
        houseNumber: address.house_number ?? "",
        streetName: address.road ?? "",
        ward: address.suburb ?? address.quarter ?? address.neighbourhood ?? "",
        province: address.city ?? address.state ?? address.province ?? "",
      };

      setLocationData(location);
      if (!isDefaultLocation) {
        onChange?.(location);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const searchLocation = async () => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: searchText,
            format: "json",
            limit: 1,
            addressdetails: 1,
          },
        },
      );

      if (!response.data.length) {
        return;
      }

      const result = response.data[0];

      const lat = Number(result.lat);
      const lng = Number(result.lon);

      setPosition([lat, lng]);

      reverseGeocode(lat, lng);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    reverseGeocode(latitude, longitude);
  }, []);

  return (
    <>
      <MapContainer
        center={position}
        zoom={16}
        style={{
          width: "100%",
          height: height,
          marginTop: marginTop,
          borderRadius: 12
        }}
      >
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
        <ResizeMap />
        <ChangeMapView center={position} />
        <LocationSelector
          onSelect={(lat, lng) => {
            if (isReadOnly) return;

            setPosition([lat, lng]);
            reverseGeocode(lat, lng);
          }}
        />
        <Marker
          position={position}
          icon={markerIcon}
          draggable={!isReadOnly}
          eventHandlers={{
            dragend(event) {
              const marker = event.target;
              const { lat, lng } = marker.getLatLng();

              setPosition([lat, lng]);

              reverseGeocode(lat, lng);
            },
          }}
        />
        {!isReadOnly && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 50,
              zIndex: 1000,
              width: 350,
            }}
          >
            <Input.Search
              placeholder="Nhập địa chỉ..."
              enterButton
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={searchLocation}
            />
          </div>
        )}
        {!isReadOnly && (
          <CurrentLocationButtonComponent
            top={14}
            left={410}
            onLocationFound={(lat, lng) => {
              setPosition([lat, lng]);
              reverseGeocode(lat, lng);
            }}
          />
        )}
      </MapContainer>
      {isShowInfo && (
        <div
          style={{
            position: "absolute",
            left: 10,
            bottom: 10,
            zIndex: 1000,
            background: "#fff",
            padding: 12,
            borderRadius: 6,
            minWidth: 350,
            boxShadow: "0 4px 16px rgba(0,0,0,.15)",
          }}
        >
          <div>
            <strong>Vĩ độ: </strong>
            <span>{locationData?.latitude}</span>
          </div>
          <div>
            <strong>Kinh độ: </strong>
            <span>{locationData?.longitude}</span>
          </div>
          <div>
            <strong>Số nhà: </strong>
            <span>{locationData?.houseNumber}</span>
          </div>
          <div>
            <strong>Tên đường: </strong>
            <span>{locationData?.streetName}</span>
          </div>
          <div>
            <strong>Phường / Xã: </strong>
            <span>{locationData?.ward}</span>
          </div>
          <div>
            <strong>Tỉnh / Thành phố: </strong>
            <span>{locationData?.province}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default RestaurantLocationPickerComponent;
