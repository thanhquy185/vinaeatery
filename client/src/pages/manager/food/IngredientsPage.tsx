import useModal from "../../../hooks/useModal";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import ModalComponent from "../../../components/shared/ModalComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../../components/admin-manager/filters/MainFilterInfoComponent";
import IngredientsTableComponent from "../../../components/pages/manager/food/IngredientsTableComponent";
import DetailIngredientModalComponent from "../../../components/admin-manager/modal/ingredient/DetailIngredientModalComponent";
import CreateIngredientModalComponent from "../../../components/admin-manager/modal/ingredient/CreateIngredientModalComponent";
import UpdateIngredientModalComponent from "../../../components/admin-manager/modal/ingredient/UpdateIngredientModalComponent";
import LockModalComponent from "../../../components/admin-manager/modal/LockModalComponent";
import CategoryIngredientApiService from "../../../services/api/v1/CategoryIngredientApiService";
import IngredientApiService from "../../../services/api/v1/IngredientApiService";
import { useState } from "react";
import {
  CommonStatusValue,
  IngredientUnitValues,
  ModalTitleValue,
  ModalWidthValue,
} from "../../../constants/values";
import { actionIndexes, getActionNameEn } from "../../../utils/defaultActionsUtil";
import { hasPermission } from "../../../utils/hasPermissionsUtil";
import { getFilterSelectValueToShow } from "../../../utils/otherEvents";
import type { SelectProps } from "antd";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { IngredientSummaryResponseType } from "../../../types/IngredientType";
import type { CategoryIngredientCrudResponseType } from "../../../types/CategoryIngredientType";

const ManagerIngredientsPage: React.FC<AdminManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );

  // Các biến giữ dữ liệu về loại nguyên liệu
  const { data: categoryIngredients } = useEntityQuery<
    CategoryIngredientCrudResponseType[]
  >({
    keys: ["category-ingredients-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: CategoryIngredientApiService.handleGetCrud,
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
  const { data: ingredientData, isLoading } = useEntityQuery<
    PageResponseType<IngredientSummaryResponseType>
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
    api: IngredientApiService.handleGetSummary,
  });

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title: "Thông tin cơ bản",
    id: "Mã nguyên liệu",
    name: "Tên nguyên liệu",
    categoryIngredient: "Loại nguyên liệu",
    unit: "Đơn vị",
    capacity: "Định lượng",
    dateCreate: "Ngày sản xuất",
    dateRemove: "Hạn sử dụng",
    inputPrice: "Giá nhập (VNĐ)",
    inventory: "Tồn kho",
    note: "Ghi chú",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "Thông tin cơ bản",
    id: "Được xác định sau khi xác nhận thêm!",
    name: "Nhập Tên nguyên liệu",
    categoryIngredient: "Chọn Loại nguyên liệu",
    unit: "Chọn Đơn vị",
    capacity: "Nhập Định lượng",
    dateCreate: "Chọn Ngày sản xuất",
    dateRemove: "Chọn Hạn sử dụng",
    inputPrice: "Nhập Giá nhập (VNĐ)",
    inventory: "Chọn Tồn kho",
    note: "Nhập Ghi chú",
    status: "Chọn Trạng thái",
  };
  // - Quản lý các modal
  const ManagerIngredientModals = {
    detail: (ingredientSummary: IngredientSummaryResponseType) => (
      <DetailIngredientModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        data={ingredientSummary}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateIngredientModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{
          categoryIngredients: categoryIngredients,
          units: IngredientUnitValues,
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (ingredientSummary: IngredientSummaryResponseType) => (
      <UpdateIngredientModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={ingredientSummary}
        dataForCrud={{
          categoryIngredients: categoryIngredients,
          units: IngredientUnitValues,
        }}
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
              children: ManagerIngredientModals.create(),
            })
          }
        />
        <IngredientsTableComponent
          context={{
            categoryIngredients,
            nameEN,
            nameVN,
            isManager,
            restaurantIdForCrud,
            validActions,
            ManagerIngredientModals,
            openModal,
          }}
          tableKey={tableKey}
          object={nameEN}
          data={ingredientData}
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

export default ManagerIngredientsPage;
