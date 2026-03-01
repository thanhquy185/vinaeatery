import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";
import { Eye, PenBox, Printer } from "lucide-react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faEye,
//   faLock,
//   faPenToSquare,
//   faUnlock,
// } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  DatePicker,
  InputNumber,
  Select,
  Tag,
  type SelectProps,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { ManagerPageProps } from "../../../common/props";
import type { OrderDetailType, OrderType } from "../../../common/types";
import {
  OrderStatus,
  PayStatus,
  ModalTitleValue,
  ModalWidthValue,
} from "../../../common/values";
import CustomCardStatic from "../../../components/admin-manager/common/card-static";
import CustomModal from "../../../components/common/modal";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import AdminManagerMainFilterInfo from "../../../components/admin-manager/common/main-filter-info";
import AdminManagerMainData from "../../../components/admin-manager/common/main-data";
import ManagerDetailOrder from "../../../components/admin-manager/modal/order/manager-detail-order";
import ManagerCreateOrder from "../../../components/admin-manager/modal/order/manager-create-order";
import ManagerUpdateOrder from "../../../components/admin-manager/modal/order/manager-update-order";
import ManagerPrintOrder from "../../../components/admin-manager/modal/order/manager-print-order";
import ManagerCreateOrderDetail from "../../../components/admin-manager/modal/order-detail/manager-create-order-detail";
import ManagerDeleteOrderDetail from "../../../components/admin-manager/modal/order-detail/manager-delete-order";
import { FindAllOrder } from "../../../requests/orders";
import { useModal } from "../../../hook/use-modal";
import { useSecondModal } from "../../../hook/use-second-modal";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { actionIndexes, getActionNameEn } from "../../../utils/default-actions";
import {
  getFilterSelectValueToShow,
  vietnamMoneyFormat,
} from "../../../utils/other-events";
import { hasPermission } from "../../../utils/has-permissions";
import dayjs from "dayjs";

// Các giá trị chung
// - Chi tiết phiếu nhập
export interface OrderDetailsTableProps {
  orderDetails?: OrderDetailType[];
  setOrderDetails?: Dispatch<SetStateAction<OrderDetailType[]>>;
}
const OrDetailWidths = ["14%", "30%", "17%", "17%", "22%"];
const OrDetailColumns = [
  "Mã món ăn",
  "Tên món ăn",
  "Giá bán (VNĐ)",
  "Số lượng",
  "Thành tiền (VNĐ)",
];
const OrDetailAttributes = [
  "food.id",
  "food.name",
  "price",
  "quantity",
  "price*quantity",
];
const OrDetailFormat = ["", "", "price", "", "price"];

