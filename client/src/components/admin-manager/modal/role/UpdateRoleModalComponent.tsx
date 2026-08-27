import useEntityQuery from "../../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import RoleApiService from "../../../../services/api/v1/RoleApiService";
import { Form, Input, InputNumber, Select, Spin } from "antd";
import { ruleRequired } from "../../../../constants/rules";
import {
  ModalAutoComplete,
  ModalLayout,
  RoleSalaryTypeValue,
} from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmationUtil";
import {
  inputNumberFormatter,
  inputNumberParse,
} from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  RoleDetailResponseType,
  RoleUpdateRequestType,
} from "../../../../types/RoleType";

const UpdateRoleModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  data,
  closeModal,
}) => {
  const { data: roleDetail, isLoading } =
    useEntityQuery<RoleDetailResponseType>({
      keys: ["role", data.id],
      params: { id: data.id },
      api: RoleApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<RoleUpdateRequestType>();

  const updateMutation = useEntityMutation<
    RoleUpdateRequestType,
    RoleDetailResponseType
  >({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["role", data.id]],
    api: RoleApiService.handleUpdate,
  });

  return (
    <Spin spinning={!roleDetail || isLoading}>
      {roleDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          initialValues={roleDetail}
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

              const response = await updateMutation.mutateAsync({
                values: values,
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
                <Input className="text-center" disabled />
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
              >
                <Select disabled />
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
            <button type="submit" className="modal__button btn update">
              Xác nhận
            </button>
          </div>
        </Form>
      )}
    </Spin>
  );
};

export default UpdateRoleModalComponent;
