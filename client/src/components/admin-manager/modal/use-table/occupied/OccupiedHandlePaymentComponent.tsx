import { useRef, useState } from "react";
import { ClipLoader, SyncLoader } from "react-spinners";
import { faCheck, faRotate, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputNumber } from "antd";
import {
  ImageSourcePath,
  PaymentMachineProcessStatusValue,
  PaymentMachineStatusValue,
} from "../../../../../constants/values";
import {
  inputNumberFormatter,
  inputNumberParse,
} from "../../../../../utils/otherEvents";
import { openConfirmation } from "../../../../../utils/showConfirmation";
import { openNotification } from "../../../../../utils/showNotification";
import type { Client } from "stompjs";
import type {
  PaymentMachineProcessStatusEnum,
  PaymentMachineStatusEnum,
} from "../../../../../constants/enums";
import type {
  PaymentMachineDetailResponseType,
  PaymentMachineInfoResponseType,
  PaymentMachineUpdateRequestType,
} from "../../../../../types/PaymentMachineType";
import type { UseMutationResult } from "@tanstack/react-query";
import type { RestResponseType } from "../../../../../types/RestResponseType";
import type { ReactQueryMutationProps } from "../../../../../constants/props";

type OccupiedHandlePaymentComponentProps = {
  tableName: string;
  paymentMachine: PaymentMachineInfoResponseType;
  stompClientCommonRef: React.RefObject<Client | null>;
  updateMutation: UseMutationResult<
    RestResponseType<PaymentMachineDetailResponseType>,
    string,
    ReactQueryMutationProps<PaymentMachineUpdateRequestType>,
    void
  >;
};

const OccupiedHandlePaymentComponent: React.FC<
  OccupiedHandlePaymentComponentProps
