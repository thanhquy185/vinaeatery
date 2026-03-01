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
  IssuesCloseOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { ManagerPageProps } from "../../../common/props";
import type {
  InputTicketDetailType,
  InputTicketType,
  SupplierType,
} from "../../../common/types";
import {
  InputTicketStatus,
  PayStatus,
  ModalTitleValue,
  ModalWidthValue,
  CommonStatus,
} from "../../../common/values";
import CustomCardStatic from "../../../components/admin-manager/common/card-static";
import CustomModal from "../../../components/common/modal";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import AdminManagerMainFilterInfo from "../../../components/admin-manager/common/main-filter-info";
import AdminManagerMainData from "../../../components/admin-manager/common/main-data";
import ManagerDetailInputTicket from "../../../components/admin-manager/modal/input-ticket/manager-detail-input-ticket";
import ManagerCreateInputTicket from "../../../components/admin-manager/modal/input-ticket/manager-create-input-ticket";
import ManagerUpdateInputTicket from "../../../components/admin-manager/modal/input-ticket/manager-update-input-ticket";
import ManagerPrintInputTicket from "../../../components/admin-manager/modal/input-ticket/manager-print-input-ticket";
import ManagerCreateInputTicketDetail from "../../../components/admin-manager/modal/input-ticket-detail/manager-create-input-ticket-detail";
import ManagerDeleteInputTicketDetail from "../../../components/admin-manager/modal/input-ticket-detail/manager-delete-input-ticket-detail";
import { useModal } from "../../../hook/use-modal";
import { useSecondModal } from "../../../hook/use-second-modal";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { FindAllSupplier } from "../../../requests/suppliers";
import { FindAllInputTicket } from "../../../requests/input-tickets";
import { actionIndexes, getActionNameEn } from "../../../utils/default-actions";
import {
  getFilterSelectValueToShow,
  vietnamMoneyFormat,
} from "../../../utils/other-events";
import { hasPermission } from "../../../utils/has-permissions";
import dayjs from "dayjs";

// Các giá trị chung
// - Chi tiết phiếu nhập
export interface InputTicketDetailsTableProps {
  inputTicketDetails?: InputTicketDetailType[];
  setInputTicketDetails?: Dispatch<SetStateAction<InputTicketDetailType[]>>;
}
const IPDetailWidths = ["14%", "30%", "17%", "17%", "22%"];
const IPDetailColumns = [
  "Mã nguyên liệu",
  "Tên nguyên liệu",
  "Giá nhập (VNĐ)",
  "Số lượng",
  "Thành tiền (VNĐ)",
];
const IPDetailAttributes = [
  "ingredient.id",
  "ingredient.name",
  "price",
  "quantity",
  "price*quantity",
];
const IPDetailFormat = ["", "", "price", "", "price"];

