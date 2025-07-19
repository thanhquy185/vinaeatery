import React, {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCommentDots,
  faGear,
  faMinus,
  faPlus,
  faQrcode,
  faReceipt,
  faShoppingCart,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Image } from "antd";
import type {
  CategoryFoodsType,
  FoodsFormatType,
  ShoppingCartsType,
} from "../common/types";
import CustomBrand from "../components/common/brand";
import CustomTextArea from "../components/admin/text-area";
import CustomDrawer from "../components/client/drawer";
import CustomCardFilter from "../components/client/card-filter";
import CustomCardFood from "../components/client/card-food";
import { FindAllCategoryFood, FindAllFood, FindTableId } from "../services/api";
import { openNotification } from "../utils/showNotification";
import { vietnamMoneyFormat } from "../utils/otherEvents";
import { openConfirmation } from "../utils/showConfirmation";

// Kiểu dữ liệu của các tham số truyền vào
type ClientLayoutProps = {
  tableId?: string;
  shoppingCart?: ShoppingCartsType[];
  setShoppingCart?: Dispatch<SetStateAction<ShoppingCartsType[]>>;
};

// Client Header
const ClientHeader: React.FC<ClientLayoutProps> = ({
  tableId,
  shoppingCart,
  setShoppingCart,
}) => {
  // Cách thành phần drawer theo từng icon
  const ClientDrawers = {
    qr: () => {
      return (
        <>
          <p className="drawer__paragraph">
            Quét mã QR bên dưới để đặt món ăn bằng thiết bị của bạn (ấn vào ảnh
            để phóng to)
          </p>
          <Image
            src={
              "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=http://localhost:5173/client/" +
              tableId!
            }
            className="drawer__qr"
          />
        </>
      );
    },
    call: () => {
      return (
        <>
          <p className="drawer__paragraph">Bạn cần nhân viên hỗ trợ ?</p>
          <button
            type="button"
            className="drawer__button btn"
            onClick={async (e) => {
              // Nút hiện tại
              const button = e.currentTarget;
              // Thêm class 'active' thể hiện nút đang được nhấn
              button.classList.add("active");

              // Hỏi trước khi xử khi xử lý ?
              const answer = await openConfirmation({
                title: "Bạn có chắc chắn gọi nhân viên ?",
                content: "Hành động này không thể hoàn tác.",
              });
              if (answer) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: "Đã gọi nhân viên hỗ trợ",
                  duration: 1.5,
                });
              }

              // Xoá class 'active' thể hiện nút không còn được nhấn
              button.classList.remove("active");
            }}
          >
            Gửi yêu cầu
          </button>
        </>
      );
    },
    message: () => {
      return (
        <>
          <CustomTextArea
            placeholder="Nhập nội dung góp ý"
            className="drawer__text-area"
          />
          <button
            type="button"
            className="drawer__button btn"
            onClick={() =>
              openNotification({
                type: "success",
                message: "Thành công",
                description: "Đã góp ý nhân viên",
                duration: 1.5,
              })
            }
          >
            Gửi góp ý
          </button>
        </>
      );
    },
    shoppingCart: () => {
      let totalPriceValue: number | undefined = shoppingCart?.reduce(
        (total, item) => {
          return total + (item.food?.price || 0) * (item.quantity || 0);
        },
        0
      );

      return (
        <>
          <div className="client__cart">
            <div className="client__cart-list-warper">
              <div className="client__cart-list">
                {shoppingCart!.map((item, index) => (
                  <div key={item.food?.id} className="client__cart-item">
                    <img
                      src={
                        item!.food!.image
                          ? "/src/assets/images/foods/" + item!.food!.image
                          : "/src/assets/images/others/no-image.png"
                      }
                      alt=""
                      className="client__cart-item-image"
                    />
                    <div className="client__cart-item-info">
                      <p className="client__cart-item-paragraph name">
                        {item!.food!.name}
                      </p>
                      <p className="client__cart-item-paragraph category">
                        Loại món ăn: {item!.food!.categoryFood!.name}
                      </p>
                      <p className="client__cart-item-paragraph unit">
                        Đơn vị: {item!.food!.unit}
                      </p>
                      <p className="client__cart-item-paragraph price">
                        {vietnamMoneyFormat(item!.food!.price as number)}đ
                      </p>
                    </div>
                    <div className="client__cart-item-buttons">
                      <button
                        type="button"
                        className="client__cart-item-button btn secondary-btn minus"
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
                        className="client__cart-item-input"
                        value={item!.quantity}
                        onChange={(e) => {
                          const newQuantity = Number(
                            e.currentTarget.value.replace(/\D/g, "")
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
                        className="client__cart-item-button btn secondary-btn plus"
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
                        className="client__cart-item-button btn red-secondary trash"
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
                                description: "Xoá món ăn thành công !",
                                duration: 1.5,
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
            <div className="client__cart-final">
              <div className="client__cart-actions">
                <p className="client__cart-total-price">
                  Tổng tiền:
                  <span>{vietnamMoneyFormat(totalPriceValue!)}đ</span>
                </p>
                <div className="client__cart-buttons">
                  <button
                    type="button"
                    className="client__cart-button btn"
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
                          description: "Xoá tất cả món ăn thành công !",
                          duration: 1.5,
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
                  <button type="button" className="client__cart-button btn">
                    Gọi món
                  </button>
                </div>
              </div>
              <CustomTextArea
                className="client__cart-note"
                placeholder="Nhập ghi chú khi gọi món"
              />
            </div>
          </div>
        </>
      );
    },
    callTickets: () => {
      return (
        <>
          <div className="client__orders">
            <div className="client__order">
              <p className="client__order-time">10:30:00</p>
              <div className="client__order-info red">
                <b className="client__order-title">Phiếu: #PH001</b>
                <table className="client__order-details">
                  <colgroup>
                    <col width="55%" />
                    <col width="15%" />
                    <col width="30%" />
                  </colgroup>
                  <tr>
                    <td className="left">Phở bò</td>
                    <td>1x</td>
                    <td className="right">45.000đ</td>
                  </tr>
                  <tr>
                    <td className="left">Trà đào</td>
                    <td>2x</td>
                    <td className="right">60.000đ</td>
                  </tr>
                </table>
                <p className="client__order-total">Tổng cộng: 165.000đ</p>
                <p className="client__order-status">Đã xác nhận</p>
                <p className="client__order-message">
                  Lời nhắn: Rau muống tạm hết hàng
                </p>
              </div>
            </div>
          </div>
        </>
      );
    },
  };

  return (
    <>
      <header className="client__header-warper">
        <div className="client__header container">
          <CustomBrand to="#!" prefixClassName="client__" name="VINAEATERY" />
          <div className="client__actions">
            {/* <button type="button" className="client__action">
              <FontAwesomeIcon icon={faGear} className="client__icon" />
            </button> */}
            <CustomDrawer
              prefixClassName="client__"
              icon={faQrcode}
              title="QR Code"
              children={ClientDrawers.qr()}
            />
            <CustomDrawer
              prefixClassName="client__"
              icon={faBell}
              title="Gọi nhân viên"
              children={ClientDrawers.call()}
            />
            <CustomDrawer
              prefixClassName="client__"
              icon={faCommentDots}
              title="Góp ý nhân viên"
              children={ClientDrawers.message()}
            />
            <CustomDrawer
              prefixClassName="client__"
              icon={faShoppingCart}
              title="Giỏ hàng"
              size="large"
              children={ClientDrawers.shoppingCart()}
            />
            <CustomDrawer
              prefixClassName="client__"
              icon={faReceipt}
              title="Phiếu gọi món"
              size="large"
              children={ClientDrawers.callTickets()}
            />
          </div>
        </div>
      </header>
    </>
  );
};

// Client Main
const ClientMain: React.FC<ClientLayoutProps> = ({
  shoppingCart,
  setShoppingCart,
}) => {
  //
  const filterListRef = useRef<HTMLDivElement>(null);

  // Hàm cập nhật danh sách các loại món ăn, món ăn (gọi API)
  const [categoryFoods, setCategoryFoods] = useState<CategoryFoodsType[]>([]);
  const getAllCategoryFood = async () => {
    const res = await FindAllCategoryFood({
      statusValue: ["Hoạt động"],
    });
    if (res!.status === 200) {
      setCategoryFoods(res!.data);
    } else {
      console.log(res);
      openNotification({
        type: "error",
        message: "Truy vấn dữ liệu thất bại",
        description: "Lỗi phát sinh khi truy vấn dữ liệu",
        duration: 2,
      });
    }
  };
  const [foods, setFoods] = useState<FoodsFormatType[]>([]);
  const getAllFood = async () => {
    const res = await FindAllFood({ categoryValue: [String(filterCategory!)] });
    if (res!.status === 200) {
      setFoods(res!.data);
    } else {
      openNotification({
        type: "error",
        message: "Truy vấn dữ liệu thất bại",
        description: "Lỗi phát sinh khi truy vấn dữ liệu",
        duration: 2,
      });
    }
  };

  // Biến giữ giá trị lọc món ăn theo loại món ăn
  const [filterCategory, setFilterCategory] = useState<number | string>();

  //
  useEffect(() => {
    getAllCategoryFood();
    getAllFood();
  }, []);
  useEffect(() => {
    getAllFood();
  }, [filterCategory]);

  return (
    <>
      <main className="client__main">
        <aside className="client__filter">
          <div className="client__filter-list-warper">
            <div ref={filterListRef} className="client__filter-list">
              {categoryFoods?.map((categoryFood) => (
                <CustomCardFilter
                  object={categoryFood}
                  active={filterCategory === categoryFood.id}
                  currentValue={filterCategory}
                  setSelectValue={setFilterCategory}
                />
              ))}
            </div>
          </div>
        </aside>
        <div className="client__foods">
          {foods?.map((food) => (
            <CustomCardFood
              object={food}
              shoppingCart={shoppingCart}
              setSelectFood={setShoppingCart}
            />
          ))}
        </div>
      </main>
    </>
  );
};

// Client Layout
const ClientLayout = () => {
  // Id của bàn hiện tại (thông qua url trang)
  const { tableId } = useParams();
  // - Kiểm tra id bàn có tồn tại hay không ?
  const [isExists, setIsExists] = useState<boolean>(true);
  const isExistsTableId = async () => {
    const res = await FindTableId({
      id: tableId!,
    });
    if (res!.status === 200) {
      if (!(res!.config ? res!.data!.data : res!.data)) {
        setIsExists(false);
      }
    } else {
      openNotification({
        type: "error",
        message: "Truy vấn dữ liệu thất bại",
        description: "Lỗi phát sinh khi truy vấn dữ liệu",
        duration: 2,
      });
    }
  };
  // - Dữ liệu về giỏ hàng hiện tại của bàn
  const [shoppingCart, setShoppingCart] = useState<ShoppingCartsType[]>([]);
  // - Dữ liệu về phiếu gọi món hiện tại của bàn
  const [orderSheets, setOrderSheets] = useState<any>([]);

  //
  useEffect(() => {
    isExistsTableId();
  }, []);

  return (
    <>
      {!isExists ? (
        <Navigate to="/error" replace />
      ) : (
        <>
          <ClientHeader
            tableId={tableId}
            shoppingCart={shoppingCart}
            setShoppingCart={setShoppingCart}
          />
          <ClientMain
            tableId={tableId}
            shoppingCart={shoppingCart}
            setShoppingCart={setShoppingCart}
          />
        </>
      )}
    </>
  );
};

export default ClientLayout;
