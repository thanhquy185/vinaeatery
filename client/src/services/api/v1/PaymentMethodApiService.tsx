import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type {
  PaymentMethodDetailResponseType,
  PaymentMethodCrudResponseType,
} from "../../../types/PaymentMethodType";

const FEATURE_NAME = "payment-methods";

const PaymentMethodApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<
    AxiosResponse<PaymentMethodDetailResponseType, any>
  > {
    return instance.get<PaymentMethodDetailResponseType>(
      `/api/v1/${FEATURE_NAME}/${id}`,
    );
  },

  async handleGetCrud(): Promise<
    AxiosResponse<PaymentMethodCrudResponseType[], any>
  > {
    return instance.get<PaymentMethodCrudResponseType[]>(
      `/api/v1/${FEATURE_NAME}/crud`,
    );
  },
};

export default PaymentMethodApiService;
