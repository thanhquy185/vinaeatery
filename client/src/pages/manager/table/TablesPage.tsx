import useModal from "../../../hooks/useModal";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import ModalComponent from "../../../components/shared/ModalComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../../components/admin-manager/filters/MainFilterInfoComponent";
import TablesTableComponent from "../../../components/pages/manager/table/TablesTableComponent";
import DetailTableModalComponent from "../../../components/admin-manager/modal/table/DetailTableModalComponent";
import CreateTableModalComponent from "../../../components/admin-manager/modal/table/CreateTableModalComponent";
import UpdateTableModalComponent from "../../../components/admin-manager/modal/table/UpdateTableModalComponent";
import LockModalComponent from "../../../components/admin-manager/modal/LockModalComponent";
import FloorApiService from "../../../services/api/v1/FloorApiService";
import CategoryTableApiService from "../../../services/api/v1/CategoryTableApiService";
import TableApiService from "../../../services/api/v1/TableApiService";
import { useState } from "react";
import { CommonStatusValue, ModalTitleValue, ModalWidthValue } from "../../../constants/values";
import { hasPermission } from "../../../utils/hasPermissionsUtil";
import { getFilterSelectValueToShow } from "../../../utils/otherEvents";
import { actionIndexes, getActionNameEn } from "../../../utils/defaultActionsUtil";
import type { SelectProps } from "antd";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { FloorCrudResponseType } from "../../../types/FloorType";
import type { CategoryTableCrudResponseType } from "../../../types/CategoryTableType";
import type { TableSummaryResponseType } from "../../../types/TableType";

const ManagerTablesPage: React.FC<AdminManagerPageProps> = ({
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
  // - Loại bàn ăn
  const { data: categoryTables } = useEntityQuery<
    CategoryTableCrudResponseType[]
  >({
    keys: ["category-tables-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: CategoryTableApiService.handleGetCrud,
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Key
  const [tableKey, setTableKey] = useState<number>(0);
  // - Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
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
    { label: CommonStatusValue.active, value: CommonStatusValue.active },
    { label: CommonStatusValue.inactive, value: CommonStatusValue.inactive },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const { data: tableData, isLoading } = useEntityQuery<
    PageResponseType<TableSummaryResponseType>
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
    api: TableApiService.handleGetSummary,
  });

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
    detail: (tableSummary: TableSummaryResponseType) => (
      <DetailTableModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        data={tableSummary}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateTableModalComponent
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
    update: (tableSummary: TableSummaryResponseType) => (
      <UpdateTableModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={tableSummary}
        dataForCrud={{
          floors: floors,
          categoryTables: categoryTables,
        }}
        closeModal={() => closeModal()}
      />
    ),
    lock: (id: number, status: string) => (
      <LockModalComponent
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
              width: ModalWidthValue.split2,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: ManagerTableModals.create(),
            })
          }
        />
        <TablesTableComponent
          context={{
            categoryTables,
            floors,
            nameEN,
            nameVN,
            isManager,
            restaurantIdForCrud,
            validActions,
            ManagerTableModals,
            openModal,
          }}
          tableKey={tableKey}
          object={nameEN}
          data={tableData}
          isLoading={isLoading}
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

export default ManagerTablesPage;
