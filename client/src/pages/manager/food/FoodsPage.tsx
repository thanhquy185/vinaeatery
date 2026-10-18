import useModal from "../../../hooks/useModal";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import ModalComponent from "../../../components/shared/ModalComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../../components/admin-manager/filters/MainFilterInfoComponent";
import FoodsTableComponent from "../../../components/pages/manager/food/FoodsTableComponent";
import DetailFoodModalComponent from "../../../components/admin-manager/modal/food/DetailFoodModalComponent";
import CreateFoodModalComponent from "../../../components/admin-manager/modal/food/CreateFoodModalComponent";
import UpdateFoodModalComponent from "../../../components/admin-manager/modal/food/UpdateFoodModalComponent";
import LockModalComponent from "../../../components/admin-manager/modal/LockModalComponent";
import CategoryFoodApiService from "../../../services/api/v1/CategoryFoodApiService";
import IngredientApiService from "../../../services/api/v1/IngredientApiService";
import FoodApiService from "../../../services/api/v1/FoodApiService";
import { useState } from "react";
import {
  FoodStatusValue,
  ModalTitleValue,
  ModalWidthValue,
  FoodUnitValues,
} from "../../../constants/values";
import { actionIndexes, getActionNameEn } from "../../../utils/defaultActionsUtil";
import { hasPermission } from "../../../utils/hasPermissionsUtil";
import { getFilterSelectValueToShow } from "../../../utils/otherEvents";
import type { SelectProps } from "antd";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { CategoryFoodCrudResponseType } from "../../../types/CategoryFoodType";
import type { IngredientCrudResponseType } from "../../../types/IngredientType";
import type { FoodSummaryResponseType } from "../../../types/FoodType";

const ManagerFoodsPage: React.FC<AdminManagerPageProps> = ({
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
  // - Loại món ăn
  const { data: categoryFoods } = useEntityQuery<
    CategoryFoodCrudResponseType[]
  >({
    keys: ["category-foods-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: CategoryFoodApiService.handleGetCrud,
  });
  // - Nguyên liệu
  const { data: ingredients } = useEntityQuery<IngredientCrudResponseType[]>({
    keys: ["ingredients-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: IngredientApiService.handleGetCrud,
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
    { label: FoodStatusValue.active, value: FoodStatusValue.active },
    { label: FoodStatusValue.inactive, value: FoodStatusValue.inactive },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const { data: foodData, isLoading } = useEntityQuery<
    PageResponseType<FoodSummaryResponseType>
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
    api: FoodApiService.handleGetSummary,
  });

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title1: "Thông tin cơ bản",
    title2: "Thông tin nguyên liệu",
    id: "Mã món ăn",
    image: "Hình ảnh",
    name: "Tên món ăn",
    categoryFood: "Loại món ăn",
    unit: "Đơn vị",
    price: "Giá bán (VNĐ)",
    description: "Mô tả",
    status: "Trạng thái",
    recipes: "Công thức",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    id: "Được xác định sau khi xác nhận thêm!",
    image: "Chọn Hình ảnh",
    name: "Nhập Tên món ăn",
    categoryFood: "Chọn Loại món ăn",
    unit: "Chọn Đơn vị",
    price: "Nhập Giá bán (VNĐ)",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
    recipes: "",
  };
  // - Quản lý modal
  const ManagerFoodModals = {
    detail: (foodSummary: FoodSummaryResponseType) => (
      <DetailFoodModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={foodSummary}
        dataForCrud={{
          ingredients: ingredients,
        }}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateFoodModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{
          infoLogin: infoLogin,
          categoryFoods: categoryFoods,
          ingredients: ingredients,
          units: FoodUnitValues,
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (foodSummary: FoodSummaryResponseType) => (
      <UpdateFoodModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={foodSummary}
        dataForCrud={{
          categoryFoods: categoryFoods,
          ingredients: ingredients,
          units: FoodUnitValues,
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
              width: ModalWidthValue.split3,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: ManagerFoodModals.create(),
            })
          }
        />
        <FoodsTableComponent
          context={{
            categoryFoods,
            nameEN,
            nameVN,
            isManager,
            restaurantIdForCrud,
            validActions,
            ManagerFoodModals,
            openModal,
          }}
          tableKey={tableKey}
          object={nameEN}
          data={foodData}
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

export default ManagerFoodsPage;
