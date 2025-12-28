import React, {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Navigate, useParams } from "react-router-dom";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCommentDots,
  faInfoCircle,
  faMinus,
  faPaperPlane,
  faPlus,
  faReceipt,
  faRotate,
  faShoppingCart,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Image, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { ShoppingCartsType, UseTablesFormatType } from "../common/types";
import {
  CommonStatus,
  HandlePaymentStatus,
  OrderSheetStatus,
  ReactQueryGetData,
  UseFoodStatus,
  UseTableStatus,
} from "../common/values";
import CustomBrand from "../components/common/brand";
import CustomDrawer from "../components/client/drawer";
import CustomCardFilter from "../components/client/card-filter";
import CustomCardFood from "../components/client/card-food";
import {
  FindAllCategoryFood,
  FindAllUseFoodTimeEndIsNull,
  FindOneNewUseTableByTableId,
  GetHandlePaymentFormatByUseTableId,
  HandleCreateOrderSheet,
} from "../services/api";
import CustomSpinner from "../components/common/spinner";
import { openNotification } from "../utils/showNotification";
import { vietnamMoneyFormat } from "../utils/otherEvents";
import { openConfirmation } from "../utils/showConfirmation";
import SockJS from "sockjs-client";
import { Client, over } from "stompjs";
import dayjs from "dayjs";
import PaymentPage from "../pages/other/payment";

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
    info: () => {
      return (
        <>
          <div className="client__info">
            <div className="client__info-block table">
              <h3>Bàn ăn</h3>
              <p>
                <span>Tên bàn:</span>
                <b>{currentUseTable?.table?.name}</b>
              </p>
              <p>
                <span>Loại bàn:</span>
                <b>{currentUseTable?.table?.categoryTable?.name}</b>
              </p>
              <p>
                <span>Tầng:</span>
                <b>{currentUseTable?.table?.floor?.name}</b>
              </p>
              <p>
                <span>Số chỗ:</span>
                <b>{currentUseTable?.table?.seats}</b>
              </p>
              <p>
                <span>Nhận bàn:</span>
                <b>{currentUseTable?.timeStart}</b>
              </p>
            </div>
            <div className="client__info-block customer">
              <h3>Khách hàng</h3>
              <p>
                <span>Họ và tên:</span>
                <b>{currentUseTable?.customer?.fullname}</b>
              </p>
              <p>
                <span>Điện thoại:</span>
                <b>{currentUseTable?.customer?.phone}</b>
              </p>
              <p>
                <span>Email:</span>
                <b>{currentUseTable?.customer?.email}</b>
              </p>
              <p>
                <span>Địa chỉ:</span>
                <b>{currentUseTable?.customer?.address}</b>
              </p>
              {/* <p>
                <span>Thẻ KH:</span>
                <b>{currentUseTable?.customer?.customerCard?.name}</b>
              </p> */}
            </div>
          </div>
        </>
      );
    },
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
          <Button
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
                const client = stompClientCommonRef.current;
                if (!client || !client.connected) {
                  console.warn(
                    "WebSocket chưa kết nối, không gửi được tin nhắn"
                  );
                  return;
                }

                client.send(
                  "/app/customer-call-employee",
                  {},
                  currentUseTable?.table?.name
                );

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
          </Button>
        </>
      );
    },
    message: () => {
      //
      const scrollBottomRef = useRef<HTMLDivElement | null>(null);
      const stompClientMessageRef = useRef<Client | null>(null);
      const [inputValue, setInputValue] = useState("");
      //
      const sendMessage = () => {
        if (!inputValue.trim()) return;

        const client = stompClientMessageRef.current;
        if (!client || !client.connected) {
          console.warn("WebSocket chưa kết nối, không gửi được tin nhắn");
          return;
        }

        client.send(
          "/app/customer-send-message",
          {},
          JSON.stringify({
            useTableId: currentUseTable?.id,
            restaurantId: currentUseTable?.restaurantId,
            messageDetail: {
              sendAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
              isAdminSend: false,
              content: inputValue,
            },
          })
        );
        queryClient?.invalidateQueries({
          queryKey: ["current-use-table"],
        });
        setInputValue("");
      };
      //
      useEffect(() => {
        //
        scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
        //
        const socket = new SockJS("http://localhost:8080/websocket");
        const client = over(socket);
        stompClientMessageRef.current = client;

        client.connect({}, () => {
          console.log("WebSocket connected");
          client.subscribe(
            `/topic/call-food-messages-use-table-${currentUseTable?.id}`,
            (message) => {
              if (message) {
                console.log(message);
                openNotification({
                  type: "success",
                  message: "Nhà hàng trả lời",
                  description: "Nhà hàng đã trả lời tin nhắn của bạn !",
                  duration: 1.5,
                });
              }

              queryClient?.invalidateQueries({
                queryKey: ["current-use-table"],
              });
            }
          );
        });

        return () => {
          if (client.connected) {
            client.disconnect(() => console.log("WebSocket disconnected"));
          }
        };
      }, []);
      //
      useEffect(() => {
        scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [currentUseTable?.message]);

      return (
        <>
          <div className="drawer__message-content-warper">
            {currentUseTable?.message?.id ? (
              <>
                <div className="drawer__message-content">
                  {currentUseTable?.message?.messageDetails?.map(
                    (messageDetail) => (
                      <>
                        <div
                          className={
                            "drawer__message-bubble " +
                            (messageDetail?.isAdminSend ? "admin" : "customer")
                          }
                        >
                          <p>{messageDetail?.content}</p>
                          <span>{messageDetail?.sendAt?.split(" ")[1]}</span>
                        </div>
                      </>
                    )
                  )}
                </div>
                <div ref={scrollBottomRef}></div>
              </>
            ) : (
              <div className="drawer__message-inform">
                <img
                  src="/src/assets/images/others/message-question-icon.png"
                  alt=""
                />
                <p>
                  Hãy nhắn tin cho cửa hàng về món ăn hoặc thắc mắc của bạn –
                  chúng tôi sẽ phản hồi nhanh chóng.
                </p>
              </div>
            )}
          </div>
          <div className="drawer__message-action">
            <Input
              placeholder="Nhập tin nhắn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button type="primary" onClick={sendMessage}>
              <FontAwesomeIcon icon={faPaperPlane} /> Gửi
            </Button>
          </div>
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
                                description: "Xoá món ăn thành công!",
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
                    className="btn drawer__button client__cart-button"
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
                    className="btn drawer__button client__cart-button"
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
                          restaurantId: currentUseTable?.restaurantId,
                          createAt: new Date().toISOString(),
                          tableId: Number(tableId!),
                          totalPrice: totalPriceValue! || 0,
                          note: noteValue! || undefined,
                          status: "Đang chờ xác nhận",
                          orderSheetDetails: orderSheetDetails!,
                        });
                        if (res.status === 200) {
                          const client = stompClientCommonRef.current;
                          if (!client || !client.connected) {
                            console.warn(
                              "WebSocket chưa kết nối, không gửi được tin nhắn"
                            );
                            return;
                          }
                          client.send(
                            "/app/customer-call-food",
                            {},
                            currentUseTable?.table?.name
                          );

                          openNotification({
                            type: "success",
                            message: "Thành công",
                            description: "Gọi món thành công!",
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
                            description: "Gọi món thất bại!",
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
    orderSheets: () => {
      useEffect(() => {
        //
        const socket = new SockJS("http://localhost:8080/websocket");
        const client = over(socket);

        client.connect({}, () => {
          console.log("WebSocket connected");
          client.subscribe(
            `/topic/call-food-order-sheets-use-table-${currentUseTable?.id}`,
            (message) => {
              if (message) {
                console.log(message);
                openNotification({
                  type: "success",
                  message: "Nhà hàng trả i",
                  description: "Nhà hàng đã trả lời tin nhắn của bạn !",
                  duration: 1.5,
                });
              }

              queryClient?.invalidateQueries({
                queryKey: ["current-use-table"],
              });
            }
          );
        });

        return () => {
          if (client.connected) {
            client.disconnect(() => console.log("WebSocket disconnected"));
          }
        };
      }, []);

      return (
        <>
          <div className="client__order-sheets">
            {currentUseTable!.orderSheets
              ?.sort(
                (a, b) =>
                  new Date(b.createAt!).getTime() -
                  new Date(a.createAt!).getTime()
              )
              ?.map((orderSheet) => (
                <>
                  <div key={orderSheet!.id} className="client__order-sheet">
                    <p className="client__order-sheet-time">
                      {orderSheet!.createAt!}
                    </p>
                    <div
                      className={
                        "client__order-sheet-info " +
                        (orderSheet!.status! == OrderSheetStatus.serviced
                          ? "purple"
                          : orderSheet!.status! == OrderSheetStatus.confirm
                          ? "green"
                          : orderSheet!.status! == OrderSheetStatus.canceled
                          ? "red"
                          : "gray")
                      }
                    >
                      <b className="client__order-sheet-title">
                        Phiếu: #{orderSheet!.id!}
                      </b>
                      <table className="client__order-sheet-details">
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
                      <p className="client__order-sheet-total">
                        Tổng cộng: {vietnamMoneyFormat(orderSheet!.totalPrice!)}
                        đ
                      </p>
                      <p
                        className={
                          "client__order-sheet-status " +
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
                      <p className="client__order-sheet-message">
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
    // question: () => {
    //   return (<>123</>);
    // }
  };

  return (
    <>
      <header className="client__header-warper">
        <div className="client__header">
          <CustomBrand to="#!" prefixClassName="client__" name="VINAEATERY" />
          {currentUseTable!.status === UseTableStatus.occupied && (
            <div className="client__actions">
              {/* <button type="button" className="client__action">
              <FontAwesomeIcon icon={faGear} className="client__icon" />
            </button> */}
              <CustomDrawer
                key={1}
                prefixClassName="client__"
                icon={faInfoCircle}
                title="Thông tin"
                children={ClientDrawers.info()}
              />
              {/* <CustomDrawer
                key={2}
                prefixClassName="client__"
                icon={faQrcode}
                title="QR Code"
                children={ClientDrawers.qr()}
              /> */}
              <CustomDrawer
                key={3}
                prefixClassName="client__"
                icon={faBell}
                title="Gọi nhân viên"
                children={ClientDrawers.call()}
              />
              <CustomDrawer
                key={4}
                size="large"
                prefixClassName="client__"
                icon={faCommentDots}
                title="Trò chuyện với nhà hàng"
                children={ClientDrawers.message()}
              />
              <CustomDrawer
                key={5}
                prefixClassName="client__"
                icon={faShoppingCart}
                title="Giỏ món ăn"
                size="large"
                children={ClientDrawers.shoppingCart()}
              />
              <CustomDrawer
                key={6}
                prefixClassName="client__"
                icon={faReceipt}
                title="Lịch sử gọi món"
                size="large"
                children={ClientDrawers.orderSheets()}
              />
              {/* <CustomDrawer
                key={7}
                prefixClassName="client__"
                icon={faQuestionCircle}
                title="Hướng dẫn sử dụng"
                children={ClientDrawers.question()}
              /> */}
              <button type="button" className="client__action">
                <FontAwesomeIcon icon={faRotate} className="client__icon" />
              </button>
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
  // Biến giữ giá trị lọc món ăn theo loại món ăn
  const [filterName, setFilterName] = useState<string>();
  // Biến giữ giá trị lọc món ăn theo loại món ăn
  const [filterCategory, setFilterCategory] = useState<number | string>();
  // Biến giữ giá trị của nút trạng thái món ăn hiện tại
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // ...
  const filterListRef = useRef<HTMLDivElement>(null);

  // Truy vấn dữ liệu từ csdl (gọi api)
  // - Loại món ăn
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
  // - Món ăn
  const { data: useFoods } = useQuery({
    queryKey: ["use-foods", filterName!, filterCategory!, filterStatus!],
    queryFn: async () => {
      if (currentUseTable!.status === UseTableStatus.occupied) {
        const res = await FindAllUseFoodTimeEndIsNull({
          findType: "food",
          findValue: filterName,
          categoryValue: [String(filterCategory!)],
          statusValue: [filterStatus!],
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
    // staleTime: ReactQueryGetData.staleTime,
    // refetchInterval: 1000 * 5 * 1,
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
              <div className="client__food-header">
                <Input.Search
                  allowClear
                  enterButton
                  placeholder="Tìm kiếm theo tên món ăn"
                  className="client__food-find"
                  onChange={(e) => setFilterName(e.target.value)}
                />
                <div className="client__food-buttons">
                  <Button
                    variant={filterStatus === null ? "solid" : "outlined"}
                    color="blue"
                    className="client__food-button"
                    onClick={() => setFilterStatus(null)}
                  >
                    Tất cả
                  </Button>
                  <Button
                    variant={
                      filterStatus === "Đang giảm giá" ? "solid" : "outlined"
                    }
                    color="orange"
                    className="client__food-button"
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
                    className="client__food-button"
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
                    className="client__food-button"
                    onClick={() => setFilterStatus(UseFoodStatus.canNotOrder)}
                  >
                    {UseFoodStatus.canNotOrder}
                  </Button>
                </div>
              </div>
              {useFoods?.map((useFood) => (
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
  const { restaurantId, tableId } = useParams();
  useEffect(() => {
    console.log("123 " + restaurantId);
    console.log(tableId);
  }, [restaurantId, tableId])
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
        restaurantId: restaurantId!,
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
    // refetchInterval: 1000 * 5 * 1,
  });

  // Dữ liệu về giỏ hàng hiện tại của bàn
  const [shoppingCart, setShoppingCart] = useState<ShoppingCartsType[]>([]);

  // Nếu đang load thì không trả về gì
  if (isLoading) return null;

  return (
    <>
      {isError ? (
        <Navigate to="/error" replace />
      ) : currentUseTable ? (
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
