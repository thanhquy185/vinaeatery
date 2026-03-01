import { useMemo, useState, type FC } from "react";
import { Button, Select, Tag } from "antd";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Eye, Lock, PenBox, Unlock } from "lucide-react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faEye,
//   faLock,
//   faPenToSquare,
//   faUnlock,
// } from "@fortawesome/free-solid-svg-icons";
import type { ManagerPageProps } from "../../../common/props";
import type {
  CategoryTableType,
  FloorType,
  TableType,
} from "../../../common/types";
import {
  CommonStatus,
  ModalTitleValue,
  ModalWidthValue,
} from "../../../common/values";
import CustomModal from "../../../components/common/modal";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import AdminManagerMainFilterInfo from "../../../components/admin-manager/common/main-filter-info";
import AdminManagerMainData from "../../../components/admin-manager/common/main-data";
import ManagerDetailTable from "../../../components/admin-manager/modal/table/manager-detail-table";
import ManagerCreateTable from "../../../components/admin-manager/modal/table/manager-create-table";
import ManagerUpdateTable from "../../../components/admin-manager/modal/table/manager-update-table";
import ManagerLock from "../../../components/admin-manager/modal/manager-lock";
import { useModal } from "../../../hook/use-modal";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { FindAllFloor } from "../../../requests/floors";
import { FindAllCategoryTable } from "../../../requests/category-tables";
import { FindAllTable } from "../../../requests/tables";
import { actionIndexes, getActionNameEn } from "../../../utils/default-actions";
import { hasPermission } from "../../../utils/has-permissions";
import { getFilterSelectValueToShow } from "../../../utils/other-events";

