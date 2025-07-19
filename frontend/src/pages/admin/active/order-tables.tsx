import { useEffect, useState, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faPenToSquare,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Form } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { OrderTablesType } from "../../../common/types";
import { CustomPaginationProps } from "../../../common/pagination-props";
import CustomFindInput from "../../../components/admin/find-input";
import CustomDateRangePicker from "../../../components/admin/date-ranger-picker";
import CustomTableActions from "../../../components/admin/table-actions";
import CustomInput from "../../../components/admin/input";
import CustomSelect from "../../../components/admin/select";
import CustomTextArea from "../../../components/admin/text-area";
import CustomDatePicker from "../../../components/admin/date-picker";
import CustomModal from "../../../components/admin/modal";

// Admin Order Tables Page
const AdminOrderTablesPage = () => {
  // Cấu hình cột bảng dữ liệu của Đơn đặt bàn
  const columns: ColumnsType<OrderTablesType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: "8%",
    },
    {
      title: "Thời gian đặt bàn",
      dataIndex: "timeOrder",
      key: "timeOrder",
      sorter: true,
      width: "16%",
    },
    {
      title: "Thời gian đến ăn",
      dataIndex: "timeArrive",
      key: "timeArrive",
      sorter: true,
      width: "16%",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerFullname",
      key: "customerFullname",
      sorter: true,
      width: "18%",
      className: "left",
    },
    {
      title: "Số điện thoại",
      dataIndex: "customerPhone",
      key: "customerPhone",
      width: "12%",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: "22%",
      className: "left",
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      width: "8%",
      render: (text: any, record: OrderTablesType, index: number) => (
        <>
          <button
            className="action info"
            onClick={() =>
              updatePropertiesModal(
                "Chi tiết đơn đặt bàn",
                true,
                "89%",
                "info order-tables",
                AdminOrderTablesModal.detail(record)
              )
            }
          >
            <FontAwesomeIcon icon={faCircleInfo} />
          </button>
          <button
            className="action update margin-l"
            onClick={() =>
              updatePropertiesModal(
                "Cập nhật đơn đặt bàn",
                true,
                "89%",
                "update order-tables",
                AdminOrderTablesModal.update(record)
              )
            }
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </>
      ),
    },
  ];
  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  const [orderTables, setOrderTables] = useState<OrderTablesType[]>([
    {
      id: 1,
      timeOrder: "2025-06-26 00:00:00",
      timeArrive: "2025-06-27 15:00:00",
      employee: {
        id: 1,
        fullname: "Nhân viên 1",
        phone: "0987654321",
        email: "nv1@gmail.com",
        address: "địa chỉ nv1",
      },
      customerFullname: "abc",
      customerPhone: "1234567890",
      customerEmail: "abc@gmail.com",
      customerAddress: "địa chỉ abc",
      note: "tầng 2, bàn nào nhìn cửa sổ được",
    },
  ]);
  const {
    currentItems,
    handleTableChange,
    paginationProps,
    sortField,
    sortOrder,
  } = CustomPaginationProps(orderTables, 10, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Tên", value: "name" },
    { label: "SĐT", value: "phone" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  // - Ngày đặt bàn
  const [filterDateOrderValue, setFilterDateOrderValue] =
    useState<[string, string]>();
  // - Ngày đến ăn
  const [filterDateArriveValue, setFilterDateArriveValue] =
    useState<[string, string]>();

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
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title1: "Thông tin cơ bản",
    title2: "Thông tin người đặt bàn",
    id: "Mã đơn đặt bàn",
    timeOrder: "Thời gian đặt bàn",
    timeArrive: "Thời gian đến ăn",
    employee:
      "Nhân viên xác nhận (Mã nhân viên - Họ và tên - Số điện thoại - Email)",
    customerFullname: "Họ và tên",
    customerPhone: "Số điện thoại",
    customerEmail: "Email",
    customerAddress: "Địa chỉ",
    note: "Ghi chú",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    id: "Được xác định sau khi xác nhận thêm !",
    timeOrder: "Thời gian đặt bàn",
    timeArrive: "Thời gian đến ăn",
    employee: "",
    customerFullname: "Nhập Họ và tên",
    customerPhone: "Nhập Số điện thoại",
    customerEmail: "Nhập Email",
    customerAddress: "Nhập Địa chỉ",
    note: "Nhập Ghi chú",
  };
  // - Các modal tương ứng cho từng chức năng
  const DetailOrderTables = ({
    id,
    timeOrder,
    timeArrive,
    employee,
    customerFullname,
    customerPhone,
    customerEmail,
    customerAddress,
    note,
  }: OrderTablesType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{ layout: "vertical" }}
          className="modal__form split-3"
          autoComplete="off"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <CustomInput
                  className="text-center"
                  value={id!}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["timeOrder"]}
                className="modal__form-group-item"
              >
                <CustomDatePicker
                  showTime={true}
                  value={timeOrder!}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["timeArrive"]}
                className="modal__form-group-item"
              >
                <CustomDatePicker
                  showTime={true}
                  value={timeArrive!}
                  disabled={true}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["employee"]}
                className="modal__form-group-item multiple-2"
              >
                <CustomSelect
                  className="employees"
                  options={[
                    {
                      label: `${
                        employee!.fullname +
                        " - " +
                        employee!.phone +
                        " - " +
                        employee!.email
                      }`,
                      value: employee!.id,
                    },
                  ]}
                  value={employee!.id}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["note"]}
                className="modal__form-group-item multiple-2"
              >
                <CustomTextArea
                  className="multiple-2"
                  value={note!}
                  disabled={true}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["customerFullname"]}
                className="modal__form-group-item"
              >
                <CustomInput value={customerFullname!} disabled={true} />
              </Form.Item>
              <Form.Item
                label={defaultLabels["customerAddress"]}
                className="modal__form-group-item multiple-3 margin-bottom-0"
              >
                <CustomInput value={customerAddress!} disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["customerPhone"]}
                className="modal__form-group-item"
              >
                <CustomInput value={customerPhone!} disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["customerEmail"]}
                className="modal__form-group-item"
              >
                <CustomInput value={customerEmail!} disabled={true} />
              </Form.Item>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const CreateOrderTables = () => {
    const [form] = Form.useForm();
    const [timeOrderValue, setTimeOrderValue] = useState<string | string[]>();
    const [timeArriveValue, setTimeArriveValue] = useState<string | string[]>();
    const [customerFullnameValue, setCustomerFullnameValue] =
      useState<string>();
    const [customerPhoneValue, setCustomerPhoneValue] = useState<string>();
    const [customerEmailValue, setCustomerEmailValue] = useState<string>();
    const [customerAddressValue, setCustomerAddressValue] = useState<string>();
    const [noteValue, setNoteValue] = useState<string>();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{ layout: "vertical" }}
          className="modal__form split-3"
          autoComplete="off"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <CustomInput
                  value={defaultInputs["id"]}
                  className="text-center"
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["timeOrder"]}
                htmlFor="create-timeOrder"
                className="modal__form-group-item"
              >
                <CustomDatePicker
                  showTime={true}
                  id="create-timeOrder"
                  placeholder={defaultInputs["timeOrder"]}
                  value={timeOrderValue as string}
                  setDatePickerValue={setTimeOrderValue}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["timeArrive"]}
                htmlFor="create-timeArrive"
                className="modal__form-group-item"
              >
                <CustomDatePicker
                  showTime={true}
                  id="create-timeArrive"
                  placeholder={defaultInputs["timeArrive"]}
                  value={timeArriveValue as string}
                  setDatePickerValue={setTimeArriveValue}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["employee"]}
                className="modal__form-group-item multiple-2"
              >
                <CustomSelect
                  className="employees"
                  placeholder={defaultInputs["employee"]}
                  options={[
                    {
                      label: "Xử lý khi đăng nhập",
                      value: 0,
                    },
                  ]}
                  value={0}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["note"]}
                htmlFor="create-note"
                className="modal__form-group-item multiple-2"
              >
                <CustomTextArea
                  id="create-note"
                  className="multiple-2"
                  placeholder={defaultInputs["note"]}
                  setTextAreaValue={setNoteValue}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["customerFullname"]}
                htmlFor="create-customerFullname"
                className="modal__form-group-item"
              >
                <CustomInput
                  id="create-customerFullname"
                  placeholder={defaultInputs["customerFullname"]}
                  setInputValue={setCustomerFullnameValue}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["customerAddress"]}
                htmlFor="create-customerAddress"
                className="modal__form-group-item multiple-3"
              >
                <CustomInput
                  id="create-customerAddress"
                  placeholder={defaultInputs["customerAddress"]}
                  setInputValue={setCustomerAddressValue}
                />
                <button className="btn secondary-btn">Tạo địa chỉ</button>
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["customerPhone"]}
                htmlFor="create-customerPhone"
                className="modal__form-group-item"
              >
                <CustomInput
                  id="create-customerPhone"
                  placeholder={defaultInputs["customerPhone"]}
                  setInputValue={setCustomerPhoneValue}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["customerEmail"]}
                htmlFor="create-customerEmail"
                className="modal__form-group-item"
              >
                <CustomInput
                  id="create-customerEmail"
                  placeholder={defaultInputs["customerEmail"]}
                  setInputValue={setCustomerEmailValue}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button className="modal__button btn create">Xác nhận</button>
          </div>
        </Form>
      </>
    );
  };
  const UpdateOrderTables = ({
    id,
    timeOrder,
    timeArrive,
    employee,
    customerFullname,
    customerPhone,
    customerEmail,
    customerAddress,
    note,
  }: OrderTablesType) => {
    const [form] = Form.useForm();
    const [timeOrderValue, setTimeOrderValue] = useState<string | string[]>(
      timeOrder!
    );
    const [timeArriveValue, setTimeArriveValue] = useState<string | string[]>(
      timeArrive!
    );
    const [customerFullnameValue, setCustomerFullnameValue] = useState<string>(
      customerFullname!
    );
    const [customerPhoneValue, setCustomerPhoneValue] = useState<string>(
      customerPhone!
    );
    const [customerEmailValue, setCustomerEmailValue] = useState<string>(
      customerEmail!
    );
    const [customerAddressValue, setCustomerAddressValue] = useState<string>(
      customerAddress!
    );
    const [noteValue, setNoteValue] = useState<string>(note!);

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{ layout: "vertical" }}
          className="modal__form split-3"
          autoComplete="off"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <CustomInput
                  className="text-center"
                  value={id!}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["timeOrder"]}
                htmlFor="update-timeOrder"
                className="modal__form-group-item"
              >
                <CustomDatePicker
                  showTime={true}
                  id="update-timeOrder"
                  placeholder={defaultInputs["timeOrder"]}
                  value={timeOrderValue as string}
                  setDatePickerValue={setTimeOrderValue}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["timeArrive"]}
                htmlFor="update-timeArrive"
                className="modal__form-group-item"
              >
                <CustomDatePicker
                  showTime={true}
                  id="update-timeArrive"
                  placeholder={defaultInputs["timeArrive"]}
                  value={timeArriveValue as string}
                  setDatePickerValue={setTimeArriveValue}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["employee"]}
                className="modal__form-group-item multiple-2"
              >
                <CustomSelect
                  className="employees"
                  options={[
                    {
                      label: "Xử lý khi đăng nhập",
                      value: employee!.id,
                    },
                  ]}
                  value={employee!.id}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["note"]}
                htmlFor="update-note"
                className="modal__form-group-item multiple-2"
              >
                <CustomTextArea
                  id="update-note"
                  className="multiple-2"
                  placeholder={defaultInputs["note"]}
                  value={noteValue}
                  setTextAreaValue={setNoteValue}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["customerFullname"]}
                htmlFor="update-customerFullname"
                className="modal__form-group-item"
              >
                <CustomInput
                  id="update-customerFullname"
                  placeholder={defaultInputs["customerFullname"]}
                  value={customerFullnameValue}
                  setInputValue={setCustomerFullnameValue}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["customerAddress"]}
                htmlFor="update-customerAddress"
                className="modal__form-group-item multiple-3"
              >
                <CustomInput
                  id="update-customerAddress"
                  placeholder={defaultInputs["customerAddress"]}
                  value={customerAddressValue}
                  setInputValue={setCustomerAddressValue}
                />
                <button className="btn secondary-btn">Tạo địa chỉ</button>
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["customerPhone"]}
                htmlFor="update-customerPhone"
                className="modal__form-group-item"
              >
                <CustomInput
                  id="update-customerPhone"
                  placeholder={defaultInputs["customerPhone"]}
                  value={customerPhoneValue}
                  setInputValue={setCustomerPhoneValue}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["customerEmail"]}
                htmlFor="update-customerEmail"
                className="modal__form-group-item"
              >
                <CustomInput
                  id="update-customerEmail"
                  placeholder={defaultInputs["customerEmail"]}
                  value={customerEmailValue}
                  setInputValue={setCustomerEmailValue}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button className="modal__button btn update">Xác nhận</button>
          </div>
        </Form>
      </>
    );
  };
  const AdminOrderTablesModal = {
    detail: (orderTable: OrderTablesType) => (
      <DetailOrderTables
        id={orderTable!.id}
        timeOrder={orderTable!.timeOrder}
        timeArrive={orderTable!.timeArrive}
        employee={orderTable!.employee}
        customerFullname={orderTable!.customerFullname}
        customerPhone={orderTable!.customerPhone}
        customerEmail={orderTable!.customerEmail}
        customerAddress={orderTable!.customerAddress}
        note={orderTable!.note}
      />
    ),
    create: () => <CreateOrderTables />,
    update: (orderTable: OrderTablesType) => (
      <UpdateOrderTables
        id={orderTable!.id}
        timeOrder={orderTable!.timeOrder}
        timeArrive={orderTable!.timeArrive}
        employee={orderTable!.employee}
        customerFullname={orderTable!.customerFullname}
        customerPhone={orderTable!.customerPhone}
        customerEmail={orderTable!.customerEmail}
        customerAddress={orderTable!.customerAddress}
        note={orderTable!.note}
      />
    ),
  };

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">Vận hành quán ăn - Đơn đặt bàn</h2>
        </div>
        <div className="main__filter order-tables">
          <CustomFindInput
            selectItems={findOptions}
            placeholder="Nhập thông tin cần tìm kiếm"
            defaultValue=""
            className="main__filter-find"
            setFilterFindType={setFilterFindType}
            setFilterFindValue={setFilterFindValue}
          />
          <CustomDateRangePicker
            placeholder={["Ngày đặt bắt đầu", "Ngày đặt kết thúc"]}
            className="main__filter-select filter-date"
            setDateRangeValue={setFilterDateOrderValue}
          />
          <CustomDateRangePicker
            placeholder={["Ngày đến bắt đầu", "Ngày đến kết thúc"]}
            className="main__filter-select filter-date"
            setDateRangeValue={setFilterDateArriveValue}
          />
          <button
            className={
              "main__filter-button btn create" +
              (openModal &&
              String(titleModal).includes("Thêm") &&
              String(classNameModal).includes("create")
                ? " active"
                : "")
            }
            onClick={() =>
              updatePropertiesModal(
                "Thêm đơn đặt bàn",
                true,
                "89%",
                "create order-tables",
                AdminOrderTablesModal.create()
              )
            }
          >
            <FontAwesomeIcon icon={faPlus} className="icon" />
            &nbsp;Thêm
          </button>
        </div>
        <div className="main__table">
          <CustomTableActions
            columns={columns}
            rowKey={(record) => record.id}
            data={currentItems}
            pagination={paginationProps}
            className="table-actions order-tables"
            onChange={handleTableChange}
          />
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

export default AdminOrderTablesPage;
