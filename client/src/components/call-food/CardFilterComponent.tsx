import React from "react";
import { ImageSourcePath } from "../../constants/values";
import type { CategoryFoodCrudResponseType } from "../../types/CategoryFoodType";

type CardFilterComponentProps = {
  key: number;
  className?: string;
  object: CategoryFoodCrudResponseType;
  active: boolean;
  currentValue?: number | string;
  setSelectValue?: (value?: number | string) => void;
};

const CardFilterComponent: React.FC<CardFilterComponentProps> = ({
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
            src={object.imageUrl ?? ImageSourcePath + "no-image.png"}
            alt=""
            className="call-food__filter-image"
          />
          <p className="call-food__filter-title">{object?.name}</p>
        </a>
      </div>
    </>
  );
};

export default CardFilterComponent;
