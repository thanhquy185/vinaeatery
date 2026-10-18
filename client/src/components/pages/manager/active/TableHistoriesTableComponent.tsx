import dayjs from "dayjs";
import { Button, DatePicker, Tag } from "antd";
import { Menu } from "lucide-react";
import { ModalTitleValue, ModalWidthValue, UseTableStatusValue } from "../../../../constants/values";
import { hasPermission } from "../../../../utils/hasPermissionsUtil";
import { actionIndexes, getActionNameEn } from "../../../../utils/defaultActionsUtil";
import type { ColumnsType } from "antd/es/table";
import type { FC } from "react";
import type { ManagerTableContext, ManagerTableReadWriteModals } from "../ManagerTableContextType";
import MainDataComponent from "../../../admin-manager/tables/NewMainDataComponent";
import type { PageResponseType } from "../../../../types/PageResponseType";
import type { UseTableSummaryResponseType } from "../../../../types/UseTableType";

type TableHistoriesTableContext = Pick<ManagerTableContext, "nameEN" | "nameVN" | "isManager" | "restaurantIdForCrud" | "validActions" | "openModal"> & {
  ManagerTableHistoryModals: Pick<ManagerTableReadWriteModals<UseTableSummaryResponseType>, "detail">;
};

type TableHistoriesTableComponentProps = {
  context: TableHistoriesTableContext;
  tableKey: number;
  object: string;
  data: PageResponseType<UseTableSummaryResponseType> | undefined;
  isLoading: boolean;
  isScroll?: boolean;
  onPageChange: (page: number, size: number) => void;
};

const TableHistoriesTableComponent: FC<TableHistoriesTableComponentProps> = ({
  context,
  tableKey,
  object,
  data,
  isLoading,
  isScroll,
  onPageChange,
}) => {
  const {
    isManager,
    restaurantIdForCrud,
    validActions,
    openModal,
    nameVN,
    nameEN,
    ManagerTableHistoryModals,
  } = context;
  const columns: ColumnsType<UseTableSummaryResponseType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "startAt",
      key: "startAt",
      width: "18%",
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
        </div>
      ),
      onFilter: (value, record) => {
        if (!value) return true;
        const [start, end] = JSON.parse(value as string) as [string, string];
        const date = dayjs(record.startAt);

        return (
          date.isSame(dayjs(start)) ||
          date.isSame(dayjs(end)) ||
          (date.isAfter(dayjs(start)) && date.isBefore(dayjs(end)))
        );
      },
      sorter: (a, b) => dayjs(a.startAt).valueOf() - dayjs(b.startAt).valueOf(),
      render: (val) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm:ss") : ""),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "endAt",
      key: "endAt",
      width: "18%",
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
        </div>
      ),
      onFilter: (value, record) => {
        if (!value) return true;
        const [start, end] = JSON.parse(value as string) as [string, string];
        const date = dayjs(record.endAt);

        return (
          date.isSame(dayjs(start)) ||
          date.isSame(dayjs(end)) ||
          (date.isAfter(dayjs(start)) && date.isBefore(dayjs(end)))
        );
      },
      sorter: (a, b) => dayjs(a.endAt).valueOf() - dayjs(b.endAt).valueOf(),
      render: (val) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm:ss") : ""),
    },
    {
      title: "Bàn ăn",
      key: "table",
      width: "36%",
      className: "left",
      sorter: (a, b) => a.table.id - b.table.id,
      render: (record) =>
        `#${record.table.id} - ${record.table.name} - ${record.table.floor?.name} - ${record.table.categoryTable.name} - Số chỗ: ${record.table?.seats}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (status: string) => (
        <Tag
          color={
            status === UseTableStatusValue.occupied
              ? "red"
              : status === UseTableStatusValue.reserved
                ? "yellow"
                : status === UseTableStatusValue.empty
                  ? "green"
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
      width: "6%",
      className: "buttons",
      render: (record: UseTableSummaryResponseType) => (
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
                  width: ModalWidthValue.active,
                  className: `${nameEN}`,
                  children: ManagerTableHistoryModals.detail(record),
                })
              }
            >
              <Menu />
            </button>
          )}
        </>
      ),
    },
  ];

  return (
    <MainDataComponent<UseTableSummaryResponseType>
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

export default TableHistoriesTableComponent;
