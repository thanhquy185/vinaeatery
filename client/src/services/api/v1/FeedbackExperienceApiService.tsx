import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FeedbackExperienceCrudResponseType } from "../../../types/FeedbackExperienceType";

const FEATURE_NAME = "feedback-experiences";

const FeedbackExperienceApiService = {
  async handleGetCrud(): Promise<
    AxiosResponse<FeedbackExperienceCrudResponseType[], any>
  > {
    return instance.get<FeedbackExperienceCrudResponseType[]>(
      `/api/v1/${FEATURE_NAME}/crud`,
    );
  },
};

export default FeedbackExperienceApiService;
