import useEntityQuery from "../../hooks/useEntityQuery2";
import useEntityMutation from "../../hooks/useEntityMutation";
import PaymentMachineInfoComponent from "../../components/pages/other/payment/PaymentMachineInfoComponent";
import PaymentMachineActionsComponent from "../../components/pages/other/payment/PaymentMachineActionsComponent";
import PaymentMachineMethodsComponent from "../../components/pages/other/payment/PaymentMachineMethodsComponent";
import PaymentMachineHandleComponent from "../../components/pages/other/payment/PaymentMachineHandleComponent";
import PaymentMachineResultComponent from "../../components/pages/other/payment/PaymentMachineResultComponent";
import PaymentMachineInformComponent from "../../components/pages/other/payment/PaymentMachineInformComponent";
import PaymentMachineApiService from "../../services/api/v1/PaymentMachineApiService";
import FeedbackExperienceApiService from "../../services/api/v1/FeedbackExperienceApiService";
import FeedbackScoreApiService from "../../services/api/v1/FeedbackScoreApiService";
import MoMoApiService from "../../services/api/v1/MoMoApiService";
import ZaloPayApiService from "../../services/api/v1/ZaloPayApiService";
import SockJS from "sockjs-client";
import confetti from "canvas-confetti";
import { useEffect, useRef, useState } from "react";
import { Steps } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import {
  ImageSourcePath,
  PaymentMachineProcessStatusValue,
  PaymentMachineStatusValue,
  PaymentMethodAtmInfoValue,
  PaymentMethodImageValue,
  PaymentMethodTitleValue,
} from "../../constants/values";
import { openNotification } from "../../utils/showNotificationUtil";
import { openConfirmation } from "../../utils/showConfirmationUtil";
import { over } from "stompjs";
import type { Client } from "stompjs";
import type {
  FeedbackExperienceEnum,
  PaymentMachineProcessStatusEnum,
  PaymentMachineStatusEnum,
} from "../../constants/enums";
import type { OpenPaymentMachineRequestType } from "../../types/SocketType";
import type {
  PaymentMachineDetailResponseType,
  PaymentMachineUpdateRequestType,
} from "../../types/PaymentMachineType";
import type { FeedbackExperienceCrudResponseType } from "../../types/FeedbackExperienceType";
import type { FeedbackScoreCrudResponseType } from "../../types/FeedbackScoreType";

// Giá trị chung
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
// -
const items = steps.map((item) => ({ key: item.title, title: item.title }));