// Manager Tables Page
const ManagerTablesPage: FC<ManagerPageProps> = ({
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
  //   queryClient.invalidateQueries({ queryKey: ["category-tables"] });
  //   queryClient.invalidateQueries({ queryKey: [nameEN] });
  // }, [selectedRestaurantId]);

  // Các biến giữ dữ liệu về tầng và loại bàn ăn
  // - Tầng
  const { data: floors } = useEntityQuery<FloorType[]>({
    keys: ["floors", restaurantIdForCrud, CommonStatus.active],
    params: {
      restaurantId: restaurantIdForCrud,
      statusValue: [CommonStatus.active],
    },
    api: FindAllFloor,
  });
  // - Loại bàn ăn
  const { data: categoryTables } = useEntityQuery<CategoryTableType[]>({
    keys: ["category-tables", restaurantIdForCrud, CommonStatus.active],
    params: {
      restaurantId: restaurantIdForCrud,
      statusValue: [CommonStatus.active],
    },
    api: FindAllCategoryTable,
  });

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Truy vấn dữ liệu
  const {
    data: tables,
    isLoading,
    isError,
    error,
  } = useEntityQuery<TableType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllTable,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<TableType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Tên loại bàn ăn",
      dataIndex: "name",
      key: "name",
      width: "24%",
      className: "left",
      sorter: (a, b) => a?.name!.localeCompare(b?.name!),
    },
    {
      title: "Số chỗ ngồi",
      dataIndex: "seats",
      key: "seats",
      width: "12%",
      sorter: (a, b) => a?.seats! - b?.seats!,
    },
    {
      title: "Loại bàn ăn",
      key: "categoryTable",
      width: "17%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Loại bàn ăn"
            style={{ width: "100%" }}
            options={categoryTables?.map((categoryTable) => ({
              label: `#${categoryTable.id} - ${categoryTable.name}`,
              value: categoryTable.id,
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
      onFilter: (value, record) => record.categoryTable?.id === value,
      sorter: (a, b) => a.categoryTable?.id! - b.categoryTable?.id!,
      render: (record) =>
        `#${record.categoryTable?.id} - ${record.categoryTable?.name}`,
    },
    {
      title: "Tầng",
      key: "floor",
      width: "17%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Tầng"
            style={{ width: "100%" }}
            options={floors?.map((floor) => ({
              label: `#${floor.id} - ${floor.name}`,
              value: floor.id,
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
      onFilter: (value, record) => record.floor?.id === value,
      sorter: (a, b) => a.floor?.id! - b.floor?.id!,
      render: (record) => `#${record.floor?.id} - ${record.floor?.name}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: string) => (
        <Tag color={status === CommonStatus.active ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "",
      width: "10%",
      className: "buttons",
      render: (text: any, record: TableType, index: number) => (
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
                  width: ModalWidthValue.split2,
                  className: `${getActionNameEn(
                    actionIndexes.detail,
                  )} ${nameEN}`,
                  children: ManagerTableModals.detail(record),
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
                  width: ModalWidthValue.split2,
                  className: `${getActionNameEn(
                    actionIndexes.update,
                  )} ${nameEN}`,
                  children: ManagerTableModals.update(record),
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
            requiredActionId: actionIndexes.lock,
          }) && (
            <button
              className={"action " + getActionNameEn(actionIndexes.lock)}
              onClick={() =>
                openModal({
                  title:
                    record.status == CommonStatus.active
                      ? ModalTitleValue.lock(nameVN.toLowerCase())
                      : ModalTitleValue.unlock(nameVN.toLowerCase()),
                  width: ModalWidthValue.lock,
                  className: `${getActionNameEn(actionIndexes.lock)} ${nameEN}`,
                  children: ManagerTableModals.lock(
                    record?.id as number,
                    record?.status!,
                  ),
                })
              }
            >
              {/* <FontAwesomeIcon
                icon={record.status == CommonStatus.active ? faLock : faUnlock}
              /> */}
              {record.status == CommonStatus.active ? <Lock /> : <Unlock />}
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
    { label: "Tên", value: "name" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: CommonStatus.active, value: CommonStatus.active },
    { label: CommonStatus.inactive, value: CommonStatus.inactive },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );
  // - Lọc dữ liệu
  const filteredTables = useMemo(() => {
    if (!tables) return [];

    return tables.filter((table) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(table.id).includes(value);
        }

        if (filterFindType === "name") {
          matchFind = table.name?.toLowerCase().includes(value)!;
        }
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        matchStatus = filterStatusValue.includes(table.status!);
      }

      return matchFind && matchStatus;
    });
  }, [tables, filterFindType, filterFindValue, filterStatusValue]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title: "Thông tin cơ bản",
    id: "Mã loại bàn ăn",
    name: "Tên loại bàn ăn",
    categoryTable: "Loại bàn ăn",
    floor: "Tầng",
    seats: "Số chỗ ngồi",
    description: "Mô tả",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "",
    id: "Được xác định sau khi xác nhận thêm!",
    name: "Nhập Tên loại bàn ăn",
    categoryTable: "Chọn Loại bàn ăn",
    floor: "Chọn Tầng",
    seats: "Nhập Số chỗ ngồi",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
  };
  // - Quản lý các modal
  const ManagerTableModals = {
    detail: (table: TableType) => (
      <ManagerDetailTable
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        data={table}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <ManagerCreateTable
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{
          floors: floors,
          categoryTables: categoryTables,
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (table: TableType) => (
      <ManagerUpdateTable
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={table}
        dataForCrud={{
          floors: floors,
          categoryTables: categoryTables,
        }}
        closeModal={() => closeModal()}
      />
    ),
    lock: (id: number, status: string) => (
      <ManagerLock
        objectVN={nameVN}
        objectEN={nameEN}
        restaurantId={restaurantIdForCrud}
        fieldId={id}
        fieldStatus={status}
        closeModal={() => closeModal()}
      />
    ),
  };

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
              width: ModalWidthValue.split2,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: ManagerTableModals.create(),
            })
          }
        />
        <AdminManagerMainData
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={filteredTables || []}
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

export default ManagerTablesPage;
