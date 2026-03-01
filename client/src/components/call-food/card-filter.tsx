import React from "react";
import { Card } from "antd";
import type { CategoryFoodType } from "../../common/types";
import { ImageSourcePath } from "../../common/values";

const { Meta } = Card;

// Kiểu dữ liệu của tham số truyền vào
type CustomCardFilterProps = {
  key: number;
  className?: string;
  object?: CategoryFoodType;
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
        className={
          "call-food__filter-item" + (className! ? " " + className : "")
        }
        onClick={() =>
          setSelectValue!(object?.id !== currentValue! ? object?.id : "")
        }
      >
        <a className={"call-food__filter-action" + (active ? " active" : "")}>
          <img
            src={
              object?.image
                ? (object?.image as string)
                : ImageSourcePath + "no-image.png"
            }
            alt=""
            className="call-food__filter-image"
          />
          <p className="call-food__filter-title">{object?.name}</p>
        </a>
      </div>
    </>
  );
};

export default CustomCardFilter;
