import { useEffect, useRef, useState } from "react";
import {
  GetHandlePaymentFormatByUseTableId,
  HandleCancelMomoOrder,
  HandleCreateMomoOrder,
  HandleCreateZalopayOrder,
  HandleUpdateHandlePayment,
} from "../../services/api";
import { ConfigProvider, QRCode, Rate, Steps } from "antd";
import confetti from "canvas-confetti";
import CustomSpinner from "../../components/common/spinner";
import CountdownTimer from "../../components/admin-manager/count-down-timer";
import CurrentDateTime from "../../components/admin-manager/current-datetime";
import { openConfirmation } from "../../utils/showConfirmation";
import { openNotification } from "../../utils/showNotification";
import { vietnamMoneyFormat } from "../../utils/otherEvents";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  HandlePaymentsFormatType,
  OrderSheetDetailsFormatType,
} from "../../common/types";
import {
  HandlePaymentStatus,
  OrderSheetStatus,
  SurchargeCategoryTable,
} from "../../common/values";
import { getVietnamCurrentDate } from "../../services/dayjs";

// Giá trị chung
// - ...
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
// - Chuỗi truy hình ảnh
const getImagePrefix = "/src/assets/images/others/";
// - Các icon khác
const checkedIcon = "checked-icon.png";
const billCheckedIcon = "bill-checked-icon.png";
// const billUncheckedIcon = "bill-unchecked-icon.png";
// const rateIcon = "rate-icon.png";
const terribleEmotion = "terrible-emotion.png";
const poorEmotion = "poor-emotion.png";
const okayEmotion = "okay-emotion.png";
const goodEmotion = "good-emotion.png";
const perfectEmotion = "perfect-emotion.png";
// - Thông tin tài khoản ngân hàng
const atmBank = "MB Bank";
const atmIdCard = "0123456789000000";
const atmFullname = "TRAN THANH QUY";
const atmQRCodeUrl = "123123123";
const mbbankLogo = "mbbank-logo.png";
// - Hình ảnh phương thức
const moneyImage = "money-image.png";
const savingImage = "saving-image.png";
const atmLogo = "atm-logo.png";
const visaMasterJcbLogo = "visa-master-jcb-logo.png";
const momoLogo = "momo-logo.png";
const zalopayLogo = "zalopay-logo.png";
const vnpayLogo = "vnpay-logo.png";
// - Tiêu đề phương thức
const moneyTitle = "Thanh toán bằng tiền mặt";
const atmTitle = "Thanh toán bằng ngân hàng";
const visMasterJcbTitle = "Thanh toán bằng Visa/Master/JCB";
const momoTitle = "Thanh toán bằng ví MoMo";
const zalopayTitle = "Thanh toán bằng ví ZaloPay";
const vnpayTitle = "Thanh toán bằng ví VNPay";

