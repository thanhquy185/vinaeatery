import useModal from "../../../hooks/useModal";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import ModalComponent from "../../../components/ModalComponent";
import TableRUPActionsComponent from "../../../components/TableRUPActionsComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../../components/admin-manager/MainFilterInfoComponent";
import MainStatisticCardsComponent from "../../../components/admin-manager/MainStatisticsCardsComponent";
import MainDataComponent from "../../../components/admin-manager/NewMainDataComponent";
import DetailInputTicketModalComponent from "../../../components/admin-manager/modal/input-ticket/DetailInputTicketModalComponent";
import CreateInputTicketModalComponent from "../../../components/admin-manager/modal/input-ticket/CreateInputTicketModalComponent";
import UpdateInputTicketModalComponent from "../../../components/admin-manager/modal/input-ticket/UpdateInputTicketModalComponent";
import PrintInputTicketModalComponent from "../../../components/admin-manager/modal/input-ticket/PrintInputTicketModalComponent";
import SupplierApiService from "../../../services/api/v1/SupplierApiService";
import InputTicketApiService from "../../../services/api/v1/InputTicketApiService";
import IngredientApiService from "../../../services/api/v1/IngredientApiService";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  InputNumber,
  Select,
  Tag,
  type SelectProps,
} from "antd";
import {
  InputTicketStatusValue,
  ModalTitleValue,
  ModalWidthValue,
  InputTicketPaymentStatusValue,
} from "../../../constants/values";
import {
  actionIndexes,
  getActionNameEn,
} from "../../../utils/defaultActionsUtil";
import { hasPermission } from "../../../utils/hasPermissionsUtil";
import {
  getFilterSelectValueToShow,
  vietnamMoneyFormat,
} from "../../../utils/otherEvents";
import type { ColumnsType } from "antd/es/table";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { SupplierCrudResponseType } from "../../../types/SupplierType";
import type { IngredientCrudResponseType } from "../../../types/IngredientType";
import type { InputTicketSummaryResponseType } from "../../../types/InputTicketType";

