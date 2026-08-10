import useModal from "../../../hooks/useModal";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import ModalComponent from "../../../components/ModalComponent";
import TableRUPActionsComponent from "../../../components/TableRUPActionsComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../../components/admin-manager/MainFilterInfoComponent";
import MainStatisticCardsComponent from "../../../components/admin-manager/MainStatisticsCardsComponent";
import MainDataComponent from "../../../components/admin-manager/NewMainDataComponent";
import DetailBillModalComponent from "../../../components/admin-manager/modal/bill/DetailBillModalComponent";
import CreateBillModalComponent from "../../../components/admin-manager/modal/bill/CreateBillModalComponent";
import UpdateBillModalComponent from "../../../components/admin-manager/modal/bill/UpdateBillModalComponent";
import PrintBillModalComponent from "../../../components/admin-manager/modal/bill/PrintBillModalComponent";
import PaymentMethodApiService from "../../../services/api/v1/PaymentMethodApiService";
import FoodApiService from "../../../services/api/v1/FoodApiService";
import BillApiService from "../../../services/api/v1/BillApiService";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Button, DatePicker, InputNumber, Select, Tag } from "antd";
import {
  BillStatusValue,
  ModalTitleValue,
  ModalWidthValue,
  BillPaymentStatusValue,
} from "../../../constants/values";
import { hasPermission } from "../../../utils/hasPermissions";
import { actionIndexes, getActionNameEn } from "../../../utils/defaultActions";
import {
  getFilterSelectValueToShow,
  vietnamMoneyFormat,
} from "../../../utils/otherEvents";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { FoodCrudResponseType } from "../../../types/FoodType";
import type { PaymentMethodCrudResponseType } from "../../../types/PaymentMethodType";
import type { BillSummaryResponseType } from "../../../types/BillType";

