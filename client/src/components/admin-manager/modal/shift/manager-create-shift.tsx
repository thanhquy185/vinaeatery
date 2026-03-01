import { useEffect, useState } from "react";
import { Form, Input, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type { ShiftType } from "../../../../common/types";
import {
  CommonStatus,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../common/values";
import CustomTimetable from "../../common/timetable";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleCreateShift } from "../../../../requests/shifts";
import { cellsToShifts } from "../../../../utils/timetable";
import { openConfirmation } from "../../../../utils/show-confirmation";

// Manager Create Shift
const ManagerCreateShift: React.FC<CrudObjectModalProps> = ({
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
  const createMutation = useEntityMutation<ShiftType>({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleCreateShift,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
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
            const response = await createMutation.mutateAsync({
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
                <Input
                  placeholder={defaultInputs.id}
                  className="text-center"
                  disabled
                />
              </Form.Item>
              <Form.Item
                name="status"
                label={defaultLabels.status}
                htmlFor="create-status"
                className="modal__form-group-item"
                rules={[ruleRequired("Cần chọn Trạng thái!")]}
              >
                <Select
                  allowClear
                  id="create-status"
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
              htmlFor="create-name"
              label={defaultLabels.name}
              className="modal__form-group-item multiple-2"
              rules={[ruleRequired("Tên ca làm không được để trống!")]}
            >
              <Input id="create-name" placeholder={defaultInputs.name} />
            </Form.Item>
          </div>
          <div className="modal__form-group"></div>
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

export default ManagerCreateShift;
