import instance from "../../customize";
import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestResponseType } from "../../../types/RestResponseType";
import type {
  MessageCreateRequestType,
  MessageDetailResponseType,
  MessageSummaryResponseType,
} from "../../../types/MessageType";

const FEATURE_NAME = "messages";

const MessageApiService = {
  async handleGetDetailById({
    id,
  }: FilterDataProps): Promise<AxiosResponse<MessageDetailResponseType, any>> {
    return instance.get<MessageDetailResponseType>(
      `/api/v1/${FEATURE_NAME}/${id}`,
    );
  },

  async handleGetSummary({
    page,
    size,
    findType,
    findValue,
    statusValue,
    restaurantId,
  }: FilterDataProps): Promise<
    AxiosResponse<PageResponseType<MessageSummaryResponseType>, any>
  > {
    const params: Record<string, string> = {};
    if (page && !isNaN(page)) {
      params.page = String(page - 1);
    }
    if (size && !isNaN(size)) {
      params.size = String(size);
    }
    if (findValue && findType) {
      if (findType === "id") params.id = findValue;
    }
    if (statusValue && statusValue.length > 0) params.status = statusValue![0];
    if (restaurantId && !isNaN(restaurantId))
      params.restaurantId = String(restaurantId);

    return instance.get<PageResponseType<MessageSummaryResponseType>>(
      `/api/v1/${FEATURE_NAME}`,
      { params },
    );
  },

  async handleCreate({
    restaurantId,
    useTableId,
    createAt,
    isRead,
    messageDetails,
  }: MessageCreateRequestType): Promise<
    RestResponseType<MessageDetailResponseType>
  > {
    return instance.post(
      `/api/v1/${FEATURE_NAME}`,
      {
        restaurantId,
        useTableId,
        createAt,
        isRead,
        messageDetails,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },
};

export default MessageApiService;
