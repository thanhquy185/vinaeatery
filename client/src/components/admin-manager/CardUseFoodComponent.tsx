import { Card, Tag } from "antd";
import { ImageSourcePath, UseFoodStatusValue } from "../../constants/values";
import { vietnamMoneyFormat } from "../../utils/otherEvents";
import type { UseFoodSummaryResponseType } from "../../types/UseFoodType";

type CardUseFoodComponentProps = {
  useFood: UseFoodSummaryResponseType;
  onClick: () => void;
};

const CardUseFoodComponent: React.FC<CardUseFoodComponentProps> = ({
  useFood,
  onClick,
}) => {
  return (
    <Card
      cover={
        <img
          src={useFood.food.imageUrl ?? ImageSourcePath + "no-image.png"}
          alt={"food-image-" + useFood.food.id}
        />
      }
      bodyStyle={{ padding: 0 }}
      className="use-food-card"
      onClick={onClick}
    >
      <div
        style={{
          position: "absolute",
          left: 8,
          bottom: 8,
          width: "calc(100% - 16px)",
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
          <h3>{useFood.food.name}</h3>
          <p>
            <span>Loại món ăn: </span>
            <b className="category">{useFood.food.categoryFood.name}</b>
          </p>
          <p>
            <span> Giá bán: </span>
            <b className="price">{vietnamMoneyFormat(useFood.food.price)}</b>
          </p>
          <p>
            <span>Trạng thái: </span>
            <Tag
              color={
                useFood.status === UseFoodStatusValue.can_order
                  ? "green"
                  : "red"
              }
              bordered={false}
              className="status"
            >
              {useFood.status}
            </Tag>
          </p>
        </Card>
      </div>
    </Card>
  );
};

export default CardUseFoodComponent;
