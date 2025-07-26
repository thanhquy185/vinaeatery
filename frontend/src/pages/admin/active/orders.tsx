import {
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faFileArrowDown,
  faPenToSquare,
  faPlus,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { Form, Input, InputNumber, Select, Tag, type SelectProps } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type {
  CustomersFormatType,
  FoodsFormatType,
  OrderDetailsFormatType,
  OrdersFormatType,
} from "../../../common/types";
import { ruleRequired } from "../../../common/rules";
import { CustomPaginationProps } from "../../../common/pagination-props";
import CustomFindInput from "../../../components/admin/find-input";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomDateRangePicker from "../../../components/admin/date-ranger-picker";
import CustomCardStatic from "../../../components/admin/card-static";
import CustomTableActions from "../../../components/admin/table-actions";
import CustomTableNoActions from "../../../components/admin/table-no-actions";
import CustomModal from "../../../components/admin/modal";
import {
  FindAllCustomer,
  FindAllFood,
  FindAllOrder,
  HandleCreateOrder,
  HandleUpdateOrder,
} from "../../../services/api";
import { getVietnamCurrentDatetime } from "../../../services/dayjs";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../utils/otherEvents";
import { openConfirmation } from "../../../utils/showConfirmation";
import { openNotification } from "../../../utils/showNotification";
import { handlePrintTicket } from "../../../utils/printTicket";
import { OrderStatus, PayStatus } from "../../../common/values";

// Các giá trị chung
// - Chi tiết phiếu nhập
interface OrderDetailsTableProps {
  orderDetails?: OrderDetailsFormatType[];
  setOrderDetails?: Dispatch<SetStateAction<OrderDetailsFormatType[]>>;
}
const OrDetailsColumnWidths = ["14%", "30%", "17%", "17%", "22%"];
const OrDetailsColumnTitles = [
  "Mã món ăn",
  "Tên món ăn",
  "Giá bán (VNĐ)",
  "Số lượng",
  "Thành tiền (VNĐ)",
];
const OrDetailsAttributes = [
  "food.id",
  "food.name",
  "price",
  "quantity",
  "price*quantity",
];
const OrDetailsFormat = ["", "", "price", "", "price"];

// Admin Orders Page
const AdminOrdersPage = () => {
  // Cấu hình cột bảng dữ liệu của Đơn món ăn
  const [loading, setLoading] = useState<boolean>(false);
  const columns: ColumnsType<OrdersFormatType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: "8%",
    },
    {
      title: "Thời gian tạo đơn",
      dataIndex: "timeCreate",
      key: "timeCreate",
      sorter: true,
      width: "16%",
    },
    {
      title: "Khách hàng",
      key: "customer",
      sorter: (a, b) => {
        const idA = a.customer?.id ?? 0;
        const idB = b.customer?.id ?? 0;
        return idA - idB;
      },
      width: "24%",
      render: (record) =>
        `#${record.customer?.id} - ${record.customer?.fullname} - ${record.customer?.phone} - ${record.customer?.email}`,
    },
    {
      title: "Tổng thanh toán (VNĐ)",
      key: "totalPrice",
      sorter: (a, b) => (a.totalPrice as number) - (b.totalPrice as number),
      width: "16%",
      render: (record) => vietnamMoneyFormat(record.totalPrice),
    },
    {
      title: "Thanh toán",
      dataIndex: "payStatus",
      key: "payStatus",
      width: "12%",
      render: (status: string) => (
        <Tag color={status === PayStatus.pay ? "volcano" : "default"}>{status}</Tag>
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
            status === OrderStatus.confirm ? "green" : status === OrderStatus.canceled ? "red" : "default"
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
      render: (text: any, record: OrdersFormatType, index: number) => (
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
          <button
            className="print action"
            onClick={() =>
              updatePropertiesModal(
                "In đơn hàng",
                true,
                "80%",
                "print orders",
                AdminOrdersModal.print(record)
              )
            }
          >
            <FontAwesomeIcon icon={faPrint} />
          </button>
        </>
      ),
    },
  ];
  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  const [orders, setOrders] = useState<OrdersFormatType[]>([]);
  const {
    currentItems,
    handleTableChange,
    paginationProps,
    sortField,
    sortOrder,
  } = CustomPaginationProps(orders, 8, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Khách", value: "customer" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  // - Thời gian bắt đầu / Thời gian kết thúc
  const [filterTimeValue, setFilterTimeValue] = useState<[string, string]>();
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: OrderStatus.confirm, value: OrderStatus.confirm },
    { label: OrderStatus.canceled, value: OrderStatus.canceled },
    { label: OrderStatus.pending, value: OrderStatus.pending },
    { label: PayStatus.pay, value: PayStatus.pay },
    { label: PayStatus.notPay, value: PayStatus.notPay },
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
    title2: "Thông tin bán hàng",
    id: "Mã đơn món ăn",
    timeCreate: "Thời gian tạo đơn",
    employee:
      "Nhân viên xác nhận (Mã nhân viên - Tên nhân viên - Số điện thoại - Email)",
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
    customer,
    totalPrice,
    payStatus,
    status,
    orderDetails,
  }: OrdersFormatType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: id!,
            timeCreate: timeCreate!,
            employee:
              "#" +
              employee!.id +
              " - " +
              employee!.fullname +
              " - " +
              employee!.phone +
              " - " +
              employee!.email,
            customer:
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
            totalPrice:
              vietnamMoneyFormat(totalPrice!) +
              " (" +
              numberToVietnamWords(totalPrice!) +
              ")",
            status: status! + " (" + payStatus! + ")",
          }}
          className="modal__form split-3"
          autoComplete="off"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="id"
                  label={defaultLabels["id"]}
                  className="modal__form-group-item"
                >
                  <Input className="text-center" disabled={true} />
                </Form.Item>
                <Form.Item
                  name="timeCreate"
                  label={defaultLabels["timeCreate"]}
                  className="modal__form-group-item"
                >
                  <Input className="text-center" disabled={true} />
                </Form.Item>
              </div>
              <Form.Item
                name="status"
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <Input disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="employee"
                label={defaultLabels["employee"]}
                className="modal__form-group-item multiple-2"
              >
                <Input disabled={true} />
              </Form.Item>
              <Form.Item
                name="totalPrice"
                label={defaultLabels["totalPrice"]}
                className="modal__form-group-item multiple-2"
              >
                <Input disabled={true} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="customer"
                label={defaultLabels["customer"]}
                className="modal__form-group-item multiple-3"
              >
                <Select disabled={true} />
              </Form.Item>
              <Form.Item
                label={defaultLabels["orderDetails"]}
                htmlFor="create-orderDetails"
                className="modal__form-group-item multiple-3 margin-bottom-0"
              >
                <CustomTableNoActions
                  id="create-orderDetails"
                  className="orders-details"
                  columnWidths={OrDetailsColumnWidths}
                  columnTitles={OrDetailsColumnTitles}
                  attributes={OrDetailsAttributes}
                  data={orderDetails}
                  format={OrDetailsFormat}
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
    const [totalPriceValue, setTotalPriceValue] = useState<number>(0);
    const [orderDetails, setOrderDetails] = useState<OrderDetailsFormatType[]>(
      []
    );

    //
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

    //
    useEffect(() => {
      const totalValue = orderDetails.reduce(
        (total, orderDetail) =>
          total + orderDetail.price * orderDetail.quantity,
        0
      );
      setTotalPriceValue(totalValue);
    }, [orderDetails]);

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          className="modal__form split-3"
          autoComplete="off"
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']"
            );

            // Thêm class 'active' thể hiện nút đang được nhấn
            submitButton?.classList.add("active");

            // Hỏi trước khi xử khi xử lý ?
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn thêm ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Danh sách dữ liệu
              const values = form.getFieldsValue();

              // Gọi api xử lý
              const res = await HandleCreateOrder({
                timeCreate: new Date().toISOString(),
                employeeId: 2,
                customerId: values!.customer || undefined,
                totalPrice: totalPriceValue,
                payStatus: PayStatus.notPay,
                status: OrderStatus.pending,
                orderDetails: orderDetails.map((orderDetail) => ({
                  foodId: orderDetail.food.id!,
                  price: orderDetail.price,
                  quantity: orderDetail.quantity,
                })),
              });
              if (res.status === 200) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: "Thêm thành công !",
                  duration: 1.5,
                });

                setTimeout(() => {
                  getAllOrder();
                  setOpenModal(false);
                }, 1500);
              } else {
                openNotification({
                  type: "error",
                  message: "Thất bại",
                  description: "Thêm thất bại !",
                  duration: 1.5,
                });

                setTimeout(() => {
                  // Xoá class 'active' thể hiện nút không còn được nhấn
                  submitButton?.classList.remove("active");
                }, 1500);
              }
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  label={defaultLabels["id"]}
                  className="modal__form-group-item"
                >
                  <Input
                    className="text-center"
                    placeholder={defaultInputs["id"]}
                    disabled={true}
                  />
                </Form.Item>
                <Form.Item
                  label={defaultLabels["timeCreate"]}
                  className="modal__form-group-item"
                >
                  <Input
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
                <Input placeholder={defaultInputs["status"]} disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="employee"
                label={defaultLabels["employee"]}
                htmlFor="create-employee"
                className="modal__form-group-item multiple-2"
              >
                <Select
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
                <Input
                  placeholder={defaultInputs["totalPrice"]}
                  value={
                    vietnamMoneyFormat(totalPriceValue) +
                    " (" +
                    numberToVietnamWords(totalPriceValue) +
                    ")"
                  }
                  disabled={true}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="customer"
                label={defaultLabels["customer"]}
                htmlFor="create-customer"
                className="modal__form-group-item multiple-3"
                rules={[ruleRequired("Khách hàng không được để trống !")]}
              >
                <Select
                  showSearch={true}
                  allowClear={true}
                  id="create-customer"
                  placeholder={defaultInputs["customer"]}
                  options={customers.map((customer) => ({
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
                      customer!.address,
                    value: customer!.id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["orderDetails"]}
                htmlFor="create-orderDetails"
                className="modal__form-group-item multiple-3"
              >
                <CustomTableNoActions
                  id="create-orderDetails"
                  className="orderDetails"
                  columnWidths={OrDetailsColumnWidths}
                  columnTitles={OrDetailsColumnTitles}
                  data={orderDetails}
                  attributes={OrDetailsAttributes}
                  format={OrDetailsFormat}
                />
                <div className="buttons">
                  <button
                    type="button"
                    className="btn secondary-btn margin-r"
                    onClick={() =>
                      updatePropertiesSecondModal(
                        "Xoá món ăn",
                        true,
                        "60%",
                        "secondary orderDetails",
                        AdminOrderDetailsModal.delete({
                          orderDetails,
                          setOrderDetails,
                        })
                      )
                    }
                  >
                    Xoá món ăn
                  </button>
                  <button
                    type="button"
                    className="btn secondary-btn"
                    onClick={() =>
                      updatePropertiesSecondModal(
                        "Thêm món ăn",
                        true,
                        "60%",
                        "secondary orderDetails",
                        AdminOrderDetailsModal.create({
                          orderDetails,
                          setOrderDetails,
                        })
                      )
                    }
                  >
                    Thêm món ăn
                  </button>
                </div>
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn create">
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const UpdateOrders = ({
    id,
    timeCreate,
    employee,
    customer,
    totalPrice,
    payStatus,
    status,
    orderDetails,
  }: OrdersFormatType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: id!,
            timeCreate: timeCreate!,
            employee:
              "#" +
              employee!.id +
              " - " +
              employee!.fullname +
              " - " +
              employee!.phone +
              " - " +
              employee!.email,
            customer:
              "#" +
              customer!.id +
              " - " +
              customer!.fullname +
              " - " +
              customer!.phone +
              " - " +
              customer!.email +
              " - " +
              customer!.address,
            totalPrice:
              vietnamMoneyFormat(totalPrice!) +
              " (" +
              numberToVietnamWords(totalPrice!) +
              ")",
            status: status! + " (" + payStatus! + ")",
          }}
          className="modal__form split-3"
          autoComplete="off"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="id"
                  label={defaultLabels["id"]}
                  className="modal__form-group-item"
                >
                  <Input className="text-center" disabled={true} />
                </Form.Item>
                <Form.Item
                  name="timeCreate"
                  label={defaultLabels["timeCreate"]}
                  className="modal__form-group-item"
                >
                  <Input className="text-center" disabled={true} />
                </Form.Item>
              </div>
              <Form.Item
                name="status"
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <Input disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="employee"
                label={defaultLabels["employee"]}
                className="modal__form-group-item multiple-2"
              >
                <Input disabled={true} />
              </Form.Item>
              <Form.Item
                name="totalPrice"
                label={defaultLabels["totalPrice"]}
                className="modal__form-group-item multiple-2"
              >
                <Input disabled={true} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="customer"
                label={defaultLabels["customer"]}
                className="modal__form-group-item multiple-3"
              >
                <Select disabled={true} />
              </Form.Item>
              <Form.Item
                label={defaultLabels["orderDetails"]}
                className="modal__form-group-item multiple-3 margin-bottom-0"
              >
                <CustomTableNoActions
                  columnWidths={OrDetailsColumnWidths}
                  columnTitles={OrDetailsColumnTitles}
                  attributes={OrDetailsAttributes}
                  data={orderDetails}
                  format={OrDetailsFormat}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            {status === OrderStatus.pending && (
              <>
                <button
                  className="modal__button secondary btn green-secondary"
                  onClick={(e) =>
                    callApiToUpdateOrder(id!, e.target as HTMLElement, OrderStatus.confirm)
                  }
                >
                  {OrderStatus.confirm}
                </button>
                <button
                  className="modal__button secondary btn red-secondary"
                  onClick={(e) =>
                    callApiToUpdateOrder(id!, e.target as HTMLElement, OrderStatus.canceled)
                  }
                >
                  {OrderStatus.canceled}
                </button>
              </>
            )}
            <button
              className="modal__button secondary btn"
              onClick={(e) =>
                callApiToUpdateOrder(
                  id!,
                  e.target as HTMLElement,
                  payStatus === PayStatus.pay ? PayStatus.notPay : PayStatus.pay
                )
              }
            >
              {payStatus === PayStatus.pay ? PayStatus.notPay : PayStatus.pay}
            </button>
          </div>
        </Form>
      </>
    );
  };
  const PrintOrders = ({
    id,
    timeCreate,
    employee,
    customer,
    totalPrice,
    payStatus,
    status,
    orderDetails,
  }: OrdersFormatType) => {
    // Ngày hiện tại
    const today = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString();
    const dateTime = today.replace("T", "__").slice(0, -5);
    const day = today.slice(8, 10);
    const month = today.slice(5, 7);
    const year = today.slice(0, 4);

    return (
      <>
        <div id="content-print" className="ticket__content">
          <header className="ticket__header">
            <img
              src="/src/assets/images/others/brand-image.png"
              alt="Logo Web"
              className="ticket__logo"
            />
            <div className="ticket__contact">
              <p>Nhà hàng VINAEATERY</p>
              <p>273 An Đ. Vương, Phường 2, Quận 5, Hồ Chí Minh 700000</p>
              <p>123456789 - 0987654321</p>
              <p>vinaeatery@gmail.com.vn</p>
            </div>
          </header>
          <main className="ticket__body input_ticket">
            <h1 className="ticket__title">PHIẾU ĐƠN HÀNG</h1>
            <p className="ticket__date">
              Thời gian lập đơn:{" "}
              <span className="date-start">{timeCreate}</span>
            </p>
            <p className="ticket__info">
              <b>Mã phiếu nhập:</b> #{id}
            </p>
            <p className="ticket__info">
              <b>Khách hàng:</b> {customer!.fullname} - {customer!.phone} -{" "}
              {customer!.email}
            </p>
            <p className="ticket__info">
              <b>Tổng thanh toán (VNĐ):</b> {vietnamMoneyFormat(totalPrice!)}
              <u>đ</u> ({numberToVietnamWords(totalPrice!)})
            </p>
            <p className="ticket__info">
              <b>Trạng thái phiếu nhập:</b> {status} ({payStatus})
            </p>
            <p className="ticket__info">
              <b>Chi tiết phiếu nhập:</b>
            </p>
            <CustomTableNoActions
              className="ticket__table input_ticket-details"
              columnWidths={OrDetailsColumnWidths}
              columnTitles={OrDetailsColumnTitles}
              data={orderDetails}
              attributes={OrDetailsAttributes}
              format={OrDetailsFormat}
            />
          </main>
          <footer className="ticket__footer input_ticket">
            <p className="ticket__customer">
              Ngày {day} tháng {month} năm {year}
              <b>Khách hàng</b>
              (Ký tên, ghi rõ họ tên)
            </p>
            <p className="ticket__customer">
              Ngày {day} tháng {month} năm {year}
              <b>Nhân viên lập phiếu</b>
              (Ký tên, ghi rõ họ tên)
            </p>
          </footer>
        </div>
        <button
          id="print-ticket-button"
          className="ticket__print-btn"
          onClick={() => {
            handlePrintTicket({
              contentPrint: "content-print",
              dateTime: dateTime,
              title: "PHDONHANG",
              id: id,
            });
          }}
        >
          <FontAwesomeIcon icon={faFileArrowDown} /> &nbsp;&nbsp;Tải xuống phiếu
        </button>
      </>
    );
  };
  const AdminOrdersModal = {
    detail: (order: OrdersFormatType) => (
      <DetailOrders
        id={order!.id}
        timeCreate={order!.timeCreate}
        employee={order!.employee}
        customer={order!.customer}
        totalPrice={order!.totalPrice}
        payStatus={order!.payStatus}
        status={order!.status}
        orderDetails={order!.orderDetails}
      />
    ),
    create: () => <CreateOrders />,
    update: (order: OrdersFormatType) => (
      <UpdateOrders
        id={order!.id}
        timeCreate={order!.timeCreate}
        employee={order!.employee}
        customer={order!.customer}
        totalPrice={order!.totalPrice}
        payStatus={order!.payStatus}
        status={order!.status}
        orderDetails={order!.orderDetails}
      />
    ),
    print: (order: OrdersFormatType) => (
      <PrintOrders
        id={order!.id}
        timeCreate={order!.timeCreate}
        employee={order!.employee}
        customer={order!.customer}
        totalPrice={order!.totalPrice}
        payStatus={order!.payStatus}
        status={order!.status}
        orderDetails={order!.orderDetails}
      />
    ),
  };
  // Hàm gọi API để cập nhật trạng thái đơn món ăn
  const callApiToUpdateOrder = async (
    id: number,
    button: HTMLElement,
    value: string
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
      let payStatus = null,
        status = null;
      if (value === OrderStatus.confirm || value === OrderStatus.canceled) {
        status = value;
      } else if (value === PayStatus.pay || value === PayStatus.notPay) {
        payStatus = value;
      }

      // Gọi api xử lý
      const res = await HandleUpdateOrder({
        id: id,
        payStatus: payStatus!,
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
          getAllOrder();
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

  // Các thành phần giữ giá trị cho việc hiển thị modal thứ 2
  // - Các biến
  const [titleSecondModal, setTitleSecondModal] = useState<string>("");
  const [openSecondModal, setOpenSecondModal] = useState<boolean>(false);
  const [widthSecondModal, setWidthSecondModal] = useState<string>("");
  const [classNameSecondModal, setClassNameSecondModal] = useState<string>("");
  const [childrenSecondModal, setChildrenSecondModal] = useState<ReactNode>();
  // - Các giá trị mặc định cho nhãn
  const defaultSecondLabels = {
    title: "Thông tin món ăn",
    foodCreate:
      "Món ăn (Mã món ăn - Tên món ăn - Loại món ăn - Đơn vị - Giá bán)",
    foodDelete: "Món ăn (Mã món ăn - Tên món ăn - Số lượng - Giá bán)",
    price: "Giá bán",
    quantity: "Số lượng",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultSecondInputs = {
    title: "Thông tin món ăn",
    foodCreate:
      "Chọn món ăn (Mã món ăn - Tên món ăn - Loại món ăn - Đơn vị - Giá bán)",
    foodDelete: "Chọn món ăn (Mã món ăn - Tên món ăn - Số lượng - Giá bán)",
    price: "Nhập Giá bán",
    quantity: "Nhập Số lượng",
  };
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
  const CreateOrderDetails = ({
    orderDetails,
    setOrderDetails,
  }: OrderDetailsTableProps) => {
    const [form] = Form.useForm();

    // Gọi api để truy vấn danh sách món ăn "đang bán"
    const [foods, setFoods] = useState<FoodsFormatType[]>([]);
    const getAllFood = async () => {
      const res = await FindAllFood({
        statusValue: ["Đang bán"],
      });
      if (res!.status === 200) {
        setFoods(res!.data);
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
      getAllFood();
    }, []);

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          className="modal__form secondary split-2"
          autoComplete="off"
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form.secondary button[type='submit']"
            );

            // Thêm class 'active' thể hiện nút đang được nhấn
            submitButton?.classList.add("active");

            // Hỏi trước khi xử khi xử lý ?
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn thêm ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Danh sách dữ liệu
              const values = form.getFieldsValue();

              // Định dạng dữ liệu
              const newOrderDetail: OrderDetailsFormatType = {
                food: JSON.parse(values!.food) || undefined,
                price: values!.price || undefined,
                quantity: values!.quantity || undefined,
              };

              // Cập nhật danh sách nguyên liệu mới
              let newOrderDetails: OrderDetailsFormatType[] = [
                ...orderDetails!,
              ];
              // - Kiểm tra nguyên liệu đã có tồn tại trong công thức hay chưa ?
              let isExists = false;
              for (let i = 0; i < orderDetails!.length; i++) {
                if (orderDetails![i].food.id === newOrderDetail.food.id) {
                  orderDetails![i].price = newOrderDetail.price;
                  orderDetails![i].quantity = newOrderDetail.quantity;
                  isExists = true;
                }
              }
              if (!isExists) {
                newOrderDetails.push(newOrderDetail);
              }
              // - Sắp xếp theo mã nguyên liệu tăng dần
              newOrderDetails.sort(
                (a, b) => (a!.food.id as number) - (b!.food.id as number)
              );
              // - Cập nhật
              setOrderDetails!(newOrderDetails!);

              // Thành công thì thông báo
              setOpenSecondModal(false);
              openNotification({
                type: "success",
                message: "Thành công",
                description: "Thêm thành công !",
                duration: 1.5,
              });
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">
              {defaultSecondLabels["title"]}
            </p>
            <div className="modal__form-group">
              <Form.Item
                name="food"
                label={defaultSecondLabels["foodCreate"]}
                htmlFor="create-food"
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Món ăn không được để trống !")]}
              >
                <Select
                  mode={undefined}
                  showSearch={true}
                  allowClear={true}
                  id="create-food"
                  placeholder={defaultSecondInputs["foodCreate"]}
                  options={foods?.map((food) => ({
                    label:
                      "#" +
                      food!.id +
                      " - " +
                      food!.name +
                      " - " +
                      food!.categoryFood!.name +
                      " (#" +
                      food!.categoryFood!.id +
                      ")" +
                      " - " +
                      food!.unit +
                      " - " +
                      food!.price,
                    value: JSON.stringify(food!),
                  }))}
                  onChange={(value) => {
                    if (!value) {
                      form.setFieldsValue({ price: undefined });
                      return;
                    }
                    try {
                      const selectedFood = JSON.parse(value);
                      if (selectedFood && selectedFood.price) {
                        form.setFieldsValue({
                          price: selectedFood.price,
                        });
                      }
                    } catch (err) {
                      console.error("Parse Food failed:", err);
                    }
                  }}
                />
              </Form.Item>
              <Form.Item
                name="price"
                label={defaultSecondLabels["price"]}
                className="modal__form-group-item"
              >
                <InputNumber disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              <Form.Item
                name="quantity"
                label={defaultSecondLabels["quantity"]}
                htmlFor="create-quantity"
                className="modal__form-group-item"
                rules={[ruleRequired("Số lượng không được để trống !")]}
              >
                <InputNumber
                  min={1}
                  id="create-quantity"
                  placeholder={defaultSecondInputs["quantity"]}
                />
              </Form.Item>
            </div>
            <div className="modal__buttons">
              <button type="submit" className="modal__button btn secondary-btn">
                Xác nhận
              </button>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const DeleteOrderDetails = ({
    orderDetails,
    setOrderDetails,
  }: OrderDetailsTableProps) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          className="modal__form secondary split-2"
          autoComplete="off"
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form.secondary button[type='submit']"
            );

            // Thêm class 'active' thể hiện nút đang được nhấn
            submitButton?.classList.add("active");

            // Hỏi trước khi xử khi xử lý ?
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn xoá ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Nguyên liệu cần xoá
              const food = JSON.parse(form.getFieldValue("food"));

              // Cập nhật danh sách nguyên liệu mới
              let newOrderDetails: OrderDetailsFormatType[] = [];
              for (let i = 0; i < orderDetails!.length; i++) {
                if (orderDetails![i].food.id !== food.food.id) {
                  newOrderDetails.push(orderDetails![i]);
                }
              }
              setOrderDetails!(newOrderDetails);

              // Thành công thì thông báo
              setOpenSecondModal(false);
              openNotification({
                type: "success",
                message: "Thành công",
                description: "Xoá thành công !",
                duration: 1.5,
              });
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">
              {defaultSecondLabels["title"]}
            </p>
            <div className="modal__form-group">
              <Form.Item
                name="food"
                label={defaultSecondLabels["foodDelete"]}
                htmlFor="delete-food"
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Món ăn không được để trống !")]}
              >
                <Select
                  mode={undefined}
                  showSearch={true}
                  allowClear={true}
                  id="delete-food"
                  placeholder={defaultSecondInputs["foodDelete"]}
                  options={orderDetails?.map((orderDetail) => ({
                    label:
                      "#" +
                      orderDetail!.food!.id +
                      " - " +
                      orderDetail!.food!.name +
                      " - " +
                      orderDetail!.price +
                      " - " +
                      orderDetail!.quantity,
                    value: JSON.stringify(orderDetail!),
                  }))}
                  onChange={(value) => {
                    if (!value) {
                      form.setFieldsValue({
                        price: undefined,
                        quantity: undefined,
                      });
                      return;
                    }
                    try {
                      const orderDetail = JSON.parse(value);
                      if (orderDetail) {
                        form.setFieldsValue({
                          price: orderDetail!.price,
                          quantity: orderDetail!.quantity,
                        });
                      }
                    } catch (err) {
                      console.error("Parse ingredient failed:", err);
                    }
                  }}
                />
              </Form.Item>
              <Form.Item
                name="price"
                label={defaultSecondLabels["price"]}
                className="modal__form-group-item"
              >
                <InputNumber disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              <Form.Item
                name="quantity"
                label={defaultSecondLabels["quantity"]}
                className="modal__form-group-item"
              >
                <InputNumber disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__buttons">
              <button type="submit" className="modal__button btn secondary-btn">
                Xác nhận
              </button>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const AdminOrderDetailsModal = {
    create: ({ orderDetails, setOrderDetails }: OrderDetailsTableProps) => (
      <CreateOrderDetails
        orderDetails={orderDetails}
        setOrderDetails={setOrderDetails}
      />
    ),
    delete: ({ orderDetails, setOrderDetails }: OrderDetailsTableProps) => (
      <DeleteOrderDetails
        orderDetails={orderDetails}
        setOrderDetails={setOrderDetails}
      />
    ),
  };

  // Hàm cập nhật số liệu cho các thẻ
  const updateCards = (orders: OrdersFormatType[]) => {
    let totalPrice = 0,
      totalOrder = 0,
      totalConfirm = 0,
      totalCancel = 0,
      totalPending = 0;
    orders.forEach((order) => {
      totalPrice += order.totalPrice!;
      totalOrder += 1;
      if (order.status! === OrderStatus.confirm) {
        totalConfirm += 1;
      }
      if (order.status! === OrderStatus.canceled) {
        totalCancel += 1;
      }
      if (order.status! === OrderStatus.pending) {
        totalPending += 1;
      }
    });

    setTotalPriceCardValue(totalPrice);
    setTotalOrderCardValue(totalOrder);
    setConfirmCardValue(totalConfirm);
    setCancelCardValue(totalCancel);
    setPendingCardValue(totalPending);
  };
  // Hàm cập nhật danh sách các đơn món ăn (gọi API)
  const getAllOrder = async () => {
    setLoading(true);
    const res = await FindAllOrder({
      findType: filterFindType!,
      findValue: filterFindValue!,
      timeValue: filterTimeValue!,
      statusValue: filterStatusValue!,
    });
    if (res!.status === 200) {
      setLoading(false);
      setOrders(res!.data);
      updateCards(res!.data);
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
    getAllOrder();
  }, []);
  useEffect(() => {
    getAllOrder();
  }, [filterFindType, filterFindValue, filterTimeValue, filterStatusValue]);

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
            separator="."
          />
          <CustomCardStatic
            title={"Tổng đơn món ăn"}
            value={totalOrderCardValue}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: "#274cf4" }}
          />
          <CustomCardStatic
            title={OrderStatus.confirm}
            value={confirmCardValue}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
          <CustomCardStatic
            title={OrderStatus.canceled}
            value={cancelCardValue}
            prefix={<CloseCircleOutlined />}
            valueStyle={{ color: "#cf1322" }}
          />
          <CustomCardStatic
            title={OrderStatus.pending}
            value={pendingCardValue}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: "#676767" }}
          />
        </div>
        <div className="main__table">
          <CustomTableActions
            columns={columns}
            rowKey={(record) => record!.id as number}
            data={currentItems}
            loading={loading}
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

export default AdminOrdersPage;
