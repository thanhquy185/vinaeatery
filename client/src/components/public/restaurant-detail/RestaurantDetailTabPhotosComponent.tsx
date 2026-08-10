import { Empty, Image, Space } from "antd";
import type { RestaurantImageDetailResponseType } from "../../../types/RestaurantImageType";
import { ImageSourcePath } from "../../../constants/values";

type RestaurantDetailTabPhotosComponentProps = {
  restaurantImages: RestaurantImageDetailResponseType[];
};

const RestaurantDetailTabPhotosComponent: React.FC<
  RestaurantDetailTabPhotosComponentProps
> = ({ restaurantImages }) => {
  return (
    <div
      style={{
        padding: 16,
      }}
    >
      {restaurantImages.length > 0 ? (
        <Image.PreviewGroup>
          <Space wrap>
            {restaurantImages.map((restaurantImage, index) => (
              <Image key={index} width={184} src={restaurantImage.image} />
            ))}
          </Space>
        </Image.PreviewGroup>
      ) : (
        <Empty
          image={ImageSourcePath + "image-icon.png"}
          description="Nhà hàng chưa cung cấp hình ảnh"
        />
      )}
    </div>
  );
};

export default RestaurantDetailTabPhotosComponent;
