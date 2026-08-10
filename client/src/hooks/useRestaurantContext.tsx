import { UserRoleValue } from "../constants/values";
import { getActionsString } from "../services/managerLogin";

interface UseRestaurantContextProps {
  infoLogin: any;
  functionId: number;
}

const useRestaurantContext = ({
  infoLogin,
  functionId,
}: UseRestaurantContextProps) => {
  const isManager = infoLogin?.user?.role === UserRoleValue.manager;

  const selectedRestaurantId = Number(
    sessionStorage.getItem("selected-restaurant-id"),
  );

  const validActions = getActionsString({
    currentInfoLogin: infoLogin,
    currentFunctionId: functionId,
  });

  const restaurantIdForCrud = isManager
    ? selectedRestaurantId
    : infoLogin?.restaurant.id;

  return {
    isManager,
    selectedRestaurantId,
    validActions,
    restaurantIdForCrud,
  };
};

export default useRestaurantContext;
