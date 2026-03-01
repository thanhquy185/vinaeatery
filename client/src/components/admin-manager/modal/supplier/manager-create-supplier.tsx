import { Form, Input, Select, Space } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleEmail, rulePhone, ruleRequired } from "../../../../common/rules";
import type { SupplierType } from "../../../../common/types";
import {
  CommonStatus,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../common/values";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleCreateSupplier } from "../../../../requests/suppliers";
import { showCreateValidAddress } from "../../../../services/showCreateValidAddress";
import { openConfirmation } from "../../../../utils/show-confirmation";

// Manager Create Supplier
const ManagerCreateSupplier: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  closeModal,
}) => {
  const [form] = Form.useForm<SupplierType>();
  const createMutation = useEntityMutation<SupplierType>({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleCreateSupplier,
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
                ...values,
                restaurantId: restaurantId,
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
              label={defaultLabels.id}
              className="modal__form-group-item"
            >
              <Input
                className="text-center"
                value={defaultInputs.id}
                disabled
              />
            </Form.Item>
            <Form.Item
              name="name"
              label={defaultLabels.name}
              className="modal__form-group-item multiple-2"
              rules={[ruleRequired("Tên nhà cung cấp không được để trống!")]}
            >
              <Input placeholder={defaultInputs.name} />
            </Form.Item>
            <Form.Item
              name="phone"
              label={defaultLabels.phone}
              className="modal__form-group-item"
              rules={[rulePhone()]}
            >
              <Input placeholder={defaultInputs.phone} />
            </Form.Item>
            <Form.Item
              label={defaultLabels.address}
              className="modal__form-group-item multiple-2"
            >
              <Space.Compact>
                <Form.Item name="address" noStyle>
                  <Input placeholder={defaultInputs.address} />
                </Form.Item>
                <button
                  type="button"
                  className="btn secondary-btn"
                  onClick={async () => {
                    const result = await showCreateValidAddress();
                    if (result) {
                      const { houseNumberAndStreetName, province, ward } =
                        result;

                      form.setFieldsValue({
                        address: `${houseNumberAndStreetName}, ${ward}, ${province}`,
                      });
                    }
                  }}
                >
                  Tạo địa chỉ
                </button>
              </Space.Compact>
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="status"
              label={defaultLabels.status}
              className="modal__form-group-item"
              rules={[ruleRequired("Trạng thái không được để trống!")]}
            >
              <Select
                allowClear
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
            <Form.Item label="." className="modal__form-group-item hidden">
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label={defaultLabels.email}
              className="modal__form-group-item"
              rules={[ruleEmail()]}
            >
              <Input placeholder={defaultInputs.email} />
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

export default ManagerCreateSupplier;
