import { Button } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

interface CurrentLocationButtonComponentProps {
  top: number;
  left: number;
  onLocationFound: (lat: number, lng: number) => void;
}

export const getCurrentLocation = (
  onLocationFound: (lat: number, lng: number) => void,
) => {
  navigator.geolocation.watchPosition(
    (position) => {
      onLocationFound(position.coords.latitude, position.coords.longitude);
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
    },
  );
};

const CurrentLocationButtonComponent: React.FC<
  CurrentLocationButtonComponentProps
> = ({ top, left, onLocationFound }) => {
  return (
    <Button
      type="primary"
      icon={<EnvironmentOutlined />}
      style={{
        position: "absolute",
        top: top,
        left: left,
        zIndex: 1000,
      }}
      onClick={() => getCurrentLocation(onLocationFound)}
    />
  );
};

export default CurrentLocationButtonComponent;
