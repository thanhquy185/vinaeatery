import useEntityQuery from "../../../../hooks/useEntityQuery2";
import TextArea from "antd/es/input/TextArea";
import FloorApiService from "../../../../services/api/v1/FloorApiService";
import { Form, Input, Select, Spin } from "antd";
import { ModalLayout } from "../../../../constants/values";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { FloorDetailResponseType } from "../../../../types/FloorType";

const DetailFloorModalComponent: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
}) => {
  const { data: floorDetail, isLoading } =
    useEntityQuery<FloorDetailResponseType>({
      keys: ["floor", data.id],
      params: { id: data.id },
      api: FloorApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<FloorDetailResponseType>();

  return (
    <Spin spinning={!floorDetail || isLoading}>
      {floorDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          initialValues={floorDetail}
          disabled
          className="modal__form split-2"
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
                className="modal__form-group-item multiple-2"
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
            </div>
          </div>
        </Form>
      )}
    </Spin>
  );
};

export default DetailFloorModalComponent;
