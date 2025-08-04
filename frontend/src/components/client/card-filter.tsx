import React from "react";
import { Card } from "antd";
import type { CategoryFoodsType } from "../../common/types";

const { Meta } = Card;

// Kiểu dữ liệu của tham số truyền vào
type CustomCardFilterProps = {
  key: number;
  className?: string;
  object?: CategoryFoodsType;
  active?: boolean;
  currentValue?: number | string;
  setSelectValue?: (value?: number | string) => void;
};

// Custom Card Filter
const CustomCardFilter: React.FC<CustomCardFilterProps> = ({
  key,
  className,
  object,
  active,
  currentValue,
  setSelectValue,
}) => {
  return (
    <>
      <div
        key={key}
        className={"client__filter-item" + (className! ? " " + className : "")}
        onClick={() =>
          setSelectValue!(object!.id !== currentValue! ? object!.id : "")
        }
      >
        <a className={"client__filter-action" + (active ? " active" : "")}>
          <img
            src={
              object!.image
                ? "/src/assets/images/category-foods/" + object!.image
                : "/src/assets/images/others/no-image.png"
            }
            alt=""
            className="client__filter-image"
          />
          <p className="client__filter-title">{object!.name}</p>
        </a>
      </div>
    </>
  );
};

export default CustomCardFilter;
