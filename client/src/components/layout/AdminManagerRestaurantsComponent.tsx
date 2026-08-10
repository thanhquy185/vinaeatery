import useEntityQuery from "../../hooks/useEntityQuery2";
import RestaurantApiService from "../../services/api/v1/RestaurantApiService";
import { List, Card, Tag, Button } from "antd";
import { Mail, MapPin, MoveRight, Phone } from "lucide-react";
import { ImageSourcePath, CommonStatusValue } from "../../constants/values";
import type { Dispatch, SetStateAction } from "react";
import type { RestaurantManagerResponseType } from "../../types/RestaurantType";
import type { ManagerDetailResponseType } from "../../types/ManagerType";

type AdminManagerRestaurantsComponentProps = {
  infoLogin: ManagerDetailResponseType;
  setSelectedRestaurant: Dispatch<SetStateAction<number>>;
};

const AdminManagerRestaurantsComponent: React.FC<
  AdminManagerRestaurantsComponentProps
> = ({ infoLogin, setSelectedRestaurant }) => {
  // Dữ liệu nhà hàng
  const { data: restaurants } = useEntityQuery<RestaurantManagerResponseType[]>(
    {
      keys: ["restaurants-manager"],
      params: {
        managerId: infoLogin.id,
      },
      api: RestaurantApiService.handleGetAllByManagerId,
    },
  );

  return (
    <List
      grid={{
        gutter: 24,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 3,
        xxl: 6,
      }}
      dataSource={restaurants}
      renderItem={(restaurant) => (
        <List.Item className="manager-restaurant">
          <Card
            cover={
              <img
                src={
                  restaurant.thumbnail
                    ? restaurant.thumbnail
                    : ImageSourcePath + "no-image.png"
                }
                className="manager-restaurant__image"
              />
            }
          >
            <Card.Meta
              title={
                <>
                  <p className="name"> {restaurant.name}</p>
                  <Tag
                    color={
                      restaurant.status === CommonStatusValue.active
                        ? "green"
                        : "red"
                    }
                    bordered={false}
                    className="status"
                  >
                    {restaurant.status}
                  </Tag>
                </>
              }
              description={
                <>
                  <p className="has-icon">
                    <Phone style={{ marginRight: 6 }} />
                    <span>{restaurant.phone || "Chưa cập nhật"}</span>
                  </p>
                  <p className="has-icon col-span-2">
                    <Mail style={{ marginRight: 6 }} />
                    <span>{restaurant.email || "Chưa cập nhật"}</span>
                  </p>
                  <p className="has-icon">
                    <MapPin style={{ marginRight: 6 }} />
                    <span>
                      {restaurant.houseNumber +
                        " " +
                        restaurant.streetName +
                        ", " +
                        restaurant.ward +
                        ", " +
                        restaurant.province || "Chưa cập nhật"}
                    </span>
                  </p>
                </>
              }
            />
            <Button
              type="primary"
              block
              style={{ marginTop: 24, borderRadius: 8 }}
              disabled={restaurant.status === CommonStatusValue.inactive}
              onClick={() => setSelectedRestaurant(restaurant.id)}
            >
              Quản lý nhà hàng {<MoveRight />}
            </Button>
          </Card>
        </List.Item>
      )}
      extra={
        <>
          <div className="manager-inform-warper">
            <div className="manager-inform">
              <img src={ImageSourcePath + "partner-question-icon.png"} alt="" />
              <h2>Chưa có nhà hàng để quản lý</h2>
              <p>
                Vui lòng liên hệ với quản trị hệ thống để được cấp quyền quản lý
                nhà hàng.
              </p>
            </div>
          </div>
        </>
      }
    />
  );
};

export default AdminManagerRestaurantsComponent;
