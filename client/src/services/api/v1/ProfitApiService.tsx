import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { ProfitResponseType } from "../../../types/ProfitType";

const FEATURE_NAME = "dashboard-profit";

const ProfitApiService = {
  async handleDashboard({
    restaurantId,
    timeline,
    timeDetail,
  }: FilterDataProps): Promise<AxiosResponse<ProfitResponseType, any>> {
    return instance.post(
      `/api/v1/${FEATURE_NAME}`,
      {
        restaurantId,
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

export default ProfitApiService;
