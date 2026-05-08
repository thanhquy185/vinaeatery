import { useState } from "react";
import { Form, Input, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type {
  PermissionDetailType,
  PermissionType,
} from "../../../../common/types";
import { ModalAutoComplete, ModalLayout } from "../../../../common/values";
import CustomTablePermissionDetails from "../../common/table-permission-details";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdatePermission } from "../../../../requests/permissions";
import { openConfirmation } from "../../../../utils/show-confirmation";
import dayjs from "dayjs";

// Manager Update Permission
const ManagerUpdatePermission: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  data,
  closeModal,
}) => {
  const [form] = Form.useForm<PermissionType>();
  const [permissionDetails, setPermissionDetails] = useState<
    PermissionDetailType[]
  >(
    data?.permissionDetails?.map((permissionDetail: PermissionDetailType) => ({
      functionId: permissionDetail.functionId,
      action: permissionDetail.action,
    }))!,
  );
  const updateMutation = useEntityMutation<PermissionType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleUpdatePermission,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        initialValues={{
          id: data?.id || undefined,
          name: data?.name || undefined,
          status: data?.status || undefined,
        }}
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
            title: `Bạn có chắc chắn cập nhật ?`,
            content: "Hành động này không thể hoàn tác.",
          });
          if (answer) {
            // Danh sách dữ liệu
            const values = form.getFieldsValue();

            // Thực thi mutation
            const response = await updateMutation.mutateAsync({
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
              <Input className="text-center" disabled />
            </Form.Item>
            <Form.Item
              name="name"
              label={defaultLabels.name}
              htmlFor="update-name"
              className="modal__form-group-item multiple-2"
              rules={[ruleRequired("Tên chức vụ không được để trống!")]}
            >
              <Input id="update-name" placeholder={defaultInputs.name} />
            </Form.Item>
            <Form.Item
              label={defaultLabels.permissionDetails}
              htmlFor="update-permissionDetails"
              className="modal__form-group-item multiple-2"
            >
              <CustomTablePermissionDetails
                id="update-permissionDetails"
                data={permissionDetails}
                setPermissionDetails={setPermissionDetails}
              />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="status"
              label={defaultLabels.status}
              className="modal__form-group-item"
            >
              <Select disabled />
            </Form.Item>
          </div>
        </div>
        <div className="modal__buttons">
          <button type="submit" className="modal__button btn update">
            Xác nhận
          </button>
        </div>
      </Form>
    </>
  );
};

export default ManagerUpdatePermission;
