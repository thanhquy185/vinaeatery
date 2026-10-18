import { Empty, Image } from "antd";
import type { RestaurantImageDetailResponseType } from "../../../../../types/RestaurantImageType";
import { ImageSourcePath } from "../../../../../constants/values";

type RestaurantDetailTabPhotosComponentProps = {
  restaurantImages: RestaurantImageDetailResponseType[];
};

const RestaurantDetailTabPhotosComponent: React.FC<
  RestaurantDetailTabPhotosComponentProps
> = ({ restaurantImages }) => {
  return (
    <div className="ve-restaurant-photos">
      <div className="ve-restaurant-photos__heading">
        <div>
          <span>KHÔNG GIAN</span>
          <h4>Hình ảnh nhà hàng</h4>
        </div>
        <small>{restaurantImages.length} ảnh</small>
      </div>
      {restaurantImages.length > 0 ? (
        <Image.PreviewGroup>
          <div className="ve-restaurant-photos__grid">
            {restaurantImages.map((restaurantImage, index) => (
              <div className="ve-restaurant-photos__item" key={index}>
                <Image src={restaurantImage.image} alt={`Ảnh nhà hàng ${index + 1}`} />
              </div>
            ))}
          </div>
        </Image.PreviewGroup>
      ) : (
        <div className="ve-restaurant-photos__empty">
          <Empty
            image={ImageSourcePath + "image-icon.png"}
            description="Nhà hàng chưa cung cấp hình ảnh"
          />
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailTabPhotosComponent;
