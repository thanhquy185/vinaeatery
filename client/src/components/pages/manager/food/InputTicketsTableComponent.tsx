import TableRUPActionsComponent from "../../../shared/TableRUPActionsComponent";
import MainDataComponent from "../../../admin-manager/tables/NewMainDataComponent";
import dayjs from "dayjs";
import { Button, DatePicker, InputNumber, Select, Tag } from "antd";
import {
  InputTicketPaymentStatusValue,
  InputTicketStatusValue,
  ModalWidthValue,
} from "../../../../constants/values";
import { vietnamMoneyFormat } from "../../../../utils/otherEvents";
import type { ColumnsType } from "antd/es/table";
import type { JSX } from "react";
import type { ModalState } from "../../../../hooks/useModal";
import type { PageResponseType } from "../../../../types/PageResponseType";
import type { SupplierCrudResponseType } from "../../../../types/SupplierType";
import type { InputTicketSummaryResponseType } from "../../../../types/InputTicketType";

type InputTicketModalHandlers = {
  detail: (data: InputTicketSummaryResponseType) => JSX.Element;
  create: () => JSX.Element;
  update: (data: InputTicketSummaryResponseType) => JSX.Element;
  print: (data: InputTicketSummaryResponseType) => JSX.Element;
};

type InputTicketsTableComponentProps = {
  tableKey: number;
  nameEN: string;
  nameVN: string;
  isManager: boolean;
  restaurantIdForCrud: number;
  validActions: string;
  suppliers?: SupplierCrudResponseType[];
  managerModals: InputTicketModalHandlers;
  openModal: (payload: Omit<ModalState, "open">) => void;
  data: PageResponseType<InputTicketSummaryResponseType> | undefined;
  isLoading: boolean;
  onPageChange: (page: number, size: number) => void;
};

const InputTicketsTableComponent: React.FC<InputTicketsTableComponentProps> = ({
  tableKey,
  nameEN,
  nameVN,
  isManager,
  restaurantIdForCrud,
  validActions,
  suppliers,
  managerModals,
  openModal,
  data,
  isLoading,
  onPageChange,
}) => {
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
          } catch {
            // Keep the default range if the selected value is invalid.
          }
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
          managerModals={managerModals}
          openModal={openModal}
        />
      ),
    },
  ];

  return (
    <MainDataComponent<InputTicketSummaryResponseType>
      tableKey={tableKey}
      object={nameEN}
      columns={columns}
      data={data}
      isLoading={isLoading}
      isScroll={true}
      onPageChange={onPageChange}
    />
  );
};

export default InputTicketsTableComponent;
