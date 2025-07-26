import { useEffect, useState, type ReactNode } from "react";
import { type SelectProps } from "antd";
import type { FloorsType, OrderSheetsFormatType } from "../../../common/types";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomDateRangePicker from "../../../components/admin/date-ranger-picker";
import CustomModal from "../../../components/admin/modal";
import { getElapsedTimeText, useElapsedTime } from "../../../hook/time";
import { openNotification } from "../../../utils/showNotification";
import { FindAllFloor, FindAllOrderSheetCurrentDate, HandleUpdateOrderSheet } from "../../../services/api";
import OrderSheetCard from "../../../components/admin/order-sheet-card";
import TextArea from "antd/es/input/TextArea";
import { openConfirmation } from "../../../utils/showConfirmation";
import { OrderSheetStatus } from "../../../common/values";

// Admin Order Sheets Page
const AdminOrderSheetsPage = () => {
  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  const [floors, setFloors] = useState<FloorsType[]>([]);
  const [orderSheets, setOrderSheets] = useState<OrderSheetsFormatType[]>([]);

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Thời gian gọi món bắt đầu / Thời gian gọi món kết thúc
  const [filterTimeValue, setFilterTimeValue] = useState<[string, string]>();
  // - Tầng
  const floorOptions: SelectProps["options"] = floors.map((floor) => ({ label: floor.name, value: floor.id }));
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
    const elapsed = isPending || isConfirm
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
        {
          (isPending || isConfirm) && (
            <div className="info">
              <b>Thời gian đã chờ:</b> {elapsed.text}
            </div>
          )
        }
        {
          isService && (
            <div className="info">
              <b>Thời gian phục vụ:</b> {timeService!}
            </div>
          )
        }
        {
          (isService || isConfirm || isCancel) && (
            <div className="info">
              <b>Nhân viên xác nhận:</b> {employee!.fullname} - {employee!.phone} - {employee!.email}
            </div>
          )
        }
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
              <col width="14%" />
              <col width="40%" />
              <col width="23%" />
              <col width="23%" />
            </colgroup>
            <thead>
              <tr>
                <th>Mã món ăn</th>
                <th>Tên món ăn</th>
                <th>Đơn vị</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {orderSheetDetails?.map((orderSheetDetail) => (
                <tr>
                  <td>{orderSheetDetail!.food!.id}</td>
                  <td className="left">{orderSheetDetail!.food!.name}</td>
                  <td>{orderSheetDetail!.food!.unit}</td>
                  <td>{orderSheetDetail!.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="info">
          <b>Lời nhắn:</b> <TextArea placeholder="Nhập Lời nhắn" value={messageValue!} onChange={(e) => setMessageValue(e.target.value)} disabled={isCancel || isService} />
        </div>
        <div className="note">Ghi chú: {note! ? note : "Không"}</div>
        <div className="modal__buttons">
          {status! === OrderSheetStatus.confirm && (
            <button
              className="modal__button secondary btn purple-secondary"
              onClick={(e) =>
                callApiToUpdateOrderSheet(
                  id!,
                  e.target as HTMLElement,
                  OrderSheetStatus.serviced,
                  messageValue,
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
                    messageValue,
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
                    messageValue,
                  )
                }
              >
                {OrderSheetStatus.canceled}
              </button>
            </>
          )}
        </div>
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
    messageValue: string,
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
      if (value === OrderSheetStatus.serviced || value === OrderSheetStatus.confirm || value === OrderSheetStatus.canceled) {
        status = value;
      }

      // Gọi api xử lý
      const res = await HandleUpdateOrderSheet({
        id: id,
        timeService: value === OrderSheetStatus.serviced ? new Date().toISOString() : undefined,
        employeeId: 2,
        message: messageValue! || undefined,
        status: status!,
      });
      if (res.status === 200) {
        openNotification({
          type: "success",
          message: "Thành công",
          description: "Cập nhật thành công !",
          duration: 1.5,
        });
        setTimeout(() => {
          getAllOrderSheet();
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

  // Hàm cập nhật danh sách các sử dụng bàn ăn (gọi API)
  const getAllFloor = async () => {
    const res = await FindAllFloor({
      statusValue: ["Hoạt động"],
    });
    if (res!.status === 200) {
      setFloors(res!.data);
    } else {
      openNotification({
        type: "error",
        message: "Truy vấn dữ liệu thất bại",
        description: "Lỗi phát sinh khi truy vấn dữ liệu",
        duration: 2,
      });
    }
  };
  const getAllOrderSheet = async () => {
    const res = await FindAllOrderSheetCurrentDate({
      floorValue: filterFloorValue!,
      statusValue: filterStatusValue!,
    });
    if (res!.status === 200) {
      res!.data.sort((a, b) => b.id! - a.id!);
      setOrderSheets(res!.data);
    } else {
      openNotification({
        type: "error",
        message: "Truy vấn dữ liệu thất bại",
        description: "Lỗi phát sinh khi truy vấn dữ liệu",
        duration: 2,
      });
    }
  };

  //
  useEffect(() => {
    getAllFloor();
    getAllOrderSheet();
  }, []);
  useEffect(() => {
    getAllOrderSheet();
  }, [filterFloorValue, filterStatusValue]);

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">Vận hành quán ăn - Gọi món ăn</h2>
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
          {orderSheets.map((orderSheet, index) => (
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
