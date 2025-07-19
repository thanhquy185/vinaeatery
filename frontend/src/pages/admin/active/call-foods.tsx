import { useEffect, useState, type ReactNode } from "react";
import { type SelectProps } from "antd";
import type { OrderSheetsType } from "../../../common/types";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomDateRangePicker from "../../../components/admin/date-ranger-picker";
import CustomModal from "../../../components/admin/modal";
import { getElapsedTimeText, useElapsedTime } from "../../../hook/time";

// Các giá trị chung
// - Trạng thái
const serviced = "Đã phục vụ";
const confirm = "Đang làm món";
const cancel = "Đã huỷ phiếu";
const pending = "Đang chờ xác nhận";

// Admin Call Foods Page
const AdminCallFoodsPage = () => {
  const orderSheetsTemp: OrderSheetsType[] = [
    {
      id: 1,
      timeCreate: "2025-06-28 17:18:45",
    //   timeAuthorized: "2025-05-28 17:24:45",
      table: {
        id: 1,
        name: "Bàn 1",
        category: {
          id: 10,
          name: "Loại bàn 1",
        },
        floor: {
          id: 1,
          name: "Tầng 1",
        },
      },
      employee: {
        id: 1,
        fullname: "123",
      },
      note: "",
      status: "Đang chờ xác nhận",
      orderSheetDetails: [
        {
          id: {
            orderSheet: {
              id: 1,
            },
            food: {
              id: 1,
              name: "Món ăn 1",
            },
          },
          quantity: 24,
        },
      ],
    },
  ];

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Thời gian gọi món bắt đầu / Thời gian gọi món kết thúc
  const [filterTimeValue, setFilterTimeValue] = useState<[string, string]>();
  // - Tầng
  const floorOptions: SelectProps["options"] = [
    { label: "#0 - Tầng 0", value: 0 },
  ];
  const [filterFloorValue, setFilterFloorValue] = useState<string[] | null>([]);
  // - Tầng
  const tableOptions: SelectProps["options"] = [
    { label: "#0 - Bàn 0", value: 0 },
  ];
  const [filterTableValue, setFilterTableValue] = useState<string[] | null>([]);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: serviced, value: serviced },
    { label: confirm, value: confirm },
    { label: cancel, value: cancel },
    { label: pending, value: pending },
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
  const HandleCallFoods = ({
    id,
    timeCreate,
    timeAuthorized,
    employee,
    table,
    note,
    status,
    orderSheetDetails,
  }: OrderSheetsType) => {
    const isPending = status! === pending;
    const orderTime = timeCreate!;

    // Nếu đang pending thì đếm tự động mỗi giây
    const elapsed = isPending
      ? useElapsedTime(orderTime)
      : getElapsedTimeText(orderTime, timeAuthorized! as string);

    return (
      <>
        <div className="info">
          <b>Mã phiếu:</b> #{id!}
        </div>
        <div className="info">
          <b>Thời gian gọi món:</b> {timeCreate!}
        </div>
        {isPending ? (
          <div className="info">
            <b>Thời gian đã chờ:</b> {elapsed.text}
          </div>
        ) : (
          <>
            <div className="info">
              <b>Thời gian xác nhận:</b> {timeAuthorized!}
            </div>
            <div className="info">
              <b>Nhân viên xác nhận:</b> #{employee!.id} - {employee!.fullname}{" "}
              - {employee!.phone} - {employee!.email}
            </div>
          </>
        )}
        <div className="info">
          <b>Bàn ăn:</b> #{table!.id} - {table!.name} - {table!.category?.name}{" "}
          (#
          {table!.category?.id}) - {table!.floor?.name} (#{table!.floor?.id})
        </div>
        <div className="info">
          <b>Trạng thái:</b>{" "}
          <span
            className={
              "status " +
              (status! === serviced
                ? "purple"
                : status! === confirm
                ? "green"
                : status! === cancel
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
                  <td>{orderSheetDetail!.id!.food!.id}</td>
                  <td className="left">{orderSheetDetail!.id!.food!.name}</td>
                  <td>{orderSheetDetail!.id!.food!.unit}</td>
                  <td>{orderSheetDetail!.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="note">Ghi chú: {note! ? note : "Không"}</div>
        <div className="modal__buttons">
          {status! === confirm && (
            <button className="modal__button secondary btn purple-secondary">
              {serviced}
            </button>
          )}
          {status! === pending && (
            <>
              <button className="modal__button secondary btn green-secondary">
                {confirm}
              </button>
              <button className="modal__button secondary btn red-secondary">
                {cancel}
              </button>
            </>
          )}
        </div>
      </>
    );
  };
  const AdminCallFoodsModal = {
    handle: (orderSheet: OrderSheetsType) => (
      <HandleCallFoods
        id={orderSheet!.id}
        timeCreate={orderSheet!.timeCreate}
        timeAuthorized={orderSheet!.timeAuthorized}
        employee={orderSheet!.employee}
        table={orderSheet!.table}
        note={orderSheet!.note}
        status={orderSheet!.status}
        orderSheetDetails={orderSheet!.orderSheetDetails}
      />
    ),
  };

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
            mode="tags"
            placeholder="Chọn Tầng"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-floor"
            options={floorOptions}
            setFilterSelectValue={setFilterFloorValue}
          />
          <CustomFindSelect
            mode="tags"
            placeholder="Chọn Bàn"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-table"
            options={tableOptions}
            setFilterSelectValue={setFilterTableValue}
          />
          <CustomFindSelect
            mode="tags"
            placeholder="Chọn Trạng thái"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-status"
            options={statusOptions}
            setFilterSelectValue={setFilterStatusValue}
          />
        </div>
        <div className="main__order-sheets call-foods">
          {orderSheetsTemp.map((orderSheet: OrderSheetsType, index: number) => {
            const isPending = orderSheet!.status === pending;
            const orderTime = orderSheet!.timeCreate as string;

            // Nếu đang pending thì đếm tự động mỗi giây
            const elapsed = isPending
              ? useElapsedTime(orderTime)
              : getElapsedTimeText(
                  orderTime,
                  orderSheet!.timeAuthorized as string
                );

            // Gán màu tùy theo thời gian đã chờ
            let colorClass = "";
            if (elapsed.seconds > 15 * 60) colorClass = "red";
            else if (elapsed.seconds > 10 * 60) colorClass = "orange";
            else colorClass = "green";

            return (
              <div
                key={index}
                className={`order-sheet ${colorClass}`}
                onClick={() =>
                  updatePropertiesModal(
                    "Phiếu gọi món",
                    true,
                    "80%",
                    "call-foods",
                    AdminCallFoodsModal.handle(orderSheet)
                  )
                }
              >
                <h3>
                  {"#" +
                    orderSheet!.table!.id +
                    " - " +
                    orderSheet!.table!.name}
                </h3>
                <div className="sub-info">
                  <b>Tầng:</b>{" "}
                  {"#" +
                    orderSheet!.table!.floor!.id +
                    " - " +
                    orderSheet!.table!.floor!.name}
                </div>
                <div className="sub-info">
                  <b>Gọi lúc:</b> {orderTime}
                </div>
                {isPending ? (
                  <div className="sub-info">
                    <b>Đã chờ:</b> {elapsed.text}
                  </div>
                ) : (
                  <div className="sub-info">
                    <b>Xác nhận lúc:</b> {orderSheet!.timeAuthorized}
                  </div>
                )}
                <div className="sub-info">
                  <b>Tổng số món:</b> {orderSheet!.orderSheetDetails!.length}
                </div>
                <div
                  className="sub-info note line-clamp"
                  style={{ "--line-clamp": 4 } as React.CSSProperties}
                >
                  <b>Ghi chú:</b> {orderSheet!.note}
                </div>
                <div
                  className={
                    "status " +
                    (orderSheet!.status === serviced
                      ? "purple"
                      : orderSheet!.status === confirm
                      ? "green"
                      : orderSheet!.status === cancel
                      ? "red"
                      : "")
                  }
                >
                  {orderSheet!.status}
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
          children={childrenModal}
        />
      )}
    </>
  );
};

export default AdminCallFoodsPage;
