import { useEffect, useState, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faPenToSquare,
  faPlus,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { Form, Tag, type SelectProps } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { OrdersType } from "../../../common/types";
import { CustomPaginationProps } from "../../../common/pagination-props";
import CustomFindInput from "../../../components/admin/find-input";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomDateRangePicker from "../../../components/admin/date-ranger-picker";
import CustomCardStatic from "../../../components/admin/card-static";
import CustomTableActions from "../../../components/admin/table-actions";
import CustomInput from "../../../components/admin/input";
import CustomSelect from "../../../components/admin/select";
import CustomTableNoActions from "../../../components/admin/table-no-actions";
import CustomModal from "../../../components/admin/modal";
import { getVietnamCurrentDatetime } from "../../../services/dayjs";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../utils/otherEvents";

// Các giá trị chung
// - Trạng thái
const confirm = "Đã xác nhận";
const cancel = "Đã huỷ đơn";
const pending = "Đang chờ xác nhận";
// - Thanh toán
const pay = "Đã thanh toán";
const notPay = "Chưa thanh toán";

// Admin Orders Page
const AdminOrdersPage = () => {
  // Cấu hình cột bảng dữ liệu của Đơn món ăn
  const columns: ColumnsType<OrdersType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: "8%",
    },
    {
      title: "Thời gian tạo phiếu",
      dataIndex: "timeCreate",
      key: "timeCreate",
      sorter: true,
      width: "16%",
    },
    {
      title: "Bàn ăn",
      key: "table",
      sorter: true,
      width: "24%",
      render: (record) =>
        `#${record.table?.id} - ${record.table?.name} - ${record.table?.floor?.name}`,
    },
    {
      title: "Tổng thanh toán (VNĐ)",
      key: "totalPrice",
      sorter: true,
      width: "16%",
      render: (record) => vietnamMoneyFormat(record.totalPrice),
    },
    {
      title: "Thanh toán",
      dataIndex: "payStatus",
      key: "payStatus",
      width: "12%",
      render: (status: string) => (
        <Tag color={status === pay ? "magenta" : "default"}>{status}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (status: string) => (
        <Tag
          color={
            status === confirm ? "green" : status === cancel ? "red" : "default"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      width: "12%",
      render: (text: any, record: OrdersType, index: number) => (
        <>
          <button
            className="info action"
            onClick={() =>
              updatePropertiesModal(
                "Chi tiết đơn món ăn",
                true,
                "89%",
                "info orders",
                AdminOrdersModal.detail(record)
              )
            }
          >
            <FontAwesomeIcon icon={faCircleInfo} />
          </button>
          <button
            className="update action margin-lr"
            onClick={() =>
              updatePropertiesModal(
                "Cập nhật đơn món ăn",
                true,
                "89%",
                "update orders",
                AdminOrdersModal.update(record)
              )
            }
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button className="print action">
            <FontAwesomeIcon icon={faPrint} />
          </button>
        </>
      ),
    },
  ];
  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  const [orders, setOrders] = useState<OrdersType[]>([
    {
      id: 1,
      timeCreate: "2025-06-26 23:04:23",
      employee: {
        image: "/src/assets/images/others/lock-icon.png",
        fullname: "ABC",
        birthday: "2005-07-02",
        gender: "Nam",
        phone: "1234567890",
        email: "abc@gmail.com",
        address: "abc abc abc",
        id: 1,
        dateBeginWork: "2025-06-06",
        dateStopWork: "2025-06-07",
        role: { id: 2, name: "Nhân viên bán hàng" },
        diploma: "Trung cấp",
        diplomaDetail: "Trung cấp kinh doanh",
        username: "abcdef",
        status: "Đang làm",
      },
      table: {
        id: 1,
        name: "Bàn 1",
        category: {
          id: 0,
          name: "Loại bàn 0",
        },
        floor: {
          id: 0,
          name: "Tầng 0",
        },
        status: "Hoạt động",
      },
      customer: {
        id: 1,
        fullname: "ABC",
        birthday: "2005-07-02",
        gender: "Nam",
        phone: "1234567890",
        email: "abc@gmail.com",
        address: "abc abc abc",
        description: "1218274",
        customerCard: {
          id: 10,
          name: "Thẻ siêu cấp vip pro",
          cost: 1245,
        },
        totalCost: 1000,
        status: "Hoạt động",
      },
      totalPrice: 200000,
      payStatus: "Đã thanh toán",
      status: "Đang chờ xác nhận",
      orderDetails: [],
    },
  ]);
  const {
    currentItems,
    handleTableChange,
    paginationProps,
    sortField,
    sortOrder,
  } = CustomPaginationProps(orders, 10, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Bàn", value: "table" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  // - Thời gian bắt đầu / Thời gian kết thúc
  const [filterTimeValue, setFilterTimeValue] = useState<[string, string]>();
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: confirm, value: confirm },
    { label: cancel, value: cancel },
    { label: pending, value: pending },
    { label: pay, value: pay },
    { label: notPay, value: notPay },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    []
  );

  // Các biến giữ giá trị cho việc hiển thị thông số trên card
  const [totalPriceCardValue, setTotalPriceCardValue] = useState<number>(0);
  const [totalOrderCardValue, setTotalOrderCardValue] = useState<number>(0);
  const [confirmCardValue, setConfirmCardValue] = useState<number>(0);
  const [cancelCardValue, setCancelCardValue] = useState<number>(0);
  const [pendingCardValue, setPendingCardValue] = useState<number>(0);

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
    title2: "Thông tin món ăn",
    id: "Mã đơn món ăn",
    timeCreate: "Thời gian tạo đơn",
    employee:
      "Nhân viên xác nhận (Mã nhân viên - Tên nhân viên - Số điện thoại - Email)",
    table: "Bàn ăn (Mã bàn ăn - Tên bàn ăn - Loại bàn - Tầng)",
    customer:
      "Khách hàng  (Mã khách hàng - Tên khách hàng - Số điện thoại - Email - Thẻ khách hàng)",
    totalPrice: "Tổng thanh toán (VNĐ)",
    status: "Trạng thái đơn món ăn",
    orderDetails: "Chi tiết gọi món ăn",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    id: "Chưa xác định !",
    timeCreate: "",
    employee:
      "Chọn Nhân viên xác nhận (Mã nhân viên - Tên nhân viên - Số điện thoại - Email)",
    table: "Chọn Bàn ăn (Mã bàn ăn - Tên bàn ăn - Loại bàn - Tầng)",
    customer:
      "Chọn Khách hàng (Mã khách hàng - Tên khách hàng - Số điện thoại - Email - Thẻ khách hàng)",
    totalPrice: "",
    status: "Đang chờ xác nhận (Chưa thanh toán)",
    orderDetails: "",
  };
  // - Các modal tương ứng cho từng chức năng
  const DetailOrders = ({
    id,
    timeCreate,
    employee,
    table,
    customer,
    totalPrice,
    payStatus,
    status,
    orderDetails,
  }: OrdersType) => {
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
              <div className="modal__form-group-item-warper split-2">
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
                  label={defaultLabels["timeCreate"]}
                  className="modal__form-group-item"
                >
                  <CustomInput
                    className="text-center"
                    value={timeCreate!}
                    disabled={true}
                  />
                </Form.Item>
              </div>
              <Form.Item
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <CustomInput
                  value={status! + " (" + payStatus! + ")"}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["table"]}
                className="modal__form-group-item"
              >
                <CustomSelect
                  className="tables"
                  placeholder={defaultInputs["table"]}
                  options={[
                    {
                      label:
                        table!.name +
                        " - " +
                        table!.category?.name +
                        " - " +
                        table!.floor?.name,
                      value: table!.id,
                    },
                  ]}
                  value={table!.id}
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
                label={defaultLabels["totalPrice"]}
                className="modal__form-group-item multiple-2"
              >
                <CustomInput
                  value={
                    vietnamMoneyFormat(totalPrice!) +
                    " (" +
                    numberToVietnamWords(totalPrice!) +
                    ")"
                  }
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["customer"]}
                className="modal__form-group-item multiple-2"
              >
                <CustomSelect
                  className="customers"
                  options={[
                    {
                      label: `${
                        customer!.fullname +
                        " - " +
                        customer!.phone +
                        " - " +
                        customer!.email +
                        " - " +
                        customer!.customerCard?.name +
                        " (#" +
                        customer!.customerCard?.id +
                        ")"
                      }`,
                      value: customer!.id,
                    },
                  ]}
                  value={customer!.id}
                  disabled={true}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["orderDetails"]}
                htmlFor="create-orderDetails"
                className="modal__form-group-item multiple-3 margin-bottom-0"
              >
                <CustomTableNoActions
                  id="create-orderDetails"
                  className="suppliers"
                  columnWidths={["12%", "36%", "15%", "15%", "22%"]}
                  columnTitles={[
                    "Mã món ăn",
                    "Tên món ăn",
                    "Giá bán (VNĐ)",
                    "Số lượng",
                    "Thành tiền (VNĐ)",
                  ]}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const CreateOrders = () => {
    const [form] = Form.useForm();
    const timeCreateValue = getVietnamCurrentDatetime();
    const [tableValue, setTableValue] = useState<string | number>();
    const [customerValue, setCustomerValue] = useState<string | number>();

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
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  label={defaultLabels["id"]}
                  className="modal__form-group-item"
                >
                  <CustomInput
                    className="text-center"
                    value={defaultInputs["id"]}
                    disabled={true}
                  />
                </Form.Item>
                <Form.Item
                  label={defaultLabels["timeCreate"]}
                  className="modal__form-group-item"
                >
                  <CustomInput
                    className="text-center"
                    value={timeCreateValue}
                    disabled={true}
                  />
                </Form.Item>
              </div>
              <Form.Item
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <CustomInput value={defaultInputs["status"]} disabled={true} />
              </Form.Item>
              <Form.Item
                label={defaultLabels["table"]}
                htmlFor="create-table"
                className="modal__form-group-item"
              >
                <CustomSelect
                  id="create-table"
                  className="tables"
                  placeholder={defaultInputs["table"]}
                  options={[
                    {
                      label: "Bàn 0",
                      value: 0,
                    },
                  ]}
                  setSelectValue={setTableValue}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["employee"]}
                htmlFor="create-employee"
                className="modal__form-group-item multiple-2"
              >
                <CustomSelect
                  id="create-employee"
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
                label={defaultLabels["totalPrice"]}
                className="modal__form-group-item multiple-2"
              >
                <CustomInput
                  placeholder={defaultInputs["totalPrice"]}
                  value={
                    vietnamMoneyFormat(0) + " (" + numberToVietnamWords(0) + ")"
                  }
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["customer"]}
                className="modal__form-group-item multiple-2"
              >
                <CustomSelect
                  className="customers"
                  placeholder={defaultInputs["customer"]}
                  options={[
                    {
                      label:
                        "Khách hàng a - 234567890 - a@gmail.com - ahfjhaf - Thẻ đen (#1)",
                      value: 0,
                    },
                  ]}
                  setSelectValue={setCustomerValue}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["orderDetails"]}
                htmlFor="create-orderDetails"
                className="modal__form-group-item multiple-3"
              >
                <CustomTableNoActions
                  id="create-orderDetails"
                  className="suppliers"
                  columnWidths={["12%", "36%", "15%", "15%", "22%"]}
                  columnTitles={[
                    "Mã món ăn",
                    "Tên món ăn",
                    "Giá bán (VNĐ)",
                    "Số lượng",
                    "Thành tiền (VNĐ)",
                  ]}
                />
                <div className="buttons">
                  <button type="button" className="btn secondary-btn margin-r">
                    Xoá món ăn
                  </button>
                  <button type="button" className="btn secondary-btn">
                    Thêm món ăn
                  </button>
                </div>
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
  const UpdateOrders = ({
    id,
    timeCreate,
    employee,
    table,
    customer,
    totalPrice,
    payStatus,
    status,
    orderDetails,
  }: OrdersType) => {
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
              <div className="modal__form-group-item-warper split-2">
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
                  label={defaultLabels["timeCreate"]}
                  className="modal__form-group-item"
                >
                  <CustomInput
                    className="text-center"
                    value={timeCreate!}
                    disabled={true}
                  />
                </Form.Item>
              </div>
              <Form.Item
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <CustomInput
                  value={status! + " (" + payStatus! + ")"}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["table"]}
                className="modal__form-group-item"
              >
                <CustomSelect
                  className="tables"
                  placeholder={defaultInputs["table"]}
                  options={[
                    {
                      label:
                        table!.name +
                        " - " +
                        table!.category?.name +
                        " - " +
                        table!.floor?.name,
                      value: table!.id,
                    },
                  ]}
                  value={table!.id}
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
                label={defaultLabels["totalPrice"]}
                className="modal__form-group-item multiple-2"
              >
                <CustomInput
                  value={
                    vietnamMoneyFormat(totalPrice!) +
                    " (" +
                    numberToVietnamWords(totalPrice!) +
                    ")"
                  }
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["customer"]}
                className="modal__form-group-item multiple-2"
              >
                <CustomSelect
                  className="customers"
                  options={[
                    {
                      label: `${
                        customer!.fullname +
                        " - " +
                        customer!.phone +
                        " - " +
                        customer!.email +
                        " - " +
                        customer!.customerCard?.name +
                        " (#" +
                        customer!.customerCard?.id +
                        ")"
                      }`,
                      value: customer!.id,
                    },
                  ]}
                  value={customer!.id}
                  disabled={true}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["orderDetails"]}
                htmlFor="create-orderDetails"
                className="modal__form-group-item multiple-3 margin-bottom-0"
              >
                <CustomTableNoActions
                  id="create-orderDetails"
                  className="suppliers"
                  columnWidths={["12%", "36%", "15%", "15%", "22%"]}
                  columnTitles={[
                    "Mã món ăn",
                    "Tên món ăn",
                    "Giá bán (VNĐ)",
                    "Số lượng",
                    "Thành tiền (VNĐ)",
                  ]}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            {status === pending && (
              <>
                <button className="modal__button secondary btn green-secondary">
                  {confirm}
                </button>
                <button className="modal__button secondary btn red-secondary">
                  {cancel}
                </button>
              </>
            )}
            <button className="modal__button secondary btn">
              {payStatus === pay ? notPay : pay}
            </button>
          </div>
        </Form>
      </>
    );
  };
  const AdminOrdersModal = {
    detail: (order: OrdersType) => (
      <DetailOrders
        id={order!.id}
        timeCreate={order!.timeCreate}
        employee={order!.employee}
        table={order!.table}
        customer={order!.customer}
        totalPrice={order!.totalPrice}
        payStatus={order!.payStatus}
        status={order!.status}
        orderDetails={order!.orderDetails}
      />
    ),
    create: () => <CreateOrders />,
    update: (order: OrdersType) => (
      <UpdateOrders
        id={order!.id}
        timeCreate={order!.timeCreate}
        employee={order!.employee}
        table={order!.table}
        customer={order!.customer}
        totalPrice={order!.totalPrice}
        payStatus={order!.payStatus}
        status={order!.status}
        orderDetails={order!.orderDetails}
      />
    ),
  };

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">Vận hành quán ăn - Đơn món ăn</h2>
        </div>
        <div className="main__filter">
          <CustomFindInput
            selectItems={findOptions}
            placeholder="Nhập thông tin cần tìm kiếm"
            defaultValue=""
            className="main__filter-find"
            setFilterFindType={setFilterFindType}
            setFilterFindValue={setFilterFindValue}
          />
          <CustomDateRangePicker
            showTime={true}
            placeholder={["Thời gian bắt đầu", "Thời gian kết thúc"]}
            className="main__filter-select filter-time big"
            setDateRangeValue={setFilterTimeValue}
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
                "Thêm đơn món ăn",
                true,
                "89%",
                "create orders",
                AdminOrdersModal.create()
              )
            }
          >
            <FontAwesomeIcon icon={faPlus} className="icon" />
            &nbsp;Thêm
          </button>
        </div>
        <div className="main__cards">
          <CustomCardStatic
            title={"Tổng thanh toán (VNĐ)"}
            value={totalPriceCardValue}
            prefix={<DollarOutlined />}
            valueStyle={{ color: "#d2a016" }}
          />
          <CustomCardStatic
            title={"Tổng đơn món ăn"}
            value={totalOrderCardValue}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: "#274cf4" }}
          />
          <CustomCardStatic
            title={confirm}
            value={confirmCardValue}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
          <CustomCardStatic
            title={cancel}
            value={cancelCardValue}
            prefix={<CloseCircleOutlined />}
            valueStyle={{ color: "#cf1322" }}
          />
          <CustomCardStatic
            title={pending}
            value={pendingCardValue}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: "#676767" }}
          />
        </div>
        <div className="main__table">
          <CustomTableActions
            columns={columns}
            rowKey={(record) => record.id}
            data={currentItems}
            pagination={paginationProps}
            className="table-actions orders"
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

export default AdminOrdersPage;
