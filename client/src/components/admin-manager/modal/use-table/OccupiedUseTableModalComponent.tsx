import SockJS from "sockjs-client";
import useEntityQuery from "../../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import OccupiedPaymentInfoComponent from "./occupied/OccupiedPaymentInfoComponent";
import OccupiedHandlePaymentComponent from "./occupied/OccupiedHandlePaymentComponent";
import PaymentMachineApiService from "../../../../services/api/v1/PaymentMachineApiService";
import UseTableApiService from "../../../../services/api/v1/UseTableApiService";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { over } from "stompjs";
import { Spin } from "antd";
import {
  PaymentMachineProcessStatusValue,
  PaymentMachineStatusValue,
  UseTableStatusValue,
} from "../../../../constants/values";
import { hasPermission } from "../../../../utils/hasPermissions";
import { actionIndexes } from "../../../../utils/defaultActions";
import { openConfirmation } from "../../../../utils/showConfirmation";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../utils/otherEvents";
import type { Client } from "stompjs";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  PaymentMachineProcessStatusEnum,
  PaymentMachineStatusEnum,
} from "../../../../constants/enums";
import type { UseTableDetailResponseType } from "../../../../types/UseTableType";
import type {
  PaymentMachineCreateRequestType,
  PaymentMachineDetailResponseType,
  PaymentMachineUpdateRequestType,
} from "../../../../types/PaymentMachineType";

