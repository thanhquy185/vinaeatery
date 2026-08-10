import useEntityQuery from "../../../../hooks/useEntityQuery2";
import TextArea from "antd/es/input/TextArea";
import ImageUploadComponent from "../../../ImageUploadComponent";
import CategoryFoodApiService from "../../../../services/api/v1/CategoryFoodApiService";
import { Form, Input, Select, Spin } from "antd";
import { ModalLayout } from "../../../../constants/values";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { CategoryFoodDetailResponseType } from "../../../../types/CategoryFoodType";

const DetailCategoryFoodModalComponent: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  defaultInputs,
  data,
}) => {
  const { data: categoryFoodDetail, isLoading } =
    useEntityQuery<CategoryFoodDetailResponseType>({
      keys: ["category-food", data.id],
      params: { id: data.id },
      api: CategoryFoodApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<CategoryFoodDetailResponseType>();

  return (
    <Spin spinning={!categoryFoodDetail || isLoading}>
      {categoryFoodDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          initialValues={categoryFoodDetail}
          className="modal__form split-2"
          disabled
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title}</p>
            <div className="modal__form-group">
              <Form.Item
                name="image"
                label={defaultLabels.image}
                className="modal__form-group-item"
              >
                <ImageUploadComponent
                  defaultSrc={data?.image as string}
                  alt="image-preview"
                  imageClassName="image-preview"
                  uploadClassName="image-uploader"
                  labelButton={defaultInputs.image}
                  disabled
                />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels.description}
                className="modal__form-group-item multiple-2 margin-bottom-0"
              >
                <TextArea className="multiple-2" />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels.id}
                className="modal__form-group-item"
              >
                <Input className="text-center" />
              </Form.Item>
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Select />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels.name}
                className="modal__form-group-item"
              >
                <Input />
              </Form.Item>
            </div>
          </div>
        </Form>
      )}
    </Spin>
  );
};

export default DetailCategoryFoodModalComponent;
