import useEntityQuery from "../../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import TextArea from "antd/es/input/TextArea";
import ImageUploadComponent from "../../../ImageUploadComponent";
import CategoryFoodApiService from "../../../../services/api/v1/CategoryFoodApiService";
import { useState } from "react";
import { Form, Input, Select, Spin } from "antd";
import { ruleRequired } from "../../../../constants/rules";
import { ModalAutoComplete, ModalLayout } from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmation";
import type { RcFile } from "antd/es/upload";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  CategoryFoodDetailResponseType,
  CategoryFoodUpdateRequestType,
} from "../../../../types/CategoryFoodType";

const UpdateCategoryFoodModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  data,
  closeModal,
}) => {
  const { data: categoryFoodDetail, isLoading } =
    useEntityQuery<CategoryFoodDetailResponseType>({
      keys: ["category-food", data.id],
      params: { id: data.id },
      api: CategoryFoodApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<CategoryFoodUpdateRequestType>();
  const [imageFile, setImageFile] = useState<RcFile>();

  const updateMutation = useEntityMutation<
    CategoryFoodUpdateRequestType,
    CategoryFoodDetailResponseType
  >({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["category-food", data.id]],
    api: CategoryFoodApiService.handleUpdate,
  });

  return (
    <Spin spinning={!categoryFoodDetail || isLoading}>
      {categoryFoodDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          initialValues={categoryFoodDetail}
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
                values: {
                  ...values,
                  image: imageFile ?? undefined,
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
                label={defaultLabels.image}
                htmlFor="update-image"
                className="modal__form-group-item"
              >
                <ImageUploadComponent
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  defaultSrc={data.image as string}
                  alt="image-preview"
                  htmlFor="update-image"
                  imageClassName="image-preview"
                  uploadClassName="image-uploader"
                  labelButton={defaultInputs.image}
                />
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
                name="id"
                label={defaultLabels.id}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled />
              </Form.Item>
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Select disabled />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels.name}
                className="modal__form-group-item"
                rules={[ruleRequired("Tên nguyên liệu không được để trống!")]}
              >
                <Input placeholder={defaultInputs.name} />
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

export default UpdateCategoryFoodModalComponent;
