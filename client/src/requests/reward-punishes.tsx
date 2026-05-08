import type { AxiosResponse } from "axios";
import type { FilterDataProps } from "../common/props";
import type { RewardPunishType, RestResponseType } from "../common/types";
import instance from "../services/customize";
import { getNewFormSecurityValue, keys } from "../services/api";

// Các api của đối tượng Thưởng - Phạt (Reward Punish)
export const FindAllRewardPunish = ({
  findType,
  findValue,
  timeValue,
  statusValue,
  restaurantId,
}: FilterDataProps): Promise<AxiosResponse<RewardPunishType[], any>> => {
  // Tham số để lọc dữ liệu
  const params: Record<string, string> = {};
  if (findValue! !== "") {
    if (findType! === "id") params.id = findValue!;
  }
  if (timeValue! && timeValue!.length > 0) {
    if (timeValue![0] !== "") params.createAtStart = timeValue![0];
    if (timeValue![1] !== "") params.createAtEnd = timeValue![1];
  }
  if (statusValue! && statusValue!.length > 0)
    params.statusMerge = statusValue!.join(",");
  if (restaurantId && !isNaN(restaurantId))
    params.restaurantId = String(restaurantId);

  return instance.post<RewardPunishType[]>(
    `/api/${keys.rewardPunishes}/list-format`,
    getNewFormSecurityValue({
      fieldName: keys.rewardPunishes,
      fieldAction: "read",
    }),
    {
      params,
    },
  );
};
export const FindOneRewardPunish = (
  id: string,
): Promise<AxiosResponse<RewardPunishType, any>> => {
  return instance.post(
    `/api/${keys.rewardPunishes}/detail/${id}`,
    getNewFormSecurityValue({
      fieldName: keys.rewardPunishes,
      fieldAction: "read",
    }),
  );
};
export const HandleCreateRewardPunish = ({
  restaurantId,
  createAt,
  employeeHandleId,
  employeeMainId,
  categoryRewardPunishId,
  date,
  money,
  reason,
  status,
}: RewardPunishType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.rewardPunishes,
      fieldAction: "create",
    }),
    rewardPunish: {
      restaurantId,
      createAt,
      employeeHandleId,
      employeeMainId,
      categoryRewardPunishId,
      date,
      money,
      reason,
      status,
    },
  };

  return instance.post(`/api/${keys.rewardPunishes}/create`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const HandleUpdateRewardPunish = ({
  id,
  status,
}: RewardPunishType): Promise<AxiosResponse<RestResponseType, any>> => {
  const formData = {
    formSecurity: getNewFormSecurityValue({
      fieldName: keys.rewardPunishes,
      fieldAction: "update",
    }),
    rewardPunish: {
      status,
    },
  };

  return instance.put(`/api/${keys.rewardPunishes}/update/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
