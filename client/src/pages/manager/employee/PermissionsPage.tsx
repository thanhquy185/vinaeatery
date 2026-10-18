import useModal from "../../../hooks/useModal";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import ModalComponent from "../../../components/shared/ModalComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../../components/admin-manager/filters/MainFilterInfoComponent";
import PermissionsTableComponent from "../../../components/pages/manager/employee/PermissionsTableComponent";
import CreatePermissionModalComponent from "../../../components/admin-manager/modal/permissions/CreatePermissionModalComponent";
import DetailPermissionModalComponent from "../../../components/admin-manager/modal/permissions/DetailPermissionModalComponent";
import UpdatePermissionModalComponent from "../../../components/admin-manager/modal/permissions/UpdatePermissionModalComponent";
import LockModalComponent from "../../../components/admin-manager/modal/LockModalComponent";
import PermissionApiService from "../../../services/api/v1/PermissionApiService";
import { useState } from "react";
import { CommonStatusValue, ModalTitleValue, ModalWidthValue } from "../../../constants/values";
import { actionIndexes, getActionNameEn } from "../../../utils/defaultActionsUtil";
import { hasPermission } from "../../../utils/hasPermissionsUtil";
import { getFilterSelectValueToShow } from "../../../utils/otherEvents";
import type { SelectProps } from "antd";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { PermissionSummaryResponseType } from "../../../types/PermissionType";

const ManagerPermissionsPage: React.FC<AdminManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );

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
  const { data: permissionData, isLoading } = useEntityQuery<
    PageResponseType<PermissionSummaryResponseType>
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
    api: PermissionApiService.handleGetSummary,
  });

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title: "Thông tin cơ bản",
    id: "Mã quyền hạn",
    name: "Tên quyền hạn",
    status: "Trạng thái",
    permissionDetails:
      'Chi tiết quyền hạn (Hành động "Xem" cần có để 1 chức năng hoạt động)',
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "",
    id: "Nhập Mã quyền hạn",
    name: "Nhập Tên quyền hạn",
    status: "Chọn Trạng thái",
    permissionDetails: "",
  };
  // - Quản lý các modal
  const ManagerPermissionModals = {
    detail: (permission: PermissionSummaryResponseType) => (
      <DetailPermissionModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        data={permission}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreatePermissionModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        closeModal={() => closeModal()}
      />
    ),
    update: (permission: PermissionSummaryResponseType) => (
      <UpdatePermissionModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={permission}
        closeModal={() => closeModal()}
      />
    ),
    lock: (id: number, status: string | undefined) => (
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
              children: ManagerPermissionModals.create(),
            })
          }
        />
        <PermissionsTableComponent
          context={{
            nameEN,
            nameVN,
            isManager,
            restaurantIdForCrud,
            validActions,
            ManagerPermissionModals,
            openModal,
          }}
          tableKey={tableKey}
          object={nameEN}
          data={permissionData}
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

export default ManagerPermissionsPage;
