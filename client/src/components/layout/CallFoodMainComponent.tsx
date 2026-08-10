import useEntityQuery from "../../hooks/useEntityQuery2";
import CardFilterComponent from "../call-food/CardFilterComponent";
import CardFoodComponent from "../call-food/CardFoodComponent";
import CategoryFoodApiService from "../../services/api/v1/CategoryFoodApiService";
import { useMemo, useState } from "react";
import { Button, Input } from "antd";
import {
  UseFoodStatusValue,
  UseTableStatusValue,
} from "../../constants/values";
import type { CallFoodPageProps } from "../../constants/props";
import type { CategoryFoodCrudResponseType } from "../../types/CategoryFoodType";

const CallFoodMainComponent: React.FC<CallFoodPageProps> = ({
  shoppingCart,
  setShoppingCart,
  currentUseTable,
}) => {
  // Truy vấn dữ liệu Loại món ăn
  const { data: categoryFoods } = useEntityQuery<
    CategoryFoodCrudResponseType[]
  >({
    keys: ["category-foods-crud", currentUseTable.restaurant.id],
    params: {
      restaurantId: currentUseTable.restaurant.id,
    },
    api: CategoryFoodApiService.handleGetCrud,
  });

  // Các thành phần cho việc lọc dữ liệu
  // - Tên
  const [filterName, setFilterName] = useState<string>();
  // - Loại
  const [filterCategory, setFilterCategory] = useState<number | string>();
  // - Trạng thái
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  // - Lọc dữ liệu
  const filteredFoods = useMemo(() => {
    if (!currentUseTable.menu || !currentUseTable.menu.menuDetails) return [];

    return currentUseTable.menu.menuDetails.filter((menuDetail) => {
      let matchName = true;
      if (filterName && filterName.trim() !== "") {
        const value = filterName.toLowerCase();
        matchName = menuDetail.food.name.toLowerCase().includes(value)!;
      }

      let matchCategory = true;
      if (filterCategory) {
        matchCategory = menuDetail.food.categoryFood.id === filterCategory;
      }

      let matchStatus = true;
      if (filterStatus && filterStatus.length > 0) {
        matchStatus = filterStatus.includes(menuDetail.status);
      }

      return matchName && matchCategory && matchStatus;
    });
  }, [currentUseTable, filterName, filterCategory, filterStatus]);

  return (
    <main className="call-food__main">
      {currentUseTable.status === UseTableStatusValue.occupied ? (
        <>
          <aside className="call-food__filter">
            <div className="call-food__filter-list-warper">
              <div className="call-food__filter-list">
                {(categoryFoods || []).map((categoryFood) => (
                  <CardFilterComponent
                    key={categoryFood?.id!}
                    object={categoryFood}
                    active={filterCategory === categoryFood?.id}
                    currentValue={filterCategory}
                    setSelectValue={setFilterCategory}
                  />
                ))}
              </div>
            </div>
          </aside>
          <div className="call-food__foods">
            <div className="call-food__food-header">
              <Input.Search
                allowClear
                enterButton
                placeholder="Tìm kiếm theo tên món ăn"
                className="call-food__food-find"
                onChange={(e) => setFilterName(e.target.value)}
              />
              <div className="call-food__food-buttons">
                <Button
                  variant={filterStatus === null ? "solid" : "outlined"}
                  color="blue"
                  className="call-food__food-button"
                  onClick={() => setFilterStatus(null)}
                >
                  Tất cả
                </Button>
                <Button
                  variant={
                    filterStatus === "Đang giảm giá" ? "solid" : "outlined"
                  }
                  color="orange"
                  className="call-food__food-button"
                  onClick={() => setFilterStatus("Đang giảm giá")}
                  disabled
                >
                  Đang giảm giá
                </Button>
                <Button
                  variant={
                    filterStatus === UseFoodStatusValue.can_order
                      ? "solid"
                      : "outlined"
                  }
                  color="green"
                  className="call-food__food-button"
                  onClick={() => setFilterStatus(UseFoodStatusValue.can_order)}
                >
                  {UseFoodStatusValue.can_order}
                </Button>
                <Button
                  variant={
                    filterStatus === UseFoodStatusValue.can_not_order
                      ? "solid"
                      : "outlined"
                  }
                  color="red"
                  className="call-food__food-button"
                  onClick={() =>
                    setFilterStatus(UseFoodStatusValue.can_not_order)
                  }
                >
                  {UseFoodStatusValue.can_not_order}
                </Button>
              </div>
            </div>
            {filteredFoods.map((menuDetail) => (
              <CardFoodComponent
                key={menuDetail.food.id}
                object={menuDetail.food}
                disabled={menuDetail.status !== UseFoodStatusValue.can_order}
                shoppingCart={shoppingCart!}
                setShoppingCart={setShoppingCart!}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="call-food__inform container">
          {currentUseTable.status === UseTableStatusValue.reserved
            ? "Rất tiếc, bàn này đã được khách khác đặt trước. Mong quý khách thông cảm!"
            : currentUseTable.status === UseTableStatusValue.empty
              ? "Xin vui lòng chờ trong giây lát để chúng tôi chuẩn bị bàn cho quý khách."
              : "Bàn hiện đang được bảo trì. Rất mong quý khách thông cảm vì sự bất tiện này!"}
        </p>
      )}
    </main>
  );
};

export default CallFoodMainComponent;
