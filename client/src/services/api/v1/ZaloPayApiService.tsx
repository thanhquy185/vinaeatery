import instance from "../../customize";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  ZaloPayRequestType,
  ZaloPayResponseType,
} from "../../../types/ZaloPayType";

const FEATURE_NAME = "zalopay";

const ZaloPayApiService = {
  async handleCreateOrder({
    paymentMachineId,
  }: ZaloPayRequestType): Promise<RestResponseType<ZaloPayResponseType>> {
    return instance.post(`/api/v1/${FEATURE_NAME}/create/${paymentMachineId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default ZaloPayApiService;