const PaymentPage = () => {
  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Truy vấn dữ liệu Xử lý thanh toán
  const { data: handlePayment } = useQuery({
    queryKey: ["handle-payment"],
    queryFn: async () => {
      const res = await GetHandlePaymentFormatByUseTableId(
        JSON.parse(localStorage.getItem("current-use-table-id") || "") || 0
      );
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

  // Danh sách chi tiết phiếu gọi món
  const [currentOrderSheetDetails, setCurrentOrderSheetDetails] = useState<
    OrderSheetDetailsFormatType[]
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

  // Các biến giữ trạng thái spinner
  const [isShowSpinner, setIsShowSpinner] = useState<boolean>(false);
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
  const moneyButtonRef = useRef<HTMLButtonElement>(null);
  const atmButtonRef = useRef<HTMLButtonElement>(null);
  const momoButtonRef = useRef<HTMLButtonElement>(null);
  const zalopayButtonRef = useRef<HTMLButtonElement>(null);
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

  // Sự kiện cập nhật thông tin phương thức / thanh toán
  const updateMethodInfo = (image: string, title: string, data: any) => {
    setMethodImage(image);
    setMethodTitle(title);
    setMethodData(data);
  };
  const updatePayInfo = (
    id: string,
    logo: string,
    qrCodeUrl: string,
    responseTime: number,
    totalPrice: number
  ) => {
    setPayId(id);
    setPayLogo(logo);
    setPayQRCodeUrl(qrCodeUrl);
    setPayResponseTime(responseTime);
    setPayTotalPrice(totalPrice);
  };

  // Hàm xử lý khi nhấn nút trải nghiệm
  const handleClickExperienceButtons = (
    button: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    document
      .querySelector(".public__main-result-group .emotion.active")
      ?.classList.remove("active");

    button.currentTarget.classList.toggle("active");

    setExperienceValue(button.currentTarget.textContent);
  };

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
          duration: 1.5,
        });

        return;
      }

      let newCurrentOrderSheetDetails: OrderSheetDetailsFormatType[] = [];
      const tempCurrentOrderSheetDetails: OrderSheetDetailsFormatType[] =
        handlePayment?.useTable?.orderSheets
          ?.filter(
            (orderSheet) => orderSheet!.status! === OrderSheetStatus.serviced
          )
          ?.flatMap((orderSheet) => orderSheet.orderSheetDetails || []) || [];

      tempCurrentOrderSheetDetails?.forEach((tempOrderSheetDetail) => {
        let isExists = false;
        for (let i = 0; i < newCurrentOrderSheetDetails.length; i++) {
          if (
            tempOrderSheetDetail.food.id ===
            newCurrentOrderSheetDetails[i].food.id
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
          0
        )
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
        SurchargeCategoryTable.percent
      ) {
        setCurrentCategoryTableSurcharge(
          (currentTotalFoodPrice *
            (handlePayment?.useTable?.table?.categoryTable?.surchargeValue ||
              0)) /
            100
        );
      } else {
        setCurrentCategoryTableSurcharge(
          handlePayment?.useTable?.table?.categoryTable?.surchargeValue || 0
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
      {isShowSpinner && <CustomSpinner />}
      {current !== 3 &&
      handlePayment &&
      handlePayment?.status !== HandlePaymentStatus.nothing ? (
        <>
          <div className="public__main">
            <div className="public__main-header">
              <img
                src={getImagePrefix + "brand-image.png"}
                alt=""
                className="public__main-logo"
              />
              <h1 className="public__main-title">Thanh toán hoá đơn</h1>
            </div>
            <Steps current={current} items={items} />
            {current === 0 &&
              (handlePayment?.status === HandlePaymentStatus.exists ||
                handlePayment?.status === HandlePaymentStatus.pending) && (
                <>
                  <div className="public__main-info">
                    <div className="public__main-info-list-warper">
                      <table className="public__main-info-list">
                        <colgroup>
                          <col width="40%" />
                          <col width="10%" />
                          <col width="15%" />
                          <col width="15%" />
                          <col width="20%" />
                        </colgroup>
                        <thead>
                          <tr>
                            <th>Tên món ăn</th>
                            <th>Đơn vị</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentOrderSheetDetails?.map(
                            (orderSheet, index) => (
                              <tr key={index}>
                                <td>{orderSheet.food.name}</td>
                                <td>{orderSheet.food.unit}</td>
                                <td>{vietnamMoneyFormat(orderSheet.price)}</td>
                                <td>{orderSheet.quantity}</td>
                                <td>
                                  {vietnamMoneyFormat(
                                    orderSheet.price * orderSheet.quantity
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="public__main-info-payment-group">
                      <div className="public__main-info-payment">
                        <h2>Khách hàng</h2>
                        <p>
                          <span>Họ và tên:</span>
                          <b>{handlePayment?.useTable?.customer?.fullname}</b>
                        </p>
                        <p>
                          <span>Số điện thoại:</span>
                          <b>{handlePayment?.useTable?.customer?.phone}</b>
                        </p>
                        <p>
                          {/* <span>Thẻ khách hàng:</span>
                          <b>
                            {
                              handlePayment?.useTable?.customer?.customerCard
                                ?.name
                            }{" "}
                            (Giảm{" "}
                            {
                              handlePayment?.useTable?.customer?.customerCard
                                ?.discount
                            }
                            %)
                          </b> */}
                        </p>
                      </div>
                      <div className="public__main-info-payment">
                        <h2>Bàn ăn</h2>
                        <p>
                          <span>Tên bàn ăn:</span>
                          <b>{handlePayment?.useTable?.table?.name}</b>
                        </p>
                        <p>
                          <span>Loại bàn ăn:</span>
                          <b>
                            {
                              handlePayment?.useTable?.table?.categoryTable
                                ?.name
                            }{" "}
                            (Thu{" "}
                            {handlePayment?.useTable?.table?.categoryTable
                              ?.surchargeType === SurchargeCategoryTable.percent
                              ? (handlePayment?.useTable?.table?.categoryTable
                                  ?.surchargeValue || 0) + "%"
                              : (handlePayment?.useTable?.table?.categoryTable
                                  ?.surchargeValue || 0) + "đ"}
                            )
                            {/* {handlePayment?.useTable?.table?.categoryTable
                              ?.surchargeType ===
                              SurchargeCategoryTable.fixed && <u>đ</u>}
                            ) */}
                          </b>
                        </p>
                        <p>
                          <span>Tầng:</span>
                          <b>{handlePayment?.useTable?.table?.floor?.name}</b>
                        </p>
                      </div>
                      <div className="public__main-info-payment">
                        <h2>Hoá đơn</h2>
                        <p>
                          <span>Tổng tiền món ăn:</span>
                          <b>
                            {vietnamMoneyFormat(currentTotalFoodPrice)}
                            <u>đ</u>
                          </b>
                        </p>
                        <p>
                          <span>Giảm giá khách hàng:</span>
                          <b>
                            {vietnamMoneyFormat(-1 * currentCustomerDiscount)}
                            <u>đ</u>
                          </b>
                        </p>
                        <p>
                          <span>Phụ thu loại bàn:</span>
                          <b>
                            {vietnamMoneyFormat(currentCategoryTableSurcharge)}
                            <u>đ</u>
                          </b>
                        </p>
                        <div className="public__main-info-payment-line"></div>
                        <p className="total-price">
                          <span>Tổng tiền thanh toán:</span>
                          <b>
                            {vietnamMoneyFormat(
                              Math.round(
                                currentTotalFoodPrice +
                                  currentCategoryTableSurcharge +
                                  -1 * currentCustomerDiscount
                              )
                            )}
                            <u>đ</u>
                          </b>
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            {current === 1 &&
              (handlePayment?.status === HandlePaymentStatus.exists ||
                handlePayment?.status === HandlePaymentStatus.pending ||
                handlePayment?.status === HandlePaymentStatus.selected) && (
                <>
                  {handlePayment?.status === HandlePaymentStatus.selected ? (
                    <>
                      <div className="public__main-pay">
                        <div className="public__main-pay-header">
                          <img
                            src={getImagePrefix + methodImage}
                            alt="pay-image"
                            className="public__main-pay-image"
                          />
                          <h2 className="public__main-pay-title">
                            {methodTitle}
                          </h2>
                        </div>
                        <div className="public__main-pay-body">
                          <div className="public__main-pay-info">
                            {methodImage === atmLogo &&
                              methodTitle === atmTitle && (
                                <>
                                  <p>
                                    <span>Ngân hàng: </span>
                                    <b>{atmBank}</b>
                                  </p>
                                  <p>
                                    <span>Số tài khoản: </span>
                                    <b>{atmIdCard}</b>
                                  </p>
                                  <p>
                                    <span>Họ và tên: </span>
                                    <b>{atmFullname}</b>
                                  </p>
                                </>
                              )}
                            {((methodImage === momoLogo &&
                              methodTitle === momoTitle) ||
                              (methodImage === zalopayLogo &&
                                methodTitle === zalopayTitle)) && (
                              <p>
                                <span>Mã giao dịch: </span>
                                <b>{payId}</b>
                              </p>
                            )}
                            <p>
                              <span>Thời gian thanh toán: </span>
                              <b>
                                <CurrentDateTime />
                              </b>
                            </p>
                            {((methodImage === momoLogo &&
                              methodTitle === momoTitle) ||
                              (methodImage === zalopayLogo &&
                                methodTitle === zalopayTitle)) && (
                              <p>
                                <span>Thời hạn thanh toán: </span>
                                <b>
                                  <CountdownTimer
                                    timeMs={
                                      payResponseTime +
                                      1000 * 60 * 5 -
                                      Date.now()
                                    }
                                    onFinish={async () => {
                                      setIsShowSpinner(true);

                                      if (
                                        methodImage === momoLogo &&
                                        methodTitle === momoTitle
                                      ) {
                                        const momoResponse =
                                          await HandleCancelMomoOrder({
                                            orderId: payId,
                                            amount: String(payTotalPrice),
                                          });
                                        // const momoData = momoResponse!
                                        //   .data as any;
                                      }

                                      const handlePaymentData =
                                        await HandleUpdateHandlePayment({
                                          id: handlePayment?.id,
                                          useTableId:
                                            handlePayment?.useTable?.id,
                                          payMethodId: undefined,
                                          status: HandlePaymentStatus.pending,
                                        });

                                      if (handlePaymentData) {
                                        setIsShowSpinner(false);

                                        openNotification({
                                          type: "error",
                                          message: "Thất bại",
                                          description:
                                            "Thanh toán hiện tại bị huỷ vì quá hạn thời gian thanh toán cho phép! Chuyển về trang chọn phương thức thanh toán!",
                                          duration: 2,
                                        });

                                        updateMethodInfo("", "", null);
                                        updatePayInfo("", "", "", 0, 0);
                                      }
                                    }}
                                  />
                                </b>
                              </p>
                            )}
                            <p>
                              <span>Tổng thanh toán: </span>
                              <b>{vietnamMoneyFormat(payTotalPrice)} VNĐ</b>
                            </p>
                            {payQRCodeUrl && (
                              <QRCode
                                className="qr-code"
                                errorLevel="H"
                                value={payQRCodeUrl}
                                icon={getImagePrefix + payLogo}
                              />
                            )}
                            {methodImage === moneyImage &&
                              methodTitle === moneyTitle && (
                                <img
                                  src={getImagePrefix + savingImage}
                                  alt="saving-image"
                                />
                              )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="public__main-methods">
                        <button
                          ref={moneyButtonRef}
                          className="public__main-method"
                          onClick={async () => {
                            if (!moneyButtonRef.current) return;

                            moneyButtonRef.current.classList.add("active");

                            const answer = await openConfirmation({
                              title: `Thanh toán phương thức này ?`,
                              content: `Bạn sắp chọn phương thức thanh toán "${moneyTitle}" để thanh toán hoá đơn.`,
                            });

                            if (moneyButtonRef.current) {
                              if (answer) {
                                setIsShowSpinner(true);

                                const data = await HandleUpdateHandlePayment({
                                  id: handlePayment?.id,
                                  useTableId: handlePayment?.useTable?.id,
                                  payMethodId: 1,
                                  status: HandlePaymentStatus.selected,
                                });
                                if (data.status === 200) {
                                  setIsShowSpinner(false);

                                  openNotification({
                                    type: "success",
                                    message: "Thành công",
                                    description:
                                      "Chuyển đến giao diện " +
                                      moneyTitle +
                                      "!",
                                    duration: 1.5,
                                  });

                                  updateMethodInfo(
                                    moneyImage,
                                    moneyTitle,
                                    null
                                  );
                                  updatePayInfo(
                                    "Lưu trữ nội bộ",
                                    "",
                                    "",
                                    Date.now(),
                                    currentTotalFoodPrice +
                                      -1 * currentCustomerDiscount +
                                      currentCategoryTableSurcharge
                                  );

                                  queryClient.invalidateQueries({
                                    queryKey: ["handle-payment"],
                                  });
                                }
                              }
                            }

                            moneyButtonRef.current.classList.remove("active");
                          }}
                        >
                          <img
                            src={getImagePrefix + moneyImage}
                            alt="money-image"
                          />
                          <p>{moneyTitle}</p>
                        </button>
                        <button
                          ref={momoButtonRef}
                          className="public__main-method"
                          onClick={async () => {
                            if (!momoButtonRef.current) return;

                            momoButtonRef.current.classList.add("active");

                            const answer = await openConfirmation({
                              title: `Thanh toán phương thức này ?`,
                              content: `Bạn sắp chọn phương thức thanh toán "${momoTitle}" để thanh toán hoá đơn.`,
                            });

                            if (momoButtonRef.current) {
                              if (answer) {
                                setIsShowSpinner(true);

                                const handlePaymentData =
                                  await HandleUpdateHandlePayment({
                                    id: handlePayment?.id,
                                    useTableId: handlePayment?.useTable?.id,
                                    payMethodId: 4,
                                    payTotalPrice: Math.round(
                                      currentTotalFoodPrice +
                                        currentCategoryTableSurcharge +
                                        -1 * currentCustomerDiscount
                                    ),
                                    status: HandlePaymentStatus.selected,
                                  });

                                if (handlePaymentData) {
                                  const momoResponse =
                                    await HandleCreateMomoOrder(
                                      handlePayment?.id!
                                    );
                                  const momoData = momoResponse.data as any;

                                  if (momoData) {
                                    console.log(momoData);
                                    setIsShowSpinner(false);

                                    openNotification({
                                      type: "success",
                                      message: "Thành công",
                                      description:
                                        "Chuyển đến giao diện " +
                                        momoTitle +
                                        "!",
                                      duration: 1.5,
                                    });

                                    updateMethodInfo(
                                      momoLogo,
                                      momoTitle,
                                      momoData || null
                                    );
                                    updatePayInfo(
                                      momoData.orderId,
                                      momoLogo,
                                      momoData.qrCodeUrl,
                                      momoData.responseTime,
                                      momoData.amount
                                    );

                                    queryClient.invalidateQueries({
                                      queryKey: ["handle-payment"],
                                    });
                                  }
                                }
                              }
                              momoButtonRef.current.classList.remove("active");
                            }
                          }}
                        >
                          <img
                            src={getImagePrefix + momoLogo}
                            alt="momo-logo"
                          />
                          <p>{momoTitle}</p>
                        </button>
                        <button
                          ref={atmButtonRef}
                          className="public__main-method"
                          onClick={async () => {
                            if (!atmButtonRef.current) return;

                            atmButtonRef.current.classList.add("active");

                            const answer = await openConfirmation({
                              title: `Thanh toán phương thức này ?`,
                              content: `Bạn sắp chọn phương thức thanh toán "${moneyTitle}" để thanh toán hoá đơn.`,
                            });

                            if (atmButtonRef.current) {
                              if (answer) {
                                setIsShowSpinner(true);

                                const data = await HandleUpdateHandlePayment({
                                  id: handlePayment?.id,
                                  useTableId: handlePayment?.useTable?.id,
                                  payMethodId: 2,
                                  status: HandlePaymentStatus.selected,
                                });
                                if (data.status === 200) {
                                  setIsShowSpinner(false);

                                  openNotification({
                                    type: "success",
                                    message: "Thành công",
                                    description:
                                      "Chuyển đến giao diện " + atmTitle + "!",
                                    duration: 1.5,
                                  });

                                  updateMethodInfo(atmLogo, atmTitle, "");
                                  updatePayInfo(
                                    "Lưu trữ nội bộ",
                                    mbbankLogo,
                                    atmQRCodeUrl,
                                    Date.now(),
                                    currentTotalFoodPrice +
                                      -1 * currentCustomerDiscount +
                                      currentCategoryTableSurcharge
                                  );

                                  queryClient.invalidateQueries({
                                    queryKey: ["handle-payment"],
                                  });
                                }
                              }
                            }

                            atmButtonRef.current.classList.remove("active");
                          }}
                        >
                          <img src={getImagePrefix + atmLogo} alt="atm-logo" />
                          <p>{atmTitle}</p>
                        </button>
                        <button
                          ref={zalopayButtonRef}
                          className="public__main-method"
                          onClick={async () => {
                            if (!zalopayButtonRef.current) return;

                            zalopayButtonRef.current.classList.add("active");

                            const answer = await openConfirmation({
                              title: `Thanh toán phương thức này ?`,
                              content: `Bạn sắp chọn phương thức thanh toán "${zalopayTitle}" để thanh toán hoá đơn.`,
                            });

                            if (zalopayButtonRef.current) {
                              if (answer) {
                                setIsShowSpinner(true);

                                const handlePaymentData =
                                  await HandleUpdateHandlePayment({
                                    id: handlePayment?.id,
                                    useTableId: handlePayment?.useTable?.id,
                                    payMethodId: 5,
                                    payTotalPrice: Math.round(
                                      currentTotalFoodPrice +
                                        currentCategoryTableSurcharge +
                                        -1 * currentCustomerDiscount
                                    ),
                                    status: HandlePaymentStatus.selected,
                                  });

                                if (handlePaymentData) {
                                  const zalopayResponse =
                                    await HandleCreateZalopayOrder(
                                      handlePayment?.id!
                                    );
                                  const zalopayData =
                                    zalopayResponse.data as any;

                                  if (zalopayData) {
                                    // console.log(zalopayData);
                                    setIsShowSpinner(false);

                                    openNotification({
                                      type: "success",
                                      message: "Thành công",
                                      description:
                                        "Chuyển đến giao diện " +
                                        zalopayTitle +
                                        "!",
                                      duration: 1.5,
                                    });

                                    updateMethodInfo(
                                      zalopayLogo,
                                      zalopayTitle,
                                      zalopayData || null
                                    );
                                    updatePayInfo(
                                      zalopayData.app_trans_id,
                                      zalopayLogo,
                                      zalopayData.order_url,
                                      zalopayData.app_time,
                                      zalopayData.amount
                                    );

                                    queryClient.invalidateQueries({
                                      queryKey: ["handle-payment"],
                                    });
                                  }
                                }
                              }
                              zalopayButtonRef.current.classList.remove(
                                "active"
                              );
                            }
                          }}
                        >
                          <img
                            src={getImagePrefix + zalopayLogo}
                            alt="zalopay-logo"
                          />
                          <p>{zalopayTitle}</p>
                        </button>
                        <button className="public__main-method disabled">
                          <img
                            src={getImagePrefix + visaMasterJcbLogo}
                            alt="visa-master-jcb-logo"
                          />
                          <p>{visMasterJcbTitle}</p>
                        </button>
                        <button className="public__main-method disabled">
                          <img
                            src={getImagePrefix + vnpayLogo}
                            alt="vnpay-logo"
                          />
                          <p>{vnpayTitle}</p>
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            {current === 2 &&
              handlePayment?.status === HandlePaymentStatus.completed && (
                <>
                  <div className="public__main-result">
                    <div className="public__main-result-inform">
                      <img
                        src={getImagePrefix + billCheckedIcon}
                        alt="bill-checked-icon"
                      />
                      <div className="message-box">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Thanh toán hoá đơn thành công !</span>
                      </div>
                    </div>
                    <div className="public__main-result-rate">
                      <div className="public__main-result-group-warper">
                        <div className="public__main-result-group">
                          <h3 className="sub-title">Trải nghiệm</h3>
                          <div className="emotions">
                            <button
                              className="emotion"
                              onClick={(e) => handleClickExperienceButtons(e)}
                            >
                              <img
                                src={getImagePrefix + terribleEmotion}
                                alt="terrible-emotion"
                              />
                              <p>Dở tệ</p>
                            </button>
                            <button
                              className="emotion"
                              onClick={(e) => handleClickExperienceButtons(e)}
                            >
                              <img
                                src={getImagePrefix + poorEmotion}
                                alt="poor-emotion"
                              />
                              <p>Không hài lòng</p>
                            </button>
                            <button
                              className="emotion"
                              onClick={(e) => handleClickExperienceButtons(e)}
                            >
                              <img
                                src={getImagePrefix + okayEmotion}
                                alt="okay-emotion"
                              />
                              <p>Bình thường</p>
                            </button>
                            <button
                              className="emotion"
                              onClick={(e) => handleClickExperienceButtons(e)}
                            >
                              <img
                                src={getImagePrefix + goodEmotion}
                                alt="good-emotion"
                              />
                              <p>Hài lòng</p>
                            </button>
                            <button
                              className="emotion"
                              onClick={(e) => handleClickExperienceButtons(e)}
                            >
                              <img
                                src={getImagePrefix + perfectEmotion}
                                alt="perfect-emotion"
                              />
                              <p>Tuyệt vời</p>
                            </button>
                          </div>
                        </div>
                        <div className="public__main-result-group stars">
                          <h3 className="sub-title">Chất lượng món ăn</h3>
                          <Rate
                            value={score01Value}
                            onChange={(val) => setScore01Value(val)}
                          />
                        </div>
                        <div className="public__main-result-group stars">
                          <h3 className="sub-title">Tốc độ phục vụ</h3>
                          <Rate
                            value={score02Value}
                            onChange={(val) => setScore02Value(val)}
                          />
                        </div>
                        <div className="public__main-result-group stars">
                          <h3 className="sub-title">Thái độ nhân viên</h3>
                          <Rate
                            value={score03Value}
                            onChange={(val) => setScore03Value(val)}
                          />
                        </div>
                        <div className="public__main-result-group stars">
                          <h3 className="sub-title">Dịch vụ mang lại</h3>
                          <Rate
                            value={score04Value}
                            onChange={(val) => setScore04Value(val)}
                          />
                        </div>
                        <div className="public__main-result-group stars">
                          <h3 className="sub-title">Không gian và vệ sinh</h3>
                          <Rate
                            value={score05Value}
                            onChange={(val) => setScore05Value(val)}
                          />
                        </div>
                        <div className="public__main-result-group">
                          <h3 className="sub-title">Góp ý</h3>
                          <textarea
                            placeholder="Khách hàng hãy góp ý để giúp nhà hàng khắc phục và hoàn thiện hơn"
                            value={commentValue}
                            onChange={(e) =>
                              setCommentValue(e.currentTarget.value)
                            }
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            <div className="public__main-buttons">
              {current === 0 &&
                (handlePayment?.status === HandlePaymentStatus.exists ||
                  handlePayment?.status === HandlePaymentStatus.pending) && (
                  <>
                    <button
                      className="btn right"
                      onClick={() => {
                        setIsShowSpinner(true);

                        updateMethodInfo("", "", null);
                        updatePayInfo("", "", "", 0, 0);
                        next();

                        setIsShowSpinner(false);
                      }}
                    >
                      Tiếp tục
                    </button>
                  </>
                )}
              {current === 1 &&
                (handlePayment?.status === HandlePaymentStatus.exists ||
                  handlePayment?.status === HandlePaymentStatus.pending) && (
                  <button
                    className="btn"
                    onClick={() => {
                      setIsShowSpinner(true);

                      updateMethodInfo("", "", null);
                      updatePayInfo("", "", "", 0, 0);
                      prev();

                      setIsShowSpinner(false);
                    }}
                  >
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
                        const data = await HandleUpdateHandlePayment({
                          id: handlePayment?.id,
                          useTableId: handlePayment?.useTable?.id,
                          payMethodId: undefined,
                          status: HandlePaymentStatus.pending,
                        });
                        if (data.status === 200) {
                          openNotification({
                            type: "success",
                            message: "Thành công",
                            description:
                              "Chuyển về giao diện chọn phương thức thanh toán.",
                            duration: 1.5,
                          });

                          updateMethodInfo("", "", null);

                          updatePayInfo("", "", "", 0, 0);

                          queryClient.invalidateQueries({
                            queryKey: ["handle-payment"],
                          });
                        }
                      }

                      changePayMethodButtonRef.current.classList.remove(
                        "active"
                      );
                    }}
                  >
                    Đổi phương thức
                  </button>
                )}
              {current == 2 &&
                handlePayment?.status === HandlePaymentStatus.completed && (
                  <>
                    <button
                      ref={completedPaymentButtonRef}
                      className="btn center"
                      onClick={async () => {
                        if (!completedPaymentButtonRef.current) return;

                        completedPaymentButtonRef.current.classList.add(
                          "active"
                        );

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
                              duration: 1.5,
                            });

                            return;
                          }
                          if (!score01Value) {
                            openNotification({
                              type: "warning",
                              message: "Cảnh báo",
                              description:
                                "Xin vui lòng khách hàng hãy phản hồi mục chất lượng món ăn!",
                              duration: 1.5,
                            });

                            return;
                          }
                          if (!score02Value) {
                            openNotification({
                              type: "warning",
                              message: "Cảnh báo",
                              description:
                                "Xin vui lòng khách hàng hãy phản hồi mục tốc độ phục vụ!",
                              duration: 1.5,
                            });

                            return;
                          }
                          if (!score03Value) {
                            openNotification({
                              type: "warning",
                              message: "Cảnh báo",
                              description:
                                "Xin vui lòng khách hàng hãy phản hồi mục thái độ nhân viên!",
                              duration: 1.5,
                            });

                            return;
                          }
                          if (!score04Value) {
                            openNotification({
                              type: "warning",
                              message: "Cảnh báo",
                              description:
                                "Xin vui lòng khách hàng hãy phản hồi mục dịch vụ mang lại!",
                              duration: 1.5,
                            });

                            return;
                          }
                          if (!score05Value) {
                            openNotification({
                              type: "warning",
                              message: "Cảnh báo",
                              description:
                                "Xin vui lòng khách hàng hãy phản hồi mục không gian và vệ sinh!",
                              duration: 1.5,
                            });

                            return;
                          }
                          if (!commentValue) {
                            openNotification({
                              type: "warning",
                              message: "Cảnh báo",
                              description:
                                "Xin vui lòng khách hàng hãy góp ý cửa hàng!",
                              duration: 1.5,
                            });

                            return;
                          }

                          // setIsShowSpinner(true);

                          // const data = await HandleUpdateHandlePayment({
                          //   id: handlePayment?.id,
                          //   useTableId: handlePayment?.useTable?.id,
                          //   employeeId: handlePayment?.employee?.id,
                          //   payMethodId: handlePayment?.payMethod?.id,
                          //   payTotalPrice: handlePayment?.payTotalPrice,
                          //   status: HandlePaymentStatus.completed,
                          // });
                          // if (data.status === 200) {
                          //   setIsShowSpinner(false);

                          openNotification({
                            type: "success",
                            message: "Thành công",
                            description: "Hoàn tất thanh toán hoá đơn!",
                            duration: 1.5,
                          });

                          updateMethodInfo("", "", null);

                          updatePayInfo("", "", "", 0, 0);

                          setExperienceValue("");
                          setScore01Value(0);
                          setScore02Value(0);
                          setScore03Value(0);
                          setScore04Value(0);
                          setScore05Value(0);
                          setCommentValue("");

                          localStorage.setItem(
                            "current-use-table-id",
                            JSON.stringify(0)
                          );
                          queryClient.invalidateQueries({
                            queryKey: ["handle-payment"],
                          });

                          setTimeout(() => {
                            window.location.href = "/payment";
                          }, 1500);
                        }

                        completedPaymentButtonRef.current.classList.remove(
                          "active"
                        );
                      }}
                    >
                      Hoàn tất
                    </button>
                  </>
                )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="public__inform">
            <img src={getImagePrefix + checkedIcon} alt="" />
            <h1>Hoàn tất thanh toán hoá đơn !</h1>
            <p>
              Cảm ơn bạn đã thưởng thức món ăn cùng chúng tôi. Hẹn gặp lại bạn
              sớm !
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default PaymentPage;