const OccupiedUseTableModalComponent: React.FC<CrudObjectModalProps> = ({
  objectEN,
  isManager,
  restaurantId,
  validActions,
  data,
  dataForCrud,
  callApiToUpdateUseTable,
  closeModal,
}) => {
  // Query Client
  const queryClient = useQueryClient();
  // Kết nối web socket
  const stompClientCommonRef = useRef<Client | null>(null);

  const { data: useTableDetail, isLoading } =
    useEntityQuery<UseTableDetailResponseType>({
      keys: ["use-table", data.id],
      params: { id: data.id },
      api: UseTableApiService.handleGetDetailById,
    });

  const isPaymentMachineCompleted =
    useTableDetail?.paymentMachine &&
    useTableDetail?.paymentMachine.processStatus ===
      PaymentMachineProcessStatusValue.completed &&
    useTableDetail?.paymentMachine.status ===
      PaymentMachineStatusValue.completed;
  const hasPaymentMachine =
    useTableDetail?.paymentMachine &&
    useTableDetail?.paymentMachine.processStatus !==
      PaymentMachineProcessStatusValue.cancelled &&
    useTableDetail?.paymentMachine.status !==
      PaymentMachineStatusValue.cancelled;

  // Mutation
  // - Create
  const createMutation = useEntityMutation<
    PaymentMachineCreateRequestType,
    PaymentMachineDetailResponseType
  >({
    messages: {
      success: `Tạo trạng thái thanh toán hoá đơn thành công!`,
      error: `Tạo trạng thái thanh toán hoá đơn thất bại!`,
    },
    invalidateKeys: [["use-table", useTableDetail?.id]],
    api: PaymentMachineApiService.handleCreate,
  });
  // - Update
  const updateMutation = useEntityMutation<
    PaymentMachineUpdateRequestType,
    PaymentMachineDetailResponseType
  >({
    messages: {
      success: `Cập nhật trạng thái thanh toán hoá đơn thành công!`,
      error: `Cập nhật trạng thái thanh toán hoá đơn thất bại!`,
    },
    invalidateKeys: [["use-table", useTableDetail?.id]],
    api: PaymentMachineApiService.handleUpdate,
  });

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
        paymentMachineId: useTableDetail?.paymentMachine.id,
        tableName: useTableDetail?.table.name,
      }),
    );
  };

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/websocket");
    const client = over(socket);
    stompClientCommonRef.current = client;

    client.connect({}, () => {
      console.log("WebSocket connected");

      client.subscribe("/topic/pending-payment-machine", () => {
        queryClient.invalidateQueries({
          queryKey: ["use-table", data.id],
        });
      });

      client.subscribe("/topic/selected-payment-machine", () => {
        queryClient.invalidateQueries({
          queryKey: ["use-table", data.id],
        });
      });

      client.subscribe("/topic/completed-payment-machine", () => {
        queryClient.invalidateQueries({
          queryKey: [objectEN],
        });

        closeModal();
      });
    });

    return () => {
      if (client.connected) {
        client.disconnect(() => console.log("WebSocket disconnected"));
      }
    };
  }, []);

  return (
    <Spin spinning={!useTableDetail || isLoading}>
      {dataForCrud && useTableDetail && (
        <>
          <div className="info">
            <b>Thông tin bàn ăn:</b>
            <div className="sub-info">
              <b>- Tên bàn:</b>
              {useTableDetail.table.name}
            </div>
            <div className="sub-info">
              <b>- Loại bàn:</b>
              {useTableDetail.table.categoryTable.name}
            </div>
            <div className="sub-info">
              <b>- Tầng:</b>
              {useTableDetail.table.floor.name}
            </div>
            <div className="sub-info">
              <b>- Thời gian nhận bàn:</b>
              {useTableDetail.startAt}
            </div>
          </div>
          <div className="info">
            <b>Thông tin khách hàng:</b>
            <div className="sub-info">
              <b>- Họ và tên:</b>
              {useTableDetail.customerFullname}
            </div>
            <div className="sub-info">
              <b>- Số điện thoại:</b>
              {useTableDetail.customerPhone}
            </div>
            <div className="sub-info">
              <b>- Email:</b>
              {useTableDetail.customerEmail}
            </div>
            <div className="sub-info">
              <b>- Số lượng:</b>
              {useTableDetail.customerGuests} (Người lớn:{" "}
              {useTableDetail.customerAdult}, Trẻ em:{" "}
              {useTableDetail.customerChild})
            </div>
          </div>
          <div className="info">
            <b>Thông tin thực đơn:</b>
            <div className="sub-info">
              <b>- Tên thực đơn:</b>
              {useTableDetail.menu.name}
            </div>
            <div className="sub-info">
              <b>- Loại thực đơn:</b>
              {useTableDetail.menu.type}
            </div>
            <div className="sub-info">
              <b>- Thu phí:</b>
              {vietnamMoneyFormat(useTableDetail.menu.price)} (
              {numberToVietnamWords(useTableDetail.menu.price)})
            </div>
          </div>
          <div className="info">
            <b>Trạng thái:</b>
            <span className="status red">{useTableDetail.status}</span>
          </div>
          <div className="info">
            <b>Chi tiết phiếu gọi món:</b>
            <table>
              <colgroup>
                <col width="13%" />
                <col width="17%" />
                <col width="17%" />
                <col width="17%" />
                <col width="23%" />
                <col width="13%" />
              </colgroup>
              <thead>
                <tr>
                  <th>Mã phiếu</th>
                  <th>TG gọi món</th>
                  <th>TG phục vụ</th>
                  <th>TG huỷ bỏ</th>
                  <th>Tổng tiền món ăn</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {(useTableDetail.orderSheets ?? []).map((orderSheet) => (
                  <>
                    <tr key={orderSheet.id}>
                      <td>{orderSheet.id!}</td>
                      <td>{orderSheet.createAt}</td>
                      <td>{orderSheet.serviceAt}</td>
                      <td>{orderSheet.cancelAt}</td>
                      <td>{vietnamMoneyFormat(orderSheet.totalPrice)}</td>
                      <td>{orderSheet.status}</td>
                    </tr>
                    <tr className="sub-row">
                      <td colSpan={6}>
                        <table className="sub-table">
                          <colgroup>
                            <col width="28%" />
                            <col width="22%" />
                            <col width="22%" />
                            <col width="28%" />
                          </colgroup>
                          <tbody>
                            {orderSheet.orderSheetDetails.map(
                              (orderSheetDetail) => (
                                <tr key={orderSheetDetail.food.id}>
                                  <td className="left">
                                    {orderSheetDetail.foodNameSnapshot}
                                  </td>
                                  <td>{orderSheetDetail.food.unit}</td>
                                  <td>
                                    {vietnamMoneyFormat(
                                      orderSheetDetail.foodPriceSnapshot,
                                    )}
                                    &nbsp;x{orderSheetDetail.quantity}
                                  </td>
                                  <td>
                                    {vietnamMoneyFormat(
                                      orderSheetDetail.totalPriceDetail,
                                    )}
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
          {!isPaymentMachineCompleted && (
            <>
              {hasPaymentMachine ? (
                <>
                  <div className="line"></div>
                  <div className="sub-title">Thanh toán bàn ăn</div>
                  <OccupiedPaymentInfoComponent
                    paymentMachine={useTableDetail.paymentMachine}
                  />
                  <OccupiedHandlePaymentComponent
                    tableName={useTableDetail.table.name}
                    paymentMachine={useTableDetail.paymentMachine}
                    stompClientCommonRef={stompClientCommonRef}
                    updateMutation={updateMutation}
                  />
                </>
              ) : (
                <>
                  {hasPermission({
                    isManager: isManager!,
                    restaurantIdForCrud: restaurantId,
                    validActions,
                    requiredActionId: actionIndexes.update,
                  }) && (
                    <div className="modal__buttons mg-top">
                      {(useTableDetail.orderSheets || []).length === 0 && (
                        <button
                          type="button"
                          className="modal__button secondary btn green-secondary"
                          onClick={(e) =>
                            callApiToUpdateUseTable!({
                              id: useTableDetail.id,
                              button: e.target as HTMLElement,
                              value: UseTableStatusValue.empty,
                            })
                          }
                        >
                          Khách trả bàn
                        </button>
                      )}
                      {!hasPaymentMachine &&
                        (useTableDetail.orderSheets || []).length > 0 && (
                          <button
                            type="button"
                            className="modal__button secondary btn"
                            onClick={async (e) => {
                              e.currentTarget.classList.add("active");

                              const answer = await openConfirmation({
                                title: `Thanh toán hoá tiền bàn này ?`,
                                content:
                                  "Hãy hỏi lại phía khách hàng trước khi xác nhận thanh toán.",
                              });
                              if (answer) {
                                const response = !useTableDetail.paymentMachine
                                  ? await createMutation.mutateAsync({
                                      values: {
                                        restaurantId:
                                          useTableDetail.restaurant.id,
                                        useTableId: useTableDetail.id,
                                        employeeId: dataForCrud.infoLogin?.id!,
                                        at: dayjs().format(
                                          "YYYY-MM-DD HH:mm:ss",
                                        ),
                                        processStatus:
                                          PaymentMachineProcessStatusValue.pending as PaymentMachineProcessStatusEnum,
                                        status:
                                          PaymentMachineStatusValue.processing as PaymentMachineStatusEnum,
                                      },
                                    })
                                  : await updateMutation.mutateAsync({
                                      values: {
                                        id: useTableDetail.paymentMachine.id,
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
                                  handleSendOpenPaymentMachineInform();
                                }
                              }

                              e.currentTarget.classList.remove("active");
                            }}
                          >
                            Thanh toán tiền bàn
                          </button>
                        )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </Spin>
  );
};

export default OccupiedUseTableModalComponent;
