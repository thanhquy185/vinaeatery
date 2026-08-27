import { getActionNameVn } from "./defaultActionsUtil";

interface HasPermissionParams {
  isManager: boolean;
  restaurantIdForCrud?: number;
  validActions?: string;
  requiredActionId: number;
}

export function hasPermission({
  isManager,
  restaurantIdForCrud,
  validActions,
  requiredActionId,
}: HasPermissionParams): boolean {
  // Chủ nhà hàng + đã chọn nhà hàng
  if (isManager && restaurantIdForCrud) return true;

  // Nhân viên có quyền theo action
  return validActions?.includes(getActionNameVn(requiredActionId)) ?? false;
}