> = ({ tableName, paymentMachine, stompClientCommonRef, updateMutation }) => {
  // Nút "Xác nhận đã nhận tiền"
  const confirmPaymentButtonRef = useRef<HTMLButtonElement>(null);
  // Nút "Tải lại máy thanh toán"
  const loadPaymentMachineButtonRef = useRef<HTMLButtonElement>(null);
  // Nút "Huỷ thanh toán tiền bàn"
  const cancelPaymentButtonRef = useRef<HTMLButtonElement>(null);

  //
  const [paymentTotalPriceValue, setPaymentTotalPriceValue] =
    useState<number>(0);

  // Gửi thông báo: Mỏ thanh toán POS
  const handleSendOpenPaymentMachineInform = () => {
    const client = stompClientCommonRef?.current;
    if (!client || !client.connected) {
      console.warn("WebSocket chưa kết nối");
      return;
    }

    client.send(
      "/app/open-payment-machine",
      {},
      JSON.stringify({
        paymentMachineId: paymentMachine.id,
        tableName: tableName,
      }),
    );
  };
  // Gửi thông báo: Đã nhận tiền và cập nhật giao diện đánh giá
  const handleSendFeedbackPaymentMachineInform = () => {
    const client = stompClientCommonRef?.current;
    if (!client || !client.connected) {
      console.warn("WebSocket chưa kết nối");
      return;
    }

    client.send("/app/feedback-payment-machine", {}, undefined);
  };
  // Gửi thông báo: Huỷ thanh toán hoá đơn
  const handleSendCancelledPaymentMachineInform = () => {
    const client = stompClientCommonRef?.current;
    if (!client || !client.connected) {
      console.warn("WebSocket chưa kết nối");
      return;
    }

    client.send("/app/cancelled-payment-machine", {}, undefined);
  };

  return (
    <>
      <div className="info diff">
        <b>Phương thức thanh toán</b>
        <span className="content">
          {paymentMachine.paymentMethod ? (
            <>
              <img
                src={ImageSourcePath + paymentMachine.paymentMethod.image}
                alt=""
              />
              <p>{paymentMachine.paymentMethod.name}</p>
            </>
          ) : (
            <>
              <SyncLoader className="spinner" />
              <p>Hãy đợi khách hàng chọn phương thức thanh toán</p>
            </>
          )}
        </span>
      </div>
      {paymentMachine.paymentMethod && (
        <>
          {(paymentMachine.paymentMethod.id === 1 ||
            paymentMachine.paymentMethod.id === 2) && (
            <div className="info diff">
              <b>Số tiền thanh toán</b>
              <InputNumber
                min={0}
                formatter={(value) => inputNumberFormatter(value)}
                parser={(value) => inputNumberParse(value)}
                placeholder="Nhập Số tiền thanh toán nhận được từ khách hàng"
                value={paymentTotalPriceValue}
                onChange={(val) => setPaymentTotalPriceValue(val || 0)}
                disabled={
                  paymentMachine.status === PaymentMachineStatusValue.completed
                }
                className="input-payment-total-price"
              />
            </div>
          )}
          {paymentMachine.processStatus ===
            PaymentMachineProcessStatusValue.feedback && (
            <div className="info diff">
              <b>Khách hàng đánh giá</b>
              <span className="content">
                <SyncLoader className="spinner" />
                <p>
                  Khách hàng đã thanh toán hoá đơn thành công. Hãy đợi khách
                  hàng hoàn tất việc đánh giá.
                </p>
              </span>
            </div>
          )}
        </>
      )}
      {paymentMachine.processStatus !==
        PaymentMachineProcessStatusValue.completed && (
        <div className="modal__buttons mg-top">
          {paymentMachine.processStatus !==
            PaymentMachineProcessStatusValue.feedback && (
            <>
              {paymentMachine.paymentMethod && (
                <>
                  {(paymentMachine.paymentMethod.id === 1 ||
                    paymentMachine.paymentMethod.id === 2) && (
                    <button
                      ref={confirmPaymentButtonRef}
                      type="button"
                      className="modal__button secondary btn"
                      onClick={async () => {
                        if (!confirmPaymentButtonRef.current) return;

                        confirmPaymentButtonRef.current.classList.add("active");

                        const answer = await openConfirmation({
                          title: `Xác nhận đã nhận tiền bàn này ?`,
                          content:
                            "Hãy kiểm tra lại kĩ trước khi xác nhận đã nhận tiền.",
                        });
                        if (answer) {
                          if (
                            paymentTotalPriceValue < paymentMachine.totalPrice
                          ) {
                            openNotification({
                              type: "warning",
                              message: "Thất bại",
                              description:
                                "Số tiền thanh toán phải lớn hơn hoặc bằng tổng thanh toán!",
                            });
                            confirmPaymentButtonRef.current.classList.remove(
                              "active",
                            );

                            return;
                          }

                          const response = await updateMutation.mutateAsync({
                            values: {
                              id: paymentMachine.id,
                              paymentMethodId: paymentMachine.paymentMethod.id,
                              paymentTotalPrice: paymentMachine.totalPrice,
                              processStatus:
                                PaymentMachineProcessStatusValue.feedback as PaymentMachineProcessStatusEnum,
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
                            handleSendFeedbackPaymentMachineInform();
                          }
                        }

                        confirmPaymentButtonRef.current.classList.remove(
                          "active",
                        );
                      }}
                    >
                      <FontAwesomeIcon icon={faCheck} className="icon" />
                      <span>Xác nhận đã nhận tiền</span>
                    </button>
                  )}
                  {(paymentMachine.paymentMethod.id === 4 ||
                    paymentMachine.paymentMethod.id === 5) && (
                    <button
                      type="button"
                      className="modal__button secondary btn"
                      disabled
                    >
                      <ClipLoader className="spinner" />
                      <span>Đợi KH thanh toán</span>
                    </button>
                  )}
                </>
              )}
              <button
                ref={cancelPaymentButtonRef}
                type="button"
                className="modal__button secondary btn"
                onClick={async () => {
                  if (!cancelPaymentButtonRef.current) return;

                  cancelPaymentButtonRef.current.classList.add("active");

                  const answer = await openConfirmation({
                    title: `Huỷ thanh toán tiền bàn này ?`,
                    content:
                      "Hãy hỏi lại phía khách hàng trước khi xác nhận huỷ thanh toán.",
                  });
                  if (answer) {
                    const response = await updateMutation.mutateAsync({
                      values: {
                        id: paymentMachine.id,
                        paymentMethodId: undefined,
                        paymentTotalPrice: undefined,
                        processStatus:
                          PaymentMachineProcessStatusValue.cancelled as PaymentMachineProcessStatusEnum,
                        status:
                          PaymentMachineStatusValue.cancelled as PaymentMachineStatusEnum,
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
                      handleSendCancelledPaymentMachineInform();
                    }
                  }

                  cancelPaymentButtonRef.current.classList.remove("active");
                }}
              >
                <FontAwesomeIcon icon={faXmark} className="icon" />
                <span>Huỷ thanh toán tiền bàn</span>
              </button>
            </>
          )}
          <button
            ref={loadPaymentMachineButtonRef}
            type="button"
            className="modal__button secondary btn"
            onClick={async () => {
              if (!loadPaymentMachineButtonRef.current) return;

              loadPaymentMachineButtonRef.current.classList.add("active");

              const answer = await openConfirmation({
                title: `Tải lại máy thanh toán?`,
                content:
                  "Hãy hỏi lại phía khách hàng trước khi tải lại máy thanh toán.",
              });
              if (answer) {
                handleSendOpenPaymentMachineInform();
              }

              loadPaymentMachineButtonRef.current.classList.remove("active");
            }}
          >
            <FontAwesomeIcon icon={faRotate} className="icon" />
            <span>Tải lại máy thanh toán</span>
          </button>
        </div>
      )}
    </>
  );
};

export default OccupiedHandlePaymentComponent;
