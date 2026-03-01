import { useState } from "react";
import { Form, Input, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type {
  PermissionDetailType,
  PermissionType,
} from "../../../../common/types";
import {
  CommonStatus,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../common/values";
import CustomTablePermissionDetails from "../../common/table-permission-details";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleCreatePermission } from "../../../../requests/permissions";
import { openConfirmation } from "../../../../utils/show-confirmation";

// Manager Create Permission
const ManagerCreatePermission: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  closeModal,
}) => {
  const [form] = Form.useForm<PermissionType>();
  const [permissionDetails, setPermissionDetails] = useState<
    PermissionDetailType[]
  >([]);
  const createMutation = useEntityMutation<PermissionType>({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleCreatePermission,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        className="modal__form split-2"
        onFinish={async () => {
          // Nút để submit form
          const submitButton = document.querySelector(
            ".modal__form button[type='submit']",
          );

          // Thêm class 'active' thể hiện nút đang được nhấn
          submitButton?.classList.add("active");

          // Hỏi trước khi xử khi xử lý ?
          const answer = await openConfirmation({
            title: `Bạn có chắc chắn thêm ?`,
            content: "Hành động này không thể hoàn tác.",
          });
          if (answer) {
            // Danh sách dữ liệu
            const values = form.getFieldsValue();

            // Thực thi mutation
            const response = await createMutation.mutateAsync({
              values: {
                ...values,
                restaurantId: restaurantId,
                permissionDetails: permissionDetails! || undefined,
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
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title}</p>
          <div className="modal__form-group">
            <Form.Item
              name="id"
              label={defaultLabels.id}
              className="modal__form-group-item"
            >
              <Input
                className="text-center"
                placeholder={defaultInputs.id}
                disabled
              />
            </Form.Item>
            <Form.Item
              name="name"
              label={defaultLabels.name}
              htmlFor="create-name"
              className="modal__form-group-item multiple-2"
              rules={[ruleRequired("Tên chức vụ không được để trống!")]}
            >
              <Input id="create-name" placeholder={defaultInputs.name} />
            </Form.Item>
            <Form.Item
              label={defaultLabels.permissionDetails}
              htmlFor="create-permissionDetails"
              className="modal__form-group-item multiple-2"
            >
              <CustomTablePermissionDetails
                id="create-permissionDetails"
                setPermissionDetails={setPermissionDetails}
              />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="status"
              label={defaultLabels.status}
              htmlFor="create-status"
              className="modal__form-group-item"
              rules={[ruleRequired("Trạng thái không được để trống!")]}
            >
              <Select
                allowClear
                id="create-status"
                placeholder={defaultInputs.status}
                options={[
                  {
                    label: CommonStatus.active,
                    value: CommonStatus.active,
                  },
                  {
                    label: CommonStatus.inactive,
                    value: CommonStatus.inactive,
                  },
                ]}
              />
            </Form.Item>
          </div>
        </div>
        <div className="modal__buttons">
          <button type="submit" className="modal__button btn create">
            Xác nhận
          </button>
        </div>
      </Form>
    </>
  );
};

export default ManagerCreatePermission;
