import useModal from "../../../hooks/useModal";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import ModalComponent from "../../../components/ModalComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterActiveComponent from "../../../components/admin-manager/MainFilterActiveComponent";
import MainDataComponent from "../../../components/admin-manager/NewMainDataComponent";
import DetailTableHistoryModalComponent from "../../../components/admin-manager/modal/table-history/DetailTableHistoryModalComponent";
import FloorApiService from "../../../services/api/v1/FloorApiService";
import UseTableApiService from "../../../services/api/v1/UseTableApiService";
import dayjs from "dayjs";
import { useState } from "react";
import { Button, DatePicker, Tag } from "antd";
import { Menu } from "lucide-react";
import {
  ModalTitleValue,
  ModalWidthValue,
  UseTableStatusValue,
} from "../../../constants/values";
import { hasPermission } from "../../../utils/hasPermissions";
import { actionIndexes, getActionNameEn } from "../../../utils/defaultActions";
import { getFilterSelectValueToShow } from "../../../utils/otherEvents";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { FloorCrudResponseType } from "../../../types/FloorType";
import type { UseTableSummaryResponseType } from "../../../types/UseTableType";

const ManagerTableHistoriesPage: React.FC<AdminManagerPageProps> = ({
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
  // - Tầng
  const { data: floors } = useEntityQuery<FloorCrudResponseType[]>({
    keys: ["floors-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FloorApiService.handleGetCrud,
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  // - Tìm kiếm thông tin
  const findOptions = [{ label: "#", value: "id" }];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  // - Tầng
  const floorOptions: SelectProps["options"] = floors?.map((floor) => ({
    label: floor.name,
    value: floor.id,
  }));
  const [filterFloorValue, setFilterFloorValue] = useState<string[] | null>([]);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    {
      label: UseTableStatusValue.occupied,
      value: UseTableStatusValue.occupied,
    },
    {
      label: UseTableStatusValue.reserved,
      value: UseTableStatusValue.reserved,
    },
    { label: UseTableStatusValue.empty, value: UseTableStatusValue.empty },
    { label: UseTableStatusValue.repair, value: UseTableStatusValue.repair },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    [],
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const { data: useTableData, isLoading } = useEntityQuery<
    PageResponseType<UseTableSummaryResponseType>
  >({
    keys: [
      nameEN,
      page,
      size,
      filterFindType,
      filterFindValue,
      filterFloorValue,
      filterStatusValue,
      restaurantIdForCrud,
    ],
    params: {
      page: page,
      size: size,
      findType: filterFindType!,
      findValue: filterFindValue!,
      floorValue: filterFloorValue!,
      statusValue: filterStatusValue!,
      restaurantId: restaurantIdForCrud,
    },
    api: UseTableApiService.handleGetSummary,
  });
  // - Cột thuộc tính
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

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Quản lý các modal
  const ManagerTableHistoryModals = {
    detail: (useTableSummary: UseTableSummaryResponseType) => (
      <DetailTableHistoryModalComponent
        objectEN={nameEN}
        data={useTableSummary}
        closeModal={() => closeModal()}
      />
    ),
  };

  return (
    <>
      <main className="admin-manager-main">
        <MainHeaderComponent title={nameVN} />
        <MainFilterActiveComponent
          findOptions={findOptions}
          filterFindType={filterFindType}
          filterFindValue={filterFindValue}
          setFilterFindType={setFilterFindType}
          setFilterFindValue={setFilterFindValue}
          floorOptions={floorOptions}
          filterFloorValue={getFilterSelectValueToShow({
            options: floorOptions,
            filterSelectValue: filterFloorValue,
          })}
          setFilterFloorValue={setFilterFloorValue}
          statusOptions={statusOptions}
          filterStatusValue={getFilterSelectValueToShow({
            options: statusOptions,
            filterSelectValue: filterStatusValue,
          })}
          setFilterStatusValue={setFilterStatusValue}
          onClickFilterReset={() => {
            setFilterFindType(findOptions[0].value);
            setFilterFindValue(null);
            setFilterFloorValue(null);
            setFilterStatusValue(null);
            setTableKey((prev) => prev + 1);
          }}
        />
        <MainDataComponent<UseTableSummaryResponseType>
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={useTableData}
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

export default ManagerTableHistoriesPage;
