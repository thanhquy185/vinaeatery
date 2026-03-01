import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";
import { Navigate, useParams } from "react-router-dom";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCommentDots,
  faInfoCircle,
  faReceipt,
  faRotate,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Input } from "antd";
import type {
  CategoryFoodType,
  ShoppingCartType,
  UseFoodType,
  UseTableType,
} from "../common/types";
import { CommonStatus, UseFoodStatus, UseTableStatus } from "../common/values";
import CustomBrand from "../components/common/brand";
import CustomDrawer from "../components/call-food/drawer";
import CustomCardFilter from "../components/call-food/card-filter";
import CustomCardFood from "../components/call-food/card-food";
import CustomSpinner from "../components/common/spinner";
import DrawerInfo from "../components/call-food/drawer/drawer-info";
import DrawerQR from "../components/call-food/drawer/drawer-qr";
import DrawerNotification from "../components/call-food/drawer/drawer-notification";
import DrawerMessage from "../components/call-food/drawer/drawer-message";
import DrawerShoppingCart from "../components/call-food/drawer/drawer-shopping-cart";
import DrawerOrderSheet from "../components/call-food/drawer/drawer-order-sheet";
import { useEntityQuery } from "../hook/use-entity-query";
import { FindAllCategoryFood } from "../requests/category-foods";
import { FindAllUseFoodTimeEndIsNull } from "../requests/use-foods";
import { FindOneNewUseTableByTableId } from "../requests/use-tables";
import SockJS from "sockjs-client";
import { Client, over } from "stompjs";

// Kiểu dữ liệu của các tham số truyền vào
export type CallFoodLayoutProps = {
  queryClient?: QueryClient;
  shoppingCart?: ShoppingCartType[];
  setShoppingCart?: Dispatch<SetStateAction<ShoppingCartType[]>>;
  currentUseTable?: UseTableType;
  stomp?: React.RefObject<Client | null>;
};

