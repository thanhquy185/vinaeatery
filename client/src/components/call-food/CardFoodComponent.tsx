import { Button } from "antd";
import { ImageSourcePath } from "../../constants/values";
import { vietnamMoneyFormat } from "../../utils/otherEvents";
import { openNotification } from "../../utils/showNotificationUtil";
import type { Dispatch, SetStateAction } from "react";
import type { FoodInfoResponseType } from "../../types/FoodType";
import type { ShoppingCartRequestType } from "../../types/ShoppingCartType";

type CardFoodComponentProps = {
  key: number;
  className?: string;
  object: FoodInfoResponseType;
  disabled?: boolean;
  shoppingCart: ShoppingCartRequestType[];
  setShoppingCart: Dispatch<SetStateAction<ShoppingCartRequestType[]>>;
};

const CardFoodComponent: React.FC<CardFoodComponentProps> = ({
  key,
  className,
  object,
  disabled,
  shoppingCart,
  setShoppingCart,
}) => {
  return (
    <Button
      key={key}
      className={"call-food__food" + (className ? " " + className : "")}
      disabled={disabled}
      onClick={() => {
        let newShoppingCart: ShoppingCartRequestType[] = [...shoppingCart];
        let isExistsFood = false;
        for (let i = 0; i < newShoppingCart.length; i++) {
          if (newShoppingCart[i].food.id === object.id) {
            newShoppingCart[i].quantity = newShoppingCart[i].quantity + 1;
            isExistsFood = true;
          }
        }
        if (!isExistsFood) {
          newShoppingCart.push({ food: object, quantity: 1 });
        }
        setShoppingCart(newShoppingCart);

        openNotification({
          type: "success",
          message: "Thành công",
          description: "Thêm vào giỏ hàng thành công",
        });
      }}
    >
      <img
        src={object.imageUrl ?? ImageSourcePath + "no-image.png"}
        alt=""
        className="call-food__food-image"
      />
      <div className="call-food__food-info">
        <p className="call-food__food-paragraph name">{object.name}</p>
        <p className="call-food__food-paragraph category">
          {object.categoryFood.name}
        </p>
        <p className="call-food__food-paragraph price">
          {vietnamMoneyFormat(object.price)}
        </p>
      </div>
      {disabled && (
        <div className="call-food__food-disabled">
          <img src={ImageSourcePath + "can-not-order-image.png"} alt="" />
          <p>Món ăn này đã hết phục vụ</p>
        </div>
      )}
    </Button>
  );
};

export default CardFoodComponent;