// Manager Orders Page
const ManagerOrdersPage: FC<ManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // // Đối tượng query client để thực thi react-query
  // const queryClient = useQueryClient();

  // Có là chủ nhà hàng đăng nhập
  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );
  // useEffect(() => {
  //   queryClient.invalidateQueries({ queryKey: ["suppliers"] });
  //   queryClient.invalidateQueries({ queryKey: [nameEN] });
  // }, [selectedRestaurantId]);

  // // Các biến giữ dữ liệu về khách hàng
  // const { data: customers } = useEntityQuery<CustomerType[]>({
  //     keys: ["customers", restaurantIdForCrud],
  //     params: {
  //       restaurantId: restaurantIdForCrud,
  //     },
  //     api: FindAllCustomer,
  //   });

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Truy vấn dữ liệu
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useEntityQuery<OrderType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllOrder,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<OrderType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "8%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Thời gian tạo đơn",
      dataIndex: "createAt",
      key: "createAt",
      width: "16%",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <DatePicker.RangePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            style={{ display: "flex" }}
            value={
              selectedKeys[0]
                ? (() => {
                    const [start, end] = JSON.parse(
                      selectedKeys[0] as string,
                    ) as [string, string];
                    return [dayjs(start), dayjs(end)];
                  })()
                : null
            }
            onChange={(dates) =>
              setSelectedKeys(
                dates
                  ? [
                      JSON.stringify([
                        dates[0]?.toISOString(),
                        dates[1]?.toISOString(),
                      ]),
                    ]
                  : [],
              )
            }
          />
          <Button
            type="primary"
            size="small"
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => confirm()}
          >
            Lọc
          </Button>
          {/* Nếu muốn nút reset thì bật lại */}
          {/* <Button
        size="small"
        style={{ width: "100%", marginTop: 4 }}
        onClick={() => {
          clearFilters?.();
          confirm();
        }}
      >
        Đặt lại
      </Button> */}
        </div>
      ),
      onFilter: (value, record) => {
        if (!value) return true;
        const [start, end] = JSON.parse(value as string) as [string, string];
        const date = dayjs(record.createAt);

        return (
          date.isSame(dayjs(start)) ||
          date.isSame(dayjs(end)) ||
          (date.isAfter(dayjs(start)) && date.isBefore(dayjs(end)))
        );
      },
      sorter: (a, b) =>
        dayjs(a.createAt).valueOf() - dayjs(b.createAt).valueOf(),
      render: (val) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm:ss") : ""),
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: "24%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 400, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Khách hàng"
            style={{ width: "100%" }}
            onChange={(val) => setSelectedKeys(val ? [val] : [])}
          >
            {/* {customers?.map((customer) => (
              <Option key={customer.id} value={customer.id}>
                #{customer.id} - {customer.fullname} - {customer.phone} -{" "}
                {customer.email}
              </Option>
            ))} */}
          </Select>
          <Button
            type="primary"
            size="small"
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => confirm()}
          >
            Lọc
          </Button>
        </div>
      ),
      onFilter: (value, record) => record.customer?.id === value,
      sorter: (a, b) => a.customer?.id! - b.customer?.id!,
      render: (record) =>
        `#${record.customer?.id} - ${record.customer?.fullname} - ${record.customer?.phone} - ${record.customer?.email}`,
    },
    {
      title: "Tổng thanh toán",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: "16%",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        let min = 0,
          max = 0;
        if (selectedKeys[0]) {
          try {
            [min, max] = JSON.parse(selectedKeys[0] as string) as [
              number,
              number,
            ];
          } catch {}
        }

        return (
          <div style={{ padding: 8 }}>
            <InputNumber
              placeholder="Tối thiểu"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={min || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([val ?? 0, max ?? 0])]);
              }}
            />
            <InputNumber
              placeholder="Tối đa"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={max || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([min ?? 0, val ?? 0])]);
              }}
            />
            <Button
              type="primary"
              size="small"
              style={{ width: "100%" }}
              onClick={() => confirm()}
            >
              Lọc
            </Button>
            {/* <Button
              size="small"
              style={{ width: "100%", marginTop: 4 }}
              onClick={() => {
                clearFilters?.();
                confirm();
              }}
            >
              Đặt lại
            </Button> */}
          </div>
        );
      },
      onFilter: (value, record) => {
        if (!value) return true;
        const [min, max] = JSON.parse(value as string) as [number, number];
        const totalPrice = record.totalPrice ?? 0;
        if (min && totalPrice < min) return false;
        if (max && totalPrice > max) return false;
        return true;
      },
      sorter: (a, b) => a?.totalPrice! - b?.totalPrice!,
      render: (totalPrice: number) => vietnamMoneyFormat(totalPrice || 0),
    },
    {
      title: "Thanh toán",
      dataIndex: "payStatus",
      key: "payStatus",
      width: "12%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Thanh toán"
            style={{ width: "100%" }}
            options={[
              { label: PayStatus.pay, value: PayStatus.pay },
              { label: PayStatus.notPay, value: PayStatus.notPay },
            ]}
            onChange={(val) => setSelectedKeys(val ? [val] : [])}
          ></Select>
          <Button
            type="primary"
            size="small"
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => confirm()}
          >
            Lọc
          </Button>
        </div>
      ),
      onFilter: (value, record) => record.payStatus === value,
      sorter: (a, b) => a?.payStatus!.localeCompare(b?.payStatus!),
      render: (status: string) => (
        <Tag color={status === PayStatus.pay ? "volcano" : "default"}>
          {status}
        </Tag>
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
            status === OrderStatus.confirm
              ? "green"
              : status === OrderStatus.canceled
                ? "red"
                : "default"
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
      className: "buttons",
      render: (text: any, record: OrderType, index: number) => (
        <>
          {hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.detail,
          }) && (
            <button
              className={"action " + getActionNameEn(actionIndexes.detail)}
              onClick={() =>
                openModal({
                  title: ModalTitleValue.detail(nameVN.toLowerCase()),
                  width: ModalWidthValue.split3,
                  className: `${getActionNameEn(
                    actionIndexes.detail,
                  )} ${nameEN}`,
                  children: ManagerOrderModals.detail(record),
                })
              }
            >
              {/* <FontAwesomeIcon icon={faEye} /> */}
              <Eye />
            </button>
          )}
          {hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.update,
          }) && (
            <button
              className={"action " + getActionNameEn(actionIndexes.update)}
              onClick={() =>
                openModal({
                  title: ModalTitleValue.update(nameVN.toLowerCase()),
                  width: ModalWidthValue.split3,
                  className: `${getActionNameEn(
                    actionIndexes.update,
                  )} ${nameEN}`,
                  children: ManagerOrderModals.update(record),
                })
              }
            >
              {/* <FontAwesomeIcon icon={faPenToSquare} /> */}
              <PenBox />
            </button>
          )}
          {hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.print,
          }) && (
            <button
              className={"action " + getActionNameEn(actionIndexes.print)}
              onClick={() =>
                openModal({
                  title: ModalTitleValue.print(nameVN.toLowerCase()),
                  width: ModalWidthValue.split3,
                  className: `${getActionNameEn(
                    actionIndexes.print,
                  )} ${nameEN}`,
                  children: ManagerOrderModals.print(record),
                })
              }
            >
              {/* <FontAwesomeIcon icon={faPenToSquare} /> */}
              <Printer />
            </button>
          )}
        </>
      ),
    },
  ];

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    // { label: "Khách", value: "customer" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: OrderStatus.confirm, value: OrderStatus.confirm },
    { label: OrderStatus.canceled, value: OrderStatus.canceled },
    { label: OrderStatus.pending, value: OrderStatus.pending },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    [],
  );
  // - Lọc dữ liệu
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    return orders.filter((order) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(order.id).includes(value);
        }
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        matchStatus = filterStatusValue.includes(order.status!);
      }

      return matchFind && matchStatus;
    });
  }, [orders, filterFindType, filterFindValue, filterStatusValue]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title1: "Thông tin cơ bản",
    title2: "Thông tin khách hàng và món ăn",
    title3: "Thông tin thanh toán",
    id: "Mã đơn món ăn",
    createAt: "Thời gian tạo đơn",
    employee:
      "Nhân viên xác nhận (Mã nhân viên - Tên nhân viên - Số điện thoại - Email)",
    customerFullname: "Họ và tên",
    customerPhone: "Số điện thoại",
    customerEmail: "Email",
    totalPrice: "Tổng thanh toán (VNĐ)",
    status: "Trạng thái đơn món ăn",
    payId: "Mã giao dịch",
    payMethod: "Phương thức thanh toán",
    payTime: "Thời gian thanh toán",
    payTotalPrice: "Số tiền thanh toán",
    payStatus: "Trạng thái thanh toán",
    orderDetails: "Chi tiết gọi món ăn",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    title3: "",
    id: "Chưa xác định!",
    createAt: "",
    employee:
      "Chọn Nhân viên xác nhận (Mã nhân viên - Tên nhân viên - Số điện thoại - Email)",
    customerFullname: "Nhập Họ và tên",
    customerPhone: "Nhập Số điện thoại",
    customerEmail: "Nhập Email",
    totalPrice: "",
    status: "Đang chờ xác nhận",
    payId: "Nhập Mã giao dịch",
    payMethod: "Chọn Phương thức thanh toán",
    payTime: "Chọn Thời gian thanh toán",
    payTotalPrice: "Nhập Số tiền thanh toán",
    payStatus: "Chọn Trạng thái thanh toán",
    orderDetails: "",
  };
  // - Quản lý các modal
  const ManagerOrderModals = {
    detail: (order: OrderType) => (
      <ManagerDetailOrder
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={order}
        dataForCrud={{
          orderDetails: order?.orderDetails,
        }}
        tableNoActionsFormat={{
          widths: OrDetailWidths,
          columns: OrDetailColumns,
          attributes: OrDetailAttributes,
          format: OrDetailFormat,
        }}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <ManagerCreateOrder
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{
          infoLogin: infoLogin,
        }}
        tableNoActionsFormat={{
          widths: OrDetailWidths,
          columns: OrDetailColumns,
          attributes: OrDetailAttributes,
          format: OrDetailFormat,
        }}
        modalForCrud={{
          orderDetails: {
            openModalCreate: ({
              orderDetails,
              setOrderDetails,
            }: OrderDetailsTableProps) =>
              openSecondModal({
                title: "Thêm món ăn",
                width: ModalWidthValue.split2,
                className: "secondary order-detail",
                children: ManagerOrderDetailModals.create({
                  orderDetails: orderDetails,
                  setOrderDetails: setOrderDetails,
                }),
              }),
            openModalDelete: ({
              orderDetails,
              setOrderDetails,
            }: OrderDetailsTableProps) =>
              openSecondModal({
                title: "Xoá món ăn",
                width: ModalWidthValue.split2,
                className: "secondary input-ticket-detail",
                children: ManagerOrderDetailModals.delete({
                  orderDetails: orderDetails,
                  setOrderDetails: setOrderDetails,
                }),
              }),
          },
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (order: OrderType) => (
      <ManagerUpdateOrder
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={order}
        dataForCrud={{
          infoLogin: infoLogin,
          orderDetails: order?.orderDetails,
        }}
        tableNoActionsFormat={{
          widths: OrDetailWidths,
          columns: OrDetailColumns,
          attributes: OrDetailAttributes,
          format: OrDetailFormat,
        }}
        closeModal={() => closeModal()}
      />
    ),
    print: (order: OrderType) => (
      <ManagerPrintOrder
        objectEN={nameEN}
        data={order}
        tableNoActionsFormat={{
          widths: OrDetailWidths,
          columns: OrDetailColumns,
          attributes: OrDetailAttributes,
          format: OrDetailFormat,
        }}
        closeModal={() => closeModal()}
      />
    ),
  };

  // Các thành phần giữ giá trị cho việc hiển thị modal thứ 2
  // - Các biến
  const { secondModal, openSecondModal, closeSecondModal } = useSecondModal();
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
  // - Quản lý các modal
  const ManagerOrderDetailModals = {
    create: ({ orderDetails, setOrderDetails }: OrderDetailsTableProps) => (
      <ManagerCreateOrderDetail
        objectEN=""
        defaultLabels={defaultSecondLabels}
        defaultInputs={defaultSecondInputs}
        restaurantId={restaurantIdForCrud}
        orderDetails={orderDetails}
        setOrderDetails={setOrderDetails}
        closeModal={() => closeSecondModal()}
      />
    ),
    delete: ({ orderDetails, setOrderDetails }: OrderDetailsTableProps) => (
      <ManagerDeleteOrderDetail
        objectEN=""
        defaultLabels={defaultSecondLabels}
        defaultInputs={defaultSecondInputs}
        restaurantId={restaurantIdForCrud}
        orderDetails={orderDetails}
        setOrderDetails={setOrderDetails}
        closeModal={() => closeSecondModal()}
      />
    ),
  };

  // Các biến giữ giá trị cho việc hiển thị thông số trên card
  const [totalPriceCardValue, setTotalPriceCardValue] = useState<number>(0);
  const [totalOrderCardValue, setTotalOrderCardValue] = useState<number>(0);
  const [confirmCardValue, setConfirmCardValue] = useState<number>(0);
  const [cancelCardValue, setCancelCardValue] = useState<number>(0);
  const [pendingCardValue, setPendingCardValue] = useState<number>(0);
  // Hàm cập nhật số liệu cho các thẻ
  const updateCards = () => {
    let totalPrice = 0,
      totalOrder = 0,
      totalConfirm = 0,
      totalCancel = 0,
      totalPending = 0;
    orders?.forEach((order) => {
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
  // ...
  useEffect(() => {
    updateCards();
  }, [orders]);

  return (
    <>
      <main className="admin-manager-main">
        <AdminManagerMainHeader title={nameVN} />
        <AdminManagerMainFilterInfo
          objectName={nameVN}
          findOptions={findOptions}
          filterFindType={filterFindType}
          filterFindValue={filterFindValue}
          setFilterFindType={setFilterFindType}
          setFilterFindValue={setFilterFindValue}
          statusOptions={statusOptions}
          filterStatusValue={getFilterSelectValueToShow({
            options: statusOptions,
            filterSelectValue: filterStatusValue,
          })}
          setFilterStatusValue={setFilterStatusValue}
          onClickFilterReset={() => {
            setFilterFindType(findOptions[0].value);
            setFilterFindValue(null);
            setFilterStatusValue(null);
            setTableKey((prev) => prev + 1);
          }}
          isShowFilterCreate={hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.create,
          })}
          onClickFilterCreate={() =>
            openModal({
              title: ModalTitleValue.create(nameVN.toLowerCase()),
              width: ModalWidthValue.split3,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: ManagerOrderModals.create(),
            })
          }
        />
        <div className="admin-manager-main__cards">
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
        <AdminManagerMainData
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={filteredOrders || []}
          isLoading={isLoading}
        />
      </main>
      {modal.open && (
        <CustomModal
          title={modal.title}
          open={modal.open}
          width={modal.width}
          className={modal.className}
          children={modal.children}
          setCloseModal={() => closeModal()}
        />
      )}
      {secondModal.open && (
        <CustomModal
          title={secondModal.title}
          open={secondModal.open}
          width={secondModal.width}
          className={secondModal.className}
          children={secondModal.children}
          setCloseModal={() => closeSecondModal()}
        />
      )}
    </>
  );
};

export default ManagerOrdersPage;
