import useEntityQuery from "../../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import TextArea from "antd/es/input/TextArea";
import FloorApiService from "../../../../services/api/v1/FloorApiService";
import { Form, Input, Select, Spin } from "antd";
import { ModalAutoComplete, ModalLayout } from "../../../../constants/values";
import { ruleRequired } from "../../../../constants/rules";
import { openConfirmation } from "../../../../utils/showConfirmation";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  FloorUpdateRequestType,
  FloorDetailResponseType,
} from "../../../../types/FloorType";

const UpdateFloorModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  data,
  closeModal,
}) => {
  const { data: floorDetail, isLoading } =
    useEntityQuery<FloorDetailResponseType>({
      keys: ["floor", data.id],
      params: { id: data.id },
      api: FloorApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<FloorDetailResponseType>();

  const updateMutation = useEntityMutation<
    FloorUpdateRequestType,
    FloorDetailResponseType
  >({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["floor", data.id]],
    api: FloorApiService.handleUpdate,
  });

  return (
    <Spin spinning={!floorDetail || isLoading}>
      {floorDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          initialValues={floorDetail}
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
                rules={[ruleRequired("Tên tầng không được để trống!")]}
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

export default UpdateFloorModalComponent;
