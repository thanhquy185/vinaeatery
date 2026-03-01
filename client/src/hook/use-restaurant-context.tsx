import { UserRoleValue } from "../common/values";
import { getActionsString } from "../services/manager-login";

interface UseRestaurantContextProps {
  infoLogin: any;
  functionId: number;
}

export function useRestaurantContext({
  infoLogin,
  functionId,
}: UseRestaurantContextProps) {
  const isManager = infoLogin?.user?.role === UserRoleValue.manager;

  const selectedRestaurantId = Number(
    sessionStorage.getItem("selected-restaurant-id")
  );

  const validActions = getActionsString({ currentInfoLogin: infoLogin, currentFunctionId: functionId });

  const restaurantIdForCrud = isManager
    ? selectedRestaurantId
    : infoLogin?.restaurantId;

  return {
    isManager,
    selectedRestaurantId,
    validActions,
    restaurantIdForCrud,
  };
}
