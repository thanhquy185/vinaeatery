import useEntityMutation from "../../../../hooks/useEntityMutation";
import TextArea from "antd/es/input/TextArea";
import CategoryTableApiService from "../../../../services/api/v1/CategoryTableApiService";
import { Form, Input, InputNumber, Select } from "antd";
import { ruleRequired } from "../../../../constants/rules";
import {
  CategoryTableSurchargeTypeValue,
  CommonStatusValue,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmationUtil";
import {
  inputNumberFormatter,
  inputNumberParse,
} from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  CategoryTableCreateRequestType,
  CategoryTableDetailResponseType,
} from "../../../../types/CategoryTableType";

const CreateCategoryTableModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  closeModal,
}) => {
  const [form] = Form.useForm<CategoryTableCreateRequestType>();

  const createMutation = useEntityMutation<
    CategoryTableCreateRequestType,
    CategoryTableDetailResponseType
  >({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: CategoryTableApiService.handleCreate,
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
                  placeholder={defaultInputs.id}
                  className="text-center"
                  disabled
                />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels.name}
                className="modal__form-group-item"
                rules={[ruleRequired("Tên loại bàn không được để trống!")]}
              >
                <Input placeholder={defaultInputs.name} />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels.description}
                className="modal__form-group-item multiple-2"
              >
                <TextArea
                  className="multiple-2"
                  placeholder={defaultInputs.description}
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
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="surchargeType"
                  label={defaultLabels.surchargeType}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Loại phụ thu không được để trống!")]}
                >
                  <Select
                    allowClear
                    placeholder={defaultInputs.surchargeType}
                    options={[
                      {
                        label: CategoryTableSurchargeTypeValue.percent,
                        value: CategoryTableSurchargeTypeValue.percent,
                      },
                      {
                        label: CategoryTableSurchargeTypeValue.fixed,
                        value: CategoryTableSurchargeTypeValue.fixed,
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="surchargeValue"
                  label={defaultLabels.surchargeValue}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Giá trị phụ thu không được để trống!")]}
                >
                  <InputNumber
                    min={0}
                    formatter={(value) => inputNumberFormatter(value)}
                    parser={(value) => inputNumberParse(value)}
                    placeholder={defaultInputs.surchargeValue}
                  />
                </Form.Item>
              </div>
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

export default CreateCategoryTableModalComponent;
