import { useEffect, useRef, useState } from "react";
import { ClipLoader, SyncLoader } from "react-spinners";
import { InputNumber } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import type { CrudObjectModalProps } from "../../../../common/props";
import type {
  HandlePaymentType,
  OrderSheetDetailType,
  UseTableType,
} from "../../../../common/types";
import {
  HandlePaymentStatus,
  ImageSourcePath,
  OrderSheetStatus,
  CategoryTableSurchargeType,
  UseTableStatus,
} from "../../../../common/values";
import CustomSpinner from "../../../common/spinner";
import CurrentDateTime from "../../common/current-datetime";
import { useEntityQuery } from "../../../../hook/use-entity-query";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import {
  GetHandlePaymentFormatByUseTableId,
  HandleUpdateHandlePayment,
} from "../../../../requests/handle-payments";
import { actionIndexes } from "../../../../utils/default-actions";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../utils/other-events";
import { hasPermission } from "../../../../utils/has-permissions";
import { openConfirmation } from "../../../../utils/show-confirmation";
import { openNotification } from "../../../../utils/show-notification";

// Manager Occupied Order Table
const ManagerOccupiedUseTable: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  isManager,
  restaurantId,
  validActions,
  data,
  dataForCrud,
  closeModal,
  callApiToUpdateUseTable,
}) => {
  // Truy vấn dữ liệu Xử lý thanh toán
  const {
    data: handlePayment,
    isLoading,
    isError,
    error,
  } = useEntityQuery<HandlePaymentType>({
    keys: ["handle-payment"],
    params: {
      useTableId: data?.id,
    },
    api: GetHandlePaymentFormatByUseTableId,
  });

  // Mutation
  const updateMutation = useEntityMutation<HandlePaymentType>({
    messages: {
      success: `Cập nhật trạng thái thanh toán hoá đơn thành công!`,
      error: `Cập nhật trạng thái thanh toán hoá đơn thất bại!`,
    },
    invalidateKeys: [["handle-payment"]],
    api: HandleUpdateHandlePayment,
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
  // Số tiền thanh toán
  const [payTotalPriceValue, setPayTotalPriceValue] = useState<number>(0);

  // Nút "Xác nhận đã nhận tiền"
  const confirmPaymentButtonRef = useRef<HTMLButtonElement>(null);
  // Nút "Huỷ thanh toán tiền bàn"
  const cancelPaymentButtonRef = useRef<HTMLButtonElement>(null);

  //
  useEffect(() => {
    console.log(handlePayment);
    if (handlePayment) {
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
            tempOrderSheetDetail?.food?.id ===
            newCurrentOrderSheetDetails[i]?.food?.id
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
      // Số tiền thanh toán
      setPayTotalPriceValue(handlePayment?.payTotalPrice!);
    } else {
      closeModal();
      setCurrentOrderSheetDetails([]);
      setCurrentTotalFoodPrice(0);
      setPayTotalPriceValue(0);
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
    } else {
      setCurrentCategoryTableSurcharge(0);
      setCurrentCategoryTableSurcharge(0);
      setCurrentCustomerDiscount(0);
    }
  }, [currentTotalFoodPrice]);

  return (
    <>
      {isLoading ? (
        <CustomSpinner />
      ) : (
        <>
          <div className="info">
            <b>Bàn ăn:</b>
            {data?.table?.name} - {data?.table?.categoryTable?.name} -{" "}
            {data?.table?.floor?.name} - Số chỗ: {data?.table?.seats}
          </div>
          <div className="info">
            <b>Thời gian nhận bàn:</b>
            {data?.timeStart}
          </div>
          <div className="info">
            <b>Thông tin khách hàng:</b>
            <div className="sub-info">
              <b>- Họ và tên:</b>
              {data?.customerFullname}
            </div>
            <div className="sub-info">
              <b>- Số điện thoại:</b>
              {data?.customerPhone}
            </div>
            <div className="sub-info">
              <b>- Email:</b>
              {data?.customerEmail}
            </div>
          </div>
          <div className="info">
            <b>Trạng thái:</b>
            <span className="status red">{data?.status!}</span>
          </div>
          <div className="info">
            <b>Chi tiết phiếu gọi món:</b>
            <table>
              <colgroup>
                <col width="15%" />
                <col width="20%" />
                <col width="20%" />
                <col width="30%" />
                <col width="15%" />
              </colgroup>
              <thead>
                <tr>
                  <th>Mã phiếu</th>
                  <th>Thời gian gọi món</th>
                  <th>Thời gian phục vụ</th>
                  <th>Tổng tiền món ăn</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {(data as UseTableType)?.orderSheets?.map((orderSheet) => (
                  <tr key={orderSheet?.id}>
                    <td>{orderSheet!.id!}</td>
                    <td>{orderSheet!.createAt!}</td>
                    <td>{orderSheet!.serviceAt!}</td>
                    <td>{vietnamMoneyFormat(orderSheet!.totalPrice!)}</td>
                    <td>{orderSheet!.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <div className="note">*Lưu ý: Khi thanh toán, các phiếu gọi món chưa được phục vụ sẽ bị huỷ !</div> */}
          {handlePayment?.useTable?.id === data?.id &&
          (handlePayment?.status === HandlePaymentStatus.exists ||
            handlePayment?.status === HandlePaymentStatus.pending ||
            handlePayment?.status === HandlePaymentStatus.selected ||
            handlePayment?.status === HandlePaymentStatus.completed) ? (
            <>
              <div className="line"></div>
              <div className="sub-title">Thanh toán bàn ăn</div>
              <div className="info">
                <b>Nhân viên xác nhận:</b>
                {/* <div className="sub-info">
                  <b>- Mã nhân viên:</b>#{dataForCrud?.infoLogin?.id}
                </div> */}
                <div className="sub-info">
                  <b>- Họ và tên:</b>
                  {dataForCrud?.infoLogin?.fullname}
                </div>
                <div className="sub-info">
                  <b>- Số điện thoại:</b>
                  {dataForCrud?.infoLogin?.phone}
                </div>
                <div className="sub-info">
                  <b>- Email:</b>
                  {dataForCrud?.infoLogin?.email}
                </div>
              </div>
              <div className="info">
                <b>Thời gian thanh toán:</b>
                <CurrentDateTime />
              </div>
              <div className="info">
                <b>Tổng tiền thanh toán:</b>
                {vietnamMoneyFormat(
                  Math.round(
                    currentTotalFoodPrice +
                      currentCategoryTableSurcharge +
                      -1 * currentCustomerDiscount,
                  ),
                )}
                (
                {numberToVietnamWords(
                  Math.round(
                    currentTotalFoodPrice +
                      currentCategoryTableSurcharge +
                      -1 * currentCustomerDiscount,
                  ),
                )}
                )
                <div className="sub-info">
                  <b>- Tổng tiền món ăn:</b>
                  {vietnamMoneyFormat(currentTotalFoodPrice)}
                </div>
                <div className="sub-info">
                  <b>- Giảm giá khách hàng:</b>
                  {vietnamMoneyFormat(-1 * currentCustomerDiscount)}
                </div>
                <div className="sub-info">
                  <b>- Phụ thu loại bàn:</b>
                  {vietnamMoneyFormat(currentCategoryTableSurcharge)}
                </div>
              </div>
              <div className="info">
                <b>Chi tiết đã phục vụ:</b>
                <table>
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
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrderSheetDetails?.map((orderSheetDetail) => (
                      <tr key={orderSheetDetail?.food?.id}>
                        <td>{orderSheetDetail!.food!.name}</td>
                        <td>{orderSheetDetail!.food!.unit}</td>
                        <td>{orderSheetDetail!.quantity}</td>
                        <td>{vietnamMoneyFormat(orderSheetDetail!.price)}</td>
                        <td>
                          {vietnamMoneyFormat(
                            orderSheetDetail!.quantity *
                              orderSheetDetail!.price,
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* <div className="line diff"></div> */}
              <div className="info diff">
                <b>Phương thức thanh toán</b>
                <span className="content">
                  {handlePayment?.payMethod ? (
                    <>
                      <img
                        src={
                          ImageSourcePath + "" + handlePayment?.payMethod?.image
                        }
                        alt=""
                      />
                      <p>{handlePayment?.payMethod?.name}</p>
                    </>
                  ) : (
                    <>
                      <SyncLoader className="spinner" />
                      <p>Hãy đợi khách hàng chọn phương thức thanh toán</p>
                    </>
                  )}
                </span>
              </div>
              {(handlePayment?.payMethod?.id === 1 ||
                handlePayment?.payMethod?.id === 2) && (
                <div className="info diff">
                  <b>Số tiền thanh toán</b>
                  <InputNumber
                    min={0}
                    placeholder="Nhập Số tiền thanh toán nhận được từ khách hàng"
                    className="input-pay-total-price"
                    value={payTotalPriceValue}
                    onChange={(val) => setPayTotalPriceValue(val || 0)}
                    disabled={
                      handlePayment?.status === HandlePaymentStatus.completed
                    }
                  />
                </div>
              )}
              {handlePayment?.status === HandlePaymentStatus.completed && (
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
              <div className="modal__buttons mg-top">
                {handlePayment?.status !== HandlePaymentStatus.completed &&
                  (handlePayment?.payMethod?.id === 1 ||
                    handlePayment?.payMethod?.id === 2) && (
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
                          // if (payTotalPriceValue) {
                          //   openNotification({
                          //     type: "error",
                          //     message: "Thất bại",
                          //     description:
                          //       "Số tiền thanh toán không được để trống!",
                          //
                          //   });

                          //   return;
                          // }
                          if (
                            payTotalPriceValue <
                            currentTotalFoodPrice +
                              -1 * currentCustomerDiscount +
                              currentCategoryTableSurcharge
                          ) {
                            openNotification({
                              type: "error",
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
                              id: handlePayment?.id,
                              useTableId: handlePayment?.useTable?.id,
                              employeeId: handlePayment?.employee?.id,
                              payMethodId: handlePayment?.payMethod?.id,
                              isEmployeeHandle: true,
                              payTotalPrice: payTotalPriceValue,
                              status: HandlePaymentStatus.completed,
                            },
                          });
                          if (data) {
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
                {(handlePayment?.payMethod?.id === 4 ||
                  handlePayment?.payMethod?.id === 5) && (
                  <button
                    type="button"
                    className="modal__button secondary btn"
                    disabled
                  >
                    <ClipLoader className="spinner" />
                    <span>Đợi KH thanh toán</span>
                  </button>
                )}
                {handlePayment?.status !== HandlePaymentStatus.completed && (
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
                            id: handlePayment?.id,
                            useTableId: handlePayment?.useTable?.id,
                            employeeId: undefined,
                            payMethodId: undefined,
                            payTotalPrice: undefined,
                            status: HandlePaymentStatus.nothing,
                          },
                        });
                        if (data) {
                        }
                      }

                      cancelPaymentButtonRef.current.classList.remove("active");
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} className="icon" />
                    <span>Huỷ thanh toán tiền bàn</span>
                  </button>
                )}
              </div>
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
                  {data?.orderSheets?.length! === 0 && (
                    <button
                      type="button"
                      className="modal__button secondary btn green-secondary"
                      onClick={(e) =>
                        callApiToUpdateUseTable!({
                          id: data?.id,
                          button: e.target as HTMLElement,
                          value: UseTableStatus.empty,
                        })
                      }
                    >
                      Khách trả bàn
                    </button>
                  )}
                  {handlePayment?.useTable?.id &&
                    data?.orderSheets?.length! > 0 && (
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
                            const response = await updateMutation.mutateAsync({
                              values: {
                                id: handlePayment?.id,
                                useTableId: handlePayment?.useTable?.id,
                                employeeId: dataForCrud?.infoLogin?.id,
                                isEmployeeHandle: true,
                                status: HandlePaymentStatus.exists,
                              },
                            });
                            if (data) {
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
  );
};

export default ManagerOccupiedUseTable;