const PaymentMachinePage: React.FC = () => {
  // Query Key
  const queryKey = "payment-machine";
  // Query Client
  const queryClient = useQueryClient();
  // Kết nối web socket chung
  const stompClientCommonRef = useRef<Client | null>(null);

  // Mã Thanh toán POS
  const [paymentMachineId, setPaymentMachineId] = useState<number>(0);
  // Truy vấn dữ liệu Thanh toán POS
  const { data: paymentMachineDetail } =
    useEntityQuery<PaymentMachineDetailResponseType>({
      keys: [queryKey],
      params: { id: paymentMachineId },
      api: PaymentMachineApiService.handleGetDetailById,
    });

  // Các biến giữ trạng thái step hiện tại
  const [current, setCurrent] = useState<number>(-1);
  // Các biến giữ thông tin liên quan về 1 phương thức được nhấn
  const [methodImage, setMethodImage] = useState<string>("");
  const [methodTitle, setMethodTitle] = useState<string>("");
  // const [methodData, setMethodData] = useState<any>(null);
  // Các biến giữ thông tin hiển thị khi thanh toán bằng 1 phương thức
  const [paymentId, setPaymentId] = useState<string>("");
  const [paymentLogo, setPaymentLogo] = useState<string>("");
  const [paymentQRCodeUrl, setPaymentQRCodeUrl] = useState<string>("");
  const [paymentResponseTime, setPaymentResponseTime] = useState<number>(0);
  const [paymentTotalPrice, setPaymentTotalPrice] = useState<number>(0);
  // Các biến giữ thông tin đánh giá phản hồi từ khách hàng
  const [experienceValue, setExperienceValue] = useState<string>("");
  const [score01Value, setScore01Value] = useState<number>(0);
  const [score02Value, setScore02Value] = useState<number>(0);
  const [score03Value, setScore03Value] = useState<number>(0);
  const [score04Value, setScore04Value] = useState<number>(0);
  const [score05Value, setScore05Value] = useState<number>(0);
  const [commentValue, setCommentValue] = useState<string>("");

  const feedbackQueriesEnabled =
    current === 2 &&
    paymentMachineDetail?.processStatus ===
      PaymentMachineProcessStatusValue.feedback;
  const { data: feedbackExperiences } =
    useEntityQuery<FeedbackExperienceCrudResponseType[]>({
      keys: ["feedback-experiences-crud"],
      enabled: feedbackQueriesEnabled,
      params: {},
      api: FeedbackExperienceApiService.handleGetCrud,
    });
  const { data: feedbackScores } =
    useEntityQuery<FeedbackScoreCrudResponseType[]>({
      keys: ["feedback-scores-crud"],
      enabled: feedbackQueriesEnabled,
      params: {},
      api: FeedbackScoreApiService.handleGetCrud,
    });

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
  const updateMethodInfo = ({
    image,
    title,
  }: {
    image: string;
    title: string;
  }) => {
    setMethodImage(image);
    setMethodTitle(title);
  };
  // Hàm cập nhật thông tn thanh toán
  const updatePaymentInfo = ({
    id,
    logo,
    qrCodeUrl,
    responseTime,
    totalPrice,
  }: {
    id: string;
    logo: string;
    qrCodeUrl: string;
    responseTime: number;
    totalPrice: number;
  }) => {
    setPaymentId(id);
    setPaymentLogo(logo);
    setPaymentQRCodeUrl(qrCodeUrl);
    setPaymentResponseTime(responseTime);
    setPaymentTotalPrice(totalPrice);
  };
  // Hàm xử lý khi nhấn nút trải nghiệm
  const handleClickExperienceButtons = (
    button: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    document
      .querySelector(".payment-machine__main-result-group .emotion.active")
      ?.classList.remove("active");

    button.currentTarget.classList.toggle("active");

    setExperienceValue(button.currentTarget.textContent ?? "");
  };
  // Thông báo: Khách hàng đổi phương thức thanh toán khác
  const handleSendPendingPaymentMachineInform = () => {
    const client = stompClientCommonRef?.current;
    if (!client || !client.connected) {
      console.warn("WebSocket chưa kết nối");
    } else {
      client.send("/app/pending-payment-machine", {}, undefined);
    }
  };
  // Thông báo: Khách hàng hoàn tất thanh toán hoá đơn
  const handleSendCompletedPaymentMachineInform = () => {
    const client = stompClientCommonRef?.current;
    if (!client || !client.connected) {
      console.warn("WebSocket chưa kết nối");
    } else {
      client.send("/app/completed-payment-machine", {}, undefined);
    }
  };

  // Mutation
  const updateMutation = useEntityMutation<
    PaymentMachineUpdateRequestType,
    PaymentMachineDetailResponseType
  >({
    messages: {
      success: `Cập nhật thông tin thanh toán POS thành công!`,
      error: `Cập nhật thông tin thanh toán POS thất bại!`,
    },
    invalidateKeys: [[queryKey]],
    api: PaymentMachineApiService.handleUpdate,
  });

  const handleSendSelectedPaymentMachineInform = () => {
    const client = stompClientCommonRef.current;
    if (!client || !client.connected) {
      console.warn("WebSocket chưa kết nối");
    } else {
      client.send("/app/selected-payment-machine", {}, undefined);
    }
  };

  const handleSelectPaymentMethod = async (
    method: "money" | "momo" | "atm" | "zalopay",
  ) => {
    if (!paymentMachineDetail) return;

    const methodTitle =
      method === "money"
        ? PaymentMethodTitleValue.moneyTitle
        : method === "momo"
          ? PaymentMethodTitleValue.moneyTitle
          : method === "atm"
            ? PaymentMethodTitleValue.atmTitle
            : PaymentMethodTitleValue.zalopayTitle;
    const answer = await openConfirmation({
      title: "Thanh toán phương thức này ?",
      content: `Bạn sắp chọn phương thức thanh toán "${methodTitle}" để thanh toán hoá đơn.`,
    });
    if (!answer) return;

    const methodIds = { money: 1, atm: 2, momo: 4, zalopay: 5 };
    const response = await updateMutation.mutateAsync({
      values: {
        id: paymentMachineDetail.id,
        paymentMethodId: methodIds[method],
        paymentTotalPrice: undefined,
        processStatus:
          PaymentMachineProcessStatusValue.selected as PaymentMachineProcessStatusEnum,
        status:
          PaymentMachineStatusValue.processing as PaymentMachineStatusEnum,
        feedbackExperience: undefined,
        feedbackScore1: undefined,
        feedbackScore2: undefined,
        feedbackScore3: undefined,
        feedbackScore4: undefined,
        feedbackScore5: undefined,
        feedbackMessage: undefined,
      },
    });
    if (!response) return;

    if (method === "momo") {
      const momoResponse = await MoMoApiService.handleCreateOrder({
        paymentMachineId: paymentMachineDetail.id,
      });
      const momoData = momoResponse.data;

      if (momoData) {
        console.log(momoData);
        updateMethodInfo({
          image: PaymentMethodImageValue.momoLogo,
          title: PaymentMethodTitleValue.momoTitle,
        });
        updatePaymentInfo({
          id: momoData.orderId,
          logo: PaymentMethodImageValue.momoLogo,
          qrCodeUrl: momoData.qrCodeUrl,
          responseTime: momoData.responseTime,
          totalPrice: momoData.amount,
        });
        handleSendSelectedPaymentMachineInform();
      }
      return;
    }

    if (method === "zalopay") {
      const zalopayResponse = await ZaloPayApiService.handleCreateOrder({
        paymentMachineId: paymentMachineDetail.id,
      });
      const zalopayData = zalopayResponse.data as {
        app_trans_id: string;
        order_url: string;
        app_time: number;
        amount: number;
      };

      if (zalopayData) {
        console.log(zalopayData);
        updateMethodInfo({
          image: PaymentMethodImageValue.zalopayLogo,
          title: PaymentMethodTitleValue.zalopayTitle,
        });
        updatePaymentInfo({
          id: zalopayData.app_trans_id,
          logo: PaymentMethodImageValue.zalopayLogo,
          qrCodeUrl: zalopayData.order_url,
          responseTime: zalopayData.app_time,
          totalPrice: zalopayData.amount,
        });
        handleSendSelectedPaymentMachineInform();
      }
      return;
    }

    if (method === "money") {
      updateMethodInfo({
        image: PaymentMethodImageValue.moneyImage,
        title: PaymentMethodTitleValue.moneyTitle,
      });
      updatePaymentInfo({
        id: "Lưu trữ nội bộ",
        logo: "",
        qrCodeUrl: "",
        responseTime: Date.now(),
        totalPrice: paymentMachineDetail.totalPrice,
      });
    } else {
      updateMethodInfo({
        image: PaymentMethodImageValue.atmLogo,
        title: PaymentMethodTitleValue.atmTitle,
      });
      updatePaymentInfo({
        id: "Lưu trữ nội bộ",
        logo: PaymentMethodAtmInfoValue.mbbankLogo,
        qrCodeUrl: PaymentMethodAtmInfoValue.atmQRCodeUrl,
        responseTime: Date.now(),
        totalPrice: paymentMachineDetail.totalPrice,
      });
    }
    handleSendSelectedPaymentMachineInform();
  };

  const handlePaymentTimeout = async () => {
    if (!paymentMachineDetail) return;

    const response = await updateMutation.mutateAsync({
      values: {
        id: paymentMachineDetail.id,
        paymentMethodId: undefined,
        paymentTotalPrice: undefined,
        processStatus:
          PaymentMachineProcessStatusValue.pending as PaymentMachineProcessStatusEnum,
        status:
          PaymentMachineStatusValue.processing as PaymentMachineStatusEnum,
        feedbackExperience: undefined,
        feedbackScore1: undefined,
        feedbackScore2: undefined,
        feedbackScore3: undefined,
        feedbackScore4: undefined,
        feedbackScore5: undefined,
        feedbackMessage: undefined,
      },
    });
    if (response) {
      updateMethodInfo({ image: "", title: "" });
      updatePaymentInfo({
        id: "",
        logo: "",
        qrCodeUrl: "",
        responseTime: 0,
        totalPrice: 0,
      });
      handleSendPendingPaymentMachineInform();
    }
  };

  const handleChangePaymentMethod = async () => {
    if (!paymentMachineDetail) return;

    const answer = await openConfirmation({
      title: "Đổi phương thức hiện tại ?",
      content:
        "Bạn có chắc muốn đổi phương thức này ? Sau khi đổi, bạn có thể chọn phương thức thanh toán khác để hoàn tất đơn hàng.",
    });
    if (!answer) return;

    const response = await updateMutation.mutateAsync({
      values: {
        id: paymentMachineDetail.id,
        paymentMethodId: undefined,
        paymentTotalPrice: undefined,
        processStatus:
          PaymentMachineProcessStatusValue.pending as PaymentMachineProcessStatusEnum,
        status:
          PaymentMachineStatusValue.processing as PaymentMachineStatusEnum,
        feedbackExperience: undefined,
        feedbackScore1: undefined,
        feedbackScore2: undefined,
        feedbackScore3: undefined,
        feedbackScore4: undefined,
        feedbackScore5: undefined,
        feedbackMessage: undefined,
      },
    });
    if (response) {
      updateMethodInfo({ image: "", title: "" });
      updatePaymentInfo({
        id: "",
        logo: "",
        qrCodeUrl: "",
        responseTime: 0,
        totalPrice: 0,
      });
      handleSendPendingPaymentMachineInform();
    }
  };

  const handleCompletePayment = async (): Promise<boolean> => {
    if (!paymentMachineDetail) return true;

    const answer = await openConfirmation({
      title: "Hoàn tất việc đánh giá ?",
      content:
        "Nếu khách hàng hài lòng về đánh giá của mình thì hãy hoàn tất nhé !",
    });
    if (!answer) return true;

    const requiredFeedback = [
      {
        value: experienceValue,
        message: "Xin vui lòng khách hàng hãy phản hồi mục trải nghiệm!",
      },
      {
        value: score01Value,
        message:
          "Xin vui lòng khách hàng hãy phản hồi mục chất lượng món ăn!",
      },
      {
        value: score02Value,
        message: "Xin vui lòng khách hàng hãy phản hồi mục tốc độ phục vụ!",
      },
      {
        value: score03Value,
        message: "Xin vui lòng khách hàng hãy phản hồi mục thái độ nhân viên!",
      },
      {
        value: score04Value,
        message: "Xin vui lòng khách hàng hãy phản hồi mục dịch vụ mang lại!",
      },
      {
        value: score05Value,
        message:
          "Xin vui lòng khách hàng hãy phản hồi mục không gian và vệ sinh!",
      },
      { value: commentValue, message: "Xin vui lòng khách hàng hãy góp ý cửa hàng!" },
    ];
    const missingFeedback = requiredFeedback.find(({ value }) => !value);
    if (missingFeedback) {
      openNotification({
        type: "warning",
        message: "Cảnh báo",
        description: missingFeedback.message,
      });
      return false;
    }

    const response = await updateMutation.mutateAsync({
      values: {
        id: paymentMachineDetail.id,
        paymentMethodId: paymentMachineDetail.paymentMethod.id,
        paymentTotalPrice: paymentMachineDetail.paymentTotalPrice,
        processStatus:
          PaymentMachineProcessStatusValue.completed as PaymentMachineProcessStatusEnum,
        status:
          PaymentMachineStatusValue.completed as PaymentMachineStatusEnum,
        feedbackExperience: experienceValue as FeedbackExperienceEnum,
        feedbackScore1: score01Value,
        feedbackScore2: score02Value,
        feedbackScore3: score03Value,
        feedbackScore4: score04Value,
        feedbackScore5: score05Value,
        feedbackMessage: commentValue,
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
      updateMethodInfo({ image: "", title: "" });
      updatePaymentInfo({
        id: "",
        logo: "",
        qrCodeUrl: "",
        responseTime: 0,
        totalPrice: 0,
      });
    }

    handleSendCompletedPaymentMachineInform();
    setCurrent(-1);
    return true;
  };

  //
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/websocket");
    const client = over(socket);
    stompClientCommonRef.current = client;

    client.connect({}, () => {
      console.log("WebSocket connected");

      client.subscribe("/topic/open-payment-machine", (message) => {
        const openPaymentMachineRequest: OpenPaymentMachineRequestType =
          JSON.parse(message.body);

        setPaymentMachineId(openPaymentMachineRequest.paymentMachineId);

        openNotification({
          type: "info",
          message: "Mở thanh toán hoá đơn",
          description: `Đã mở thanh toán hoá đơn cho bàn ${openPaymentMachineRequest.tableName}`,
        });
      });

      client.subscribe("/topic/feedback-payment-machine", () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });

      client.subscribe("/topic/cancelled-payment-machine", () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });
    });

    return () => {
      if (client.connected) {
        client.disconnect(() => console.log("WebSocket disconnected"));
      }
    };
  }, []);
  useEffect(() => {
    if (paymentMachineId) {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    }
  }, [paymentMachineId]);
  useEffect(() => {
    if (paymentMachineDetail) {
      if (
        paymentMachineDetail.processStatus ===
        PaymentMachineProcessStatusValue.pending
      ) {
        setCurrent(0);
      }
      if (
        paymentMachineDetail.processStatus ===
        PaymentMachineProcessStatusValue.selected
      ) {
        setCurrent(1);
      }
      if (
        paymentMachineDetail.processStatus ===
        PaymentMachineProcessStatusValue.feedback
      ) {
        setCurrent(2);
      }
      if (
        paymentMachineDetail.processStatus ===
        PaymentMachineProcessStatusValue.completed
      ) {
        setCurrent(-1);
      }

      if (
        paymentMachineDetail.processStatus ===
        PaymentMachineProcessStatusValue.feedback
      ) {
        openNotification({
          type: "success",
          message: "Thành công",
          description: `${
            // paymentMachineDetail.paymentMethod.id === 1
            //   ? methodTitle
            //   : paymentMachineDetail.paymentMethod.id === 2
            //     ? atmTitle
            //     : paymentMachineDetail.paymentMethod.id === 3
            //       ? visMasterJcbTitle
            //       : paymentMachineDetail.paymentMethod.id === 4
            //         ? momoTitle
            //         : paymentMachineDetail.paymentMethod.id === 5
            //           ? zalopayTitle
            //           : vnpayTitle
            methodTitle
          } thành công. Xin khách hàng dành ra ít phút để đánh giá.`,
        });

        return;
      }
    }

    if (current === -1) {
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
  }, [paymentMachineDetail]);
  useEffect(() => {
    if (
      experienceValue === "Tuyệt vời" &&
      score01Value === 5 &&
      score01Value === score02Value &&
      score01Value === score03Value &&
      score01Value === score04Value &&
      score01Value === score05Value
    ) {
      const defaults = {
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
      {/* {isLoading && <SpinnerComponent />} */}
      {paymentMachineDetail &&
      paymentMachineDetail.processStatus !==
        PaymentMachineProcessStatusValue.completed &&
      paymentMachineDetail.status !== PaymentMachineStatusValue.completed ? (
        <>
          <div className="payment-machine__main">
            <div className="payment-machine__main-header">
              <img
                src={ImageSourcePath + "brand-image.png"}
                alt=""
                className="payment-machine__main-logo"
              />
              <h1 className="payment-machine__main-title">
                Thanh toán hoá đơn
              </h1>
            </div>
            <Steps current={current} items={items} />
            {current === 0 &&
              paymentMachineDetail.processStatus ===
                PaymentMachineProcessStatusValue.pending && (
                <PaymentMachineInfoComponent
                  paymentMachine={paymentMachineDetail}
                />
              )}
            {current === 1 &&
              paymentMachineDetail.processStatus ===
                PaymentMachineProcessStatusValue.pending && (
                <PaymentMachineMethodsComponent
                  onSelectPaymentMethod={handleSelectPaymentMethod}
                />
              )}
            {current === 1 &&
              paymentMachineDetail.processStatus ===
                PaymentMachineProcessStatusValue.selected && (
                <PaymentMachineHandleComponent
                  methodTitle={methodTitle}
                  methodImage={methodImage}
                  paymentId={paymentId}
                  paymentLogo={paymentLogo}
                  paymentQRCodeUrl={paymentQRCodeUrl}
                  paymentResponseTime={paymentResponseTime}
                  paymentTotalPrice={paymentTotalPrice}
                  onPaymentTimeout={handlePaymentTimeout}
                />
              )}
            {current === 2 &&
              paymentMachineDetail.processStatus ===
                PaymentMachineProcessStatusValue.feedback && (
                <PaymentMachineResultComponent
                  feedbackExperiences={feedbackExperiences}
                  feedbackScores={feedbackScores}
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
            <PaymentMachineActionsComponent
              current={current}
              processStatus={paymentMachineDetail.processStatus}
              onNext={next}
              onPrevious={prev}
              onChangePaymentMethod={handleChangePaymentMethod}
              onCompletePayment={handleCompletePayment}
            />
          </div>
        </>
      ) : (
        <PaymentMachineInformComponent paymentMachine={paymentMachineDetail!} />
      )}
    </>
  );
};

export default PaymentMachinePage;
