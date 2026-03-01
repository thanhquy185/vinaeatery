import { Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type { CategoryTableType } from "../../../../common/types";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdateCategoryTable } from "../../../../requests/category-tables";
import { openConfirmation } from "../../../../utils/show-confirmation";
import {
  ModalAutoComplete,
  ModalLayout,
  CategoryTableSurchargeType,
} from "../../../../common/values";

// Manager Update CategoryTable
const ManagerUpdateCategoryTable: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  data,
  closeModal,
}) => {
  const [form] = Form.useForm<CategoryTableType>();
  const updateMutation = useEntityMutation<CategoryTableType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleUpdateCategoryTable,
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
          surchargeType: data?.surchargeType! || undefined,
          surchargeValue: data?.surchargeValue! || undefined,
          description: data?.description! || undefined,
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
              className="modal__form-group-item"
              rules={[ruleRequired("Tên loại bàn không được để trống!")]}
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
            <div className="modal__form-group-item-warper">
              <Form.Item
                name="surchargeType"
                label={defaultLabels.surchargeType}
                className="modal__form-group-item"
              >
                <Select
                  allowClear
                  placeholder={defaultInputs.surchargeType}
                  options={[
                    {
                      label: CategoryTableSurchargeType.percent,
                      value: CategoryTableSurchargeType.percent,
                    },
                    {
                      label: CategoryTableSurchargeType.fixed,
                      value: CategoryTableSurchargeType.fixed,
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="surchargeValue"
                label={defaultLabels.surchargeValue}
                className="modal__form-group-item"
              >
                <InputNumber
                  min={0}
                  placeholder={defaultInputs.surchargeValue}
                />
              </Form.Item>
            </div>
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

export default ManagerUpdateCategoryTable;
