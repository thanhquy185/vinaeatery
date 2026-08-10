import useEntityMutation from "../../../../hooks/useEntityMutation";
import RoleApiService from "../../../../services/api/v1/RoleApiService";
import { Form, Input, InputNumber, Select } from "antd";
import { ruleRequired } from "../../../../constants/rules";
import {
  CommonStatusValue,
  ModalAutoComplete,
  ModalLayout,
  RoleSalaryTypeValue,
} from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmation";
import {
  inputNumberFormatter,
  inputNumberParse,
} from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  RoleCreateRequestType,
  RoleDetailResponseType,
} from "../../../../types/RoleType";

const CreateRoleModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  closeModal,
}) => {
  const [form] = Form.useForm<RoleCreateRequestType>();

  const createMutation = useEntityMutation<
    RoleCreateRequestType,
    RoleDetailResponseType
  >({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: RoleApiService.handleCreate,
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
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Tên chức vụ không được để trống!")]}
              >
                <Input placeholder={defaultInputs.name} />
              </Form.Item>
              <Form.Item
                name="salaryType"
                label={defaultLabels.salaryType}
                className="modal__form-group-item"
                rules={[ruleRequired("Cách tính lương không được để trống!")]}
              >
                <Select
                  allowClear
                  placeholder={defaultInputs.salaryType}
                  options={[
                    {
                      label: RoleSalaryTypeValue.fixed,
                      value: RoleSalaryTypeValue.fixed,
                    },
                    {
                      label: RoleSalaryTypeValue.hours,
                      value: RoleSalaryTypeValue.hours,
                    },
                  ]}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
                rules={[ruleRequired("Trạng thái không được để trống!")]}
              >
                <Select
                  allowClear
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
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              <Form.Item
                name="salaryValue"
                label={defaultLabels.salaryValue}
                className="modal__form-group-item"
                rules={[ruleRequired("Tiền lương không được để trống!")]}
              >
                <InputNumber
                  min={0}
                  formatter={(value) => inputNumberFormatter(value)}
                  parser={(value) => inputNumberParse(value)}
                  placeholder={defaultInputs.salaryValue}
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

export default CreateRoleModalComponent;
