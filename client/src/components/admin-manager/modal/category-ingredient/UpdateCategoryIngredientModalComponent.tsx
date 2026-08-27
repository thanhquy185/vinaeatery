import useEntityQuery from "../../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import TextArea from "antd/es/input/TextArea";
import CategoryIngredientApiService from "../../../../services/api/v1/CategoryIngredientApiService";
import { Form, Input, Select, Spin } from "antd";
import { ruleRequired } from "../../../../constants/rules";
import { ModalAutoComplete, ModalLayout } from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmationUtil";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  CategoryIngredientDetailResponseType,
  CategoryIngredientUpdateRequestType,
} from "../../../../types/CategoryIngredientType";

const UpdateCategoryIngredientModalComponent: React.FC<
  CrudObjectModalProps
> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  data,
  closeModal,
}) => {
  const { data: categoryIngredientDetail, isLoading } =
    useEntityQuery<CategoryIngredientDetailResponseType>({
      keys: ["category-ingredient", data.id],
      params: { id: data.id },
      api: CategoryIngredientApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<CategoryIngredientDetailResponseType>();

  const updateMutation = useEntityMutation<
    CategoryIngredientUpdateRequestType,
    CategoryIngredientDetailResponseType
  >({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["category-ingredient", data.id]],
    api: CategoryIngredientApiService.handleUpdate,
  });

  return (
    <Spin spinning={!categoryIngredientDetail || isLoading}>
      {categoryIngredientDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          initialValues={categoryIngredientDetail}
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
                className="modal__form-group-item multiple-2"
                rules={[
                  ruleRequired("Tên loại nguyên liệu không được để trống!"),
                ]}
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

export default UpdateCategoryIngredientModalComponent;
