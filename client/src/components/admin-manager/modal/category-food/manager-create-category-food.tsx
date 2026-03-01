import { useState } from "react";
import { Form, Input, Select } from "antd";
import type { RcFile } from "antd/es/upload";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type { CategoryFoodType } from "../../../../common/types";
import {
  CommonStatus,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../common/values";
import CustomImageUpload from "../../../common/image-upload";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleCreateCategoryFood } from "../../../../requests/category-foods";
import { openConfirmation } from "../../../../utils/show-confirmation";

// Manager Create Category Food
const ManagerCreateCategoryFood: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  closeModal,
}) => {
  const [form] = Form.useForm<CategoryFoodType>();
  const [imageFile, setImageFile] = useState<RcFile>();
  const createMutation = useEntityMutation<CategoryFoodType>({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleCreateCategoryFood,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
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
            title: `Bạn có chắc chắn thêm ?`,
            content: "Hành động này không thể hoàn tác.",
          });
          if (answer) {
            // Danh sách dữ liệu
            const values = form.getFieldsValue();

            // Thực thi mutation
            const response = await createMutation.mutateAsync({
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
          <p className="modal__form-group-title">{defaultLabels["title"]}</p>
          <div className="modal__form-group">
            <Form.Item
              label={defaultLabels.image}
              htmlFor="create-image"
              className="modal__form-group-item"
            >
              <CustomImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                alt="image-preview"
                htmlFor="create-image"
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
              <Input
                className="text-center"
                placeholder={defaultInputs.id}
                disabled
              />
            </Form.Item>
            <Form.Item
              name="status"
              label={defaultLabels.status}
              className="modal__form-group-item"
              rules={[ruleRequired("Trạng thái không được để trống!")]}
            >
              <Select
                placeholder={defaultInputs.status}
                options={[
                  {
                    label: CommonStatus.active,
                    value: CommonStatus.active,
                  },
                  {
                    label: CommonStatus.inactive,
                    value: CommonStatus.inactive,
                  },
                ]}
              />
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
          <button type="submit" className="modal__button btn create">
            Xác nhận
          </button>
        </div>
      </Form>
    </>
  );
};

export default ManagerCreateCategoryFood;
