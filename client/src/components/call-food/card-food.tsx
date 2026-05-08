import React, { type Dispatch, type SetStateAction } from "react";
import { Button, Card } from "antd";
import type { FoodType, ShoppingCartType } from "../../common/types";
import { ImageSourcePath } from "../../common/values";
import { vietnamMoneyFormat } from "../../utils/other-events";
import { openNotification } from "../../utils/show-notification";

// Kiểu dữ liệu của tham số truyền vào
type CustomCardFoodProps = {
  key: number;
  className?: string;
  object?: FoodType;
  disabled?: boolean;
  shoppingCart?: ShoppingCartType[];
  setSelectFood?: Dispatch<SetStateAction<ShoppingCartType[]>>;
};

// Custom Card Food
const CustomCardFood: React.FC<CustomCardFoodProps> = ({
  key,
  className,
  object,
  disabled,
  shoppingCart,
  setSelectFood,
}) => {
  return (
    <>
      <Button
        key={key}
        className={"call-food__food" + (className ? " " + className : "")}
        disabled={disabled}
        onClick={() => {
          let newShoppingCart: ShoppingCartType[] = [...shoppingCart!];
          let isExistsFood = false;
          for (let i = 0; i < newShoppingCart!.length; i++) {
            if (newShoppingCart![i].food!.id === object?.id) {
              newShoppingCart![i].quantity = newShoppingCart![i].quantity! + 1;
              isExistsFood = true;
            }
          }
          if (!isExistsFood) {
            newShoppingCart!.push({ food: object, quantity: 1 });
          }
          setSelectFood!(newShoppingCart);

          openNotification({
            type: "success",
            message: "Thành công",
            description: "Thêm vào giỏ hàng thành công!",
          });
        }}
      >
        <img
          src={
            object?.image!
              ? (object?.image as string)
              : ImageSourcePath + "no-image.png"
          }
          alt=""
          className="call-food__food-image"
        />
        <div className="call-food__food-info">
          <p className="call-food__food-paragraph name">{object?.name!}</p>
          <p className="call-food__food-paragraph category">
            {object?.categoryFood!.name!}
          </p>
          <p className="call-food__food-paragraph price">
            {vietnamMoneyFormat(object?.price || 0)}
          </p>
        </div>
        {disabled && (
          <div className="call-food__food-disabled">
            <img src={ImageSourcePath + "can-not-order-image.png"} alt="" />
            <p>Món ăn này đã hết phục vụ</p>
          </div>
        )}
      </Button>
    </>
  );
};

export default CustomCardFood;
