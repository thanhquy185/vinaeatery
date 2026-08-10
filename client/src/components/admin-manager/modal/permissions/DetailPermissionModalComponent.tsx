import useEntityQuery from "../../../../hooks/useEntityQuery2";
import TablePermissionDetailsComponent from "./TablePermissionDetailsComponent";
import PermissionApiService from "../../../../services/api/v1/PermissionApiService";
import { Form, Input, Select, Spin } from "antd";
import { ModalLayout } from "../../../../constants/values";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { PermissionDetailResponseType } from "../../../../types/PermissionType";

const DetailPermissionModalComponent: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
}) => {
  const { data: permissionDetail, isLoading } =
    useEntityQuery<PermissionDetailResponseType>({
      keys: ["permission", data.id],
      params: { id: data.id },
      api: PermissionApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<PermissionDetailResponseType>();

  return (
    <Spin spinning={!permissionDetail || isLoading}>
      {permissionDetail && (
        <Form
          key={permissionDetail.id}
          form={form}
          layout={ModalLayout}
          initialValues={permissionDetail}
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
                label={defaultLabels.permissionDetails}
                htmlFor="detail-permissionDetails"
                className="modal__form-group-item multiple-2 margin-bottom-0"
              >
                <TablePermissionDetailsComponent
                  type="detail"
                  data={permissionDetail.permissionDetails}
                />
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

export default DetailPermissionModalComponent;
