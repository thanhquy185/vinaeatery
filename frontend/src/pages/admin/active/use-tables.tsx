import { useEffect, useRef, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  type SelectProps,
} from "antd";
import CustomFindInput from "../../../components/admin/find-input";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomModal from "../../../components/admin/modal";
import { ruleEmail, rulePhone, ruleRequired } from "../../../common/rules";
import {
  CommonStatus,
  HandlePaymentStatus,
  OrderSheetStatus,
  ReactQueryGetData,
  SurchargeCategoryTable,
  UseTableStatus,
} from "../../../common/values";
import type {
  CustomersFormatType,
  EmployeesFormatType,
  FloorsType,
  OrderSheetDetailsFormatType,
  OrderSheetsFormatType,
  OrderTablesFormatType,
  UseTablesFormatType,
} from "../../../common/types";
import {
  FindAllCustomer,
  FindAllFloor,
  FindAllOrderTable,
  FindAllUseTableTimeEndIsNull,
  GetHandlePaymentFormat,
  HandleUpdateHandlePayment,
  HandleUpdateUseTable,
} from "../../../services/api";
import { getActionNameVn } from "../../../services/default-actions";
import { getActionsString } from "../../../services/employee-login";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../utils/otherEvents";
import { showCreateValidAddress } from "../../../utils/showCreateValidAddress";
import { openConfirmation } from "../../../utils/showConfirmation";
import { openNotification } from "../../../utils/showNotification";
import CurrentDateTime from "../../../components/admin/current-datetime";
import { ClipLoader, SyncLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import CustomSpinner from "../../../components/common/spinner";

// Các giá trị chung
// - Tên đối tượng
const objectName = "Sử dụng bàn ăn";

// Kiểu dữ liệu các tham số truyền vào của 1 đối tượng sử dụng bàn ăn
type HandleUseTableProps = {
  id?: number;
  tableId?: number;
  employeeId?: number;
  customerId?: number;
  orderId?: number;
  orderTableId?: number;
  orderTable?: OrderTablesFormatType;
  orderSheets?: OrderSheetsFormatType[];
};

// Admin Status Tables Page
const AdminUseTablesPage = ({
  employeeLogin,
  functionId,
}: {
  employeeLogin: EmployeesFormatType;
  functionId: number;
}) => {
  // Danh sách tác vụ mà nhân viên có thể thực hiện theo mã chức năng
  const validActions = getActionsString({ currentFunctionId: functionId });

  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Truy vấn dữ liệu Tầng
  const { data: floors } = useQuery({
    queryKey: ["floors"],
    queryFn: async () => {
      const res = await FindAllFloor({ statusValue: [CommonStatus.active] });
      if (res.status === 200) {
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
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [{ label: "Bàn", value: "table" }];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  // - Tầng
  const floorOptions: SelectProps["options"] = floors?.map((floor) => ({
    label: floor.name,
    value: floor.id,
  }));
  const [filterFloorValue, setFilterFloorValue] = useState<string[] | null>([]);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: UseTableStatus.occupied, value: UseTableStatus.occupied },
    { label: UseTableStatus.reserved, value: UseTableStatus.reserved },
    { label: UseTableStatus.empty, value: UseTableStatus.empty },
    { label: UseTableStatus.repair, value: UseTableStatus.repair },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    []
  );

  // Truy vấn dữ liệu sử dụng bàn ăn(mới nhất)
  const { data: useTables } = useQuery({
    queryKey: [
      "use-tables",
      filterFindType!,
      filterFindValue!,
      filterFloorValue!,
      filterStatusValue!,
    ],
    queryFn: async () => {
      const res = await FindAllUseTableTimeEndIsNull({
        findType: filterFindType!,
        findValue: filterFindValue!,
        floorValue: filterFloorValue!,
        statusValue: filterStatusValue!,
      });
      if (res.status === 200) {
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

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const [titleModal, setTitleModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [widthModal, setWidthModal] = useState<string>("");
  const [classNameModal, setClassNameModal] = useState<string>("");
  const [SecondModal, setSecondModal] = useState<ReactNode>();
  // - Hàm cập nhật
  const updatePropertiesModal = (
    titleModal: string,
    openModal: boolean,
    widthModal: string,
    classNameModal: string,
    SecondModal: ReactNode
  ) => {
    setTitleModal(titleModal);
    setOpenModal(openModal);
    setWidthModal(widthModal);
    setClassNameModal(classNameModal);
    setSecondModal(SecondModal);
  };
  // - Các modal tương ứng cho từng chức năng
  const OccupiedUseTables = ({
    id,
    timeStart,
    timeEnd,
    table,
    employee,
    customer,
    order,
    orderTable,
    status,
    orderSheets,
  }: UseTablesFormatType) => {
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

    // ...
    const [isShowSpinner, setIsShowSpinner] = useState<boolean>(false);

    // Danh sách chi tiết phiếu gọi món
    const [currentOrderSheetDetails, setCurrentOrderSheetDetails] = useState<
      OrderSheetDetailsFormatType[]
    >([]);
    // Tổng tiền món ăn
    const [currentTotalFoodPrice, setCurrentTotalFoodPrice] =
      useState<number>(0);
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
      if (handlePayment) {
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
        // Số tiền thanh toán
        setPayTotalPriceValue(handlePayment?.payTotalPrice!);
      } else {
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

        // Giảm giá khách hàng
        setCurrentCustomerDiscount(
          (currentTotalFoodPrice *
            (handlePayment?.useTable?.customer?.customerCard?.discount || 0)) /
            100
        );
      } else {
        setCurrentCategoryTableSurcharge(0);
        setCurrentCategoryTableSurcharge(0);
        setCurrentCustomerDiscount(0);
      }
    }, [currentTotalFoodPrice]);

    // useEffect(() => {
    //   console.log(payTotalPriceValue);
    // }, [payTotalPriceValue]);

    return (
      <>
        {isShowSpinner ? (
          <CustomSpinner />
        ) : (
          <>
            <div className="info">
              <b>Bàn ăn:</b> {table!.name} - {table!.categoryTable!.name} -{" "}
              {table!.floor!.name} - Số chỗ: {table!.seats}
            </div>
            <div className="info">
              <b>Thời gian nhận bàn:</b> {timeStart!}
            </div>
            <div className="info">
              <b>Khách hàng:</b> {customer!.fullname} - {customer!.phone} -{" "}
              {customer!.email! ? customer!.email : "Chưa cung cấp email"} -{" "}
              {customer!.customerCard!.name}
            </div>
            <div className="info">
              <b>Trạng thái:</b> <span className="status red">{status!}</span>
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
                  {orderSheets?.map((orderSheet) => (
                    <tr key={orderSheet?.id}>
                      <td>{orderSheet!.id!}</td>
                      <td>{orderSheet!.timeCreate!}</td>
                      <td>{orderSheet!.timeService!}</td>
                      <td>{vietnamMoneyFormat(orderSheet!.totalPrice!)}</td>
                      <td>{orderSheet!.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* <div className="note">*Lưu ý: Khi thanh toán, các phiếu gọi món chưa được phục vụ sẽ bị huỷ !</div> */}
            {handlePayment?.useTable?.id === id &&
            (handlePayment?.status === HandlePaymentStatus.exists ||
              handlePayment?.status === HandlePaymentStatus.pending ||
              handlePayment?.status === HandlePaymentStatus.selected ||
              handlePayment?.status === HandlePaymentStatus.completed) ? (
              <>
                <div className="line"></div>
                <div className="sub-title">Thanh toán bàn ăn</div>
                <div className="info">
                  <b>Nhân viên xác nhận:</b>
                  {"#" +
                    employeeLogin!.id +
                    " - " +
                    employeeLogin!.fullname +
                    " - " +
                    employeeLogin!.phone}
                </div>
                <div className="info">
                  <b>Thời gian thanh toán:</b>
                  {<CurrentDateTime />}
                </div>
                <div className="info">
                  <b>Tổng tiền thanh toán:</b>
                  {vietnamMoneyFormat(
                    Math.round(
                      currentTotalFoodPrice +
                        currentCategoryTableSurcharge +
                        -1 * currentCustomerDiscount
                    )
                  )}
                  <u>đ</u> (
                  {numberToVietnamWords(
                    Math.round(
                      currentTotalFoodPrice +
                        currentCategoryTableSurcharge +
                        -1 * currentCustomerDiscount
                    )
                  )}
                  )
                  <div className="sub-info">
                    <b>- Tổng tiền món ăn:</b>
                    {vietnamMoneyFormat(currentTotalFoodPrice)}
                    <u>đ</u>
                  </div>
                  <div className="sub-info">
                    <b>- Giảm giá khách hàng:</b>
                    {vietnamMoneyFormat(-1 * currentCustomerDiscount)}
                    <u>đ</u>
                  </div>
                  <div className="sub-info">
                    <b>- Phụ thu loại bàn:</b>
                    {vietnamMoneyFormat(currentCategoryTableSurcharge)}
                    <u>đ</u>
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
                                orderSheetDetail!.price
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="info diff">
                  <b>Phương thức thanh toán</b>
                  <span className="content">
                    {handlePayment?.payMethod ? (
                      <>
                        <img
                          src={
                            "/src/assets/images/others/" +
                            handlePayment?.payMethod?.image
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
                        Khách hàng đã thanh toán hoá đơn thành công. Hãy đợi
                        khách hàng hoàn tất việc đánh giá.
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

                          confirmPaymentButtonRef.current.classList.add(
                            "active"
                          );

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
                            //       "Số tiền thanh toán không được để trống !",
                            //     duration: 1.5,
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
                                  "Số tiền thanh toán phải lớn hơn hoặc bằng tổng thanh toán !",
                                duration: 1.5,
                              });
                              confirmPaymentButtonRef.current.classList.remove(
                                "active"
                              );

                              return;
                            }

                            setIsShowSpinner(true);
                            const data = await HandleUpdateHandlePayment({
                              useTableId: handlePayment?.useTable?.id,
                              employeeId: handlePayment?.employee?.id,
                              payMethodId: handlePayment?.payMethod?.id,
                              payTotalPrice: payTotalPriceValue,
                              status: HandlePaymentStatus.completed,
                            });
                            if (data.status === 200) {
                              setIsShowSpinner(false);

                              openNotification({
                                type: "success",
                                message: "Thành công",
                                description: "Thanh toán hoá đơn thành công !",
                                duration: 1.5,
                              });

                              queryClient.invalidateQueries({
                                queryKey: ["handle-payment"],
                              });
                            }
                          }

                          confirmPaymentButtonRef.current.classList.remove(
                            "active"
                          );
                        }}
                      >
                        <FontAwesomeIcon icon={faCheck} className="icon" />
                        <span>Xác nhận đã nhận tiền</span>
                      </button>
                    )}
                  {handlePayment?.payMethod?.id === 4 && (
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
                          setIsShowSpinner(true);

                          const data = await HandleUpdateHandlePayment({
                            useTableId: undefined,
                            employeeId: undefined,
                            payMethodId: undefined,
                            payTotalPrice: undefined,
                            status: HandlePaymentStatus.nothing,
                          });
                          if (data.status === 200) {
                            setIsShowSpinner(false);

                            openNotification({
                              type: "success",
                              message: "Thành công",
                              description:
                                "Đã hủy thanh toán hoá đơn thành công !",
                              duration: 1.5,
                            });

                            queryClient.invalidateQueries({
                              queryKey: ["handle-payment"],
                            });
                          }
                        }

                        cancelPaymentButtonRef.current.classList.remove(
                          "active"
                        );
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} className="icon" />
                      <span>Huỷ thanh toán tiền bàn</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              validActions!.includes(getActionNameVn(2)) && (
                <div className="modal__buttons mg-top">
                  {orderSheets!.length! === 0 && (
                    <button
                      type="button"
                      className="modal__button secondary btn green-secondary"
                      onClick={(e) =>
                        callApiToUpdateUseTable({
                          id: id!,
                          button: e.target as HTMLElement,
                          value: UseTableStatus.empty,
                        })
                      }
                    >
                      Khách trả bàn
                    </button>
                  )}
                  {!handlePayment?.useTable?.id && (
                    <button
                      type="button"
                      className="modal__button secondary btn"
                      onClick={async (e) => {
                        e.currentTarget.classList.add("active");

                        const answer = await openConfirmation({
                          title: `Thanh toán hoá đơn bàn này ?`,
                          content:
                            "Hãy hỏi lại phía khách hàng trước khi xác nhận thanh toán.",
                        });
                        if (answer) {
                          const data = await HandleUpdateHandlePayment({
                            useTableId: id!,
                            employeeId: employeeLogin?.id,
                            status: HandlePaymentStatus.exists,
                          });
                          if (data.status === 200) {
                            openNotification({
                              type: "success",
                              message: "Thành công",
                              description:
                                "Cập nhật giao diện thanh toán hoá đơn thành công !",
                              duration: 1.5,
                            });

                            queryClient.invalidateQueries({
                              queryKey: ["handle-payment"],
                            });
                          }
                        }

                        e.currentTarget.classList.remove("active");
                      }}
                    >
                      Thanh toán tiền bàn
                    </button>
                  )}
                </div>
              )
            )}
          </>
        )}
      </>
    );
  };
  const ReservedUseTables = ({
    id,
    timeStart,
    timeEnd,
    table,
    employee,
    customer,
    order,
    orderTable,
    status,
    orderSheets,
  }: UseTablesFormatType) => {
    return (
      <>
        <div className="info">
          <b>Bàn ăn:</b> {table!.name} - {table!.categoryTable!.name} -{" "}
          {table!.floor!.name} - Số chỗ: {table!.seats}
        </div>
        <div className="info">
          <b>Thời gian đặt bàn:</b> {orderTable!.timeOrder}
        </div>
        <div className="info">
          <b>Thời gian đến ăn:</b>{" "}
          {orderTable!.timeArrive!
            ? orderTable!.timeArrive
            : "Chưa cung cấp thời gian đến ăn"}
        </div>
        <div className="info">
          <b>Thông tin người đặt:</b> {orderTable!.fullname!} -{" "}
          {orderTable!.phone!} -{" "}
          {orderTable!.email! ? orderTable!.email : "Chưa cung cấp email"}
        </div>
        <div className="info">
          <b>Trạng thái:</b> <span className="status yellow">{status!}</span>
        </div>
        {validActions!.includes(getActionNameVn(2)) && (
          <div className="modal__buttons mg-top">
            <button
              type="button"
              className="modal__button secondary btn red-secondary"
              onClick={() =>
                updatePropertiesSecondModal(
                  "Khách hàng nhận bàn",
                  true,
                  "60%",
                  "secondary red",
                  AdminHandleUseTablesModal.HandleOccupiedFromReversed(
                    id!,
                    orderTable!
                  )
                )
              }
            >
              Khách nhận bàn
            </button>
            <button
              type="button"
              className="modal__button secondary btn green-secondary"
              onClick={(e) =>
                callApiToUpdateUseTable({
                  id: id!,
                  button: e.target as HTMLElement,
                  value: UseTableStatus.empty,
                })
              }
            >
              {UseTableStatus.empty}
            </button>
          </div>
        )}
      </>
    );
  };
  const EmptyUseTables = ({
    id,
    timeStart,
    timeEnd,
    table,
    employee,
    customer,
    order,
    orderTable,
    status,
    orderSheets,
  }: UseTablesFormatType) => {
    return (
      <>
        <div className="info">
          <b>Bàn ăn:</b> {table!.name} - {table!.categoryTable!.name} -{" "}
          {table!.floor!.name} - Số chỗ: {table!.seats}
        </div>
        <div className="info">
          <b>Trạng thái:</b> <span className="status green">{status!}</span>
        </div>
        {validActions!.includes(getActionNameVn(2)) && (
          <div className="modal__buttons mg-top-diff">
            <button
              type="button"
              className="modal__button secondary btn red-secondary"
              onClick={() =>
                updatePropertiesSecondModal(
                  "Bàn đang có khách",
                  true,
                  "60%",
                  "secondary red",
                  AdminHandleUseTablesModal.handleOccupied(id!)
                )
              }
            >
              {UseTableStatus.occupied}
            </button>
            <button
              type="button"
              className="modal__button secondary btn yellow-secondary"
              onClick={() =>
                updatePropertiesSecondModal(
                  "Bàn đã được đặt",
                  true,
                  "60%",
                  "secondary yellow",
                  AdminHandleUseTablesModal.handleReserved(id!)
                )
              }
            >
              {UseTableStatus.reserved}
            </button>
            <button
              type="button"
              className="modal__button secondary btn gray-secondary"
              onClick={(e) =>
                callApiToUpdateUseTable({
                  id: id!,
                  button: e.target as HTMLElement,
                  value: UseTableStatus.repair,
                })
              }
            >
              {UseTableStatus.repair}
            </button>
          </div>
        )}
      </>
    );
  };
  const RepairUseTables = ({
    id,
    timeStart,
    timeEnd,
    table,
    employee,
    customer,
    order,
    orderTable,
    status,
    orderSheets,
  }: UseTablesFormatType) => {
    return (
      <>
        <div className="info">
          <b>Bàn ăn:</b> {table!.name} - {table!.categoryTable!.name} -{" "}
          {table!.floor!.name} - Số chỗ: {table!.seats}
        </div>
        <div className="info">
          <b>Trạng thái:</b> <span className="status gray">{status!}</span>
        </div>
        {validActions!.includes(getActionNameVn(2)) && (
          <div className="modal__buttons mg-top-diff">
            <button
              type="button"
              className="modal__button secondary btn green-secondary"
              onClick={(e) =>
                callApiToUpdateUseTable({
                  id: id!,
                  button: e.target as HTMLElement,
                  value: UseTableStatus.empty,
                })
              }
            >
              {UseTableStatus.empty}
            </button>
          </div>
        )}
      </>
    );
  };
  const AdminUseTablesModal = {
    occupied: (useTable: UseTablesFormatType) => (
      <OccupiedUseTables
        id={useTable!.id!}
        timeStart={useTable!.timeStart!}
        timeEnd={useTable!.timeEnd!}
        table={useTable!.table!}
        employee={useTable!.employee!}
        customer={useTable!.customer!}
        order={useTable!.order!}
        orderTable={useTable!.orderTable!}
        status={useTable!.status!}
        orderSheets={useTable!.orderSheets!}
      />
    ),
    reserved: (useTable: UseTablesFormatType) => (
      <ReservedUseTables
        id={useTable!.id!}
        timeStart={useTable!.timeStart!}
        timeEnd={useTable!.timeEnd!}
        table={useTable!.table!}
        employee={useTable!.employee!}
        customer={useTable!.customer!}
        order={useTable!.order!}
        orderTable={useTable!.orderTable!}
        status={useTable!.status!}
        orderSheets={useTable!.orderSheets!}
      />
    ),
    empty: (useTable: UseTablesFormatType) => (
      <EmptyUseTables
        id={useTable!.id!}
        timeStart={useTable!.timeStart!}
        timeEnd={useTable!.timeEnd!}
        table={useTable!.table!}
        employee={useTable!.employee!}
        customer={useTable!.customer!}
        order={useTable!.order!}
        orderTable={useTable!.orderTable!}
        status={useTable!.status!}
        orderSheets={useTable!.orderSheets!}
      />
    ),
    repair: (useTable: UseTablesFormatType) => (
      <RepairUseTables
        id={useTable!.id!}
        timeStart={useTable!.timeStart!}
        timeEnd={useTable!.timeEnd!}
        table={useTable!.table!}
        employee={useTable!.employee!}
        customer={useTable!.customer!}
        order={useTable!.order!}
        orderTable={useTable!.orderTable!}
        status={useTable!.status!}
        orderSheets={useTable!.orderSheets!}
      />
    ),
  };

  // Các thành phần giữ giá trị cho việc hiển thị modal thứ 2
  // - Các biến
  const [titleSecondModal, setTitleSecondModal] = useState<string>("");
  const [openSecondModal, setOpenSecondModal] = useState<boolean>(false);
  const [widthSecondModal, setWidthSecondModal] = useState<string>("");
  const [classNameSecondModal, setClassNameSecondModal] = useState<string>("");
  const [childrenSecondModal, setChildrenSecondModal] = useState<ReactNode>();
  // - Hàm cập nhật
  const updatePropertiesSecondModal = (
    titleSecondModal: string,
    openSecondModal: boolean,
    widthSecondModal: string,
    classNameSecondModal: string,
    childrenSecondModal: ReactNode
  ) => {
    setTitleSecondModal(titleSecondModal);
    setOpenSecondModal(openSecondModal);
    setWidthSecondModal(widthSecondModal);
    setClassNameSecondModal(classNameSecondModal);
    setChildrenSecondModal(childrenSecondModal);
  };
  // - Các modal tương ứng cho từng chức năng
  const HandleOccupied = ({ id }: HandleUseTableProps) => {
    const [form] = Form.useForm();

    // Gọi api để truy vấn danh sách khách hàng "hoạt động"
    const [customers, setCustomers] = useState<CustomersFormatType[]>([]);
    const getAllCustomer = async () => {
      const res = await FindAllCustomer({
        statusValue: ["Hoạt động"],
      });
      if (res!.status === 200) {
        setCustomers(res!.data);
      } else {
        openNotification({
          type: "error",
          message: "Truy vấn dữ liệu thất bại",
          description: "Lỗi phát sinh khi truy vấn dữ liệu",
          duration: 2,
        });
      }
    };
    useEffect(() => {
      getAllCustomer();
    }, []);

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          className="modal__form split-2"
          onFinish={() => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']"
            );

            callApiToUpdateUseTable({
              id: id!,
              customerId: form.getFieldValue("customer"),
              button: submitButton as HTMLElement,
              value: UseTableStatus.occupied,
            });
          }}
        >
          <div className="modal__form-group-warper">
            <div className="modal__form-group">
              <Form.Item
                name="customer"
                label="Khách hàng (Mã khách hàng - Tên khách hàng - Số điện thoại - Email - Thẻ khách hàng)"
                htmlFor="customer"
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Khách hàng không được để trống !")]}
              >
                <Select
                  showSearch={true}
                  allowClear={true}
                  id="customer"
                  placeholder="Chọn Khách hàng (Mã khách hàng - Tên khách hàng - Số điện thoại - Email - Thẻ khách hàng)"
                  options={customers?.map((customer) => ({
                    label:
                      "#" +
                      customer!.id +
                      " - " +
                      customer!.fullname +
                      " - " +
                      customer!.phone +
                      " - " +
                      customer!.email +
                      " - " +
                      customer!.customerCard!.name,
                    value: customer!.id,
                  }))}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn red-secondary">
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const HandleOccupiedFromReversed = ({
    id,
    orderTable,
  }: HandleUseTableProps) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            fullname: orderTable!.fullname,
            phone: orderTable!.phone,
            email: orderTable!.email,
            address: orderTable!.address,
          }}
          autoComplete="off"
          className="modal__form split-2"
          onFinish={() => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']"
            );

            callApiToUpdateUseTable({
              id: id!,
              orderTableNewFullname: form.getFieldValue("fullname"),
              orderTableNewPhone: form.getFieldValue("phone"),
              orderTableNewEmail: form.getFieldValue("email"),
              orderTableNewAddress: form.getFieldValue("address"),
              button: submitButton as HTMLElement,
              value: UseTableStatus.occupied,
            });
          }}
        >
          <div className="modal__form-group-warper">
            <div className="modal__form-group">
              <Form.Item
                name="fullname"
                label="Tên khách hàng"
                htmlFor="fullname"
                className="modal__form-group-item"
                rules={[ruleRequired("Tên khách hàng không được để trống !")]}
              >
                <Input id="fullname" placeholder="Nhập Tên khách hàng" />
              </Form.Item>
              <Form.Item
                label="Địa chỉ"
                className="modal__form-group-item multiple-2"
              >
                <Space.Compact>
                  <Form.Item name="address" noStyle>
                    <Input id="address" placeholder="Nhập địa chỉ" />
                  </Form.Item>
                  <button
                    type="button"
                    className="btn secondary-btn"
                    onClick={async () => {
                      const result = await showCreateValidAddress();
                      if (result) {
                        const { houseNumberAndStreetName, province, ward } =
                          result;

                        form.setFieldsValue({
                          address: `${houseNumberAndStreetName}, ${ward}, ${province}`,
                        });
                      }
                    }}
                  >
                    Tạo địa chỉ
                  </button>
                </Space.Compact>
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  htmlFor="phone"
                  className="modal__form-group-item"
                  rules={[
                    ruleRequired("Số điện thoại không được để trống !"),
                    rulePhone(),
                  ]}
                >
                  <Input id="phone" placeholder="Nhập Số điện thoại" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  htmlFor="email"
                  className="modal__form-group-item"
                  rules={[ruleEmail()]}
                >
                  <Input id="email" placeholder="Nhập Email" />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn red-secondary">
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const HandleReserved = ({ id }: HandleUseTableProps) => {
    const [form] = Form.useForm();

    // Gọi api để truy vấn danh sách đơn đặt bàn "hoạt động"
    const [orderTables, setOrderTables] = useState<OrderTablesFormatType[]>([]);
    const getAllOrderTable = async () => {
      const res = await FindAllOrderTable({
        statusValue: ["Hoạt động"],
      });
      if (res!.status === 200) {
        setOrderTables(res!.data);
      } else {
        openNotification({
          type: "error",
          message: "Truy vấn dữ liệu thất bại",
          description: "Lỗi phát sinh khi truy vấn dữ liệu",
          duration: 2,
        });
      }
    };
    useEffect(() => {
      getAllOrderTable();
    }, []);

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          className="modal__form split-2"
          onFinish={() => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']"
            );

            callApiToUpdateUseTable({
              id: id!,
              orderTableId: form.getFieldValue("orderTable"),
              button: submitButton as HTMLElement,
              value: UseTableStatus.reserved,
            });
          }}
        >
          <div className="modal__form-group-warper">
            <div className="modal__form-group">
              <Form.Item
                name="orderTable"
                label="Đơn đặt bàn (Mã Đơn đặt bàn - Thời gian đặt bàn - Thời gian nhận bàn - Tên khách hàng - Số điện thoại)"
                htmlFor="orderTable"
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Đơn đặt bàn không được để trống !")]}
              >
                <Select
                  showSearch={true}
                  allowClear={true}
                  id="orderTable"
                  placeholder="Chọn Đơn đặt bàn (Mã Đơn đặt bàn - Thời gian đặt bàn - Tên khách hàng - Số điện thoại)"
                  options={orderTables?.map((orderTable) => ({
                    label:
                      "#" +
                      orderTable!.id +
                      " - " +
                      orderTable!.timeOrder +
                      " - " +
                      orderTable!.fullname +
                      " - " +
                      orderTable!.phone,
                    value: orderTable.id,
                  }))}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button
              type="submit"
              className="modal__button btn yellow-secondary"
            >
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const AdminHandleUseTablesModal = {
    handleOccupied: (id?: number) => <HandleOccupied id={id} />,
    HandleOccupiedFromReversed: (
      id?: number,
      orderTable?: OrderTablesFormatType
    ) => <HandleOccupiedFromReversed id={id} orderTable={orderTable} />,
    handleReserved: (id?: number) => <HandleReserved id={id} />,
  };

  // Hàm gọi API để cập nhật trạng thái sử dụng bàn ăn
  const callApiToUpdateUseTable = async ({
    id,
    customerId,
    orderTableId,
    orderTableNewFullname,
    orderTableNewPhone,
    orderTableNewEmail,
    orderTableNewAddress,
    orderSheets,
    button,
    value,
  }: {
    id: number;
    customerId?: number;
    orderTableId?: number;
    orderTableNewFullname?: string;
    orderTableNewPhone?: string;
    orderTableNewEmail?: string;
    orderTableNewAddress?: string;
    orderSheets?: OrderSheetsFormatType[];
    button: HTMLElement;
    value: string;
  }) => {
    // Thêm class 'active' thể hiện là nút được nhấn
    button.classList.add("active");

    // Hỏi trước khi xử khi xử lý ?
    const answer = await openConfirmation({
      title: `Bạn có chắc chắn cập nhật ?`,
      content: "Hành động này không thể hoàn tác.",
    });
    if (answer) {
      // Biến giữ giá trị tương ứng với "trạng thái" cần thay đổi
      let status = null;
      if (
        value === UseTableStatus.occupied ||
        value === UseTableStatus.reserved ||
        value === UseTableStatus.empty ||
        value === UseTableStatus.repair
      ) {
        status = value;
      }

      // Gọi api xử lý
      const res = await HandleUpdateUseTable({
        id: id!,
        timeEnd: new Date().toISOString(),
        employeeId: 2,
        customerId:
          value === UseTableStatus.occupied && customerId!
            ? customerId
            : undefined,
        orderTableId:
          value === UseTableStatus.reserved && orderTableId!
            ? orderTableId
            : undefined,
        orderTableNewFullname:
          value === UseTableStatus.occupied && orderTableNewFullname!
            ? orderTableNewFullname
            : undefined,
        orderTableNewPhone:
          value === UseTableStatus.occupied && orderTableNewPhone!
            ? orderTableNewPhone
            : undefined,
        orderTableNewEmail:
          value === UseTableStatus.occupied && orderTableNewEmail!
            ? orderTableNewEmail
            : undefined,
        orderTableNewAddress:
          value === UseTableStatus.occupied && orderTableNewAddress!
            ? orderTableNewAddress
            : undefined,
        status: status!,
        orderSheets:
          value === UseTableStatus.empty &&
          orderSheets &&
          orderSheets.length > 0
            ? orderSheets!
            : undefined,
      });
      if (res.status === 200) {
        openNotification({
          type: "success",
          message: "Thành công",
          description: "Cập nhật thành công !",
          duration: 1.5,
        });
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["use-tables"] });
          setOpenModal(false);
          setOpenSecondModal(false);
        }, 1500);
      } else {
        openNotification({
          type: "error",
          message: "Thất bại",
          description:
            res.status === 400
              ? String(res.data)
                  .split("|")
                  .map((line, index) => (
                    <div key={index}>
                      {line}
                      <br />
                    </div>
                  ))
              : "Cập nhật thất bại !",
          duration: 1.5,
        });
        setTimeout(() => {
          button.classList.remove("active");
        }, 1500);
      }
    } else {
      // Xoá class 'active' thể hiện là nút không còn được nhấn
      button.classList.remove("active");
    }
  };

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">{objectName}</h2>
        </div>
        <div className="main__filter use-tables">
          <CustomFindInput
            selectItems={findOptions}
            placeholder="Nhập thông tin cần tìm kiếm"
            defaultValue=""
            className="main__filter-find"
            setFilterFindType={setFilterFindType}
            setFilterFindValue={setFilterFindValue}
          />
          <CustomFindSelect
            mode={undefined}
            placeholder="Chọn Tầng"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-floor"
            options={floorOptions}
            setFilterSelectValue={setFilterFloorValue}
          />
          <CustomFindSelect
            mode={undefined}
            placeholder="Chọn Trạng thái"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-status"
            options={statusOptions}
            setFilterSelectValue={setFilterStatusValue}
          />
        </div>
        <div className="main__use-tables">
          {useTables?.map((useTable) => {
            if (useTable!.table!.status !== CommonStatus.active) return null;

            return (
              <div
                key={useTable?.id}
                className={
                  "use-table " +
                  (useTable!.status === UseTableStatus.occupied
                    ? "red"
                    : useTable!.status === UseTableStatus.reserved
                    ? "yellow"
                    : useTable!.status === UseTableStatus.empty
                    ? "green"
                    : "gray")
                }
                onClick={() =>
                  updatePropertiesModal(
                    "Thông tin bàn ăn",
                    true,
                    "80%",
                    "use-tables",
                    useTable!.status === UseTableStatus.occupied
                      ? AdminUseTablesModal.occupied(useTable)
                      : useTable!.status === UseTableStatus.reserved
                      ? AdminUseTablesModal.reserved(useTable)
                      : useTable!.status === UseTableStatus.empty
                      ? AdminUseTablesModal.empty(useTable)
                      : AdminUseTablesModal.repair(useTable)
                  )
                }
              >
                <div className="title">{useTable!.table!.name}</div>
                <div className="info">
                  <b>Tầng:</b> {useTable!.table!.floor!.name}
                </div>
                <div className="info">
                  <b>Số chỗ ngồi:</b> {useTable!.table!.seats}
                </div>
                <div className="info">
                  <b>Trạng thái:</b>{" "}
                  <span className="status">{useTable!.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      {openModal && (
        <CustomModal
          title={titleModal}
          openModal={openModal}
          setOpenModal={() => setOpenModal(false)}
          width={widthModal}
          className={classNameModal}
          children={SecondModal}
        />
      )}
      {openSecondModal && (
        <CustomModal
          key="second-modal"
          title={titleSecondModal}
          openModal={openSecondModal}
          setOpenModal={() => setOpenSecondModal(false)}
          width={widthSecondModal}
          className={classNameSecondModal}
          children={childrenSecondModal}
        />
      )}
    </>
  );
};

export default AdminUseTablesPage;
