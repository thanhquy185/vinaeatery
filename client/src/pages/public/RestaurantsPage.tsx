import useEntityQuery from "../../hooks/useEntityQuery2";
import RestaurantMapComponent from "../../components/public/RestaurantMapComponent";
import RestaurantApiService from "../../services/api/v1/RestaurantApiService";
import { Layout, Spin } from "antd";
import type { PageResponseType } from "../../types/PageResponseType";
import type { RestaurantPublicResponseType } from "../../types/RestaurantType";
import type { PublicPageProps } from "../../constants/props";

const PublicRestaurantsPage: React.FC<PublicPageProps> = ({
  isCustomer,
  customerLogin,
}) => {
  // Dữ liệu nhà hàng
  const { data: restaurantData, isLoading } = useEntityQuery<
    PageResponseType<RestaurantPublicResponseType>
  >({
    keys: ["restaurants-public"],
    params: {},
    api: RestaurantApiService.handleGetPublic,
  });

  return (
    <Layout
      style={{ minHeight: "calc(100vh - 90px)", backgroundColor: "#f4f6fa" }}
    >
      <Spin spinning={!restaurantData || isLoading}>
        {restaurantData && restaurantData?.content && (
          <RestaurantMapComponent
            isCustomer={isCustomer}
            customerLogin={customerLogin}
            restaurants={restaurantData?.content}
          />
        )}
      </Spin>
    </Layout>
  );
};

export default PublicRestaurantsPage;
