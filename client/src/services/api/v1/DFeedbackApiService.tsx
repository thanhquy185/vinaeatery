import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { DFeedbackResponseType } from "../../../types/DFeedbackType";

const FEATURE_NAME = "dashboard-feedback";

const FeedbackApiService = {
  async handleDashboard({
    restaurantId,
    timeline,
    timeDetail,
  }: FilterDataProps): Promise<AxiosResponse<DFeedbackResponseType, any>> {
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

export default FeedbackApiService;
