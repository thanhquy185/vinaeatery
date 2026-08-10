import TablePermissionDetailsComponent from "./TablePermissionDetailsComponent";
import PermissionApiService from "../../../../services/api/v1/PermissionApiService";
import { useState } from "react";
import { Form, Input, Select } from "antd";
import { ruleRequired } from "../../../../constants/rules";
import {
  CommonStatusValue,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../constants/values";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import { openConfirmation } from "../../../../utils/showConfirmation";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  PermissionCreateRequestType,
  PermissionDetailResponseType,
} from "../../../../types/PermissionType";
import type { PermissionDetailCreateRequestType } from "../../../../types/PermissionDetailType";

const CreatePermissionModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  closeModal,
}) => {
  const [form] = Form.useForm<PermissionCreateRequestType>();
  const [permissionDetails, setPermissionDetails] = useState<
    PermissionDetailCreateRequestType[]
  >([]);

  const createMutation = useEntityMutation<
    PermissionCreateRequestType,
    PermissionDetailResponseType
  >({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: PermissionApiService.handleCreate,
  });

  return (
    <>
      {restaurantId && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          className="modal__form split-2"
          onFinish={async () => {
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']",
            );

            submitButton?.classList.add("active");

            const answer = await openConfirmation({
              title: `Bạn có chắc chắn thêm ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              const values = form.getFieldsValue();

              const response = await createMutation.mutateAsync({
                values: {
                  ...values,
                  restaurantId: restaurantId,
                  permissionDetails: permissionDetails,
                },
              });
              if (response) {
                closeModal();
              }
            }

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
                <TablePermissionDetailsComponent
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
                      label: CommonStatusValue.active,
                      value: CommonStatusValue.active,
                    },
                    {
                      label: CommonStatusValue.inactive,
                      value: CommonStatusValue.inactive,
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
      )}
    </>
  );
};

export default CreatePermissionModalComponent;
