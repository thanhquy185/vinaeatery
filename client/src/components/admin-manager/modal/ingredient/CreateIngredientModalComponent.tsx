import useEntityMutation from "../../../../hooks/useEntityMutation";
import TextArea from "antd/es/input/TextArea";
import IngredientApiService from "../../../../services/api/v1/IngredientApiService";
import dayjs from "dayjs";
import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import { ruleRequired } from "../../../../constants/rules";
import {
  CommonStatusValue,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmation";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  IngredientCreateRequestType,
  IngredientDetailResponseType,
} from "../../../../types/IngredientType";

const CreateIngredientModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  dataForCrud,
  closeModal,
}) => {
  const [form] = Form.useForm<IngredientCreateRequestType>();

  const createMutation = useEntityMutation<
    IngredientCreateRequestType,
    IngredientDetailResponseType
  >({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: IngredientApiService.handleCreate,
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
                  dateCreate: dayjs(values.dateCreate).isValid()
                    ? dayjs(values.dateCreate).format("YYYY-MM-DD")
                    : undefined,
                  dateRemove: dayjs(values.dateRemove).isValid()
                    ? dayjs(values.dateRemove).format("YYYY-MM-DD")
                    : undefined,
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
                label={defaultLabels.id}
                className="modal__form-group-item"
              >
                <Input
                  value={defaultInputs.id}
                  className="text-center"
                  disabled
                />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels.name}
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Tên nguyên liệu không được để trống!")]}
              >
                <Input placeholder={defaultInputs.name} />
              </Form.Item>
              <Form.Item
                name="categoryIngredientId"
                label={defaultLabels.categoryIngredient}
                className="modal__form-group-item"
                rules={[ruleRequired("Loại nguyên liệu không được để trống!")]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder={defaultInputs.categoryIngredient}
                  options={dataForCrud?.categoryIngredients!.map(
                    (categoryIngredient) => ({
                      label: `#${categoryIngredient.id} - ${categoryIngredient.name}`,
                      value: categoryIngredient.id,
                    }),
                  )}
                  className="category-ingredients"
                />
              </Form.Item>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="dateCreate"
                  label={defaultLabels.dateCreate}
                  className="modal__form-group-item"
                >
                  <DatePicker placeholder={defaultInputs.dateCreate} />
                </Form.Item>
                <Form.Item
                  name="dateRemove"
                  label={defaultLabels.dateRemove}
                  className="modal__form-group-item"
                >
                  <DatePicker placeholder={defaultInputs.dateRemove} />
                </Form.Item>
              </div>
              <Form.Item
                name="note"
                label={defaultLabels.note}
                className="modal__form-group-item multiple-2"
              >
                <TextArea
                  className="multiple-2"
                  placeholder={defaultInputs.note}
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
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="unit"
                  label={defaultLabels.unit}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần chọn Đơn vị!")]}
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder={defaultInputs.unit}
                    options={dataForCrud?.units!.map((unit) => ({
                      label: unit,
                      value: unit,
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  name="capacity"
                  label={defaultLabels.capacity}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần nhập Định lượng!")]}
                >
                  <InputNumber min={0} placeholder={defaultInputs.capacity} />
                </Form.Item>
              </div>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="inputPrice"
                  label={defaultLabels.inputPrice}
                  className="modal__form-group-item"
                >
                  <InputNumber min={0} placeholder={defaultInputs.inputPrice} />
                </Form.Item>
                <Form.Item
                  name="inventory"
                  label={defaultLabels.inventory}
                  className="modal__form-group-item"
                >
                  <InputNumber disabled />
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

export default CreateIngredientModalComponent;
