import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { RevenueResponseType } from "../../../types/RevenueType";

const FEATURE_NAME = "dashboard-revenue";

const RevenueApiService = {
  async handleDashboard({
    restaurantId,
    revenueType,
    timeline,
    timeDetail,
  }: FilterDataProps): Promise<AxiosResponse<RevenueResponseType, any>> {
    return instance.post(
      `/api/v1/${FEATURE_NAME}`,
      {
        restaurantId,
        type: revenueType,
        timeline,
        timeDetail,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },
};

export default RevenueApiService;
