import RestaurantFilterCardInfoComponent from "./filter/RestaurantFilterCardInfoComponent";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { RestaurantPublicResponseType } from "../../../../types/RestaurantType";
import { isRestaurantOpenNow } from "./restaurantUtils";

type RestaurantFilterComponentProps = {
  restaurants: RestaurantPublicResponseType[];
  selectedRestaurant: RestaurantPublicResponseType | undefined;
  setSelectedRestaurant: Dispatch<
    SetStateAction<RestaurantPublicResponseType | undefined>
  >;
  setViewMode: Dispatch<SetStateAction<"filter" | "detail">>;
};

type AvailabilityFilter = "all" | "open" | "closed";

const RestaurantFilterComponent: React.FC<RestaurantFilterComponentProps> = ({
  restaurants,
  selectedRestaurant,
  setSelectedRestaurant,
  setViewMode,
}) => {
  const [keyword, setKeyword] = useState("");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");

  const filteredRestaurants = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLocaleLowerCase("vi");

    return restaurants.filter((restaurant) => {
      const searchableText = [
        restaurant.name,
        restaurant.houseNumber,
        restaurant.streetName,
        restaurant.ward,
        restaurant.province,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("vi");
      const matchesKeyword = searchableText.includes(normalizedKeyword);
      const isOpen = isRestaurantOpenNow(restaurant);
      const matchesAvailability =
        availability === "all" ||
        (availability === "open" && isOpen) ||
        (availability === "closed" && !isOpen);

      return matchesKeyword && matchesAvailability;
    });
  }, [restaurants, keyword, availability]);

  const openRestaurantCount = useMemo(
    () => restaurants.filter((restaurant) => isRestaurantOpenNow(restaurant)).length,
    [restaurants],
  );

  return (
    <section className="ve-restaurant-explorer" aria-label="Tìm nhà hàng">
      <header className="ve-restaurant-explorer__header">
        <div>
          <span className="ve-restaurant-explorer__eyebrow">
            <i /> KHÁM PHÁ ẨM THỰC
          </span>
          <h2>Tìm nhà hàng</h2>
          <p>Chọn một điểm đến trên bản đồ để xem chi tiết.</p>
        </div>
        <span className="ve-restaurant-explorer__count">
          {restaurants.length} <small>địa điểm</small>
        </span>
      </header>

      <div className="ve-restaurant-explorer__controls">
        <Input
          allowClear
          size="large"
          prefix={<SearchOutlined />}
          placeholder="Tên nhà hàng hoặc khu vực..."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          aria-label="Tìm theo tên nhà hàng hoặc khu vực"
        />
        <div
          className="ve-restaurant-explorer__chips"
          aria-label="Lọc theo giờ mở cửa"
        >
          <button
            type="button"
            className={availability === "all" ? "is-active" : ""}
            onClick={() => setAvailability("all")}
          >
            Tất cả
          </button>
          <button
            type="button"
            className={availability === "open" ? "is-active" : ""}
            onClick={() => setAvailability("open")}
          >
            <i className="is-open" /> Đang mở · {openRestaurantCount}
          </button>
          <button
            type="button"
            className={availability === "closed" ? "is-active" : ""}
            onClick={() => setAvailability("closed")}
          >
            Đã đóng
          </button>
        </div>
        <div className="ve-restaurant-explorer__result-count">
          {filteredRestaurants.length} kết quả
        </div>
      </div>

      <div className="ve-restaurant-explorer__results">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <RestaurantFilterCardInfoComponent
              key={restaurant.id}
              selected={selectedRestaurant?.id === restaurant.id}
              restaurant={restaurant}
              onClick={() => {
                setSelectedRestaurant(restaurant);
                setViewMode("detail");
              }}
            />
          ))
        ) : (
          <div className="ve-restaurant-explorer__empty">
            <span><SearchOutlined /></span>
            <strong>Chưa tìm thấy nhà hàng phù hợp</strong>
            <p>Thử tên nhà hàng hoặc khu vực khác nhé.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RestaurantFilterComponent;
