import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type { IngredientType } from "../../../../common/types";
import { ModalAutoComplete, ModalLayout } from "../../../../common/values";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdateIngredient } from "../../../../requests/ingredients";
import { openConfirmation } from "../../../../utils/show-confirmation";
import dayjs from "dayjs";

// Manager Update Ingredient
const ManagerUpdateIngredient: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  data,
  dataForCrud,
  closeModal,
}) => {
  const [form] = Form.useForm<IngredientType>();
  const updateMutation = useEntityMutation<IngredientType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleUpdateIngredient,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        initialValues={{
          id: data?.id! || undefined,
          name: data?.name! || undefined,
          categoryIngredientId: data?.categoryIngredient!.id || undefined,
          unit: data?.unit! || undefined,
          capacity: data?.capacity! || undefined,
          dateCreate: dayjs(data?.dateCreate!) || undefined,
          dateRemove: dayjs(data?.dateRemove!) || undefined,
          inputPrice: data?.inputPrice! || undefined,
          inventory: data?.inventory! || undefined,
          note: data?.note! || undefined,
          status: data?.status! || undefined,
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
                dateCreate:
                  values!.dateCreate && dayjs(values!.dateCreate).isValid()
                    ? dayjs(values!.dateCreate).format("YYYY-MM-DD")
                    : undefined,
                dateRemove:
                  values!.dateRemove && dayjs(values!.dateRemove).isValid()
                    ? dayjs(values!.dateRemove).format("YYYY-MM-DD")
                    : undefined,
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
                showSearch
                allowClear
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
            >
              <Select disabled />
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
          <button type="submit" className="modal__button btn update">
            Xác nhận
          </button>
        </div>
      </Form>
    </>
  );
};

export default ManagerUpdateIngredient;
