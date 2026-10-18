import useModal from "../../../hooks/useModal";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import ModalComponent from "../../../components/shared/ModalComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../../components/admin-manager/filters/MainFilterInfoComponent";
import MenusTableComponent from "../../../components/pages/manager/active/MenusTableComponent";
import DetailMenuModalComponent from "../../../components/admin-manager/modal/menu/DetailMenuModalComponent";
import CreateMenuModalComponent from "../../../components/admin-manager/modal/menu/CreateMenuModalComponent";
import UpdateMenuModalComponent from "../../../components/admin-manager/modal/menu/UpdateMenuModalComponent";
import LockModalComponent from "../../../components/admin-manager/modal/LockModalComponent";
import FoodApiService from "../../../services/api/v1/FoodApiService";
import MenuApiService from "../../../services/api/v1/MenuApiService";
import { useState } from "react";
import { CommonStatusValue, ModalTitleValue, ModalWidthValue } from "../../../constants/values";
import { hasPermission } from "../../../utils/hasPermissionsUtil";
import { actionIndexes, getActionNameEn } from "../../../utils/defaultActionsUtil";
import { getFilterSelectValueToShow } from "../../../utils/otherEvents";
import type { SelectProps } from "antd";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { FoodCrudResponseType } from "../../../types/FoodType";
import type { MenuSummaryResponseType } from "../../../types/MenuType";

const ManagerMenusPage: React.FC<AdminManagerPageProps> = ({
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
  // - Món ăn
  const { data: foods } = useEntityQuery<FoodCrudResponseType[]>({
    keys: ["foods-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FoodApiService.handleGetCrud,
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Key bảng
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
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: CommonStatusValue.active, value: CommonStatusValue.active },
    { label: CommonStatusValue.inactive, value: CommonStatusValue.inactive },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    [],
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const { data: menuData, isLoading } = useEntityQuery<
    PageResponseType<MenuSummaryResponseType>
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
    api: MenuApiService.handleGetSummary,
  });

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title: "Thông tin cơ bản",
    id: "Mã thực đơn",
    name: "Tên thực đơn",
    type: "Loại thực đơn",
    price: "Giá tiền",
    description: "Mô tả",
    status: "Trạng thái",
    menuDetails: "Chi tiết thực đơn",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "",
    id: "Chưa xác định!",
    name: "Nhập Tên thực đơn",
    type: "Chọn Loại thực đơn",
    price: "Nhập Giá tiền",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
    menuDetails: "",
  };
  // - Quản lý các modal
  const ManagerMenuModals = {
    detail: (menuSummary: MenuSummaryResponseType) => (
      <DetailMenuModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        data={menuSummary}
        dataForCrud={{ foods: foods }}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateMenuModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{ foods: foods }}
        closeModal={() => closeModal()}
      />
    ),
    update: (menuSummary: MenuSummaryResponseType) => (
      <UpdateMenuModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={menuSummary}
        dataForCrud={{ foods: foods }}
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
              width: ModalWidthValue.split3,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: ManagerMenuModals.create(),
            })
          }
        />
        <MenusTableComponent
          context={{
            nameEN,
            nameVN,
            isManager,
            restaurantIdForCrud,
            validActions,
            ManagerMenuModals,
            openModal,
          }}
          tableKey={tableKey}
          object={nameEN}
          data={menuData}
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

export default ManagerMenusPage;
