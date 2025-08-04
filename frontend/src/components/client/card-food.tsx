import React, { type Dispatch, type SetStateAction } from "react";
import { Card } from "antd";
import type { FoodsFormatType, ShoppingCartsType } from "../../common/types";
import { vietnamMoneyFormat } from "../../utils/otherEvents";
import { openNotification } from "../../utils/showNotification";

const { Meta } = Card;

// Kiểu dữ liệu của tham số truyền vào
type CustomCardFoodProps = {
  key: number;
  className?: string;
  object?: FoodsFormatType;
  active?: boolean;
  shoppingCart?: ShoppingCartsType[];
  setSelectFood?: Dispatch<SetStateAction<ShoppingCartsType[]>>;
};

// Custom Card
const CustomCardFood: React.FC<CustomCardFoodProps> = ({
  key,
  className,
  object,
  active,
  shoppingCart,
  setSelectFood,
}) => {
  return (
    <>
      <div
        key={key}
        className={"client__food" + (className ? " " + className : "")}
        onClick={() => {
          let newShoppingCart: ShoppingCartsType[] = [...shoppingCart!];
          let isExistsFood = false;
          for (let i = 0; i < newShoppingCart!.length; i++) {
            if (newShoppingCart![i].food!.id === object!.id) {
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
            description: "Thêm vào giỏ hàng thành công !",
            duration: 1.5,
          });
        }}
      >
        <img
          src={
            object!.image!
              ? "/src/assets/images/foods/" + object!.image
              : "/src/assets/images/others/no-image.png"
          }
          alt=""
          className="client__food-image"
        />
        <div className="client__food-info">
          <p className="client__food-paragraph name">{object!.name!}</p>
          <p className="client__food-paragraph other">
            {object!.categoryFood!.name!}
          </p>
          <p className="client__food-paragraph price">
            {vietnamMoneyFormat(object!.price!)}đ
          </p>
        </div>
      </div>
    </>
  );
};

export default CustomCardFood;
