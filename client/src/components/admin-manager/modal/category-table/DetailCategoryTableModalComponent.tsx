import useEntityQuery from "../../../../hooks/useEntityQuery2";
import TextArea from "antd/es/input/TextArea";
import CategoryTableApiService from "../../../../services/api/v1/CategoryTableApiService";
import { Form, Input, InputNumber, Select, Spin } from "antd";
import { ModalLayout } from "../../../../constants/values";
import {
  inputNumberFormatter,
  inputNumberParse,
} from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { CategoryTableDetailResponseType } from "../../../../types/CategoryTableType";

const DetailCategoryTableModalComponent: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
}) => {
  const { data: categoryTableDetail, isLoading } =
    useEntityQuery<CategoryTableDetailResponseType>({
      keys: ["category-table", data.id],
      params: { id: data.id },
      api: CategoryTableApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<CategoryTableDetailResponseType>();

  return (
    <Spin spinning={!categoryTableDetail && isLoading}>
      {categoryTableDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          initialValues={categoryTableDetail}
          className="modal__form split-2"
          disabled
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title}</p>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels.id}
                className="modal__form-group-item"
              >
                <Input className="text-center" />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels.name}
                className="modal__form-group-item"
              >
                <Input />
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
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Select />
              </Form.Item>
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="surchargeType"
                  label={defaultLabels.surchargeType}
                  className="modal__form-group-item"
                >
                  <Select />
                </Form.Item>
                <Form.Item
                  name="surchargeValue"
                  label={defaultLabels.surchargeValue}
                  className="modal__form-group-item"
                >
                  <InputNumber
                    formatter={(value) => inputNumberFormatter(value)}
                    parser={(value) => inputNumberParse(value)}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Spin>
  );
};

export default DetailCategoryTableModalComponent;