// Call Food Header
const CallFoodHeader: FC<CallFoodLayoutProps> = ({
  queryClient,
  currentUseTable,
  shoppingCart,
  setShoppingCart,
}) => {
  // Kết nối web socket chung
  const stompClientCommonRef = useRef<Client | null>(null);
  useEffect(() => {
    //
    const socket = new SockJS("http://localhost:8080/websocket");
    const client = over(socket);
    stompClientCommonRef.current = client;

    client.connect({}, () => {
      console.log("WebSocket connected");
    });

    return () => {
      if (client.connected) {
        client.disconnect(() => console.log("WebSocket disconnected"));
      }
    };
  }, []);

  // Cách thành phần drawer theo từng icon
  const ClientDrawers = {
    info: () => <DrawerInfo currentUseTable={currentUseTable} />,
    qr: () => <DrawerQR currentUseTable={currentUseTable} />,
    call: () => (
      <DrawerNotification
        currentUseTable={currentUseTable}
        stomp={stompClientCommonRef}
      />
    ),
    message: () => (
      <DrawerMessage
        queryClient={queryClient}
        currentUseTable={currentUseTable}
      />
    ),
    shoppingCart: () => (
      <DrawerShoppingCart
        queryClient={queryClient}
        currentUseTable={currentUseTable}
        stomp={stompClientCommonRef}
        shoppingCart={shoppingCart}
        setShoppingCart={setShoppingCart}
      />
    ),
    orderSheets: () => (
      <DrawerOrderSheet
        queryClient={queryClient}
        currentUseTable={currentUseTable}
      />
    ),
    // question: () => {
    //   return (<>123</>);
    // }
  };

  return (
    <header className="call-food__header-warper">
      <div className="call-food__header">
        <CustomBrand to="#!" prefixClassName="call-food__" name="VINAEATERY" />
        {currentUseTable?.status === UseTableStatus.occupied && (
          <div className="call-food__actions">
            {/* <button type="button" className="call-food__action">
              <FontAwesomeIcon icon={faGear} className="call-food__icon" />
            </button> */}
            <CustomDrawer
              key={1}
              prefixClassName="call-food__"
              icon={faInfoCircle}
              title="Thông tin"
              children={ClientDrawers.info()}
            />
            {/* <CustomDrawer
                key={2}
                prefixClassName="call-food__"
                icon={faQrcode}
                title="QR Code"
                children={ClientDrawers.qr()}
              /> */}
            <CustomDrawer
              key={3}
              prefixClassName="call-food__"
              icon={faBell}
              title="Gọi nhân viên"
              children={ClientDrawers.call()}
            />
            <CustomDrawer
              key={4}
              size="large"
              prefixClassName="call-food__"
              icon={faCommentDots}
              title="Trò chuyện với nhà hàng"
              children={ClientDrawers.message()}
            />
            <CustomDrawer
              key={5}
              prefixClassName="call-food__"
              icon={faShoppingCart}
              title="Giỏ món ăn"
              size="large"
              children={ClientDrawers.shoppingCart()}
            />
            <CustomDrawer
              key={6}
              prefixClassName="call-food__"
              icon={faReceipt}
              title="Lịch sử gọi món"
              size="large"
              children={ClientDrawers.orderSheets()}
            />
            {/* <CustomDrawer
                key={7}
                prefixClassName="call-food__"
                icon={faQuestionCircle}
                title="Hướng dẫn sử dụng"
                children={ClientDrawers.question()}
              /> */}
            <button type="button" className="call-food__action">
              <FontAwesomeIcon icon={faRotate} className="call-food__icon" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

// Call Food Main
const CallFoodMain: React.FC<CallFoodLayoutProps> = ({
  shoppingCart,
  setShoppingCart,
  currentUseTable,
}) => {
  // Truy vấn dữ liệu từ csdl (gọi api)
  // - Loại món ăn
  const { data: categoryFoods } = useEntityQuery<CategoryFoodType[]>({
    keys: [
      "category-foods",
      currentUseTable?.restaurantId,
      CommonStatus.active,
    ],
    params: {
      restaurantId: currentUseTable?.restaurantId,
      statusValue: [CommonStatus.active],
    },
    api: FindAllCategoryFood,
  });
  // - Món ăn
  const { data: useFoods } = useEntityQuery<UseFoodType[]>({
    keys: ["use-foods", currentUseTable?.restaurantId],
    params: {
      restaurantId: currentUseTable?.restaurantId,
    },
    api: FindAllUseFoodTimeEndIsNull,
  });

  // Các thành phần cho việc lọc dữ liệu
  // - Tên
  const [filterName, setFilterName] = useState<string>();
  // - Loại
  const [filterCategory, setFilterCategory] = useState<number | string>();
  // - Trạng thái
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  // - Lọc dữ liệu
  const filteredUseFoods = useMemo(() => {
    if (!useFoods) return [];

    return useFoods.filter((useFood) => {
      // Theo name
      let matchName = true;
      if (filterName && filterName.trim() !== "") {
        const value = filterName.toLowerCase();
        matchName = useFood?.food?.name?.toLowerCase().includes(value)!;
      }

      // Theo category
      let matchCategory = true;
      if (filterCategory) {
        matchCategory = useFood?.food?.categoryFood?.id === filterCategory;
      }

      // Theo status
      let matchStatus = true;
      if (filterStatus && filterStatus.length > 0) {
        matchStatus = filterStatus.includes(useFood.status!);
      }

      return matchName && matchCategory && matchStatus;
    });
  }, [useFoods, filterName, filterCategory, filterStatus]);

  return (
    <main className="call-food__main">
      {currentUseTable?.status === UseTableStatus.occupied ? (
        <>
          <aside className="call-food__filter">
            <div className="call-food__filter-list-warper">
              <div className="call-food__filter-list">
                {categoryFoods?.map((categoryFood) => (
                  <CustomCardFilter
                    key={categoryFood?.id!}
                    object={categoryFood}
                    active={filterCategory === categoryFood?.id}
                    currentValue={filterCategory}
                    setSelectValue={setFilterCategory}
                  />
                ))}
              </div>
            </div>
          </aside>
          <div className="call-food__foods">
            <div className="call-food__food-header">
              <Input.Search
                allowClear
                enterButton
                placeholder="Tìm kiếm theo tên món ăn"
                className="call-food__food-find"
                onChange={(e) => setFilterName(e.target.value)}
              />
              <div className="call-food__food-buttons">
                <Button
                  variant={filterStatus === null ? "solid" : "outlined"}
                  color="blue"
                  className="call-food__food-button"
                  onClick={() => setFilterStatus(null)}
                >
                  Tất cả
                </Button>
                <Button
                  variant={
                    filterStatus === "Đang giảm giá" ? "solid" : "outlined"
                  }
                  color="orange"
                  className="call-food__food-button"
                  onClick={() => setFilterStatus("Đang giảm giá")}
                  disabled
                >
                  Đang giảm giá
                </Button>
                <Button
                  variant={
                    filterStatus === UseFoodStatus.canOrder
                      ? "solid"
                      : "outlined"
                  }
                  color="green"
                  className="call-food__food-button"
                  onClick={() => setFilterStatus(UseFoodStatus.canOrder)}
                >
                  {UseFoodStatus.canOrder}
                </Button>
                <Button
                  variant={
                    filterStatus === UseFoodStatus.canNotOrder
                      ? "solid"
                      : "outlined"
                  }
                  color="red"
                  className="call-food__food-button"
                  onClick={() => setFilterStatus(UseFoodStatus.canNotOrder)}
                >
                  {UseFoodStatus.canNotOrder}
                </Button>
              </div>
            </div>
            {filteredUseFoods?.map((useFood) => (
              <CustomCardFood
                key={useFood?.food?.id!}
                object={useFood?.food!}
                disabled={useFood?.status !== UseFoodStatus.canOrder}
                shoppingCart={shoppingCart}
                setSelectFood={setShoppingCart}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="call-food__inform container">
          {currentUseTable?.status === UseTableStatus.reserved
            ? "Rất tiếc, bàn này đã được khách khác đặt trước. Mong quý khách thông cảm!"
            : currentUseTable?.status === UseTableStatus.empty
            ? "Xin vui lòng chờ trong giây lát để chúng tôi chuẩn bị bàn cho quý khách."
            : "Bàn hiện đang được bảo trì. Rất mong quý khách thông cảm vì sự bất tiện này!"}
        </p>
      )}
    </main>
  );
};

// Call Food Layout
const CallFoodLayout = () => {
  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Id của bàn hiện tại (thông qua url trang)
  const { restaurantId, tableId } = useParams();
  // useEffect(() => {
  //   console.log("123 " + restaurantId);
  //   console.log(tableId);
  // }, [restaurantId, tableId]);
  // Truy vấn dữ liệu sử dụng bàn ăn (theo mã bàn)
  const {
    data: currentUseTable,
    isLoading,
    isError,
    error,
  } = useEntityQuery<UseTableType>({
    keys: ["current-use-table", restaurantId, tableId],
    params: {
      restaurantId: Number(restaurantId!),
      tableId: Number(tableId!),
    },
    api: FindOneNewUseTableByTableId,
  });

  // Dữ liệu về giỏ hàng hiện tại của bàn
  const [shoppingCart, setShoppingCart] = useState<ShoppingCartType[]>([]);

  // Nếu đang load thì không trả về gì
  if (isLoading) return null;

  return (
    <>
      {isError ? (
        <Navigate to="/error" replace />
      ) : currentUseTable ? (
        <>
          <CallFoodHeader
            queryClient={queryClient}
            shoppingCart={shoppingCart}
            setShoppingCart={setShoppingCart}
            currentUseTable={currentUseTable}
          />
          <CallFoodMain
            shoppingCart={shoppingCart}
            setShoppingCart={setShoppingCart}
            currentUseTable={currentUseTable}
          />
        </>
      ) : (
        <CustomSpinner />
      )}
    </>
  );
};

export default CallFoodLayout;
