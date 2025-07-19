import { useEffect, useState, type ReactNode } from "react";
import { Form, Select, type SelectProps } from "antd";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomDateRangePicker from "../../../components/admin/date-ranger-picker";
import CustomModal from "../../../components/admin/modal";
import { ruleRequired } from "../../../common/rules";
import { openConfirmation } from "../../../utils/showConfirmation";
import { openNotification } from "../../../utils/showNotification";

// Các giá trị chung
// - Trạng thái
const occupied = "Đang có khách";
const reserved = "Đã đặt bàn";
const empty = "Đang trống";
const repair = "Đang bảo trì";

// Admin Status Tables Page
const AdminUseTablesPage = () => {
  const data = [
    {
      id: 1,
      table: "Bàn 1",
      floor: "Tầng 1",
      seats: 5,
      status: "Đang có khách",
    },
    {
      id: 2,
      table: "Bàn 2",
      floor: "Tầng 2",
      seats: 5,
      status: "Đã đặt bàn",
    },
    {
      id: 3,
      table: "Bàn 3",
      floor: "Tầng 3",
      seats: 5,
      status: "Đang trống",
    },
    {
      id: 4,
      table: "Bàn 4",
      floor: "Tầng 4",
      seats: 5,
      status: "Đang bảo trì",
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
    { label: occupied, value: occupied },
    { label: reserved, value: reserved },
    { label: empty, value: empty },
    { label: repair, value: repair },
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
  const OccupiedUseTables = () => {
    return (
      <>
        <div className="info">
          <b>Bàn:</b>
        </div>
        <div className="info">
          <b>Tầng:</b>
        </div>
        <div className="info">
          <b>Số chỗ ngồi:</b>
        </div>
        <div className="info">
          <b>Khách hàng:</b>
        </div>
        <div className="info">
          <b>Thời gian nhận bàn:</b>
        </div>
        <div className="info">
          <b>Trạng thái:</b> <span className="red">{status!}</span>
        </div>
        <div className="info">
          <b>Chi tiết phiếu gọi món:</b>
          <table>
            <colgroup>
              <col width="20%" />
              <col width="30%" />
              <col width="30%" />
              <col width="20%" />
            </colgroup>
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Thời gian gọi món</th>
                <th>Thời gian xác nhận</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        <div className="modal__buttons mg-top">
          <button
            type="button"
            className="modal__button secondary btn"
            onClick={async (e) => {
              // Nút để submit form
              const submitButton = e.currentTarget;

              // Thêm class 'active' thể hiện nút đang được nhấn
              submitButton?.classList.add("active");

              // Hỏi trước khi xử khi xử lý ?
              const answer = await openConfirmation({
                title: `Bạn có chắc chắn thanh toán ?`,
                content: "Hành động này không thể hoàn tác.",
              });
              if (answer) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: "Thanh toán tiền bàn thành công !",
                  duration: 1.5,
                });
              }

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }}
          >
            Thanh toán tiền bàn
          </button>
        </div>
      </>
    );
  };
  const ReservedUseTables = () => {
    return (
      <>
        <div className="info">
          <b>Bàn:</b>
        </div>
        <div className="info">
          <b>Tầng:</b>
        </div>
        <div className="info">
          <b>Số chỗ ngồi:</b>
        </div>
        <div className="info">
          <b>Khách hàng:</b>
        </div>
        <div className="info">
          <b>Thời gian đặt bàn:</b>
        </div>
        <div className="info">
          <b>Trạng thái:</b> <span className="yellow">{status!}</span>
        </div>
        <div className="modal__buttons mg-top">
          <button
            type="button"
            className="modal__button secondary btn red-secondary"
          >
            Khách nhận bàn
          </button>
          <button
            type="button"
            className="modal__button secondary btn green-secondary"
            onClick={async (e) => {
              // Nút để submit form
              const submitButton = e.currentTarget;

              // Thêm class 'active' thể hiện nút đang được nhấn
              submitButton?.classList.add("active");

              // Hỏi trước khi xử khi xử lý ?
              const answer = await openConfirmation({
                title: `Bạn có chắc chắn bàn trống ?`,
                content: "Hành động này không thể hoàn tác.",
              });
              if (answer) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: "Cập nhật bàn trống thành công !",
                  duration: 1.5,
                });
              }

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }}
          >
            {empty}
          </button>
        </div>
      </>
    );
  };
  const EmptyUseTables = () => {
    return (
      <>
        <div className="info">
          <b>Bàn:</b>
        </div>
        <div className="info">
          <b>Tầng:</b>
        </div>
        <div className="info">
          <b>Số chỗ ngồi:</b>
        </div>
        <div className="info">
          <b>Trạng thái:</b> <span className="green">{status!}</span>
        </div>
        <div className="modal__buttons mg-top">
          <button
            type="button"
            className="modal__button secondary btn red-secondary"
            onClick={() =>
              updatePropertiesSecondModal(
                "Bàn đang có khách",
                true,
                "60%",
                "secondary red",
                AdminHandleUseTablesModal.handleOccupied()
              )
            }
          >
            {occupied}
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
                AdminHandleUseTablesModal.handleReserved()
              )
            }
          >
            {reserved}
          </button>
          <button
            type="button"
            className="modal__button secondary btn gray-secondary"
            onClick={async (e) => {
              // Nút để submit form
              const submitButton = e.currentTarget;

              // Thêm class 'active' thể hiện nút đang được nhấn
              submitButton?.classList.add("active");

              // Hỏi trước khi xử khi xử lý ?
              const answer = await openConfirmation({
                title: `Bạn có chắc chắn bảo trì ?`,
                content: "Hành động này không thể hoàn tác.",
              });
              if (answer) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: "Cập nhật bảo trì thành công !",
                  duration: 1.5,
                });
              }

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }}
          >
            {repair}
          </button>
        </div>
      </>
    );
  };
  const RepairUseTables = () => {
    return (
      <>
        <div className="info">
          <b>Bàn:</b>
        </div>
        <div className="info">
          <b>Tầng:</b>
        </div>
        <div className="info">
          <b>Số chỗ ngồi:</b>
        </div>
        <div className="info">
          <b>Trạng thái:</b> <span className="gray">{status!}</span>
        </div>
        <div className="modal__buttons mg-top">
          <button
            type="button"
            className="modal__button secondary btn green-secondary"
            onClick={async (e) => {
              // Nút để submit form
              const submitButton = e.currentTarget;

              // Thêm class 'active' thể hiện nút đang được nhấn
              submitButton?.classList.add("active");

              // Hỏi trước khi xử khi xử lý ?
              const answer = await openConfirmation({
                title: `Bạn có chắc chắn bàn trống ?`,
                content: "Hành động này không thể hoàn tác.",
              });
              if (answer) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: "Cập nhật bàn trống thành công !",
                  duration: 1.5,
                });
              }

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }}
          >
            {empty}
          </button>
        </div>
      </>
    );
  };
  const AdminUseTablesModal = {
    occupied: () => <OccupiedUseTables />,
    reserved: () => <ReservedUseTables />,
    empty: () => <EmptyUseTables />,
    repair: () => <RepairUseTables />,
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
  const HandleOccupied = () => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          className="modal__form split-2"
        >
          <div className="modal__form-group-warper">
            <div className="modal__form-group">
              <Form.Item
                name="customer"
                label="Khách hàng (Mã khách hàng - Tên khách hàng - Số điện thoại - Email)"
                htmlFor="customer"
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Khách hàng không được để trống !")]}
              >
                <Select
                  showSearch={true}
                  allowClear={true}
                  id="customer"
                  placeholder="Chọn Khách hàng (Mã khách hàng - Tên khách hàng - Số điện thoại - Email)"
                  // options={customers?.map((customer) => ({
                  //   label: "#" + customer.id + " - " + customer.name,
                  //   value: customer.id,
                  // }))}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button className="modal__button btn red-secondary">
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const HandleReserved = () => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          className="modal__form split-2"
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
                  placeholder="Chọn Đơn đặt bàn (Mã Đơn đặt bàn - Thời gian đặt bàn - Thời gian nhận bàn - Tên khách hàng - Số điện thoại)"
                  // options={orderTables?.map((orderTable) => ({
                  //   label: "#" + orderTable.id + " - " + orderTable.name,
                  //   value: orderTable.id,
                  // }))}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button className="modal__button btn yellow-secondary">
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const AdminHandleUseTablesModal = {
    handleOccupied: () => <HandleOccupied />,
    handleReserved: () => <HandleReserved />,
  };

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">Vận hành quán ăn - Sử dụng bàn ăn</h2>
        </div>
        <div className="main__filter use-tables">
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
        <div className="main__use-tables">
          {data.map((item) => (
            <div
              className={
                "use-table " +
                (item!.status === occupied
                  ? "red"
                  : item!.status === reserved
                  ? "yellow"
                  : item!.status === empty
                  ? "green"
                  : "gray")
              }
              onClick={() =>
                updatePropertiesModal(
                  "Thông tin bàn ăn",
                  true,
                  // item!.status === occupied
                  //   ? "80%"
                  //   : item!.status === reserved
                  //   ? "50%"
                  //   : item!.status === empty
                  //   ? "50%"
                  //   : "50%",
                  "80%",
                  "use-tables",
                  item!.status === occupied
                    ? AdminUseTablesModal.occupied()
                    : item!.status === reserved
                    ? AdminUseTablesModal.reserved()
                    : item!.status === empty
                    ? AdminUseTablesModal.empty()
                    : AdminUseTablesModal.repair()
                )
              }
            >
              <div className="title">{item!.table}</div>
              <div className="info">
                <b>Tầng:</b> {item!.floor}
              </div>
              <div className="info">
                <b>Số chỗ ngồi:</b> {item!.seats}
              </div>
              <div className="info">
                <b>Trạng thái:</b>{" "}
                <span className="status">{item!.status}</span>
              </div>
            </div>
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
