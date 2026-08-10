import useEntityMutation from "../../../hooks/useEntityMutation";
import RestaurantApiService from "../../../services/api/v1/RestaurantApiService";
import ManagerApiService from "../../../services/api/v1/ManagerApiService";
import CustomerApiService from "../../../services/api/v1/CustomerApiService";
import UserApiService from "../../../services/api/v1/UserApiService";
import FloorApiService from "../../../services/api/v1/FloorApiService";
import CategoryTableApiService from "../../../services/api/v1/CategoryTableApiService";
import TableApiService from "../../../services/api/v1/TableApiService";
import SupplierApiService from "../../../services/api/v1/SupplierApiService";
import CategoryIngredientApiService from "../../../services/api/v1/CategoryIngredientApiService";
import IngredientApiService from "../../../services/api/v1/IngredientApiService";
import CategoryFoodApiService from "../../../services/api/v1/CategoryFoodApiService";
import FoodApiService from "../../../services/api/v1/FoodApiService";
import RoleApiService from "../../../services/api/v1/RoleApiService";
import PermissionApiService from "../../../services/api/v1/PermissionApiService";
import EmployeeApiService from "../../../services/api/v1/EmployeeApiService";
import { Form } from "antd";
import {
  CommonStatusValue,
  EmployeeStatusValue,
  FoodStatusValue,
  ImageSourcePath,
  ModalLayout,
} from "../../../constants/values";
import { openConfirmation } from "../../../utils/showConfirmation";
import type { CrudObjectModalProps } from "../../../constants/props";
import MenuApiService from "../../../services/api/v1/MenuApiService";

const ACTIVE_STATUS_MAP: Record<string, string> = {
  foods: FoodStatusValue.active,
  employees: EmployeeStatusValue.active,
};
const INACTIVE_STATUS_MAP: Record<string, string> = {
  foods: FoodStatusValue.inactive,
  employees: EmployeeStatusValue.inactive,
};
export const getActiveStatusByObject = (objectEN: string): string => {
  return ACTIVE_STATUS_MAP[objectEN] ?? CommonStatusValue.active;
};
export const getInactiveStatusByObject = (objectEN: string): string => {
  return INACTIVE_STATUS_MAP[objectEN] ?? CommonStatusValue.inactive;
};
export const isActiveStatus = (
  objectEN: string,
  fieldStatus: string,
): boolean => {
  return fieldStatus === getActiveStatusByObject(objectEN);
};
export const convertStatus = (
  objectEN: string,
  currentStatus: string,
): string => {
  const activeStatus = getActiveStatusByObject(objectEN);
  const inactiveStatus = getInactiveStatusByObject(objectEN);

  return currentStatus === activeStatus ? inactiveStatus : activeStatus;
};

const getApiByObjectEN = (objectEN: string) => {
  switch (objectEN) {
    case "restaurants":
      return RestaurantApiService.handleDelete;
    case "managers":
      return ManagerApiService.handleDelete;
    case "customers":
      return CustomerApiService.handleDelete;
    case "users":
      return UserApiService.handleDelete;
    case "menus":
      return MenuApiService.handleDelete;
    case "floors":
      return FloorApiService.handleDelete;
    case "category-tables":
      return CategoryTableApiService.handleDelete;
    case "tables":
      return TableApiService.handleDelete;
    case "suppliers":
      return SupplierApiService.handleDelete;
    case "category-ingredients":
      return CategoryIngredientApiService.handleDelete;
    case "ingredients":
      return IngredientApiService.handleDelete;
    case "category-foods":
      return CategoryFoodApiService.handleDelete;
    case "foods":
      return FoodApiService.handleDelete;
    case "roles":
      return RoleApiService.handleDelete;
    case "permissions":
      return PermissionApiService.handleDelete;
    case "employees":
      return EmployeeApiService.handleDelete;
  }
};

const LockModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  objectENPrimary,
  fieldId,
  fieldStatus,
  closeModal,
}) => {
  const [form] = Form.useForm();

  const isActive = isActiveStatus(objectEN, fieldStatus!);
  const nextStatus = convertStatus(objectEN, fieldStatus!);

  const lockMutation = useEntityMutation<any, any>({
    messages: {
      success: `${
        isActive ? "Khoá" : "Mở khoá"
      } ${objectVN?.toLowerCase()} thành công!`,
      error: `${
        isActive ? "Khoá" : "Mở khoá"
      } ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [
      [objectENPrimary ? objectENPrimary : objectEN],
      [objectEN.slice(0, objectEN.length - 1), fieldId],
    ],
    api: getApiByObjectEN(objectEN)!,
  });

  return (
    <Form
      form={form}
      layout={ModalLayout}
      className="modal__form"
      onFinish={async () => {
        const submitButton = document.querySelector(
          ".modal__form button[type='submit']",
        );

        submitButton?.classList.add("active");

        const answer = await openConfirmation({
          title: `Bạn có chắc chắn ${isActive ? "khoá" : "mở khoá"} ?`,
          content: "Hành động này không thể hoàn tác.",
        });
        if (answer) {
          const response = await lockMutation.mutateAsync({
            values: {
              id: fieldId,
              status: nextStatus,
            },
          });
          if (response) {
            closeModal();
          }
        }

        submitButton?.classList.remove("active");
      }}
    >
      <div className="modal__form-image">
        <img
          src={
            isActive
              ? ImageSourcePath + "lock-icon.png"
              : ImageSourcePath + "unlock-icon.png"
          }
          alt=""
        />
      </div>
      <div className="modal__form-content">
        <p>
          Bạn có xác nhận rằng{" "}
          <b>
            {isActive ? "khoá" : "mở khoá"}&nbsp;{objectVN?.toLowerCase()}
          </b>{" "}
          có mã đối tượng là <b>#{fieldId}</b> ?
        </p>
      </div>
      <div className="modal__buttons">
        <button type="submit" className="modal__button btn lock">
          Xác nhận
        </button>
      </div>
    </Form>
  );
};

export default LockModalComponent;
