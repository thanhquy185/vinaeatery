import TableRUActionsComponent from "../../../shared/TableRUActionsComponent";
import dayjs from "dayjs";
import { Button, DatePicker, Tag } from "antd";
import { ModalWidthValue, ReservationStatusValue } from "../../../../constants/values";
import type { ColumnsType } from "antd/es/table";
import type { FC } from "react";
import type { ManagerTableContext, ManagerTableReadWriteModals } from "../ManagerTableContextType";
import MainDataComponent from "../../../admin-manager/tables/NewMainDataComponent";
import type { PageResponseType } from "../../../../types/PageResponseType";
import type { ReservationSummaryResponseType } from "../../../../types/ReservationType";

type ReservationsTableComponentContext = ManagerTableContext & {
  ManagerReservationModals: ManagerTableReadWriteModals<ReservationSummaryResponseType>;
};

type ReservationsTableComponentProps = {
  context: ReservationsTableComponentContext;
  tableKey: number;
  object: string;
  data: PageResponseType<ReservationSummaryResponseType> | undefined;
  isLoading: boolean;
  isScroll?: boolean;
  onPageChange: (page: number, size: number) => void;
};

const ReservationsTableComponent: FC<ReservationsTableComponentProps> = ({
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
    validActions,
    ManagerReservationModals,
    openModal,
  } = context;
  const columns: ColumnsType<ReservationSummaryResponseType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Thời gian đặt bàn",
      dataIndex: "createAt",
      key: "createAt",
      width: "17%",
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
      title: "Thời gian nhận bàn",
      dataIndex: "arriveAt",
      key: "arriveAt",
      width: "17%",
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
        const date = dayjs(record.arriveAt);

        return (
          date.isSame(dayjs(start)) ||
          date.isSame(dayjs(end)) ||
          (date.isAfter(dayjs(start)) && date.isBefore(dayjs(end)))
        );
      },
      sorter: (a, b) =>
        dayjs(a.arriveAt).valueOf() - dayjs(b.arriveAt).valueOf(),
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "14%",
      render: (status: string) => (
        <Tag
          color={
            status === ReservationStatusValue.confirmed
              ? "green"
              : status === ReservationStatusValue.cancelled
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
      width: 150,
      fixed: "right",
      className: "buttons",
      render: (record: ReservationSummaryResponseType) => (
        <TableRUActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          hasLockUser={true}
          hasChangePasswordUser={true}
          validActions={validActions!}
          record={record}
          modalWidth={ModalWidthValue.split3}
          managerModals={ManagerReservationModals}
          openModal={openModal}
        />
      ),
    },
  ];

  return (
    <MainDataComponent<ReservationSummaryResponseType>
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

export default ReservationsTableComponent;
