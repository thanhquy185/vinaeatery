import { Form, Input, Select, Space } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleEmail, rulePhone, ruleRequired } from "../../../../common/rules";
import type { SupplierType } from "../../../../common/types";
import { ModalAutoComplete, ModalLayout } from "../../../../common/values";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdateSupplier } from "../../../../requests/suppliers";
import { showCreateValidAddress } from "../../../../services/showCreateValidAddress";
import { openConfirmation } from "../../../../utils/show-confirmation";

// Manager Update Supplier
const ManagerUpdateSupplier: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  data,
  closeModal,
}) => {
  const [form] = Form.useForm<SupplierType>();
  const updateMutation = useEntityMutation<SupplierType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleUpdateSupplier,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        initialValues={{
          id: data?.id! || undefined,
          name: data?.name! || undefined,
          phone: data?.phone! || undefined,
          email: data?.email! || undefined,
          address: data?.address! || undefined,
          status: data?.status! || undefined,
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
              values: { ...values, restaurantId: restaurantId },
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
            >
              <Select disabled />
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
          <button type="submit" className="modal__button btn update">
            Xác nhận
          </button>
        </div>
      </Form>
    </>
  );
};

export default ManagerUpdateSupplier;
