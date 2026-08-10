import useEntityQuery from "../../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import TextArea from "antd/es/input/TextArea";
import CategoryTableApiService from "../../../../services/api/v1/CategoryTableApiService";
import { Form, Input, InputNumber, Select, Spin } from "antd";
import { ruleRequired } from "../../../../constants/rules";
import {
  CategoryTableSurchargeTypeValue,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmation";
import {
  inputNumberFormatter,
  inputNumberParse,
} from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  CategoryTableUpdateRequestType,
  CategoryTableDetailResponseType,
} from "../../../../types/CategoryTableType";

const UpdateCategoryTableModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  data,
  closeModal,
}) => {
  const { data: categoryTableDetail, isLoading } =
    useEntityQuery<CategoryTableDetailResponseType>({
      keys: ["category-table", data.id],
      params: { id: data.id },
      api: CategoryTableApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<CategoryTableDetailResponseType>();

  const updateMutation = useEntityMutation<
    CategoryTableUpdateRequestType,
    CategoryTableDetailResponseType
  >({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["category-table", data.id]],
    api: CategoryTableApiService.handleUpdate,
  });

  return (
    <Spin spinning={!categoryTableDetail && isLoading}>
      {categoryTableDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          initialValues={categoryTableDetail}
          className="modal__form split-2"
          onFinish={async () => {
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']",
            );

            submitButton?.classList.add("active");

            const answer = await openConfirmation({
              title: `Bạn có chắc chắn cập nhật ?`,
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
              >
                <Select disabled />
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
            <button type="submit" className="modal__button btn update">
              Xác nhận
            </button>
          </div>
        </Form>
      )}
    </Spin>
  );
};

export default UpdateCategoryTableModalComponent;
