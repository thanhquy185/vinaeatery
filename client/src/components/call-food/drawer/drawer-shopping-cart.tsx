import { useState, type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import TextArea from "antd/es/input/TextArea";
import { ImageSourcePath } from "../../../common/values";
import type { CallFoodLayoutProps } from "../../../layouts/call-food-layout";
import { HandleCreateOrderSheet } from "../../../requests/order-sheets";
import { vietnamMoneyFormat } from "../../../utils/other-events";
import { openConfirmation } from "../../../utils/show-confirmation";
import { openNotification } from "../../../utils/show-notification";

// Drawer Shopping Cart
const DrawerShoppingCart: FC<CallFoodLayoutProps> = ({
  queryClient,
  currentUseTable,
  stomp,
  shoppingCart,
  setShoppingCart,
}) => {
  let totalPriceValue: number | undefined = shoppingCart?.reduce(
    (total, item) => {
      return total + (item.food?.price || 0) * (item.quantity || 0);
    },
    0,
  );
  const [noteValue, setNoteValue] = useState<string>();

  return (
    <div className="call-food__cart">
      <div className="call-food__cart-list-warper">
        <div className="call-food__cart-list">
          {shoppingCart!.map((item, index) => (
            <div key={item.food?.id} className="call-food__cart-item">
              <img
                src={
                  item!.food!.image
                    ? "/src/assets/images/foods/" + item!.food!.image
                    : ImageSourcePath + "no-image.png"
                }
                alt=""
                className="call-food__cart-item-image"
              />
              <div className="call-food__cart-item-info">
                <p className="call-food__cart-item-paragraph name">
                  {item!.food!.name}
                </p>
                <p className="call-food__cart-item-paragraph category">
                  Loại món ăn: {item!.food!.categoryFood!.name}
                </p>
                <p className="call-food__cart-item-paragraph unit">
                  Đơn vị: {item!.food!.unit}
                </p>
                <p className="call-food__cart-item-paragraph price">
                  {vietnamMoneyFormat(item!.food!.price as number)}đ
                </p>
              </div>
              <div className="call-food__cart-item-buttons">
                <button
                  type="button"
                  className="call-food__cart-item-button btn secondary-btn minus"
                  onClick={() => {
                    if (item.quantity! > 1) {
                      let newShoppingCart = [...shoppingCart!];
                      newShoppingCart![index].quantity =
                        newShoppingCart![index].quantity! - 1;
                      setShoppingCart!(newShoppingCart);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <input
                  type="text"
                  className="call-food__cart-item-input"
                  value={item!.quantity}
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
                      newShoppingCart![index].quantity =
                        newShoppingCart![index].quantity! + 1;
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
                      // Nút hiện tại
                      const button = e.currentTarget;
                      // Thêm class 'active' thể hiện nút đang được nhấn
                      button.classList.add("active");

                      // Hỏi trước khi xử khi xử lý ?
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

                        // Xoá class 'active' thể hiện nút không còn được nhấn
                        button.classList.remove("active");
                      }

                      // Xoá class 'active' thể hiện nút không còn được nhấn
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
            <span>{vietnamMoneyFormat(totalPriceValue!)}đ</span>
          </p>
          <div className="call-food__cart-buttons">
            <button
              type="button"
              className="btn drawer__button call-food__cart-button"
              onClick={async (e) => {
                // Nút hiện tại
                const button = e.currentTarget;
                // Thêm class 'active' thể hiện nút đang được nhấn
                button.classList.add("active");

                // Hỏi trước khi xử khi xử lý ?
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

                  // Xoá class 'active' thể hiện nút không còn được nhấn
                  button.classList.remove("active");
                }

                // Xoá class 'active' thể hiện nút không còn được nhấn
                button.classList.remove("active");
              }}
            >
              Xoá tất cả
            </button>
            <button
              type="button"
              className="btn drawer__button call-food__cart-button"
              onClick={async (e) => {
                // Nút hiện tại
                const button = e.currentTarget;
                // Thêm class 'active' thể hiện nút đang được nhấn
                button.classList.add("active");

                // Hỏi trước khi xử khi xử lý ?
                const answer = await openConfirmation({
                  title: "Bạn có chắc chắn gọi món ?",
                  content: "Hành động này không thể hoàn tác.",
                });
                if (answer) {
                  // Nếu giỏ hàng trống thì báo lỗi
                  if (shoppingCart?.length == 0) {
                    openNotification({
                      type: "warning",
                      message: "Cảnh báo",
                      description: "Không có món ăn nào trong giỏ hàng!",
                    });

                    // Xoá class 'active' thể hiện nút không còn được nhấn
                    button?.classList.remove("active");

                    return;
                  }

                  // Định dạng lại dữ liệu chi tiết phiếu gọi món
                  const orderSheetDetails = shoppingCart?.map((item) => ({
                    foodId: item!.food?.id!,
                    price: item!.food?.price!,
                    quantity: item!.quantity!,
                  }));

                  // Gọi api xử lý
                  const res = await HandleCreateOrderSheet({
                    restaurantId: currentUseTable?.restaurantId,
                    createAt: new Date().toISOString(),
                    tableId: currentUseTable?.table?.id,
                    totalPrice: totalPriceValue! || 0,
                    note: noteValue! || undefined,
                    status: "Đang chờ xác nhận",
                    orderSheetDetails: orderSheetDetails!,
                  });
                  if (res.status === 200) {
                    const client = stomp?.current;
                    if (!client || !client.connected) {
                      console.warn(
                        "WebSocket chưa kết nối, không gửi được tin nhắn",
                      );
                      return;
                    }
                    client.send(
                      "/app/customer-call-food",
                      {},
                      currentUseTable?.table?.name,
                    );

                    openNotification({
                      type: "success",
                      message: "Thành công",
                      description: "Gọi món thành công!",
                    });

                    setTimeout(() => {
                      setShoppingCart!([]);
                      setNoteValue("");
                      queryClient!.invalidateQueries({
                        queryKey: ["current-use-table"],
                      });
                    }, 1500);
                  } else {
                    openNotification({
                      type: "error",
                      message: "Thất bại",
                      description: "Gọi món thất bại!",
                    });

                    setTimeout(() => {
                      // Xoá class 'active' thể hiện nút không còn được nhấn
                      button?.classList.remove("active");
                    }, 1500);
                  }
                }

                // Xoá class 'active' thể hiện nút không còn được nhấn
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

export default DrawerShoppingCart;