// Manager Input Tickets Page
const ManagerInputTicketsPage: FC<ManagerPageProps> = ({
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

  // Các biến giữ dữ liệu về nhà cung cấp
  const { data: suppliers } = useEntityQuery<SupplierType[]>({
    keys: ["suppliers", restaurantIdForCrud, CommonStatus.active],
    params: {
      restaurantId: restaurantIdForCrud,
      statusValue: [CommonStatus.active],
    },
    api: FindAllSupplier,
  });

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Truy vấn dữ liệu
  const {
    data: inputTickets,
    isLoading,
    isError,
    error,
  } = useEntityQuery<InputTicketType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllInputTicket,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<InputTicketType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "8%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Thời gian tạo phiếu",
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
      title: "Nhà cung cấp",
      key: "supplier",
      width: "24%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 400, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Nhà cung cấp"
            style={{ width: "100%" }}
            options={suppliers?.map((supplier) => ({
              label: `#${supplier.id} - ${supplier.name}`,
              value: supplier.id,
            }))}
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
      onFilter: (value, record) => record.supplier?.id === value,
      sorter: (a, b) => a.supplier?.id! - b.supplier?.id!,
      render: (record) => `#${record.supplier?.id} - ${record.supplier?.name}`,
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
            status === InputTicketStatus.giveback
              ? "purple"
              : status === InputTicketStatus.confirm
                ? "green"
                : status === InputTicketStatus.canceled
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
      render: (text: any, record: InputTicketType, index: number) => (
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
                  children: ManagerInputTicketModals.detail(record),
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
                  children: ManagerInputTicketModals.update(record),
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
                  children: ManagerInputTicketModals.print(record),
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
  const findOptions = [{ label: "#", value: "id" }];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: InputTicketStatus.giveback, value: InputTicketStatus.giveback },
    { label: InputTicketStatus.confirm, value: InputTicketStatus.confirm },
    { label: InputTicketStatus.canceled, value: InputTicketStatus.canceled },
    { label: InputTicketStatus.pending, value: InputTicketStatus.pending },
    // { label: PayStatus.pay, value: PayStatus.pay },
    // { label: PayStatus.notPay, value: PayStatus.notPay },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );
  // - Lọc dữ liệu
  const filteredInputTickets = useMemo(() => {
    if (!inputTickets) return [];

    return inputTickets.filter((inputTicket) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(inputTicket.id).includes(value);
        }
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        matchStatus = filterStatusValue.includes(inputTicket.status!);
      }

      return matchFind && matchStatus;
    });
  }, [inputTickets, filterFindType, filterFindValue, filterStatusValue]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title1: "Thông tin cơ bản",
    title2: "Thông tin nhập hàng",
    id: "Mã phiếu nhập",
    createAt: "Thời gian tạo phiếu",
    employee:
      "Nhân viên xác nhận  (Mã nhân viên - Tên nhân viên - Số điện thoại - Email)",
    supplier:
      "Nhà cung cấp (Mã nhà cung cấp - Tên nhà cung cấp - Số điện thoại - Email - Địa chỉ)",
    totalPrice: "Tổng thanh toán (VNĐ)",
    status: "Trạng thái phiếu nhập",
    inputTicketDetails: "Chi tiết phiếu nhập",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    id: "Chưa xác định!",
    createAt: "",
    employee: "",
    supplier:
      "Chọn Nhà cung cấp (Mã nhà cung cấp - Tên nhà cung cấp - Số điện thoại - Email - Địa chỉ)",
    totalPrice: "",
    status: "Đang chờ xác nhận (Chưa thanh toán)",
    inputTicketDetails: "",
  };
  // - Quản lý các modal
  const ManagerInputTicketModals = {
    detail: (inputTicket: InputTicketType) => (
      <ManagerDetailInputTicket
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={inputTicket}
        dataForCrud={{
          inputTicketDetails: inputTicket?.inputTicketDetails,
        }}
        tableNoActionsFormat={{
          widths: IPDetailWidths,
          columns: IPDetailColumns,
          attributes: IPDetailAttributes,
          format: IPDetailFormat,
        }}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <ManagerCreateInputTicket
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{
          infoLogin: infoLogin,
          suppliers: suppliers,
        }}
        tableNoActionsFormat={{
          widths: IPDetailWidths,
          columns: IPDetailColumns,
          attributes: IPDetailAttributes,
          format: IPDetailFormat,
        }}
        modalForCrud={{
          inputTicketDetails: {
            openModalCreate: ({
              inputTicketDetails,
              setInputTicketDetails,
            }: InputTicketDetailsTableProps) =>
              openSecondModal({
                title: "Thêm nguyên liệu",
                width: ModalWidthValue.split2,
                className: "secondary input-ticket-detail",
                children: ManagerInputTicketDetailModals.create({
                  inputTicketDetails: inputTicketDetails,
                  setInputTicketDetails: setInputTicketDetails,
                }),
              }),
            openModalDelete: ({
              inputTicketDetails,
              setInputTicketDetails,
            }: InputTicketDetailsTableProps) =>
              openSecondModal({
                title: "Xoá nguyên liệu",
                width: ModalWidthValue.split2,
                className: "secondary input-ticket-detail",
                children: ManagerInputTicketDetailModals.delete({
                  inputTicketDetails: inputTicketDetails,
                  setInputTicketDetails: setInputTicketDetails,
                }),
              }),
          },
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (inputTicket: InputTicketType) => (
      <ManagerUpdateInputTicket
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={inputTicket}
        dataForCrud={{
          inputTicketDetails: inputTicket?.inputTicketDetails,
        }}
        tableNoActionsFormat={{
          widths: IPDetailWidths,
          columns: IPDetailColumns,
          attributes: IPDetailAttributes,
          format: IPDetailFormat,
        }}
        closeModal={() => closeModal()}
      />
    ),
    print: (inputTicket: InputTicketType) => (
      <ManagerPrintInputTicket
        objectEN={nameEN}
        data={inputTicket}
        tableNoActionsFormat={{
          widths: IPDetailWidths,
          columns: IPDetailColumns,
          attributes: IPDetailAttributes,
          format: IPDetailFormat,
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
    title: "Thông tin nguyên liệu",
    ingredientCreate:
      "Nguyên liệu (Mã nguyên liệu - Tên nguyên liệu - Loại nguyên liệu - Định lượng & Đơn vị - Giá nhập)",
    ingredientDelete:
      "Nguyên liệu (Mã nguyên liệu - Tên nguyên liệu - Số lượng - Giá nhập)",
    price: "Giá nhập",
    quantity: "Số lượng",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultSecondInputs = {
    title: "Thông tin nguyên liệu",
    ingredientCreate:
      "Chọn Nguyên liệu (Mã nguyên liệu - Tên nguyên liệu - Loại nguyên liệu - Định lượng & Đơn vị - Giá nhập)",
    ingredientDelete:
      "Chọn Nguyên liệu (Mã nguyên liệu - Tên nguyên liệu - Số lượng - Giá nhập)",
    price: "Nhập Giá nhập",
    quantity: "Nhập Số lượng",
  };
  // - Quản lý các modal
  const ManagerInputTicketDetailModals = {
    create: ({
      inputTicketDetails,
      setInputTicketDetails,
    }: InputTicketDetailsTableProps) => (
      <ManagerCreateInputTicketDetail
        objectEN=""
        defaultLabels={defaultSecondLabels}
        defaultInputs={defaultSecondInputs}
        restaurantId={restaurantIdForCrud}
        inputTicketDetails={inputTicketDetails}
        setInputTicketDetails={setInputTicketDetails}
        closeModal={() => closeSecondModal()}
      />
    ),
    delete: ({
      inputTicketDetails,
      setInputTicketDetails,
    }: InputTicketDetailsTableProps) => (
      <ManagerDeleteInputTicketDetail
        objectEN=""
        defaultLabels={defaultSecondLabels}
        defaultInputs={defaultSecondInputs}
        restaurantId={restaurantIdForCrud}
        inputTicketDetails={inputTicketDetails}
        setInputTicketDetails={setInputTicketDetails}
        closeModal={() => closeSecondModal()}
      />
    ),
  };

  // Các biến giữ giá trị cho việc hiển thị thông số trên card
  const [totalPriceCardValue, setTotalPriceCardValue] = useState<number>(0);
  const [giveBackCardValue, setGiveBackCardValue] = useState<number>(0);
  const [confirmCardValue, setConfirmCardValue] = useState<number>(0);
  const [cancelCardValue, setCancelCardValue] = useState<number>(0);
  const [pendingCardValue, setPendingCardValue] = useState<number>(0);
  // Hàm cập nhật số liệu cho các thẻ
  const updateCards = () => {
    let totalPrice = 0,
      totalGiveBack = 0,
      totalConfirm = 0,
      totalCancel = 0,
      totalPending = 0;
    inputTickets?.forEach((inputTicket) => {
      totalPrice += inputTicket.totalPrice!;
      if (inputTicket.status! === InputTicketStatus.giveback) {
        totalGiveBack += 1;
      }
      if (inputTicket.status! === InputTicketStatus.confirm) {
        totalConfirm += 1;
      }
      if (inputTicket.status! === InputTicketStatus.canceled) {
        totalCancel += 1;
      }
      if (inputTicket.status! === InputTicketStatus.pending) {
        totalPending += 1;
      }
    });

    setTotalPriceCardValue(totalPrice);
    setGiveBackCardValue(totalGiveBack);
    setConfirmCardValue(totalConfirm);
    setCancelCardValue(totalCancel);
    setPendingCardValue(totalPending);
  };
  // Cập nhật mỗi khi danh sách phiếu nhập thay đổi
  useEffect(() => {
    updateCards();
  }, [inputTickets]);

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
              children: ManagerInputTicketModals.create(),
            })
          }
        />
        <div className="admin-manager-main__cards">
          <CustomCardStatic
            title={"Tổng thanh toán (VNĐ)"}
            value={totalPriceCardValue}
            prefix={<DollarOutlined />}
            separator="."
            valueStyle={{ color: "#d2a016" }}
          />
          <CustomCardStatic
            title={InputTicketStatus.giveback}
            value={giveBackCardValue}
            prefix={<IssuesCloseOutlined />}
            valueStyle={{ color: "#7b13cf" }}
          />
          <CustomCardStatic
            title={InputTicketStatus.confirm}
            value={confirmCardValue}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
          <CustomCardStatic
            title={InputTicketStatus.canceled}
            value={cancelCardValue}
            prefix={<CloseCircleOutlined />}
            valueStyle={{ color: "#cf1322" }}
          />
          <CustomCardStatic
            title={InputTicketStatus.pending}
            value={pendingCardValue}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: "#676767" }}
          />
        </div>
        <AdminManagerMainData
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={filteredInputTickets || []}
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

export default ManagerInputTicketsPage;
