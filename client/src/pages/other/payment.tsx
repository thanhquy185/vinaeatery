import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Steps } from "antd";
import confetti from "canvas-confetti";
import type {
  HandlePaymentType,
  OrderSheetDetailType,
} from "../../common/types";
import {
  HandlePaymentStatus,
  ImageSourcePath,
  OrderSheetStatus,
  CategoryTableSurchargeType,
} from "../../common/values";
// import CustomSpinner from "../../components/common/spinner";
import PaymentInfo from "../../components/other/payment/payment-info";
import PaymentMethods from "../../components/other/payment/payment-methods";
import PaymentPay from "../../components/other/payment/payment-pay";
import PaymentResult from "../../components/other/payment/payment-result";
import PaymentInform from "../../components/other/payment/payment-inform";
import { useEntityQuery } from "../../hook/use-entity-query";
import { useEntityMutation } from "../../hook/use-entity-mutation";
import {
  GetHandlePaymentFormatByIsEmployeeHandleAndIsHandling,
  HandleUpdateHandlePayment,
} from "../../requests/handle-payments";
import { openNotification } from "../../utils/show-notification";
import { openConfirmation } from "../../utils/show-confirmation";

// Payment Props
export type PaymentProps = {
  nameEN?: string;
  handlePayment?: HandlePaymentType;
  orderSheetDetails?: OrderSheetDetailType[];
  totalFoodPrice?: number;
  categoryTableSurcharge?: number;
  customerDiscount?: number;
  methodImage?: string;
  methodTitle?: string;
  methodData?: any;
  payId?: string;
  payLogo?: string;
  payQRCodeUrl?: string;
  payResponseTime?: number;
  payTotalPrice?: number;
  score01Value?: number;
  score02Value?: number;
  score03Value?: number;
  score04Value?: number;
  score05Value?: number;
  commentValue?: string;
  updateMethodInfo?: (image: string, title: string, data: any) => void;
  updatePayInfo?: (
    id: string,
    logo: string,
    qrCodeUrl: string,
    responseTime: number,
    totalPrice: number,
  ) => void;
  setScore01Value?: Dispatch<SetStateAction<number>>;
  setScore02Value?: Dispatch<SetStateAction<number>>;
  setScore03Value?: Dispatch<SetStateAction<number>>;
  setScore04Value?: Dispatch<SetStateAction<number>>;
  setScore05Value?: Dispatch<SetStateAction<number>>;
  setCommentValue?: Dispatch<SetStateAction<string>>;
  handleClickExperienceButtons?: (
    button: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
};

// Giá trị chung
// - Đối tượng
const nameEN = "handle-payment-is-employee-handle";
// -
const steps = [
  {
    title: "Thông tin hoá đơn",
  },
  {
    title: "Chọn Phương thức thanh toán",
  },
  {
    title: "Kết quả và đánh giá",
  },
];
// - Tiêu đề phương thức
const moneyTitle = "Thanh toán bằng tiền mặt";
const atmTitle = "Thanh toán bằng ngân hàng";
const visMasterJcbTitle = "Thanh toán bằng Visa/Master/JCB";
const momoTitle = "Thanh toán bằng ví MoMo";
const zalopayTitle = "Thanh toán bằng ví ZaloPay";
const vnpayTitle = "Thanh toán bằng ví VNPay";

const PaymentPage = () => {
  // Truy vấn dữ liệu Xử lý thanh toán
  const {
    data: handlePayment,
    isLoading,
    isError,
    error,
  } = useEntityQuery<HandlePaymentType>({
    keys: [nameEN],
    params: {},
    api: GetHandlePaymentFormatByIsEmployeeHandleAndIsHandling,
  });

  // Danh sách chi tiết phiếu gọi món
  const [currentOrderSheetDetails, setCurrentOrderSheetDetails] = useState<
    OrderSheetDetailType[]
  >([]);
  // Tổng tiền món ăn
  const [currentTotalFoodPrice, setCurrentTotalFoodPrice] = useState<number>(0);
  // Phụ thu loại bàn ăn
  const [currentCategoryTableSurcharge, setCurrentCategoryTableSurcharge] =
    useState<number>(0);
  // Giảm giá khách hàng
  const [currentCustomerDiscount, setCurrentCustomerDiscount] =
    useState<number>(0);
  // // Tổng tiền thanh toán
  // const [currentTotalPrice, setCurrentTotalPrice] = useState<number>(0);

  // Các biến giữ trạng thái step hiện tại
  const [current, setCurrent] = useState<number>(0);
  // ...
  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  // Các biến giữ thông tin liên quan về 1 phương thức được nhấn
  // const [isSelectedMethod, setIsSelectedMethod] = useState<boolean>(false);
  const [methodImage, setMethodImage] = useState<string>("");
  const [methodTitle, setMethodTitle] = useState<string>("");
  const [methodData, setMethodData] = useState<any>(null);
  // Các biến giữ thông tin hiển thị khi thanh toán bằng 1 phương thức
  const [payId, setPayId] = useState<string>("");
  const [payLogo, setPayLogo] = useState<string>("");
  const [payQRCodeUrl, setPayQRCodeUrl] = useState<string>("");
  const [payResponseTime, setPayResponseTime] = useState<number>(0);
  const [payTotalPrice, setPayTotalPrice] = useState<number>(0);

  // Các biến giữ thông tin đánh giá phản hồi từ khách hàng
  const [experienceValue, setExperienceValue] = useState<string>("");
  const [score01Value, setScore01Value] = useState<number>(0);
  const [score02Value, setScore02Value] = useState<number>(0);
  const [score03Value, setScore03Value] = useState<number>(0);
  const [score04Value, setScore04Value] = useState<number>(0);
  const [score05Value, setScore05Value] = useState<number>(0);
  const [commentValue, setCommentValue] = useState<string>("");

  // Các biến giữ ref
  const changePayMethodButtonRef = useRef<HTMLButtonElement>(null);
  const completedPaymentButtonRef = useRef<HTMLButtonElement>(null);

  // Sự kiện chuyển step
  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };
  const next = () => {
    if (current < 3) {
      setCurrent(current + 1);
    }
  };

  // Hàm cập nhật thông tin phương thức
  const updateMethodInfo = (image: string, title: string, data: any) => {
    setMethodImage(image);
    setMethodTitle(title);
    setMethodData(data);
  };
  // Hàm cập nhật thông tn thanh toán
  const updatePayInfo = (
    id: string,
    logo: string,
    qrCodeUrl: string,
    responseTime: number,
    totalPrice: number,
  ) => {
    setPayId(id);
    setPayLogo(logo);
    setPayQRCodeUrl(qrCodeUrl);
    setPayResponseTime(responseTime);
    setPayTotalPrice(totalPrice);
  };
  // Hàm xử lý khi nhấn nút trải nghiệm
  const handleClickExperienceButtons = (
    button: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    document
      .querySelector(".public__main-result-group .emotion.active")
      ?.classList.remove("active");

    button.currentTarget.classList.toggle("active");

    setExperienceValue(button.currentTarget.textContent);
  };

  // Mutation
  // - Change Pay Method
  const changePayMethodMutation = useEntityMutation<HandlePaymentType>({
    messages: {
      success: `Chuyển về giao diện chọn phương thức thanh toán thành công!`,
      error: `Chuyển về giao diện chọn phương thức thanh toán thất bại!`,
    },
    invalidateKeys: [[nameEN]],
    api: HandleUpdateHandlePayment,
  });
  // - Complete Payment
  const completePaymentMutation = useEntityMutation<HandlePaymentType>({
    messages: {
      success: `Hoàn tất thanh toán hoá đơn!`,
      error: `Không hoàn tất thanh toán hoá đơn!`,
    },
    invalidateKeys: [[nameEN]],
    api: HandleUpdateHandlePayment,
  });

  //
  useEffect(() => {
    if (handlePayment) {
      if (
        handlePayment?.useTable &&
        handlePayment?.employee &&
        !handlePayment?.payMethod &&
        handlePayment?.status === HandlePaymentStatus.exists
      ) {
        setCurrent(0);
      }
      if (
        handlePayment?.useTable &&
        handlePayment?.employee &&
        !handlePayment?.payMethod &&
        handlePayment?.status === HandlePaymentStatus.pending
      ) {
        setCurrent(1);
      }
      if (
        handlePayment?.useTable &&
        handlePayment?.employee &&
        handlePayment?.payMethod &&
        handlePayment?.status === HandlePaymentStatus.selected
      ) {
        setCurrent(1);
      }
      if (
        handlePayment?.useTable &&
        handlePayment?.employee &&
        handlePayment?.payMethod &&
        handlePayment?.payTotalPrice! >= 0 &&
        handlePayment?.status === HandlePaymentStatus.completed
      ) {
        setCurrent(2);
      }
      if (
        !handlePayment?.useTable &&
        !handlePayment?.employee &&
        !handlePayment?.payMethod &&
        !handlePayment?.payTotalPrice &&
        handlePayment?.status === HandlePaymentStatus.nothing
      ) {
        setCurrent(3);
      }

      if (handlePayment?.status === HandlePaymentStatus.completed) {
        openNotification({
          type: "success",
          message: "Thành công",
          description: `${
            handlePayment?.payMethod?.id === 1
              ? methodTitle
              : handlePayment?.payMethod?.id === 2
                ? atmTitle
                : handlePayment?.payMethod?.id === 3
                  ? visMasterJcbTitle
                  : handlePayment?.payMethod?.id === 4
                    ? momoTitle
                    : handlePayment?.payMethod?.id === 5
                      ? zalopayTitle
                      : vnpayTitle
          } thành công. Xin khách hàng dành ra ít phút để đánh giá.`,
        });

        return;
      }

      let newCurrentOrderSheetDetails: OrderSheetDetailType[] = [];
      const tempCurrentOrderSheetDetails: OrderSheetDetailType[] =
        handlePayment?.useTable?.orderSheets
          ?.filter(
            (orderSheet) => orderSheet!.status! === OrderSheetStatus.serviced,
          )
          ?.flatMap((orderSheet) => orderSheet.orderSheetDetails || []) || [];

      tempCurrentOrderSheetDetails?.forEach((tempOrderSheetDetail) => {
        let isExists = false;
        for (let i = 0; i < newCurrentOrderSheetDetails.length; i++) {
          if (
            tempOrderSheetDetail.food?.id ===
            newCurrentOrderSheetDetails[i].food?.id
          ) {
            newCurrentOrderSheetDetails[i].quantity +=
              tempOrderSheetDetail.quantity;
            isExists = true;
          }
        }

        if (!isExists) {
          newCurrentOrderSheetDetails.push({
            ...tempOrderSheetDetail,
          });
        }
      });

      // Danh sách món ăn (Đã phục vụ)
      setCurrentOrderSheetDetails(newCurrentOrderSheetDetails);
      // Tổng tiền món ăn
      setCurrentTotalFoodPrice(
        newCurrentOrderSheetDetails?.reduce(
          (total, detail) => total + detail.price * detail.quantity,
          0,
        ),
      );
    } else {
      setCurrentOrderSheetDetails([]);
    }
  }, [handlePayment]);
  useEffect(() => {
    if (currentTotalFoodPrice > 0) {
      // Phí loại bàn ăn
      if (
        handlePayment?.useTable?.table?.categoryTable?.surchargeType ===
        CategoryTableSurchargeType.percent
      ) {
        setCurrentCategoryTableSurcharge(
          (currentTotalFoodPrice *
            (handlePayment?.useTable?.table?.categoryTable?.surchargeValue ||
              0)) /
            100,
        );
      } else {
        setCurrentCategoryTableSurcharge(
          handlePayment?.useTable?.table?.categoryTable?.surchargeValue || 0,
        );
      }

      // // Giảm giá khách hàng
      // setCurrentCustomerDiscount(
      //   (currentTotalFoodPrice *
      //     (handlePayment?.useTable?.customer?.customerCard?.discount || 0)) /
      //     100
      // );
    }
  }, [currentTotalFoodPrice]);
  // useEffect(() => {
  //   setCurrentTotalPrice(
  //     currentTotalFoodPrice +
  //       currentCategoryTableSurcharge +
  //       -1 * currentCustomerDiscount
  //   );
  // }, [
  //   currentTotalFoodPrice,
  //   currentCustomerDiscount,
  //   currentCategoryTableSurcharge,
  // ]);
  //
  useEffect(() => {
    if (current === 0) {
      // bắn pháo giấy khi vào trang
      const duration = 3 * 1000; // 3 giây
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();

      confetti({
        particleCount: 500,
        spread: 200, // tản rộng
        ticks: 200, // rơi lâu hơn
        origin: { y: 0.1 }, // vị trí ngay phía trên
      });
    }
  }, [handlePayment]);
  useEffect(() => {
    if (
      experienceValue === "Tuyệt vời" &&
      score01Value === 5 &&
      score01Value === score02Value &&
      score01Value === score03Value &&
      score01Value === score04Value &&
      score01Value === score05Value
    ) {
      var defaults = {
        spread: 400,
        ticks: 200,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
      };

      function shoot() {
        confetti({
          ...defaults,
          particleCount: 40,
          scalar: 1.2,
          shapes: ["star"],
        });

        confetti({
          ...defaults,
          particleCount: 10,
          scalar: 0.75,
          shapes: ["circle"],
        });
      }

      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      setTimeout(shoot, 200);
    }
  }, [
    experienceValue,
    score01Value,
    score02Value,
    score03Value,
    score04Value,
    score05Value,
  ]);

  return (
    <>
      {/* {isLoading && <CustomSpinner />} */}
      {current !== 3 &&
      handlePayment &&
      handlePayment?.status !== HandlePaymentStatus.nothing ? (
        <>
          <div className="public__main">
            <div className="public__main-header">
              <img
                src={ImageSourcePath + "brand-image.png"}
                alt=""
                className="public__main-logo"
              />
              <h1 className="public__main-title">Thanh toán hoá đơn</h1>
            </div>
            <Steps current={current} items={items} />
            {current === 0 &&
              (handlePayment?.status === HandlePaymentStatus.exists ||
                handlePayment?.status === HandlePaymentStatus.pending) && (
                <PaymentInfo
                  handlePayment={handlePayment}
                  orderSheetDetails={currentOrderSheetDetails}
                  totalFoodPrice={currentTotalFoodPrice}
                  categoryTableSurcharge={currentCategoryTableSurcharge}
                  customerDiscount={currentCustomerDiscount}
                />
              )}
            {current === 1 &&
              (handlePayment?.status === HandlePaymentStatus.pending ||
                handlePayment?.status === HandlePaymentStatus.exists ||
                handlePayment?.status === HandlePaymentStatus.selected) && (
                <>
                  {handlePayment?.status !== HandlePaymentStatus.selected ? (
                    <PaymentMethods
                      nameEN={nameEN}
                      handlePayment={handlePayment}
                      totalFoodPrice={currentTotalFoodPrice}
                      categoryTableSurcharge={currentCategoryTableSurcharge}
                      customerDiscount={currentCustomerDiscount}
                      methodTitle={methodTitle}
                      updateMethodInfo={updateMethodInfo}
                      updatePayInfo={updatePayInfo}
                    />
                  ) : (
                    <PaymentPay
                      nameEN={nameEN}
                      handlePayment={handlePayment}
                      methodTitle={methodTitle}
                      methodImage={methodImage}
                      payId={payId}
                      payLogo={payLogo}
                      payQRCodeUrl={payQRCodeUrl}
                      payResponseTime={payResponseTime}
                      payTotalPrice={payTotalPrice}
                      updateMethodInfo={updateMethodInfo}
                      updatePayInfo={updatePayInfo}
                    />
                  )}
                </>
              )}
            {current === 2 &&
              handlePayment?.status === HandlePaymentStatus.completed && (
                <PaymentResult
                  score01Value={score01Value}
                  score02Value={score02Value}
                  score03Value={score03Value}
                  score04Value={score04Value}
                  score05Value={score05Value}
                  commentValue={commentValue}
                  setScore01Value={setScore01Value}
                  setScore02Value={setScore02Value}
                  setScore03Value={setScore03Value}
                  setScore04Value={setScore04Value}
                  setScore05Value={setScore05Value}
                  setCommentValue={setCommentValue}
                  handleClickExperienceButtons={handleClickExperienceButtons}
                />
              )}
            <div className="public__main-buttons">
              {current === 0 &&
                (handlePayment?.status === HandlePaymentStatus.pending ||
                  handlePayment?.status === HandlePaymentStatus.exists) && (
                  <button className="btn right" onClick={() => next()}>
                    Tiếp tục
                  </button>
                )}
              {current === 1 &&
                (handlePayment?.status === HandlePaymentStatus.pending ||
                  handlePayment?.status === HandlePaymentStatus.exists) && (
                  <button className="btn" onClick={() => prev()}>
                    Quay lại
                  </button>
                )}
              {current === 1 &&
                handlePayment?.status === HandlePaymentStatus.selected && (
                  <button
                    ref={changePayMethodButtonRef}
                    className="btn"
                    onClick={async () => {
                      if (!changePayMethodButtonRef.current) return;

                      changePayMethodButtonRef.current.classList.add("active");

                      const answer = await openConfirmation({
                        title: `Đổi phương thức hiện tại ?`,
                        content: `Bạn có chắc muốn đổi phương thức này ? Sau khi đổi, bạn có thể chọn phương thức thanh toán khác để hoàn tất đơn hàng.`,
                      });
                      if (answer) {
                        const response =
                          await changePayMethodMutation.mutateAsync({
                            values: {
                              id: handlePayment?.id,
                              useTableId: handlePayment?.useTable?.id,
                              payMethodId: undefined,
                              isEmployeeHandle: true,
                              isHandling: true,
                              status: HandlePaymentStatus.pending,
                            },
                          });
                        if (response) {
                          updateMethodInfo!("", "", null);
                          updatePayInfo!("", "", "", 0, 0);
                        }
                      }

                      changePayMethodButtonRef.current.classList.remove(
                        "active",
                      );
                    }}
                  >
                    Đổi phương thức
                  </button>
                )}
              {current == 2 &&
                handlePayment?.status === HandlePaymentStatus.completed && (
                  <button
                    ref={completedPaymentButtonRef}
                    className="btn center"
                    onClick={async () => {
                      if (!completedPaymentButtonRef.current) return;

                      completedPaymentButtonRef.current.classList.add("active");

                      const answer = await openConfirmation({
                        title: `Hoàn tất việc đánh giá ?`,
                        content: `Nếu khách hàng hài lòng về đánh giá của mình thì hãy hoàn tất nhé !`,
                      });
                      if (answer) {
                        if (!experienceValue) {
                          openNotification({
                            type: "warning",
                            message: "Cảnh báo",
                            description:
                              "Xin vui lòng khách hàng hãy phản hồi mục trải nghiệm!",
                          });

                          return;
                        }
                        if (!score01Value) {
                          openNotification({
                            type: "warning",
                            message: "Cảnh báo",
                            description:
                              "Xin vui lòng khách hàng hãy phản hồi mục chất lượng món ăn!",
                          });

                          return;
                        }
                        if (!score02Value) {
                          openNotification({
                            type: "warning",
                            message: "Cảnh báo",
                            description:
                              "Xin vui lòng khách hàng hãy phản hồi mục tốc độ phục vụ!",
                          });

                          return;
                        }
                        if (!score03Value) {
                          openNotification({
                            type: "warning",
                            message: "Cảnh báo",
                            description:
                              "Xin vui lòng khách hàng hãy phản hồi mục thái độ nhân viên!",
                          });

                          return;
                        }
                        if (!score04Value) {
                          openNotification({
                            type: "warning",
                            message: "Cảnh báo",
                            description:
                              "Xin vui lòng khách hàng hãy phản hồi mục dịch vụ mang lại!",
                          });

                          return;
                        }
                        if (!score05Value) {
                          openNotification({
                            type: "warning",
                            message: "Cảnh báo",
                            description:
                              "Xin vui lòng khách hàng hãy phản hồi mục không gian và vệ sinh!",
                          });

                          return;
                        }
                        if (!commentValue) {
                          openNotification({
                            type: "warning",
                            message: "Cảnh báo",
                            description:
                              "Xin vui lòng khách hàng hãy góp ý cửa hàng!",
                          });

                          return;
                        }

                        const response =
                          await completePaymentMutation.mutateAsync({
                            values: {
                              id: handlePayment?.id,
                              useTableId: handlePayment?.useTable?.id,
                              employeeId: handlePayment?.employee?.id,
                              isEmployeeHandle: true,
                              isHandling: false,
                              payMethodId: handlePayment?.payMethod?.id,
                              payTotalPrice: handlePayment?.payTotalPrice,
                              status: HandlePaymentStatus.feedback,
                            },
                          });
                        if (response) {
                          setExperienceValue("");
                          setScore01Value(0);
                          setScore02Value(0);
                          setScore03Value(0);
                          setScore04Value(0);
                          setScore05Value(0);
                          setCommentValue("");
                          updateMethodInfo("", "", null);
                          updatePayInfo("", "", "", 0, 0);
                        }
                      }

                      completedPaymentButtonRef.current.classList.remove(
                        "active",
                      );
                    }}
                  >
                    Hoàn tất
                  </button>
                )}
            </div>
          </div>
        </>
      ) : (
        <PaymentInform />
      )}
    </>
  );
};

export default PaymentPage;
