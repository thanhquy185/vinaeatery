import { useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type SelectProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { OrderSheetsFormatType } from "../../../common/types";
import {
  CommonStatus,
  OrderSheetStatus,
  ReactQueryGetData,
} from "../../../common/values";
import { getElapsedTimeText, useElapsedTime } from "../../../hook/time";
import CustomFindSelect from "../../../components/admin/find-select";
import OrderSheetCard from "../../../components/admin/order-sheet-card";
import CustomModal from "../../../components/admin/modal";
import {
  FindAllFloor,
  FindAllOrderSheetCurrentDate,
  HandleUpdateOrderSheet,
} from "../../../services/api";
import { getActionNameVn } from "../../../services/default-actions";
import { getActionsString } from "../../../services/employee-login";
import { vietnamMoneyFormat } from "../../../utils/otherEvents";
import { openConfirmation } from "../../../utils/showConfirmation";
import { openNotification } from "../../../utils/showNotification";
import CustomFindInput from "../../../components/admin/find-input";

// Các giá trị chung
// - Tên đối tượng
const objectName = "Phiếu gọi món";

// Admin Order Sheets Page
const AdminOrderSheetsPage = ({ functionId }: { functionId: number }) => {
  // Danh sách tác vụ mà nhân viên có thể thực hiện theo mã chức năng
  const validActions = getActionsString({ currentFunctionId: functionId });

  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Các biến giữ dữ liệu về tầng
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
  // - Thời gian gọi món bắt đầu / Thời gian gọi món kết thúc
  const [filterTimeValue, setFilterTimeValue] = useState<[string, string]>();
  // - Tầng
  const floorOptions: SelectProps["options"] = floors?.map((floor) => ({
    label: floor.name,
    value: floor.id,
  }));
  const [filterFloorValue, setFilterFloorValue] = useState<string[] | null>([]);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: OrderSheetStatus.serviced, value: OrderSheetStatus.serviced },
    { label: OrderSheetStatus.confirm, value: OrderSheetStatus.confirm },
    { label: OrderSheetStatus.canceled, value: OrderSheetStatus.canceled },
    { label: OrderSheetStatus.pending, value: OrderSheetStatus.pending },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    []
  );

  // Truy vấn dữ liệu phiếu gọi món (hôm nay)
  const { data: orderSheets } = useQuery({
    queryKey: [
      "order-sheets",
      filterFindType!,
      filterFindValue!,
      filterFloorValue!,
      filterStatusValue!,
    ],
    queryFn: async () => {
      const res = await FindAllOrderSheetCurrentDate({
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
  });

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const [titleModal, setTitleModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [widthModal, setWidthModal] = useState<string>("");
  const [classNameModal, setClassNameModal] = useState<string>("");
  const [childrenModal, setChildrenModal] = useState<ReactNode>();
  // - Hàm cập nhật
  const updatePropertiesModal = (
    titleModal: string,
    openModal: boolean,
    widthModal: string,
    classNameModal: string,
    childrenModal: ReactNode
  ) => {
    setTitleModal(titleModal);
    setOpenModal(openModal);
    setWidthModal(widthModal);
    setClassNameModal(classNameModal);
    setChildrenModal(childrenModal);
  };
  // - Các modal tương ứng cho từng chức năng
  const HandleOrderSheets = ({
    id,
    timeCreate,
    timeService,
    employee,
    table,
    note,
    message,
    totalPrice,
    status,
    orderSheetDetails,
  }: OrderSheetsFormatType) => {
    //
    const isPending = status! === OrderSheetStatus.pending;
    const isCancel = status! === OrderSheetStatus.canceled;
    const isConfirm = status! === OrderSheetStatus.confirm;
    const isService = status! === OrderSheetStatus.serviced;
    const orderTime = timeCreate!;

    // Nếu đang pending thì đếm tự động mỗi giây
    const elapsed =
      isPending || isConfirm
        ? useElapsedTime(orderTime)
        : getElapsedTimeText(orderTime, timeService! as string);

    //
    const [messageValue, setMessageValue] = useState<string>(message!);

    return (
      <>
        <div className="info">
          <b>Mã phiếu:</b> #{id!}
        </div>
        <div className="info">
          <b>Bàn ăn:</b> {table!.name} - {table!.floor?.name}
        </div>
        <div className="info">
          <b>Thời gian gọi món:</b> {timeCreate!}
        </div>
        {(isPending || isConfirm) && (
          <div className="info">
            <b>Thời gian đã chờ:</b> {elapsed.text}
          </div>
        )}
        {isService && (
          <div className="info">
            <b>Thời gian phục vụ:</b> {timeService!}
          </div>
        )}
        {(isService || isConfirm || isCancel) && (
          <div className="info">
            <b>Nhân viên xác nhận:</b> {employee!.fullname} - {employee!.phone}{" "}
            - {employee!.email}
          </div>
        )}
        <div className="info">
          <b>Tổng tiền món ăn:</b> {vietnamMoneyFormat(totalPrice!)}
        </div>
        <div className="info">
          <b>Trạng thái:</b>{" "}
          <span
            className={
              "status " +
              (status! === OrderSheetStatus.serviced
                ? "purple"
                : status! === OrderSheetStatus.confirm
                ? "green"
                : status! === OrderSheetStatus.canceled
                ? "red"
                : "gray")
            }
          >
            {status!}
          </span>
        </div>
        <div className="info">
          <b>Chi tiết gọi món:</b>
          <table>
            <colgroup>
              <col width="12%" />
              <col width="36%" />
              <col width="12%" />
              <col width="20%" />
              <col width="20%" />
            </colgroup>
            <thead>
              <tr>
                <th>Mã món ăn</th>
                <th>Tên món ăn</th>
                <th>Đơn vị</th>
                <th>Giá bán</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {orderSheetDetails?.map((orderSheetDetail) => (
                <tr>
                  <td>{orderSheetDetail!.food!.id}</td>
                  <td className="left">{orderSheetDetail!.food!.name}</td>
                  <td>{orderSheetDetail!.food!.unit}</td>
                  <td>{vietnamMoneyFormat(orderSheetDetail!.price!)}</td>
                  <td>{orderSheetDetail!.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="info">
          <b>Lời nhắn:</b>{" "}
          <TextArea
            placeholder="Nhập Lời nhắn"
            value={messageValue!}
            onChange={(e) => setMessageValue(e.target.value)}
            disabled={isCancel || isService}
          />
        </div>
        <div className="note">Ghi chú: {note! ? note : "Không"}</div>
        {validActions!.includes(getActionNameVn(2)) && (
          <div className="modal__buttons">
            {status! === OrderSheetStatus.confirm && (
              <button
                className="modal__button secondary btn purple-secondary"
                onClick={(e) =>
                  callApiToUpdateOrderSheet(
                    id!,
                    e.target as HTMLElement,
                    OrderSheetStatus.serviced,
                    messageValue
                  )
                }
              >
                {OrderSheetStatus.serviced}
              </button>
            )}
            {status! === OrderSheetStatus.pending && (
              <>
                <button
                  className="modal__button secondary btn green-secondary"
                  onClick={(e) =>
                    callApiToUpdateOrderSheet(
                      id!,
                      e.target as HTMLElement,
                      OrderSheetStatus.confirm,
                      messageValue
                    )
                  }
                >
                  {OrderSheetStatus.confirm}
                </button>
                <button
                  className="modal__button secondary btn red-secondary"
                  onClick={(e) =>
                    callApiToUpdateOrderSheet(
                      id!,
                      e.target as HTMLElement,
                      OrderSheetStatus.canceled,
                      messageValue
                    )
                  }
                >
                  {OrderSheetStatus.canceled}
                </button>
              </>
            )}
          </div>
        )}
      </>
    );
  };
  const AdminOrderSheetsModal = {
    handle: (orderSheet: OrderSheetsFormatType) => (
      <HandleOrderSheets
        id={orderSheet!.id}
        timeCreate={orderSheet!.timeCreate}
        timeService={orderSheet!.timeService}
        employee={orderSheet!.employee}
        table={orderSheet!.table}
        note={orderSheet!.note}
        message={orderSheet!.message}
        totalPrice={orderSheet!.totalPrice}
        status={orderSheet!.status}
        orderSheetDetails={orderSheet!.orderSheetDetails}
      />
    ),
  };
  // Hàm gọi API để cập nhật trạng thái phiếu gọi món
  const callApiToUpdateOrderSheet = async (
    id: number,
    button: HTMLElement,
    value: string,
    messageValue: string
  ) => {
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
        value === OrderSheetStatus.serviced ||
        value === OrderSheetStatus.confirm ||
        value === OrderSheetStatus.canceled
      ) {
        status = value;
      }

      // Gọi api xử lý
      const res = await HandleUpdateOrderSheet({
        id: id,
        timeService:
          value === OrderSheetStatus.serviced
            ? new Date().toISOString()
            : undefined,
        employeeId: 2,
        message: messageValue! || undefined,
        status: status!,
      });
      if (res.status === 200) {
        openNotification({
          type: "success",
          message: "Thành công",
          description: "Cập nhật thành công!",
          duration: 1.5,
        });
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["order-sheets"] });
          setOpenModal(false);
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
              : "Cập nhật thất bại!",
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
        <div className="main__filter call-foods">
          {/* <CustomDateRangePicker
            showTime={true}
            placeholder={[
              "Thời gian gọi món bắt đầu",
              "Thời gian gọi món kết thúc",
            ]}
            className="main__filter-select filter-time"
            setDateRangeValue={setFilterTimeValue}
          /> */}
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
        <div className="main__order-sheets call-foods">
          {orderSheets?.map((orderSheet, index) => (
            <OrderSheetCard
              key={index}
              orderSheet={orderSheet}
              onClick={() =>
                updatePropertiesModal(
                  "Phiếu gọi món",
                  true,
                  "80%",
                  "order-sheets",
                  AdminOrderSheetsModal.handle(orderSheet)
                )
              }
            />
          ))}
        </div>
      </main>
      {openModal && (
        <CustomModal
          title={titleModal}
          openModal={openModal}
          setOpenModal={() => setOpenModal(false)}
          width={widthModal}
          className={classNameModal}
          children={childrenModal}
        />
      )}
    </>
  );
};

export default AdminOrderSheetsPage;
