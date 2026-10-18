import { Card, Empty, Flex, Image, List, Space, Typography } from "antd";
import { ImageSourcePath } from "../../../../../constants/values";
import { vietnamMoneyFormat } from "../../../../../utils/otherEvents";
import type { FoodInfoResponseType } from "../../../../../types/FoodType";

type RestaurantDetailTabMenuComponentProps = {
  foods: FoodInfoResponseType[];
};

const RestaurantDetailTabMenuComponent: React.FC<
  RestaurantDetailTabMenuComponentProps
> = ({ foods }) => {
  return (
    <div className="ve-restaurant-menu">
      <Space direction="vertical" style={{ width: "100%" }}>
        <div className="ve-restaurant-menu__heading">
          <span>HƯƠNG VỊ NHÀ HÀNG</span>
          <Typography.Title level={4}>Thực đơn nổi bật</Typography.Title>
          <p>Khám phá các món ăn nhà hàng đang phục vụ.</p>
        </div>
        {foods.length > 0 ? (
          <List
            className="ve-restaurant-menu__list"
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 2,
              xl: 2,
            }}
            dataSource={foods}
            renderItem={(food) => (
              <List.Item>
                <Card hoverable className="ve-restaurant-menu__card" bodyStyle={{ padding: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                    }}
                  >
                    <Image
                      src={food.imageUrl ?? ImageSourcePath + "no-image.png"}
                      width={90}
                      height={90}
                      style={{
                        borderRadius: 8,
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <Typography.Text
                        strong
                        ellipsis
                        style={{
                          marginBottom: 0,
                          fontSize: 14,
                        }}
                      >
                        {food.name}
                      </Typography.Text>
                      <Typography.Paragraph
                        type="secondary"
                        ellipsis={{
                          rows: 2,
                        }}
                        style={{
                          marginTop: 0,
                          marginBottom: 0,
                          fontSize: 13,
                        }}
                      >
                        {food.categoryFood.name} / {food.unit}
                      </Typography.Paragraph>
                      <Typography.Paragraph
                        ellipsis={{
                          rows: 2,
                        }}
                        style={{
                          marginTop: 0,
                          marginBottom: 8,
                          fontSize: 13,
                        }}
                      >
                        {food.description}
                      </Typography.Paragraph>
                      <Flex justify="flex-end" align="center">
                        <Typography.Text
                          strong
                          style={{
                            fontSize: 16,
                            color: "#f5a623",
                          }}
                        >
                          {vietnamMoneyFormat(food.price)}
                        </Typography.Text>
                      </Flex>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
            pagination={{ pageSize: 6 }}
          />
        ) : (
          <Empty
            image={ImageSourcePath + "cooking-icon.png"}
            description="Nhà hàng chưa cung cấp menu món ăn"
          />
        )}
      </Space>
    </div>
  );
};

export default RestaurantDetailTabMenuComponent;
