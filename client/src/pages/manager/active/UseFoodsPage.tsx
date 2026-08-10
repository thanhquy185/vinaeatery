import useModal from "../../../hooks/useModal";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import ModalComponent from "../../../components/ModalComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterActiveComponent from "../../../components/admin-manager/MainFilterActiveComponent";
import MainUseFoodListComponent from "../../../components/admin-manager/MainUseFoodListComponent";
import UpdateUseFoodModalComponent from "../../../components/admin-manager/modal/use-food/UpdateUseFoodModalComponent";
import CategoryFoodApiService from "../../../services/api/v1/CategoryFoodApiService";
import UseFoodApiService from "../../../services/api/v1/UseFoodApiService";
import { useState } from "react";
import { UseFoodStatusValue } from "../../../constants/values";
import { getFilterSelectValueToShow } from "../../../utils/otherEvents";
import type { SelectProps } from "antd";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { CategoryFoodCrudResponseType } from "../../../types/CategoryFoodType";
import type { UseFoodSummaryResponseType } from "../../../types/UseFoodType";

const ManagerUseFoodsPage: React.FC<AdminManagerPageProps> = ({
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

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(12);
  // - Tìm kiếm thông tin
  const findOptions = [{ label: "Tên", value: "foodName" }];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  // - Loại món ăn
  const categoryFoodOptions: SelectProps["options"] = categoryFoods?.map(
    (categoryFood) => ({
      label: categoryFood.name,
      value: categoryFood.id,
    }),
  );
  const [filterCategoryFoodValue, setFilterCategoryFoodValue] = useState<
    string[] | null
  >([]);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    {
      label: UseFoodStatusValue.can_order,
      value: UseFoodStatusValue.can_order,
    },
    {
      label: UseFoodStatusValue.can_not_order,
      value: UseFoodStatusValue.can_not_order,
    },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    [],
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const { data: useFoodData, isLoading } = useEntityQuery<
    PageResponseType<UseFoodSummaryResponseType>
  >({
    keys: [
      nameEN,
      page,
      size,
      filterFindType,
      filterFindValue,
      filterCategoryFoodValue,
      filterStatusValue,
      restaurantIdForCrud,
    ],
    params: {
      page: page,
      size: size,
      findType: filterFindType!,
      findValue: filterFindValue!,
      timeValue: ["", "null"],
      categoryValue: filterCategoryFoodValue!,
      statusValue: filterStatusValue!,
      restaurantId: restaurantIdForCrud,
    },
    api: UseFoodApiService.handleGetSummary,
  });

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Quản lý các modal
  const ManagerUseFoodModals = {
    update: (useFoodSummary: UseFoodSummaryResponseType) => (
      <UpdateUseFoodModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        isManager={isManager}
        restaurantId={restaurantIdForCrud}
        validActions={validActions}
        data={useFoodSummary}
        dataForCrud={{ infoLogin: infoLogin }}
        closeModal={() => closeModal()}
      />
    ),
  };

  return (
    <>
      <main className="admin-manager-main">
        <MainHeaderComponent title={nameVN} />
        <MainFilterActiveComponent
          isUseFood={true}
          findOptions={findOptions}
          filterFindType={filterFindType}
          filterFindValue={filterFindValue}
          setFilterFindType={setFilterFindType}
          setFilterFindValue={setFilterFindValue}
          floorOptions={categoryFoodOptions}
          filterFloorValue={getFilterSelectValueToShow({
            options: categoryFoodOptions,
            filterSelectValue: filterCategoryFoodValue,
          })}
          setFilterFloorValue={setFilterCategoryFoodValue}
          statusOptions={statusOptions}
          filterStatusValue={getFilterSelectValueToShow({
            options: statusOptions,
            filterSelectValue: filterStatusValue,
          })}
          setFilterStatusValue={setFilterStatusValue}
          onClickFilterReset={() => {
            setFilterFindType(findOptions[0].value);
            setFilterFindValue(null);
            setFilterCategoryFoodValue(null);
            setFilterStatusValue(null);
          }}
        />
        <MainUseFoodListComponent
          nameEN={nameEN}
          nameVN={nameVN}
          useFoodData={useFoodData!}
          isLoading={isLoading}
          ManagerUseFoodModals={ManagerUseFoodModals}
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

export default ManagerUseFoodsPage;
