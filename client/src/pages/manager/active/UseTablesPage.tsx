import useModal from "../../../hooks/useModal";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../hooks/useEntityMutation";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import ModalComponent from "../../../components/ModalComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterActiveComponent from "../../../components/admin-manager/MainFilterActiveComponent";
import MainUseTableListComponent from "../../../components/admin-manager/MainUseTableListComponent";
import OccupiedUseTableModalComponent from "../../../components/admin-manager/modal/use-table/OccupiedUseTableModalComponent";
import ReservedUseTableModalComponent from "../../../components/admin-manager/modal/use-table/ReservedUseTableModalComponent";
import EmptyUseTableModalComponent from "../../../components/admin-manager/modal/use-table/EmptyUseTableModalComponent";
import RepairUseTableModalComponent from "../../../components/admin-manager/modal/use-table/RepairUseTableModalComponent";
import FloorApiService from "../../../services/api/v1/FloorApiService";
import UseTableApiService from "../../../services/api/v1/UseTableApiService";
import dayjs from "dayjs";
import { useState } from "react";
import { UseTableStatusValue } from "../../../constants/values";
import { openConfirmation } from "../../../utils/showConfirmationUtil";
import { getFilterSelectValueToShow } from "../../../utils/otherEvents";
import type { SelectProps } from "antd";
import type { UseTableStatusEnum } from "../../../constants/enums";
import type {
  AdminManagerPageProps,
  HandleUpdateStatusUseTableProps,
} from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { FloorCrudResponseType } from "../../../types/FloorType";
import type {
  UseTableDetailResponseType,
  UseTableSummaryResponseType,
  UseTableUpdateStatusRequestType,
} from "../../../types/UseTableType";

// Kiểu dữ liệu các tham số truyền vào của 1 đối tượng sử dụng bàn ăn

const ManagerUseTablesPage: React.FC<AdminManagerPageProps> = ({
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
  // - Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(12);
  // - Tìm kiếm thông tin
  const findOptions = [{ label: "Bàn", value: "table" }];
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
      sort: "table_id_asc",
      findType: filterFindType!,
      findValue: filterFindValue!,
      timeValue: ["", "null"],
      floorValue: filterFloorValue!,
      statusValue: filterStatusValue!,
      restaurantId: restaurantIdForCrud,
    },
    api: UseTableApiService.handleGetSummary,
  });

  // Các thành phần xử lý sự kiện cập nhật sử dụng bàn ăn
  // - Mutation
  const updateMutation = useEntityMutation<
    UseTableUpdateStatusRequestType,
    UseTableDetailResponseType
  >({
    messages: {
      success: `Cập nhật trạng thái ${nameVN?.toLowerCase()} thành công!`,
      error: `Cập nhật trạng thái ${nameVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[nameEN]],
    api: UseTableApiService.handleUpdateStatus,
  });
  // - Sự kiện
  const callApiToUpdateUseTable = async ({
    id,
    menuId,
    reservationId,
    customerId,
    customerFullname,
    customerPhone,
    customerEmail,
    customerAdult,
    customerChild,
    customerGuests,
    button,
    value,
  }: HandleUpdateStatusUseTableProps) => {
    button.classList.add("active");

    const answer = await openConfirmation({
      title: `Bạn có chắc chắn cập nhật ?`,
      content: "Hành động này không thể hoàn tác.",
    });
    if (answer) {
      const response = await updateMutation.mutateAsync({
        values: {
          id: id!,
          endAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          menuId:
            value === UseTableStatusValue.occupied && menuId
              ? menuId
              : undefined,
          reservationId:
            value === UseTableStatusValue.reserved && reservationId
              ? reservationId
              : undefined,
          employeeId: infoLogin?.id!,
          customerId:
            value === UseTableStatusValue.occupied && customerId
              ? customerId
              : undefined,
          customerFullname:
            value === UseTableStatusValue.occupied && customerFullname
              ? customerFullname
              : undefined,
          customerPhone:
            value === UseTableStatusValue.occupied && customerPhone
              ? customerPhone
              : undefined,
          customerEmail:
            value === UseTableStatusValue.occupied && customerEmail
              ? customerEmail
              : undefined,
          customerAdult:
            value === UseTableStatusValue.occupied && customerAdult
              ? customerAdult
              : undefined,
          customerChild:
            value === UseTableStatusValue.occupied && customerChild
              ? customerChild
              : undefined,
          customerGuests:
            value === UseTableStatusValue.occupied && customerGuests
              ? customerGuests
              : undefined,
          status: value as UseTableStatusEnum,
        },
      });
      if (response) {
        closeModal();
      }
    }

    button.classList.remove("active");
  };

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Quản lý các modal
  const ManagerUseTableModals = {
    occupied: (useTableSummary: UseTableSummaryResponseType) => (
      <OccupiedUseTableModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        isManager={isManager}
        restaurantId={restaurantIdForCrud}
        validActions={validActions}
        data={useTableSummary}
        dataForCrud={{ infoLogin: infoLogin }}
        callApiToUpdateUseTable={callApiToUpdateUseTable}
        closeModal={() => closeModal()}
      />
    ),
    reserved: (useTableSummary: UseTableSummaryResponseType) => (
      <ReservedUseTableModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        isManager={isManager}
        restaurantId={restaurantIdForCrud}
        validActions={validActions}
        data={useTableSummary}
        dataForCrud={{ infoLogin: infoLogin }}
        callApiToUpdateUseTable={callApiToUpdateUseTable}
        closeModal={() => closeModal()}
      />
    ),
    empty: (useTableSummary: UseTableSummaryResponseType) => (
      <EmptyUseTableModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        isManager={isManager}
        restaurantId={restaurantIdForCrud}
        validActions={validActions}
        data={useTableSummary}
        dataForCrud={{ infoLogin: infoLogin }}
        callApiToUpdateUseTable={callApiToUpdateUseTable}
        closeModal={() => closeModal()}
      />
    ),
    repair: (useTableSummary: UseTableSummaryResponseType) => (
      <RepairUseTableModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        isManager={isManager}
        restaurantId={restaurantIdForCrud}
        validActions={validActions}
        data={useTableSummary}
        dataForCrud={{ infoLogin: infoLogin }}
        callApiToUpdateUseTable={callApiToUpdateUseTable}
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
          }}
        />
        <MainUseTableListComponent
          nameEN={nameEN}
          nameVN={nameVN}
          useTableData={useTableData!}
          isLoading={isLoading}
          ManagerUseTableModals={ManagerUseTableModals}
          openModal={openModal}
          setPage={setPage}
          setSize={setSize}
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

export default ManagerUseTablesPage;
