import useEntityMutation from "../../../hooks/useEntityMutation";
import CountUp from "react-countup";
import TextArea from "antd/es/input/TextArea";
import OrderSheetApiService from "../../../services/api/v1/OrderSheetApiService";
import dayjs from "dayjs";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {
  ImageSourcePath,
  OrderSheetStatusValue,
} from "../../../constants/values";
import { vietnamMoneyFormat } from "../../../utils/otherEvents";
import { openConfirmation } from "../../../utils/showConfirmationUtil";
import { openNotification } from "../../../utils/showNotificationUtil";
import type { CallFoodPageProps } from "../../../constants/props";
import type { OrderSheetStatusEnum } from "../../../constants/enums";
import type {
  OrderSheetCreateRequestType,
  OrderSheetDetailResponseType,
} from "../../../types/OrderSheetType";
import type { OrderSheetDetailCreateRequestType } from "../../../types/OrderSheetDetailType";

const DrawerShoppingCartComponent: React.FC<CallFoodPageProps> = ({
  queryKey,
  queryClient,
  currentUseTable,
  stomp,
  shoppingCart,
  setShoppingCart,
}) => {
  const [noteValue, setNoteValue] = useState<string>("");

  let totalPriceValue: number = (shoppingCart || []).reduce((total, item) => {
    return total + (item.food.price || 0) * (item.quantity || 0);
  }, 0);

  const createMutation = useEntityMutation<
    OrderSheetCreateRequestType,
    OrderSheetDetailResponseType
  >({
    messages: {
      success: `Gọi món ăn thành công!`,
      error: `Gọi món ăn thất bại!`,
    },
    invalidateKeys: [queryKey!],
    api: OrderSheetApiService.handleCreate,
  });

  return (
    <div className="call-food__cart">
      <div className="call-food__cart-list-warper">
        <div className="call-food__cart-list">
          {(shoppingCart || []).map((item, index) => (
            <div key={item.food.id} className="call-food__cart-item">
              <img
                src={item.food.imageUrl ?? ImageSourcePath + "no-image.png"}
                alt=""
                className="call-food__cart-item-image"
              />
              <div className="call-food__cart-item-info">
                <p className="call-food__cart-item-paragraph name">
                  {item.food.name}
                </p>
                <p className="call-food__cart-item-paragraph category">
                  Loại món ăn: {item.food.categoryFood.name}
                </p>
                <p className="call-food__cart-item-paragraph unit">
                  Đơn vị: {item.food.unit}
                </p>
                <p className="call-food__cart-item-paragraph price">
                  {vietnamMoneyFormat(item.food.price as number)}
                </p>
              </div>
              <div className="call-food__cart-item-buttons">
                <button
                  type="button"
                  className="call-food__cart-item-button btn secondary-btn minus"
                  onClick={() => {
                    if (item.quantity! > 1) {
                      let newShoppingCart = [...shoppingCart!];
                      newShoppingCart[index].quantity =
                        newShoppingCart[index].quantity! - 1;
                      setShoppingCart!(newShoppingCart);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <input
                  type="text"
                  className="call-food__cart-item-input"
                  value={item.quantity}
                  onChange={(e) => {
                    const newQuantity = Number(
                      e.currentTarget.value.replace(/\D/g, ""),
                    );
                    if (newQuantity > 0) {
                      let newShoppingCart = [...shoppingCart!];
                      newShoppingCart[index].quantity = newQuantity;
                      setShoppingCart!(newShoppingCart);
                    }
                  }}
                />
                <button
                  type="button"
                  className="call-food__cart-item-button btn secondary-btn plus"
                  onClick={() => {
                    if (item.quantity! > 0) {
                      let newShoppingCart = [...shoppingCart!];
                      newShoppingCart[index].quantity =
                        newShoppingCart[index].quantity! + 1;
                      setShoppingCart!(newShoppingCart);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
                <button
                  className="call-food__cart-item-button btn red-secondary trash"
                  onClick={async (e) => {
                    if (item.quantity! > 0) {
                      const button = e.currentTarget;
                      button.classList.add("active");

                      const answer = await openConfirmation({
                        title: "Bạn có chắc chắn xoá ?",
                        content: "Hành động này không thể hoàn tác.",
                      });
                      if (answer) {
                        let newShoppingCart = [...shoppingCart!];
                        newShoppingCart.splice(index, 1);
                        setShoppingCart!(newShoppingCart);

                        openNotification({
                          type: "success",
                          message: "Thành công",
                          description: "Xoá món ăn thành công!",
                        });
                      }

                      button.classList.remove("active");
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="call-food__cart-final">
        <div className="call-food__cart-actions">
          <p className="call-food__cart-total-price">
            Tổng tiền:
            <CountUp
              end={totalPriceValue}
              duration={0.5}
              separator="."
              suffix=" ₫"
            />
          </p>
          <div className="call-food__cart-buttons">
            <button
              type="button"
              className="btn drawer__button call-food__cart-button"
              onClick={async (e) => {
                const button = e.currentTarget;
                button.classList.add("active");

                const answer = await openConfirmation({
                  title: "Bạn có chắc chắn xoá tất cả ?",
                  content: "Hành động này không thể hoàn tác.",
                });
                if (answer) {
                  setShoppingCart!([]);
                  openNotification({
                    type: "success",
                    message: "Thành công",
                    description: "Xoá tất cả món ăn thành công!",
                  });
                }

                button.classList.remove("active");
              }}
            >
              Xoá tất cả
            </button>
            <button
              type="button"
              className="btn drawer__button call-food__cart-button"
              onClick={async (e) => {
                const button = e.currentTarget;
                button.classList.add("active");

                const answer = await openConfirmation({
                  title: "Bạn có chắc chắn gọi món ?",
                  content: "Hành động này không thể hoàn tác.",
                });
                if (answer) {
                  if (shoppingCart?.length == 0) {
                    openNotification({
                      type: "warning",
                      message: "Cảnh báo",
                      description: "Không có món ăn nào trong giỏ hàng!",
                    });

                    button.classList.remove("active");

                    return;
                  }

                  const orderSheetDetails: OrderSheetDetailCreateRequestType[] =
                    (shoppingCart ?? []).map((item) => ({
                      foodId: item.food.id,
                      price: item.food.price,
                      quantity: item.quantity,
                      foodNameSnapshot: item.food.name,
                      foodPriceSnapshot: item.food.price,
                      foodUnitSnapshot: item.food.unit,
                      totalPriceDetail: item.food.price * item.quantity,
                    }));

                  const response = await createMutation.mutateAsync({
                    values: {
                      restaurantId: currentUseTable.restaurant.id,
                      useTableId: currentUseTable.id,
                      createAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                      totalPrice: totalPriceValue,
                      note: noteValue,
                      status:
                        OrderSheetStatusValue.pending as OrderSheetStatusEnum,
                      orderSheetDetails: orderSheetDetails,
                    },
                  });
                  if (response) {
                    const client = stomp?.current;
                    if (!client || !client.connected) {
                      console.warn("WebSocket chưa kết nối");
                    } else {
                      client.send(
                        "/app/customer-call-food",
                        {},
                        currentUseTable?.table?.name,
                      );
                    }

                    setShoppingCart!([]);
                    setNoteValue("");
                    setTimeout(() => {
                      queryClient!.invalidateQueries({
                        queryKey: queryKey,
                      });
                    }, 500);
                  }
                }

                button.classList.remove("active");
              }}
            >
              Gọi món
            </button>
          </div>
        </div>
        <TextArea
          className="call-food__cart-note"
          placeholder="Nhập ghi chú khi gọi món"
          value={noteValue}
          onChange={(e) => setNoteValue(e.target.value)}
        />
      </div>
    </div>
  );
};

export default DrawerShoppingCartComponent;
