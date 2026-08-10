import useEntityQuery from "../../../../hooks/useEntityQuery2";
import TextArea from "antd/es/input/TextArea";
import TableApiService from "../../../../services/api/v1/TableApiService";
import { Form, Input, InputNumber, Select, Spin } from "antd";
import { ModalLayout } from "../../../../constants/values";
import {
  inputNumberFormatter,
  inputNumberParse,
} from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { TableDetailResponseType } from "../../../../types/TableType";

const DetailTableModalComponent: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
}) => {
  const { data: tableDetail, isLoading } =
    useEntityQuery<TableDetailResponseType>({
      keys: ["table", data.id],
      params: { id: data.id },
      api: TableApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<TableDetailResponseType>();

  return (
    <Spin spinning={!tableDetail || isLoading}>
      {tableDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          initialValues={{
            ...tableDetail,
            floor: `#${tableDetail.floor.id} - ${tableDetail.floor.name}`,
            categoryTable: `#${tableDetail.categoryTable.id} - ${tableDetail.categoryTable.name}`,
          }}
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
                name="categoryTable"
                label={defaultLabels.categoryTable}
                className="modal__form-group-item"
              >
                <Select />
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
              <Form.Item
                name="seats"
                label={defaultLabels.seats}
                className="modal__form-group-item"
              >
                <InputNumber
                  formatter={(value) => inputNumberFormatter(value)}
                  parser={(value) => inputNumberParse(value)}
                />
              </Form.Item>
              <Form.Item
                name="floor"
                label={defaultLabels.floor}
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

export default DetailTableModalComponent;
