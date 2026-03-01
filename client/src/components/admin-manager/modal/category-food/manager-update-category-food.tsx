import { useState } from "react";
import { Form, Input, Select } from "antd";
import type { RcFile } from "antd/es/upload";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type { CategoryFoodType } from "../../../../common/types";
import { ModalAutoComplete, ModalLayout } from "../../../../common/values";
import CustomImageUpload from "../../../common/image-upload";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdateCategoryFood } from "../../../../requests/category-foods";
import { openConfirmation } from "../../../../utils/show-confirmation";

// Manager Update Category Food
const ManagerUpdateCategoryFood: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  data,
  closeModal,
}) => {
  const [form] = Form.useForm<CategoryFoodType>();
  const [imageFile, setImageFile] = useState<RcFile>();
  const updateMutation = useEntityMutation<CategoryFoodType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleUpdateCategoryFood,
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
          description: data?.description || undefined,
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
                restaurantId: restaurantId,
                image: imageFile! || undefined,
                ...values,
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
              label={defaultLabels.image}
              htmlFor="update-image"
              className="modal__form-group-item"
            >
              <CustomImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                defaultSrc={data?.image as string}
                alt="image-preview"
                htmlFor="update-image"
                imageClassName="image-preview"
                imageCategoryName="category-foods"
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
    </>
  );
};

export default ManagerUpdateCategoryFood;