const ManagerInputTicketsPage: React.FC<AdminManagerPageProps> = ({
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
  // - Nhà cung cấp
  const { data: suppliers } = useEntityQuery<SupplierCrudResponseType[]>({
    keys: ["suppliers-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: SupplierApiService.handleGetCrud,
  });
  // - Nguyên liệu
  const { data: ingredients } = useEntityQuery<IngredientCrudResponseType[]>({
    keys: ["ingredients-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: IngredientApiService.handleGetCrud,
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Key
  const [tableKey, setTableKey] = useState<number>(0);
  // - Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  // - Tìm kiếm thông tin
  const findOptions = [{ label: "#", value: "id" }];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    {
      label: InputTicketStatusValue.pending,
      value: InputTicketStatusValue.pending,
    },
    {
      label: InputTicketStatusValue.cancelled,
      value: InputTicketStatusValue.cancelled,
    },
    {
      label: InputTicketStatusValue.confirmed,
      value: InputTicketStatusValue.confirmed,
    },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const { data: inputTicketData, isLoading } = useEntityQuery<
    PageResponseType<InputTicketSummaryResponseType>
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
    api: InputTicketApiService.handleGetSummary,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<InputTicketSummaryResponseType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 50,
      fixed: "left",
      sorter: (a, b) => a.id - b.id,
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
        // clearFilters,
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
      className: "left",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 400, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Nhà cung cấp"
            style={{ width: "100%" }}
            options={suppliers?.map((supplier) => ({
              label: `#${supplier.id} - ${supplier.fullname}`,
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
      onFilter: (value, record) => record.supplier.id === value,
      sorter: (a, b) => a.supplier.id - b.supplier.id,
      render: (record) =>
        `#${record.supplier.id} - ${record.supplier.fullname}`,
    },
    {
      title: "Tổng thanh toán",
      dataIndex: "totalInputPrice",
      key: "totalInputPrice",
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
        const totalInputPrice = record.totalInputPrice ?? 0;
        if (min && totalInputPrice < min) return false;
        if (max && totalInputPrice > max) return false;
        return true;
      },
      sorter: (a, b) => a.totalInputPrice - b.totalInputPrice,
      render: (totalInputPrice: number) => vietnamMoneyFormat(totalInputPrice),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: "13%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Thanh toán"
            style={{ width: "100%" }}
            options={[
              {
                label: InputTicketPaymentStatusValue.paid,
                value: InputTicketPaymentStatusValue.paid,
              },
              {
                label: InputTicketPaymentStatusValue.unpaid,
                value: InputTicketPaymentStatusValue.unpaid,
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
      sorter: (a, b) => a.paymentStatus.localeCompare(b.paymentStatus),
      render: (paymentStatus: string) => (
        <Tag
          color={
            paymentStatus === InputTicketPaymentStatusValue.paid
              ? "volcano"
              : "default"
          }
          bordered={false}
        >
          {paymentStatus}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "13%",
      render: (status: string) => (
        <Tag
          color={
            status === InputTicketStatusValue.confirmed
              ? "green"
              : status === InputTicketStatusValue.cancelled
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
      render: (record: InputTicketSummaryResponseType) => (
        <TableRUPActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          restaurantIdForCrud={restaurantIdForCrud}
          validActions={validActions!}
          record={record}
          modalWidth={ModalWidthValue.split3}
          managerModals={ManagerInputTicketModals}
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
    title2: "Thông tin nhập hàng",
    id: "Mã phiếu nhập",
    createAt: "Thời gian tạo phiếu",
    employee: "Nhân viên tạo phiếu",
    supplier: "Nhà cung cấp",
    totalInputPrice: "Tổng tiền nguyên liệu (VNĐ)",
    paymentStatus: "Thanh toán",
    status: "Trạng thái",
    inputTicketDetails: "Chi tiết phiếu nhập",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    id: "Chưa xác định!",
    createAt: "",
    employee: "",
    supplier: "Chọn Nhà cung cấp",
    totalInputPrice: "",
    paymentStatus: "",
    status: "",
    inputTicketDetails: "",
  };
  // - Quản lý các modal
  const ManagerInputTicketModals = {
    detail: (inputTicketSummary: InputTicketSummaryResponseType) => (
      <DetailInputTicketModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={inputTicketSummary}
        dataForCrud={{
          ingredients: ingredients,
        }}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateInputTicketModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{
          infoLogin: infoLogin,
          suppliers: suppliers,
          ingredients: ingredients,
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (inputTicketSummary: InputTicketSummaryResponseType) => (
      <UpdateInputTicketModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={inputTicketSummary}
        dataForCrud={{
          infoLogin: infoLogin,
          ingredients: ingredients,
        }}
        closeModal={() => closeModal()}
      />
    ),
    print: (inputTicketSummary: InputTicketSummaryResponseType) => (
      <PrintInputTicketModalComponent
        objectEN={nameEN}
        data={inputTicketSummary}
        closeModal={() => closeModal()}
      />
    ),
  };

  //
  const cardValues = useMemo(() => {
    let totalInputPrice = 0;
    let totalTicket = 0;
    let totalConfirmed = 0;
    let totalCanceled = 0;
    let totalPending = 0;

    inputTicketData?.content.forEach((inputTicket) => {
      totalInputPrice += inputTicket.totalInputPrice ?? 0;
      totalTicket++;

      switch (inputTicket.status) {
        case InputTicketStatusValue.confirmed:
          totalConfirmed++;
          break;
        case InputTicketStatusValue.cancelled:
          totalCanceled++;
          break;
        case InputTicketStatusValue.pending:
          totalPending++;
          break;
      }
    });

    return {
      totalInputPrice,
      totalTicket,
      totalConfirmed,
      totalCanceled,
      totalPending,
    };
  }, [inputTicketData]);

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
              children: ManagerInputTicketModals.create(),
            })
          }
        />
        <MainStatisticCardsComponent
          titles={[
            "Tổng tiền (VNĐ)",
            "Tổng số phiếu",
            InputTicketStatusValue.confirmed,
            InputTicketStatusValue.cancelled,
            InputTicketStatusValue.pending,
          ]}
          values={[
            cardValues.totalInputPrice,
            cardValues.totalTicket,
            cardValues.totalConfirmed,
            cardValues.totalCanceled,
            cardValues.totalPending,
          ]}
        />
        <MainDataComponent<InputTicketSummaryResponseType>
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={inputTicketData}
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

export default ManagerInputTicketsPage;
