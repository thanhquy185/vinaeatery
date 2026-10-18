import useModal from "../../../hooks/useModal";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import ModalComponent from "../../../components/shared/ModalComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterActiveComponent from "../../../components/admin-manager/filters/MainFilterActiveComponent";
import TableHistoriesTableComponent from "../../../components/pages/manager/active/TableHistoriesTableComponent";
import DetailTableHistoryModalComponent from "../../../components/admin-manager/modal/table-history/DetailTableHistoryModalComponent";
import FloorApiService from "../../../services/api/v1/FloorApiService";
import UseTableApiService from "../../../services/api/v1/UseTableApiService";
import { useState } from "react";
import { UseTableStatusValue } from "../../../constants/values";
import { getFilterSelectValueToShow } from "../../../utils/otherEvents";
import type { SelectProps } from "antd";
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
        <TableHistoriesTableComponent
          context={{
            isManager,
            restaurantIdForCrud,
            validActions,
            openModal,
            nameVN,
            nameEN,
            ManagerTableHistoryModals,
          }}
          tableKey={tableKey}
          object={nameEN}
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
