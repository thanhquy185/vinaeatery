import useEntityQuery from "../hooks/useEntityQuery2";
import SpinnerComponent from "../components/SpinnerComponent";
import CallFoodHeaderComponent from "../components/layout/CallFoodHeaderComponent";
import CallFoodMainComponent from "../components/layout/CallFoodMainComponent";
import UseTableApiService from "../services/api/v1/UseTableApiService";
import SockJS from "sockjs-client";
import { useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { over } from "stompjs";
import { openNotification } from "../utils/showNotificationUtil";
import type { Client } from "stompjs";
import type { UseTableCustomerResponseType } from "../types/UseTableType";
import type { ShoppingCartRequestType } from "../types/ShoppingCartType";

const CallFoodLayout: React.FC = ({}) => {
  // Id của bàn hiện tại (thông qua url trang)
  const { restaurantId, tableId } = useParams();

  // Query Key
  const queryKey = ["current-use-table", restaurantId, tableId];
  // Query Client
  const queryClient = useQueryClient();

  // Truy vấn dữ liệu Sử dụng bàn ăn
  const {
    data: currentUseTable,
    isLoading,
    isError,
  } = useEntityQuery<UseTableCustomerResponseType>({
    keys: queryKey,
    params: {
      restaurantId: Number(restaurantId),
      tableId: Number(tableId),
    },
    api: UseTableApiService.handleGetCustomerByRestaurantIdAndTableId,
  });

  // Dữ liệu về giỏ hàng hiện tại của bàn
  const [shoppingCart, setShoppingCart] = useState<ShoppingCartRequestType[]>(
    [],
  );

  // Kết nối web socket chung
  const stompClientCommonRef = useRef<Client | null>(null);
  useEffect(() => {
    if (currentUseTable) {
      const socket = new SockJS("http://localhost:8080/websocket");
      const client = over(socket);
      stompClientCommonRef.current = client;

      client.connect({}, () => {
        console.log("WebSocket connected");

        client.subscribe(
          `/topic/call-food-messages-use-table-${currentUseTable.id}`,
          (message) => {
            console.log(message);

            openNotification({
              type: "success",
              message: "Nhà hàng trả lời",
              description: "Nhà hàng đã trả lời tin nhắn của bạn!",
            });

            queryClient.invalidateQueries({
              queryKey: queryKey,
            });
          },
        );

        client.subscribe(
          `/topic/call-food-order-sheets-use-table-${currentUseTable.id}`,
          (message) => {
            console.log(message);

            openNotification({
              type: "success",
              message: "Nhà hàng xử lý phiếu gọi món",
              description: "Phiếu gọi món của bạn đã được cập nhật trạng thái!",
            });

            queryClient.invalidateQueries({
              queryKey: queryKey,
            });
          },
        );
      });

      return () => {
        if (client.connected) {
          client.disconnect(() => console.log("WebSocket disconnected"));
        }
      };
    }
  }, [currentUseTable]);

  return (
    <>
      {isError ? (
        <Navigate to="/error" replace />
      ) : currentUseTable && !isLoading ? (
        <>
          <CallFoodHeaderComponent
            queryKey={queryKey}
            queryClient={queryClient}
            shoppingCart={shoppingCart}
            setShoppingCart={setShoppingCart}
            currentUseTable={currentUseTable}
            stomp={stompClientCommonRef}
          />
          <CallFoodMainComponent
            shoppingCart={shoppingCart}
            setShoppingCart={setShoppingCart}
            currentUseTable={currentUseTable}
          />
        </>
      ) : (
        <SpinnerComponent />
      )}
    </>
  );
};

export default CallFoodLayout;
