import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type {
  FunctionDetailResponseType,
  FunctionSummaryResponseType,
} from "../../../types/FunctionType";

const FEATURE_NAME = "functions";

const FunctionApiService = {
  async getOne(
    id: number,
  ): Promise<AxiosResponse<FunctionDetailResponseType, any>> {
    return instance.get<FunctionDetailResponseType>(
      `/api/v1/${FEATURE_NAME}/${id}`,
    );
  },

  async getAll(): Promise<AxiosResponse<FunctionSummaryResponseType[], any>> {
    return instance.get<FunctionSummaryResponseType[]>(
      `/api/v1/${FEATURE_NAME}`,
    );
  },
};

export default FunctionApiService;
