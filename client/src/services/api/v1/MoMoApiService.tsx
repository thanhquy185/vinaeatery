import instance from "../../customize";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  MoMoRequestType,
  MoMoResponseType,
} from "../../../types/MoMoType";

const FEATURE_NAME = "momo";

const MoMoApiService = {
  async handleCreateOrder({
    paymentMachineId,
  }: MoMoRequestType): Promise<RestResponseType<MoMoResponseType>> {
    return instance.post(`/api/v1/${FEATURE_NAME}/create/${paymentMachineId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default MoMoApiService;
