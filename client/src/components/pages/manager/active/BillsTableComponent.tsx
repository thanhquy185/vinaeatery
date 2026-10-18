import TableRUPActionsComponent from "../../../shared/TableRUPActionsComponent";
import dayjs from "dayjs";
import { Button, DatePicker, InputNumber, Select, Tag } from "antd";
import { BillStatusValue, ModalWidthValue, BillPaymentStatusValue } from "../../../../constants/values";
import { vietnamMoneyFormat } from "../../../../utils/otherEvents";
import type { ColumnsType } from "antd/es/table";
import type { FC } from "react";
import type { ManagerTableContext, ManagerTablePrintModals } from "../ManagerTableContextType";
import MainDataComponent from "../../../admin-manager/tables/NewMainDataComponent";
import type { PageResponseType } from "../../../../types/PageResponseType";
import type { BillSummaryResponseType } from "../../../../types/BillType";

type BillsTableComponentContext = Omit<
  ManagerTableContext,
  "restaurantIdForCrud" | "validActions"
> & {
  restaurantIdForCrud: number;
  validActions: string;
  ManagerBillModals: ManagerTablePrintModals<BillSummaryResponseType>;
};

type BillsTableComponentProps = {
  context: BillsTableComponentContext;
  tableKey: number;
  object: string;
  data: PageResponseType<BillSummaryResponseType> | undefined;
  isLoading: boolean;
  isScroll?: boolean;
  onPageChange: (page: number, size: number) => void;
};

const BillsTableComponent: FC<BillsTableComponentProps> = ({
  context,
  tableKey,
  object,
  data,
  isLoading,
  isScroll,
  onPageChange,
}) => {
  const {
    nameEN,
    nameVN,
    isManager,
    restaurantIdForCrud,
    validActions,
    ManagerBillModals,
    openModal,
  } = context;
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

  return (
    <MainDataComponent<BillSummaryResponseType>
      tableKey={tableKey}
      object={object}
      columns={columns}
      data={data}
      isLoading={isLoading}
      isScroll={isScroll}
      onPageChange={onPageChange}
    />
  );
};

export default BillsTableComponent;
