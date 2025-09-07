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
import TextArea from "antd/es/input/TextArea";
import type {
  CategoryFoodsType,
  FoodsFormatType,
  ShoppingCartsType,
  UseTablesFormatType,
} from "../common/types";
import {
  CommonStatus,
  FoodStatus,
  HandlePaymentStatus,
  OrderSheetStatus,
  ReactQueryGetData,
  UseTableStatus,
} from "../common/values";
import CustomBrand from "../components/common/brand";
import CustomTextArea from "../components/admin/text-area";
import CustomDrawer from "../components/client/drawer";
import CustomCardFilter from "../components/client/card-filter";
import CustomCardFood from "../components/client/card-food";
import {
  FindAllCategoryFood,
  FindAllFood,
  FindOneNewUseTableByTableId,
  GetHandlePaymentFormat,
  HandleCreateOrderSheet,
} from "../services/api";
import { openNotification } from "../utils/showNotification";
import { vietnamMoneyFormat } from "../utils/otherEvents";
import { openConfirmation } from "../utils/showConfirmation";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import useWebSocket from "../hook/websocket";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import CustomSpinner from "../components/common/spinner";

// Kiểu dữ liệu của các tham số truyền vào
type ClientLayoutProps = {
  queryClient?: QueryClient;
  tableId?: string;
  shoppingCart?: ShoppingCartsType[];
  setShoppingCart?: Dispatch<SetStateAction<ShoppingCartsType[]>>;
  currentUseTable?: UseTablesFormatType;
};

