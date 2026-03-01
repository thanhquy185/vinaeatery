import { useEffect, useState } from "react";
import { Form, Input, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type { ShiftType } from "../../../../common/types";
import { ModalAutoComplete, ModalLayout } from "../../../../common/values";
import CustomTimetable from "../../common/timetable";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdateShift } from "../../../../requests/shifts";
import { openConfirmation } from "../../../../utils/show-confirmation";
import { cellsToShifts, shiftsToCells } from "../../../../utils/timetable";

// Manager Update Shift
const ManagerUpdateShift: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  data,
  restaurantId,
  closeModal,
}) => {
  const [form] = Form.useForm<ShiftType>();
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const updateMutation = useEntityMutation<ShiftType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleUpdateShift,
  });

  useEffect(() => {
    setSelectedCells(shiftsToCells(data?.shiftDetails));
  }, []);

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        initialValues={{
          id: data?.id || undefined,
          name: data?.name || undefined,
          status: data?.status || undefined,
        }}
        className="modal__form split-3"
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
            const response = await updateMutation.mutateAsync({
              values: {
                ...values,
                restaurantId: restaurantId,
                shiftDetails: cellsToShifts(selectedCells)! || undefined,
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
            <div className="modal__form-group-item-warper split-2">
              <Form.Item
                name="id"
                label={defaultLabels.id}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled />
              </Form.Item>
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Select disabled />
              </Form.Item>
            </div>
            <Form.Item
              // name="shiftDetails"
              label={defaultLabels.shiftDetails}
              className="modal__form-group-item multiple-3"
              // rules={[ruleRequired("Thời gian làm việc không được để trống!")]}
            >
              <CustomTimetable
                viewMode="week"
                cells={selectedCells}
                setCells={setSelectedCells}
              />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="name"
              htmlFor="update-name"
              label={defaultLabels.name}
              className="modal__form-group-item multiple-2"
              rules={[ruleRequired("Tên ca làm không được để trống!")]}
            >
              <Input id="update-name" placeholder={defaultInputs.name} />
            </Form.Item>
          </div>
          <div className="modal__form-group"></div>
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

export default ManagerUpdateShift;
