import { getVietnamCurrentTime } from "../../../../utils/dayjsUtil";
import type { RestaurantPublicResponseType } from "../../../../types/RestaurantType";

const toMinutes = (time: string) => {
  const [hours = "0", minutes = "0"] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
};

export const isRestaurantOpenNow = (
  restaurant: Pick<RestaurantPublicResponseType, "openAt" | "closeAt">,
  currentTime = getVietnamCurrentTime(),
) => {
  if (!restaurant.openAt || !restaurant.closeAt) return false;

  const now = toMinutes(currentTime);
  const opens = toMinutes(restaurant.openAt);
  const closes = toMinutes(restaurant.closeAt);

  return opens <= closes
    ? now >= opens && now <= closes
    : now >= opens || now <= closes;
};