// Client Header
const ClientHeader: React.FC<ClientLayoutProps> = ({
  queryClient,
  tableId,
  shoppingCart,
  setShoppingCart,
  currentUseTable,
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
                title: "Bạn có chắc chắn gọi ?",
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
            onClick={async (e) => {
              // Nút hiện tại
              const button = e.currentTarget;
              // Thêm class 'active' thể hiện nút đang được nhấn
              button.classList.add("active");

              // Hỏi trước khi xử khi xử lý ?
              const answer = await openConfirmation({
                title: "Bạn có chắc chắn góp ý ?",
                content: "Hành động này không thể hoàn tác.",
              });
              if (answer) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: "Đã góp ý nhân viên",
                  duration: 1.5,
                });
              }

              // Xoá class 'active' thể hiện nút không còn được nhấn
              button.classList.remove("active");
            }}
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
      const [noteValue, setNoteValue] = useState<string>();

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
                        title: "Bạn có chắc chắn gọi món ?",
                        content: "Hành động này không thể hoàn tác.",
                      });
                      if (answer) {
                        // Nếu giỏ hàng trống thì báo lỗi
                        if (shoppingCart?.length == 0) {
                          openNotification({
                            type: "warning",
                            message: "Cảnh báo",
                            description: "Không có món ăn nào trong giỏ hàng !",
                            duration: 1.5,
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
                          timeCreate: new Date().toISOString(),
                          tableId: Number(tableId!),
                          totalPrice: totalPriceValue! || 0,
                          note: noteValue! || undefined,
                          status: "Đang chờ xác nhận",
                          orderSheetDetails: orderSheetDetails!,
                        });
                        if (res.status === 200) {
                          openNotification({
                            type: "success",
                            message: "Thành công",
                            description: "Gọi món thành công !",
                            duration: 1.5,
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
                            description: "Gọi món thất bại !",
                            duration: 1.5,
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
                className="client__cart-note"
                placeholder="Nhập ghi chú khi gọi món"
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
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
            {currentUseTable!.orderSheets
              ?.sort(
                (a, b) =>
                  new Date(b.timeCreate!).getTime() -
                  new Date(a.timeCreate!).getTime()
              )
              ?.map((orderSheet) => (
                <>
                  <div key={orderSheet!.id} className="client__order">
                    <p className="client__order-time">
                      {orderSheet!.timeCreate!}
                    </p>
                    <div
                      className={
                        "client__order-info " +
                        (orderSheet!.status! == OrderSheetStatus.serviced
                          ? "purple"
                          : orderSheet!.status! == OrderSheetStatus.confirm
                          ? "green"
                          : orderSheet!.status! == OrderSheetStatus.canceled
                          ? "red"
                          : "gray")
                      }
                    >
                      <b className="client__order-title">
                        Phiếu: #{orderSheet!.id!}
                      </b>
                      <table className="client__order-details">
                        <colgroup>
                          <col width="55%" />
                          <col width="15%" />
                          <col width="30%" />
                        </colgroup>
                        {/* <tr>
                        <td className="left">Phở bò</td>
                        <td>1x</td>
                        <td className="right">45.000đ</td>
                      </tr>
                      <tr>
                        <td className="left">Trà đào</td>
                        <td>2x</td>
                        <td className="right">60.000đ</td>
                      </tr> */}
                        {orderSheet!.orderSheetDetails?.map(
                          (orderSheetDetail, index) => (
                            <tr key={index}>
                              <td className="left">
                                {orderSheetDetail!.food.name!}
                              </td>
                              <td>{orderSheetDetail!.quantity!}x</td>
                              <td className="right">
                                {vietnamMoneyFormat(orderSheetDetail!.price!)}đ
                              </td>
                            </tr>
                          )
                        )}
                      </table>
                      <p className="client__order-total">
                        Tổng cộng: {vietnamMoneyFormat(orderSheet!.totalPrice!)}
                        đ
                      </p>
                      <p
                        className={
                          "client__order-status " +
                          (orderSheet!.status! == OrderSheetStatus.serviced
                            ? "purple"
                            : orderSheet!.status! == OrderSheetStatus.confirm
                            ? "green"
                            : orderSheet!.status! == OrderSheetStatus.canceled
                            ? "red"
                            : "gray")
                        }
                      >
                        {orderSheet!.status!}
                      </p>
                      <p className="client__order-message">
                        Lời nhắn: {orderSheet!.message!}
                      </p>
                    </div>
                  </div>
                </>
              ))}
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
          {currentUseTable!.status === UseTableStatus.occupied && (
            <div className="client__actions">
              {/* <button type="button" className="client__action">
              <FontAwesomeIcon icon={faGear} className="client__icon" />
            </button> */}
              <CustomDrawer
                key={1}
                prefixClassName="client__"
                icon={faQrcode}
                title="QR Code"
                children={ClientDrawers.qr()}
              />
              <CustomDrawer
                key={2}
                prefixClassName="client__"
                icon={faBell}
                title="Gọi nhân viên"
                children={ClientDrawers.call()}
              />
              <CustomDrawer
                key={3}
                prefixClassName="client__"
                icon={faCommentDots}
                title="Góp ý nhân viên"
                children={ClientDrawers.message()}
              />
              <CustomDrawer
                key={4}
                prefixClassName="client__"
                icon={faShoppingCart}
                title="Giỏ hàng"
                size="large"
                children={ClientDrawers.shoppingCart()}
              />
              <CustomDrawer
                key={5}
                prefixClassName="client__"
                icon={faReceipt}
                title="Phiếu gọi món"
                size="large"
                children={ClientDrawers.callTickets()}
              />
            </div>
          )}
        </div>
      </header>
    </>
  );
};

// Client Main
const ClientMain: React.FC<ClientLayoutProps> = ({
  shoppingCart,
  setShoppingCart,
  currentUseTable,
}) => {
  // ...
  const filterListRef = useRef<HTMLDivElement>(null);

  // Truy vấn danh sách loại món ăn
  const { data: categoryFoods } = useQuery({
    queryKey: ["category-foods"],
    queryFn: async () => {
      if (currentUseTable!.status === UseTableStatus.occupied) {
        const res = await FindAllCategoryFood({
          statusValue: [CommonStatus.active],
        });
        if (res.status === 200) {
          return res.data;
        } else {
          openNotification({
            type: "error",
            message: "Truy vấn dữ liệu thất bại",
            description:
              String(res.data) || "Lỗi phát sinh khi truy vấn dữ liệu",
            duration: 2,
          });

          throw res;
        }
      } else {
        return [];
      }
    },
    retry: ReactQueryGetData.retry,
    staleTime: ReactQueryGetData.staleTime,
  });

  // Biến giữ giá trị lọc món ăn theo loại món ăn
  const [filterCategory, setFilterCategory] = useState<number | string>();

  // Hàm cập nhật danh sách các loại món ăn, món ăn (gọi API)
  const { data: foods } = useQuery({
    queryKey: ["foods", filterCategory!],
    queryFn: async () => {
      if (currentUseTable!.status === UseTableStatus.occupied) {
        const res = await FindAllFood({
          categoryValue: [String(filterCategory!)],
          statusValue: [FoodStatus.active],
        });
        if (res.status === 200) {
          return res.data;
        } else {
          openNotification({
            type: "error",
            message: "Truy vấn dữ liệu thất bại",
            description:
              String(res.data) || "Lỗi phát sinh khi truy vấn dữ liệu",
            duration: 2,
          });

          throw res;
        }
      } else {
        return [];
      }
    },
    retry: ReactQueryGetData.retry,
    staleTime: ReactQueryGetData.staleTime,
  });

  return (
    <>
      <main className="client__main">
        {currentUseTable!.status === UseTableStatus.occupied ? (
          <>
            <aside className="client__filter">
              <div className="client__filter-list-warper">
                <div ref={filterListRef} className="client__filter-list">
                  {categoryFoods?.map((categoryFood) => (
                    <CustomCardFilter
                      key={categoryFood!.id!}
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
                  key={food!.id!}
                  object={food}
                  shoppingCart={shoppingCart}
                  setSelectFood={setShoppingCart}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="client__inform container">
            {currentUseTable!.status === UseTableStatus.reserved
              ? "Rất tiếc, bàn này đã được khách khác đặt trước. Mong quý khách thông cảm!"
              : currentUseTable!.status === UseTableStatus.empty
              ? "Xin vui lòng chờ trong giây lát để chúng tôi chuẩn bị bàn cho quý khách."
              : "Bàn hiện đang được bảo trì. Rất mong quý khách thông cảm vì sự bất tiện này!"}
          </p>
        )}
      </main>
    </>
  );
};

// Client Layout
const ClientLayout = () => {
  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Id của bàn hiện tại (thông qua url trang)
  const { tableId } = useParams();
  // Truy vấn dữ liệu sử dụng bàn ăn (theo mã bàn)
  const {
    data: currentUseTable,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["current-use-table"],
    queryFn: async () => {
      const res = await FindOneNewUseTableByTableId({
        tableId: tableId!,
      });
      if (res.status === 200 && res!.data?.id) {
        return res.data;
      } else {
        openNotification({
          type: "error",
          message: "Truy vấn dữ liệu thất bại",
          description: String(res.data) || "Lỗi phát sinh khi truy vấn dữ liệu",
          duration: 2,
        });

        throw res;
      }
    },
    retry: ReactQueryGetData.retry,
    // staleTime: ReactQueryGetData.staleTime,
    refetchInterval: 1000 * 5 * 1,
  });
  // Truy vấn dữ liệu Xử lý thanh toán
  const { data: handlePayment } = useQuery({
    queryKey: ["handle-payment"],
    queryFn: async () => {
      const res = await GetHandlePaymentFormat();
      if (res.status === 200) {
        return res.data;
      } else {
        // openNotification({
        //   type: "error",
        //   message: "Truy vấn dữ liệu thất bại",
        //   description: String(res.data) || "Lỗi phát sinh khi truy vấn dữ liệu",
        //   duration: 2,
        // });
        // throw res;
      }
    },
    refetchInterval: 1000 * 3,
  });

  // //
  // useWebSocket({
  //   tableId: !isError ? tableId : undefined,
  //   onUseTableUpdate: (data) => {
  //     console.log("Cập nhật mới:", data);
  //     queryClient.invalidateQueries({ queryKey: ["current-use-table"] })
  //   }
  // });

  // Dữ liệu về giỏ hàng hiện tại của bàn
  const [shoppingCart, setShoppingCart] = useState<ShoppingCartsType[]>([]);
  // // Dữ liệu về phiếu gọi món hiện tại của bàn
  // const [orderSheets, setOrderSheets] = useState<any>([]);

  //
  if (isLoading) return null;

  return (
    <>
      {isError && !handlePayment ? (
        <Navigate to="/error" replace />
      ) : handlePayment?.useTable?.id !== currentUseTable?.id ||
        handlePayment?.status === HandlePaymentStatus.nothing ? (
        <>
          <ClientHeader
            queryClient={queryClient}
            tableId={tableId}
            shoppingCart={shoppingCart}
            setShoppingCart={setShoppingCart}
            currentUseTable={currentUseTable}
          />
          <ClientMain
            tableId={tableId}
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

export default ClientLayout;
