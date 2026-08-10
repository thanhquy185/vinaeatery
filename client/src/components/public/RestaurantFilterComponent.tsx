import RestaurantFilterCardInfoComponent from "./restaurant-filter/RestaurantFilterCardInfoComponent";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Input,
  List,
  Radio,
  Row,
  Slider,
  Space,
  Typography,
} from "antd";
import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { RestaurantPublicResponseType } from "../../types/RestaurantType";

type RestaurantFilterComponentProps = {
  restaurants: RestaurantPublicResponseType[];
  selectedRestaurant: RestaurantPublicResponseType | undefined;
  setSelectedRestaurant: Dispatch<
    SetStateAction<RestaurantPublicResponseType | undefined>
  >;
  setViewMode: Dispatch<SetStateAction<"filter" | "detail">>;
};

const RestaurantFilterComponent: React.FC<RestaurantFilterComponentProps> = ({
  restaurants,
  selectedRestaurant,
  setSelectedRestaurant,
  setViewMode,
}) => {
  const [keyword, setKeyword] = useState("");
  const [minRating, setMinRating] = useState<number>(0);
  const [distanceRange, setDistanceRange] = useState<[number, number]>([0, 20]);
  const [openOnly, setOpenOnly] = useState(false);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchKeyword =
        keyword.trim() === "" ||
        restaurant.name?.toLowerCase().includes(keyword.toLowerCase());

      // sample
      // const rating = restaurant.averageRating ?? 0;
      // const distance = restaurant.distance ?? 0;
      // const isOpen = restaurant.open ?? true;
      const rating = 0;
      const distance = 0;
      const isOpen = true;

      const matchRating = rating >= minRating;

      const matchDistance =
        distance >= distanceRange[0] && distance <= distanceRange[1];

      const matchOpen = !openOnly || isOpen;

      return matchKeyword && matchRating && matchDistance && matchOpen;
    });
  }, [restaurants, keyword, minRating, distanceRange, openOnly]);

  const resetFilter = () => {
    setKeyword("");
    setMinRating(0);
    setDistanceRange([0, 20]);
    setOpenOnly(false);
  };

  return (
    <Row style={{ height: "100%" }}>
      {/* FILTER */}
      <Col
        span={9}
        style={{
          borderRight: "1px solid #f0f0f0",
          padding: 16,
          overflowY: "auto",
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Typography.Text strong>
              <FilterOutlined /> Tìm kiếm
            </Typography.Text>
            <Input.Search
              allowClear
              enterButton
              placeholder="Nhập tên nhà hàng"
              style={{ marginTop: 8 }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Divider style={{ margin: 0 }} />
          <div>
            <Typography.Text strong>Đánh giá</Typography.Text>
            <Radio.Group
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 8,
                gap: 8,
              }}
            >
              <Radio value={0}>Tất cả</Radio>
              <Radio value={3}>3★ trở lên</Radio>
              <Radio value={4}>4★ trở lên</Radio>
              <Radio value={4.5}>4.5★ trở lên</Radio>
            </Radio.Group>
          </div>
          <Divider style={{ margin: 0 }} />
          <div>
            <Typography.Text strong>Khoảng cách</Typography.Text>
            <Slider
              range
              min={0}
              max={20}
              value={distanceRange}
              onChange={(value) => setDistanceRange(value as [number, number])}
            />
            <Typography.Text type="secondary">
              {distanceRange[0]} km - {distanceRange[1]} km
            </Typography.Text>
          </div>
          <Divider style={{ margin: 0 }} />
          <div>
            <Typography.Text strong>Trạng thái</Typography.Text>
            <Checkbox
              checked={openOnly}
              onChange={(e) => setOpenOnly(e.target.checked)}
              style={{
                display: "block",
                marginTop: 8,
              }}
            >
              Đang mở cửa
            </Checkbox>
          </div>
          <Button block icon={<ReloadOutlined />} onClick={resetFilter}>
            Xóa bộ lọc
          </Button>
        </Space>
      </Col>
      {/* RESULT */}
      <Col
        span={15}
        style={{
          padding: 12,
          overflowY: "auto",
        }}
      >
        <div
          style={{
            marginBottom: 12,
            fontWeight: 600,
          }}
        >
          <Typography.Text strong>
            Kết quả ({filteredRestaurants.length})
          </Typography.Text>
        </div>
        <List
          dataSource={filteredRestaurants}
          renderItem={(restaurant) => {
            const selected = selectedRestaurant?.id === restaurant.id;

            return (
              <div
                onClick={() => {
                  setSelectedRestaurant(restaurant);
                  setViewMode("detail");
                }}
                style={{
                  background: selected ? "#e6f4ff" : "#fff",
                  border: selected
                    ? "2px solid #1677ff"
                    : "2px solid transparent",
                  marginBottom: 10,
                  borderRadius: 12,
                  transition: "all .2s",
                  cursor: "pointer",
                }}
              >
                <RestaurantFilterCardInfoComponent
                  selected={selected}
                  restaurant={restaurant}
                />
              </div>
            );
          }}
          pagination={{
            pageSize: 4,
            size: "small",
          }}
        />
      </Col>
    </Row>
  );
};

export default RestaurantFilterComponent;
