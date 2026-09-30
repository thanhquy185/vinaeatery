import { Card, Flex, List, Typography, Badge } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { ImageSourcePath } from "../../../../constants/values";
import { vietnamMoneyFormat } from "../../../../utils/otherEvents";
import type { Dispatch, SetStateAction } from "react";
import type { FoodCrudResponseType } from "../../../../types/FoodType";

type ListMenuDetailComponentProps = {
  type: "detail" | "update";
  foods: FoodCrudResponseType[];
  selectedFoodIds: number[];
  setSelectedFoodIds: Dispatch<SetStateAction<number[]>>;
};

const ListMenuDetailComponent: React.FC<ListMenuDetailComponentProps> = ({
  type,
  foods,
  selectedFoodIds,
  setSelectedFoodIds,
}) => {
  const handleSelectAll = () => {
    setSelectedFoodIds(foods.map((food) => food.id));
  };
  const handleRemoveAll = () => {
    setSelectedFoodIds([]);
  };

  return (
    <>
      {type !== "detail" && (
        <div className="buttons">
          <button
            type="button"
            className="btn secondary-btn margin-r"
            onClick={handleSelectAll}
          >
            Chọn tất cả
          </button>
          <button
            type="button"
            className="btn secondary-btn"
            onClick={handleRemoveAll}
          >
            Xoá tất cả
          </button>
        </div>
      )}
      <List
        itemLayout="horizontal"
        grid={{
          gutter: [12, 12],
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 3,
        }}
        dataSource={foods}
        pagination={{
          pageSize: 6,
        }}
        renderItem={(food) => {
          const isSelected = selectedFoodIds.some(
            (selectedFoodId) => selectedFoodId === food.id,
          );

          return (
            <List.Item style={{ marginBlockEnd: 0 }}>
              <Badge
                count={
                  isSelected ? (
                    <CheckCircleFilled
                      style={{
                        color: "#b91c1c",
                        fontSize: 22,
                      }}
                    />
                  ) : (
                    0
                  )
                }
                offset={[-18, 18]}
              >
                <Card
                  cover={
                    <img
                      src={food.imageUrl ?? ImageSourcePath + "no-image.png"}
                    />
                  }
                  bodyStyle={{ padding: 0 }}
                  style={{
                    background: isSelected ? "#fef2f2" : "#ffffff",
                    border: isSelected
                      ? "2px solid #b91c1c"
                      : "2px solid #e5e7eb",
                    borderRadius: 16,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all .25s",
                  }}
                  onClick={() => {
                    if (type === "update") {
                      const foodId = food.id;

                      setSelectedFoodIds((prev) => {
                        if (prev.includes(foodId)) {
                          return prev.filter((id) => id !== foodId);
                        }

                        return [...prev, foodId];
                      });
                    }
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 5,
                      bottom: 5,
                      width: "calc(100% - 10px)",
                    }}
                  >
                    <Card
                      style={{
                        borderRadius: 14,
                        boxShadow: "0 8px 24px rgba(0,0,0,.12)",
                      }}
                      styles={{
                        body: {
                          padding: 10,
                        },
                      }}
                    >
                      <Typography.Title
                        style={{
                          fontSize: 13,
                          marginBottom: 0,
                        }}
                      >
                        {food.name} #{food.id}
                      </Typography.Title>
                      <Typography.Text
                        type="secondary"
                        style={{
                          fontSize: 13,
                        }}
                      >
                        {food.categoryFood.name}
                      </Typography.Text>
                      <Flex
                        justify="flex-end"
                        align="center"
                        style={{
                          marginTop: 4,
                        }}
                      >
                        <Typography.Text
                          strong
                          style={{
                            color: "#f5b301",
                            fontSize: 15,
                          }}
                        >
                          {vietnamMoneyFormat(food.price)}
                        </Typography.Text>
                      </Flex>
                    </Card>
                  </div>
                </Card>
              </Badge>
            </List.Item>
          );
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </>
  );
};

export default ListMenuDetailComponent;
