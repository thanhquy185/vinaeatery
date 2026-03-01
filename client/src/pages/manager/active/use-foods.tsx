import { useMemo, useState, type FC } from "react";
import { Card, List, Tag, type SelectProps } from "antd";
import type { ManagerPageProps } from "../../../common/props";
import {
  CommonStatus,
  FoodStatus,
  ImageSourcePath,
  ModalTitleValue,
  ModalWidthValue,
  UseFoodStatus,
} from "../../../common/values";
import type { CategoryFoodType, UseFoodType } from "../../../common/types";
import CustomModal from "../../../components/common/modal";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import AdminManagerMainFilterActive from "../../../components/admin-manager/common/main-filter-active";
import ManagerUpdateUseFood from "../../../components/admin-manager/modal/use-food/manager-update-use-food";
import { FindAllCategoryFood } from "../../../requests/category-foods";
import { FindAllUseFoodTimeEndIsNull } from "../../../requests/use-foods";
import { useModal } from "../../../hook/use-modal";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import {
  getFilterSelectValueToShow,
  vietnamMoneyFormat,
} from "../../../utils/other-events";

const { Meta } = Card;

// Manager Use Foods Page
const ManagerUseFoodsPage: FC<ManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // // Đối tượng query client để thực thi react-query
  // const queryClient = useQueryClient();

  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );
  // useEffect(() => {
  //   queryClient.invalidateQueries({ queryKey: ["category-foods"] });
  //   queryClient.invalidateQueries({ queryKey: [nameEN] });
  // }, [selectedRestaurantId]);

  // Các biến giữ dữ liệu
  // - Loại món ăn
  const { data: categoryFoods } = useEntityQuery<CategoryFoodType[]>({
    keys: ["category-foods", restaurantIdForCrud, CommonStatus.active],
    params: {
      restaurantId: restaurantIdForCrud,
      statusValue: [CommonStatus.active],
    },
    api: FindAllCategoryFood,
  });
  // - Sử dụng món ăn (mới nhất)
  const {
    data: useFoods,
    isLoading,
    isError,
    error,
  } = useEntityQuery<UseFoodType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllUseFoodTimeEndIsNull,
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [{ label: "Món ăn", value: "food" }];
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
    { label: UseFoodStatus.canOrder, value: UseFoodStatus.canOrder },
    { label: UseFoodStatus.canNotOrder, value: UseFoodStatus.canNotOrder },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    [],
  );
  // - Lọc dữ liệu
  const filteredUseFoods = useMemo(() => {
    if (!useFoods) return [];

    return useFoods.filter((useFood) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        // if (filterFindType === "id") {
        //   matchFind = String(useFood.id).includes(value);
        // }

        if (filterFindType === "food") {
          matchFind = useFood?.food?.name?.toLowerCase().includes(value)!;
        }
      }

      // Theo category food
      let matchCategoryFood = true;
      if (filterCategoryFoodValue && filterCategoryFoodValue.length > 0) {
        matchCategoryFood =
          Number(filterCategoryFoodValue[0]) ===
          useFood?.food?.categoryFood?.id;
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        console.log(filterStatusValue);
        matchStatus = filterStatusValue.includes(useFood.status!);
      }

      return matchFind && matchCategoryFood && matchStatus;
    });
  }, [
    useFoods,
    filterFindType,
    filterFindValue,
    filterCategoryFoodValue,
    filterStatusValue,
  ]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Quản lý các modal
  const ManagerUseFoodModals = {
    update: (useFood: UseFoodType) => (
      <ManagerUpdateUseFood
        objectVN={nameVN}
        objectEN={nameEN}
        isManager={isManager}
        restaurantId={restaurantIdForCrud}
        validActions={validActions}
        data={useFood}
        dataForCrud={{ infoLogin: infoLogin }}
        closeModal={() => closeModal()}
      />
    ),
  };

  return (
    <>
      <main className="admin-manager-main">
        <AdminManagerMainHeader title={nameVN} />
        <AdminManagerMainFilterActive
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
        <List
          className="main__use-foods"
          dataSource={filteredUseFoods}
          renderItem={(useFood) => {
            if (useFood?.food?.status !== FoodStatus.active) return;

            return (
              <List.Item
                onClick={() => {
                  openModal({
                    title: ModalTitleValue.handle(nameVN.toLowerCase()),
                    width: ModalWidthValue.active,
                    className: nameEN,
                    children: ManagerUseFoodModals.update(useFood),
                  });
                }}
              >
                <Card
                  cover={
                    <img
                      alt={"food-image-" + useFood?.food?.id}
                      src={
                        useFood?.food?.image
                          ? (useFood?.food?.image as string)
                          : ImageSourcePath + "no-image.png"
                      }
                    />
                  }
                >
                  <Meta
                    avatar={null}
                    title={useFood?.food?.name}
                    description={
                      <>
                        <p>
                          Loại món ăn:{" "}
                          <b>{useFood?.food?.categoryFood?.name}</b>
                        </p>
                        <p>
                          Giá bán:{" "}
                          <b className="price">
                            {vietnamMoneyFormat(useFood?.food?.price || 0)}
                          </b>
                        </p>
                        {/* <p>
                        Số lượng: <b>{useFood?.quantity}</b>
                      </p> */}
                        <p>
                          Trạng thái:{" "}
                          <Tag
                            color={
                              useFood?.status === UseFoodStatus.canOrder
                                ? "green"
                                : "red"
                            }
                          >
                            {useFood?.status}
                          </Tag>
                        </p>
                      </>
                    }
                  />
                </Card>
              </List.Item>
            );
          }}
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

export default ManagerUseFoodsPage;
