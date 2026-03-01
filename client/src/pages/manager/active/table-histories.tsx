import { useMemo, useState, type FC } from "react";
import { Button, DatePicker, Select, Tag } from "antd";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Menu } from "lucide-react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faBars,
// } from "@fortawesome/free-solid-svg-icons";
import type { ManagerPageProps } from "../../../common/props";
import type { FloorType, TableType, UseTableType } from "../../../common/types";
import {
  ModalTitleValue,
  ModalWidthValue,
  UseTableStatus,
} from "../../../common/values";
import CustomModal from "../../../components/common/modal";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import AdminManagerMainFilterActive from "../../../components/admin-manager/common/main-filter-active";
import AdminManagerMainData from "../../../components/admin-manager/common/main-data";
import AdminDetailTableHistory from "../../../components/admin-manager/modal/table-history/admin-detail-table-history";
import { useModal } from "../../../hook/use-modal";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { FindAllFloor } from "../../../requests/floors";
import { FindAllTable } from "../../../requests/tables";
import { FindAllUseTable } from "../../../requests/use-tables";
import { actionIndexes, getActionNameEn } from "../../../utils/default-actions";
import { hasPermission } from "../../../utils/has-permissions";
import { getFilterSelectValueToShow } from "../../../utils/other-events";
import dayjs from "dayjs";

// Manager Status Tables Page
const ManagerTableHistoriesPage: FC<ManagerPageProps> = ({
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
  //   queryClient.invalidateQueries({ queryKey: ["floors"] });
  //   queryClient.invalidateQueries({ queryKey: ["tables"] });
  //   queryClient.invalidateQueries({ queryKey: [nameEN] });
  // }, [selectedRestaurantId]);

  // Các biến giữ dữ liệu
  // - Tầng
  const { data: floors } = useEntityQuery<FloorType[]>({
    keys: ["floors", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllFloor,
  });
  // - Bàn ăn
  const { data: tables } = useEntityQuery<TableType[]>({
    keys: ["tables", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllTable,
  });

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Truy vấn dữ liệu
  const {
    data: useTables,
    isLoading,
    isError,
    error,
  } = useEntityQuery<UseTableType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllUseTable,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<UseTableType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "timeStart",
      key: "timeStart",
      width: "18%",
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
        const date = dayjs(record.timeStart);

        return (
          date.isSame(dayjs(start)) ||
          date.isSame(dayjs(end)) ||
          (date.isAfter(dayjs(start)) && date.isBefore(dayjs(end)))
        );
      },
      sorter: (a, b) =>
        dayjs(a.timeStart).valueOf() - dayjs(b.timeStart).valueOf(),
      render: (val) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm:ss") : ""),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "timeEnd",
      key: "timeEnd",
      width: "18%",
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
        const date = dayjs(record.timeEnd);

        return (
          date.isSame(dayjs(start)) ||
          date.isSame(dayjs(end)) ||
          (date.isAfter(dayjs(start)) && date.isBefore(dayjs(end)))
        );
      },
      sorter: (a, b) => dayjs(a.timeEnd).valueOf() - dayjs(b.timeEnd).valueOf(),
      render: (val) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm:ss") : ""),
    },
    {
      title: "Bàn ăn",
      key: "table",
      width: "36%",
      className: "left",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 500, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Bàn ăn"
            style={{ width: "100%" }}
            // options={tables?.map((table) => ({
            //   label: "#" + {table.id} + " - " + {table.name} + " - " + {table?.floor?.name}+ " - " +
            //     {table?.categoryTable?.name} + " - " + "Số chỗ: " + {table?.seats},
            //     value: table.id
            // }))}
            options={tables?.map((table) => ({
              label: "#" + table?.id,
              value: table?.id,
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
      onFilter: (value, record) => record.table?.id === value,
      sorter: (a, b) => a.table?.id! - b.table?.id!,
      render: (record) =>
        `#${record.table?.id} - ${record.table?.name} - ${record.table?.floor?.name} - ${record.table?.categoryTable?.name} - Số chỗ: ${record.table?.seats}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (status: string) => (
        <Tag
          color={
            status === UseTableStatus.occupied
              ? "red"
              : status === UseTableStatus.reserved
                ? "yellow"
                : status === UseTableStatus.empty
                  ? "green"
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
      width: "6%",
      className: "buttons",
      render: (text: any, record: UseTableType, index: number) => (
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
              {/* <FontAwesomeIcon icon={faBars} /> */}
              <Menu />
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
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  // - Tầng
  const floorOptions: SelectProps["options"] = floors?.map((floor) => ({
    label: floor.name,
    value: floor.id,
  }));
  const [filterFloorValue, setFilterFloorValue] = useState<string[] | null>([]);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: UseTableStatus.occupied, value: UseTableStatus.occupied },
    { label: UseTableStatus.reserved, value: UseTableStatus.reserved },
    { label: UseTableStatus.empty, value: UseTableStatus.empty },
    { label: UseTableStatus.repair, value: UseTableStatus.repair },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    [],
  );
  // - Lọc dữ liệu
  const filteredUseTables = useMemo(() => {
    if (!useTables) return [];

    return useTables.filter((useTable) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(useTable.id).includes(value);
        }

        // if (filterFindType === "table") {
        //   matchFind = useTable?.table?.name?.toLowerCase().includes(value)!;
        // }
      }

      // Theo floor
      let matchFloor = true;
      if (filterFloorValue && filterFloorValue.length > 0) {
        matchFloor = Number(filterFloorValue[0]) === useTable?.table?.floor?.id;
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        matchStatus = filterStatusValue.includes(useTable.status!);
      }

      return matchFind && matchFloor && matchStatus;
    });
  }, [
    useTables,
    filterFindType,
    filterFindValue,
    filterFloorValue,
    filterStatusValue,
  ]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Quản lý các modal
  const ManagerTableHistoryModals = {
    detail: (useTable: UseTableType) => (
      <AdminDetailTableHistory
        objectEN={nameEN}
        data={useTable}
        closeModal={() => closeModal()}
      />
    ),
  };

  return (
    <>
      <main className="admin-manager-main">
        <AdminManagerMainHeader title={nameVN} />
        <AdminManagerMainFilterActive
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
        <AdminManagerMainData
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={filteredUseTables || []}
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
    </>
  );
};

export default ManagerTableHistoriesPage;
