import useEntityQuery from "../../../../hooks/useEntityQuery2";
import RoleApiService from "../../../../services/api/v1/RoleApiService";
import { Form, Input, InputNumber, Select, Spin } from "antd";
import { ModalLayout } from "../../../../constants/values";
import {
  inputNumberFormatter,
  inputNumberParse,
} from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { RoleDetailResponseType } from "../../../../types/RoleType";

const DetailRoleModalComponent: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
}) => {
  const { data: roleDetail, isLoading } =
    useEntityQuery<RoleDetailResponseType>({
      keys: ["role", data.id],
      params: { id: data.id },
      api: RoleApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<RoleDetailResponseType>();

  return (
    <Spin spinning={!roleDetail || isLoading}>
      {roleDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          initialValues={roleDetail}
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
                className="modal__form-group-item multiple-2"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="salaryType"
                label={defaultLabels.salaryType}
                className="modal__form-group-item margin-bottom-0"
              >
                <Select />
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
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              <Form.Item
                name="salaryValue"
                label={defaultLabels.salaryValue}
                className="modal__form-group-item margin-bottom-0"
              >
                <InputNumber
                  formatter={(value) => inputNumberFormatter(value)}
                  parser={(value) => inputNumberParse(value)}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      )}
    </Spin>
  );
};

export default DetailRoleModalComponent;
