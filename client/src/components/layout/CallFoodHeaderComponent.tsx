import BrandComponent from "../BrandComponent";
import DrawerComponent from "../call-food/DrawerComponent";
import DrawerInfoComponent from "../call-food/drawer/DrawerInfoComponent";
import DrawerQRComponent from "../call-food/drawer/DrawerQRComponent";
import DrawerNotificationComponent from "../call-food/drawer/DrawerNotificationComponent";
import DrawerMessageComponent from "../call-food/drawer/DrawerMessageComponent";
import DrawerShoppingCartComponent from "../call-food/drawer/DrawerShoppingCartComponent";
import DrawerOrderSheetComponent from "../call-food/drawer/DrawerOrderSheetComponent";
import {
  faBell,
  faCommentDots,
  faInfoCircle,
  faQrcode,
  faReceipt,
  faRotate,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UseTableStatusValue } from "../../constants/values";
import type { CallFoodPageProps } from "../../constants/props";

const CallFoodHeaderComponent: React.FC<CallFoodPageProps> = ({
  queryKey,
  queryClient,
  shoppingCart,
  setShoppingCart,
  currentUseTable,
  stomp,
}) => {
  // Cách thành phần drawer theo từng icon
  const CallFoodDrawers = {
    info: () => <DrawerInfoComponent currentUseTable={currentUseTable} />,
    qr: () => <DrawerQRComponent currentUseTable={currentUseTable} />,
    call: () => (
      <DrawerNotificationComponent
        currentUseTable={currentUseTable}
        stomp={stomp}
      />
    ),
    message: () => (
      <DrawerMessageComponent
        queryKey={queryKey}
        queryClient={queryClient}
        currentUseTable={currentUseTable}
      />
    ),
    shoppingCart: () => (
      <DrawerShoppingCartComponent
        stomp={stomp}
        queryKey={queryKey}
        queryClient={queryClient}
        currentUseTable={currentUseTable}
        shoppingCart={shoppingCart}
        setShoppingCart={setShoppingCart}
      />
    ),
    orderSheets: () => (
      <DrawerOrderSheetComponent
        stomp={stomp}
        queryKey={queryKey}
        queryClient={queryClient}
        currentUseTable={currentUseTable}
      />
    ),
  };

  return (
    <header className="call-food__header-warper">
      <div className="call-food__header">
        <BrandComponent
          to="#!"
          prefixClassName="call-food__"
          name="VINAEATERY"
        />
        {currentUseTable?.status === UseTableStatusValue.occupied && (
          <div className="call-food__actions">
            <DrawerComponent
              key={1}
              prefixClassName="call-food__"
              icon={faInfoCircle}
              title="Thông tin"
              children={CallFoodDrawers.info()}
            />
            <DrawerComponent
              key={2}
              prefixClassName="call-food__"
              icon={faQrcode}
              title="QR Code"
              children={CallFoodDrawers.qr()}
            />
            <DrawerComponent
              key={3}
              prefixClassName="call-food__"
              icon={faBell}
              title="Gọi nhân viên"
              children={CallFoodDrawers.call()}
            />
            <DrawerComponent
              key={4}
              size="large"
              prefixClassName="call-food__"
              icon={faCommentDots}
              title="Trò chuyện với nhà hàng"
              children={CallFoodDrawers.message()}
            />
            <DrawerComponent
              key={5}
              prefixClassName="call-food__"
              icon={faShoppingCart}
              title="Giỏ món ăn"
              size="large"
              children={CallFoodDrawers.shoppingCart()}
            />
            <DrawerComponent
              key={6}
              prefixClassName="call-food__"
              icon={faReceipt}
              title="Lịch sử gọi món"
              size="large"
              children={CallFoodDrawers.orderSheets()}
            />
            <button type="button" className="call-food__action">
              <FontAwesomeIcon icon={faRotate} className="call-food__icon" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default CallFoodHeaderComponent;