const ManagerBillsPage: React.FC<AdminManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );

  // Các biến giữ dữ liệu
  // - Phương thức thanh toán
  const { data: paymentMethods } = useEntityQuery<
    PaymentMethodCrudResponseType[]
  >({
    keys: ["payment-methods-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: PaymentMethodApiService.handleGetCrud,
  });
  // - Món ăn
  const { data: foods } = useEntityQuery<FoodCrudResponseType[]>({
    keys: ["foods-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FoodApiService.handleGetCrud,
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Họ tên", value: "customer-fullname" },
    { label: "SĐT", value: "customer-phone" },
    { label: "Email", value: "customer-email" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: BillStatusValue.confirmed, value: BillStatusValue.confirmed },
    { label: BillStatusValue.cancelled, value: BillStatusValue.cancelled },
    { label: BillStatusValue.pending, value: BillStatusValue.pending },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    [],
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const { data: billData, isLoading } = useEntityQuery<
    PageResponseType<BillSummaryResponseType>
  >({
    keys: [
      nameEN,
      page,
      size,
      filterFindType,
      filterFindValue,
      filterStatusValue,
      restaurantIdForCrud,
    ],
    params: {
      page: page,
      size: size,
      findType: filterFindType!,
      findValue: filterFindValue!,
      statusValue: filterStatusValue!,
      restaurantId: restaurantIdForCrud,
    },
    api: BillApiService.handleGetSummary,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<BillSummaryResponseType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Thời gian tạo đơn",
      dataIndex: "createAt",
      key: "createAt",
      width: "16%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
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
          confirmed();
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
      title: "Họ và tên",
      dataIndex: "customerFullname",
      key: "customerFullname",
      width: "20%",
      sorter: (a, b) => a.customerFullname.localeCompare(b.customerFullname),
    },
    {
      title: "Số điện thoại",
      dataIndex: "customerPhone",
      key: "customerPhone",
      width: "12%",
      sorter: (a, b) => a.customerPhone.localeCompare(b.customerPhone),
    },
    {
      title: "Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
      width: "25%",
      sorter: (a, b) => a.customerEmail.localeCompare(b.customerEmail),
    },
    {
      title: "Tổng thanh toán",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: "16%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
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
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: "12%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Thanh toán"
            style={{ width: "100%" }}
            options={[
              {
                label: BillPaymentStatusValue.paid,
                value: BillPaymentStatusValue.paid,
              },
              {
                label: BillPaymentStatusValue.unpaid,
                value: BillPaymentStatusValue.unpaid,
              },
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
      onFilter: (value, record) => record.paymentStatus === value,
      sorter: (a, b) => a?.paymentStatus!.localeCompare(b?.paymentStatus!),
      render: (status: string) => (
        <Tag
          color={status === BillPaymentStatusValue.paid ? "volcano" : "default"}
          bordered={false}
        >
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
            status === BillStatusValue.confirmed
              ? "green"
              : status === BillStatusValue.cancelled
                ? "red"
                : "default"
          }
          bordered={false}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      width: 100,
      fixed: "right",
      className: "buttons",
      render: (record: BillSummaryResponseType) => (
        <TableRUPActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          restaurantIdForCrud={restaurantIdForCrud}
          validActions={validActions!}
          record={record}
          modalWidth={ModalWidthValue.split3}
          managerModals={ManagerBillModals}
          openModal={openModal}
        />
      ),
    },
  ];

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title1: "Thông tin cơ bản",
    title2: "Thông tin khách hàng và món ăn",
    title3: "Thông tin thanh toán",
    id: "Mã hoá đơn",
    createAt: "Thời gian tạo đơn",
    employee: "Nhân viên xác nhận",
    customerFullname: "Họ và tên",
    customerPhone: "Số điện thoại",
    customerEmail: "Email",
    totalPrice: "Tổng thanh toán (VNĐ)",
    status: "Trạng thái hoá đơn",
    paymentId: "Mã giao dịch",
    paymentMethod: "Phương thức thanh toán",
    paymentAt: "Thời gian thanh toán",
    paymentTotalPrice: "Số tiền thanh toán",
    paymentStatus: "Trạng thái thanh toán",
    billDetails: "Chi tiết gọi món ăn",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    title3: "",
    id: "Chưa xác định!",
    createAt: "",
    employee: "",
    customerFullname: "Nhập Họ và tên",
    customerPhone: "Nhập Số điện thoại",
    customerEmail: "Nhập Email",
    totalPrice: "",
    status: "Đang chờ xác nhận",
    paymentId: "Nhập Mã giao dịch",
    paymentMethod: "Chọn Phương thức thanh toán",
    paymentAt: "Chọn Thời gian thanh toán",
    paymentTotalPrice: "Nhập Số tiền thanh toán",
    paymentStatus: "Chọn Trạng thái thanh toán",
    billDetails: "",
  };
  // - Quản lý các modal
  const ManagerBillModals = {
    detail: (bill: BillSummaryResponseType) => (
      <DetailBillModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={bill}
        dataForCrud={{
          foods: foods,
        }}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateBillModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{
          infoLogin: infoLogin,
          paymentMethods: paymentMethods,
          foods: foods,
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (bill: BillSummaryResponseType) => (
      <UpdateBillModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={bill}
        dataForCrud={{
          infoLogin: infoLogin,
          foods: foods,
        }}
        closeModal={() => closeModal()}
      />
    ),
    print: (bill: BillSummaryResponseType) => (
      <PrintBillModalComponent
        objectEN={nameEN}
        data={bill}
        closeModal={() => closeModal()}
      />
    ),
  };

  //
  const cardValues = useMemo(() => {
    let totalPrice = 0;
    let totalBill = 0;
    let totalConfirmed = 0;
    let totalCanceled = 0;
    let totalPending = 0;

    billData?.content.forEach((bill) => {
      totalPrice += bill.totalPrice ?? 0;
      totalBill++;

      switch (bill.status) {
        case BillStatusValue.confirmed:
          totalConfirmed++;
          break;
        case BillStatusValue.cancelled:
          totalCanceled++;
          break;
        case BillStatusValue.pending:
          totalPending++;
          break;
      }
    });

    return {
      totalPrice,
      totalBill,
      totalConfirmed,
      totalCanceled,
      totalPending,
    };
  }, [billData]);

  return (
    <>
      <main className="admin-manager-main">
        <MainHeaderComponent title={nameVN} />
        <MainFilterInfoComponent
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
              children: ManagerBillModals.create(),
            })
          }
        />
        <MainStatisticCardsComponent
          titles={[
            "Tổng tiền (VNĐ)",
            "Tổng số đơn",
            BillStatusValue.confirmed,
            BillStatusValue.cancelled,
            BillStatusValue.pending,
          ]}
          values={[
            cardValues.totalPrice,
            cardValues.totalBill,
            cardValues.totalConfirmed,
            cardValues.totalCanceled,
            cardValues.totalPending,
          ]}
        />
        <MainDataComponent<BillSummaryResponseType>
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={billData}
          isLoading={isLoading}
          isScroll={true}
          onPageChange={(page, size) => {
            setPage(page);
            setSize(size);
          }}
        />
      </main>
      {modal.open && (
        <ModalComponent
          title={modal.title}
          open={modal.open}
          width={modal.width}
          className={modal.className}
          children={modal.children}
          setCloseModal={() => closeModal()}
        />
      )}
    </>
  );
};

export default ManagerBillsPage;
