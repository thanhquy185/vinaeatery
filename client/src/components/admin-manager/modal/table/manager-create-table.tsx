import { Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type { TableType } from "../../../../common/types";
import {
  CommonStatus,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../common/values";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleCreateTable } from "../../../../requests/tables";
import { openConfirmation } from "../../../../utils/show-confirmation";

// Manager Create Table
const ManagerCreateTable: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  dataForCrud,
  closeModal,
}) => {
  const [form] = Form.useForm<TableType>();
  const createMutation = useEntityMutation<TableType>({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleCreateTable,
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
              name="id"
              label={defaultLabels.id}
              className="modal__form-group-item"
            >
              <Input
                className="text-center"
                placeholder={defaultInputs.id}
                disabled
              />
            </Form.Item>
            <Form.Item
              name="categoryTableId"
              label={defaultLabels.categoryTable}
              className="modal__form-group-item"
              rules={[ruleRequired("Loại bàn không được để trống!")]}
            >
              <Select
                showSearch
                allowClear
                placeholder={defaultInputs.categoryTable}
                options={dataForCrud?.categoryTables?.map((categoryTable) => ({
                  label: "#" + categoryTable.id + " - " + categoryTable.name,
                  value: categoryTable.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              name="name"
              label={defaultLabels.name}
              className="modal__form-group-item"
              rules={[ruleRequired("Tên bàn không được để trống!")]}
            >
              <Input placeholder={defaultInputs.name} />
            </Form.Item>
            <Form.Item
              name="description"
              label={defaultLabels.description}
              className="modal__form-group-item multiple-2"
            >
              <TextArea
                placeholder={defaultInputs.description}
                className="multiple-2"
              />
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
            <Form.Item
              name="floorId"
              label={defaultLabels.floor}
              className="modal__form-group-item"
              rules={[ruleRequired("Tầng không được để trống!")]}
            >
              <Select
                showSearch
                allowClear
                placeholder={defaultInputs.floor}
                options={dataForCrud?.floors?.map((floor) => ({
                  label: "#" + floor.id + " - " + floor.name,
                  value: floor.id,
                }))}
                className="floors"
              />
            </Form.Item>
            <Form.Item
              name="seats"
              label={defaultLabels.seats}
              className="modal__form-group-item"
              rules={[ruleRequired("Số chỗ ngồi không được để trống!")]}
            >
              <InputNumber min={1} placeholder={defaultInputs.seats} />
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

export default ManagerCreateTable;
