import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet-routing-machine";

type RoutingMachineComponentsProps = {
  from: [number, number];
  to: [number, number];
  onRouteFound?: (route: { distance: number; duration: number }) => void;
};

const RoutingMachineComponent: React.FC<RoutingMachineComponentsProps> = ({
  from,
  to,
  onRouteFound,
}) => {
  const map = useMap();

  useEffect(() => {
    const routingControl = (L as any).Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],

      lineOptions: {
        styles: [
          {
            color: "#1677ff",
            weight: 5,
          },
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },

      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      show: true,

      createMarker: () => null,
    }).addTo(map);

    routingControl.on("routesfound", (e: any) => {
      const route = e.routes[0];
      onRouteFound?.(route);

      const latlngs = route.coordinates;
      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds, {
        paddingTopLeft: [800, 18],
      });
    });

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, from, to]);

  return null;
};

export default RoutingMachineComponent;
