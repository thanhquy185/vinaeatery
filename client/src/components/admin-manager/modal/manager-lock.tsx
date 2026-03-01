import type { FC } from "react";
import { Form } from "antd";
import type { CrudObjectModalProps } from "../../../common/props";
import {
  CommonStatus,
  EmployeeStatus,
  FoodStatus,
  ImageSourcePath,
  ModalLayout,
} from "../../../common/values";
import { useEntityMutation } from "../../../hook/use-entity-mutation";
import { HandleLockRestaurant } from "../../../requests/restaurants";
import { HandleLockManager } from "../../../requests/managers";
import { HandleLockCustomer } from "../../../requests/customers";
import { HandleLockUser } from "../../../requests/users";
import { HandleLockFloor } from "../../../requests/floors";
import { HandleLockCategoryTable } from "../../../requests/category-tables";
import { HandleLockTable } from "../../../requests/tables";
import { HandleLockSupplier } from "../../../requests/suppliers";
import { HandleLockCategoryIngredient } from "../../../requests/category-ingredients";
import { HandleLockIngredient } from "../../../requests/ingredients";
import { HandleLockCategoryFood } from "../../../requests/category-foods";
import { HandleLockFood } from "../../../requests/foods";
import { HandleLockCategoryPermissionTicket } from "../../../requests/category-permission-tickets";
import { HandleLockCategoryRewardPunish } from "../../../requests/category-reward-punishes";
import { HandleLockSchedule } from "../../../requests/schedule";
import { HandleLockShift } from "../../../requests/shifts";
import { HandleLockRole } from "../../../requests/roles";
import { HandleLockPermission } from "../../../requests/permissions";
import { HandleLockEmployee } from "../../../requests/employees";
import { openConfirmation } from "../../../utils/show-confirmation";

const getApiByObjectEN = (objectEN: string) => {
  switch (objectEN) {
    case "restaurants":
      return HandleLockRestaurant;
    case "managers":
      return HandleLockManager;
    case "customers":
      return HandleLockCustomer;
    case "users":
      return HandleLockUser;
    case "floors":
      return HandleLockFloor;
    case "category-tables":
      return HandleLockCategoryTable;
    case "tables":
      return HandleLockTable;
    case "suppliers":
      return HandleLockSupplier;
    case "category-ingredients":
      return HandleLockCategoryIngredient;
    case "ingredients":
      return HandleLockIngredient;
    case "category-foods":
      return HandleLockCategoryFood;
    case "foods":
      return HandleLockFood;
    case "category-permission-tickets":
      return HandleLockCategoryPermissionTicket;
    case "category-reward-punishes":
      return HandleLockCategoryRewardPunish;
    case "schedules":
      return HandleLockSchedule;
    case "shifts":
      return HandleLockShift;
    case "roles":
      return HandleLockRole;
    case "permissions":
      return HandleLockPermission;
    case "employees":
      return HandleLockEmployee;
  }
};

// Manager Lock
const ManagerLock: FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  restaurantId,
  fieldId,
  fieldStatus,
  closeModal,
}) => {
  const isActive =
    fieldStatus ===
    (objectEN === "foods"
      ? FoodStatus.active
      : objectEN === "employees"
        ? EmployeeStatus.active
        : CommonStatus.active)
      ? true
      : false;
  const [form] = Form.useForm();
  const lockMutation = useEntityMutation<any>({
    messages: {
      success: `${
        isActive ? "Khoá" : "Mở khoá"
      } ${objectVN?.toLowerCase()} thành công!`,
      error: `${
        isActive ? "Khoá" : "Mở khoá"
      } ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: getApiByObjectEN(objectEN)!,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        className="modal__form"
        onFinish={async () => {
          // Nút để submit form
          const submitButton = document.querySelector(
            ".modal__form button[type='submit']",
          );

          // Thêm class 'active' thể hiện nút đang được nhấn
          submitButton?.classList.add("active");

          // Hỏi trước khi xử khi xử lý ?
          const answer = await openConfirmation({
            title: `Bạn có chắc chắn ${isActive ? "khoá" : "mở khoá"} ?`,
            content: "Hành động này không thể hoàn tác.",
          });
          if (answer) {
            // Thực thi mutation
            const response = await lockMutation.mutateAsync({
              values: {
                restaurantId: restaurantId,
                id: fieldId,
                status: fieldStatus,
              },
            });
            if (response) {
              closeModal();
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }

          // Xoá class 'active' thể hiện nút không còn được nhấn
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
    </>
  );
};

export default ManagerLock;
