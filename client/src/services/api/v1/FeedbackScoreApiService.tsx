import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FeedbackScoreCrudResponseType } from "../../../types/FeedbackScoreType";

const FEATURE_NAME = "feedback-scores";

const FeedbackScoreApiService = {
  async handleGetCrud(): Promise<
    AxiosResponse<FeedbackScoreCrudResponseType[], any>
  > {
    return instance.get<FeedbackScoreCrudResponseType[]>(
      `/api/v1/${FEATURE_NAME}/crud`,
    );
  },
};

export default FeedbackScoreApiService;
