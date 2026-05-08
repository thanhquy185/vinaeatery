import type { FC } from "react";
import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { SalaryAdvanceType } from "../../../../common/types";
import { ModalLayout, SalaryAdvanceStatus } from "../../../../common/values";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdateSalaryAdvance } from "../../../../requests/salary-advances";
import { openConfirmation } from "../../../../utils/show-confirmation";
import { openNotification } from "../../../../utils/show-notification";
import dayjs from "dayjs";

// Manager Update Salary Advance
const ManagerUpdateSalaryAdvance: FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  data,
  dataForCrud,
  closeModal,
}) => {
  const [form] = Form.useForm<SalaryAdvanceType>();
  const updateMutation = useEntityMutation<SalaryAdvanceType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleUpdateSalaryAdvance,
  });
  const callApiToUpdateSalaryAdvance = async (
    id: number,
    button: HTMLElement,
    value: string,
  ) => {
    // Thêm class 'active' thể hiện là nút được nhấn
    button.classList.add("active");

    // Hỏi trước khi xử khi xử lý ?
    const answer = await openConfirmation({
      title: `Bạn có chắc chắn cập nhật ?`,
      content: "Hành động này không thể hoàn tác.",
    });
    if (answer) {
      // Kiểm tra người dùng hiện tại
      if (
        Number(form.getFieldValue("employeeHandleId")) !==
        dataForCrud?.infoLogin?.id
      ) {
        openNotification({
          type: "warning",
          message: "Cảnh báo",
          description:
            "Bạn không phải người tạo đơn này nên không thể cập nhật trạng thái!",
        });

        return;
      }

      // Biến giữ giá trị tương ứng với "trạng thái" cần thay đổi
      let status = null;
      if (
        value === SalaryAdvanceStatus.confirm ||
        value === SalaryAdvanceStatus.canceled
      ) {
        status = value;
      }

      // Thực thi mutation
      const response = await updateMutation.mutateAsync({
        values: {
          restaurantId: restaurantId,
          id: id,
          status: status! || undefined,
        },
      });
      if (response) {
        closeModal();
      }
    } else {
      // Xoá class 'active' thể hiện là nút không còn được nhấn
      button.classList.remove("active");
    }
  };

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        initialValues={{
          id: data?.id! || undefined,
          createAt: data?.createAt! || undefined,
          employeeHandleId: data?.employeeHandle?.id! || undefined,
          employeeHandle: data?.employeeHandle!
            ? "#" +
              data?.employeeHandle!.id +
              " - " +
              data?.employeeHandle!.fullname +
              " - " +
              data?.employeeHandle!.phone +
              " - " +
              data?.employeeHandle!.email
            : undefined,
          employeeMain: data?.employeeMain!
            ? "#" +
              data?.employeeMain!.id +
              " - " +
              data?.employeeMain!.fullname +
              " - " +
              data?.employeeMain!.phone +
              " - " +
              data?.employeeMain!.email
            : undefined,
          date: data?.date ? dayjs(data.date, "YYYY-MM-DD") : undefined,
          money: data?.money! || undefined,
          reason: data?.reason! || undefined,
          status: data?.status! || undefined,
        }}
        className="modal__form split-3"
        disabled
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
                <Input className="text-center" />
              </Form.Item>
              <Form.Item
                name="createAt"
                label={defaultLabels.createAt}
                className="modal__form-group-item"
              >
                <Input className="text-center" />
              </Form.Item>
            </div>
            <Form.Item
              name="status"
              label={defaultLabels.status}
              className="modal__form-group-item"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="date"
              label={defaultLabels.date}
              className={
                "modal__form-group-item"
              }
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              name="money"
              label={defaultLabels.money}
              className={
                "modal__form-group-item " +
                (data?.status !== SalaryAdvanceStatus.pending
                  ? "margin-bottom-0"
                  : "")
              }
            >
              <InputNumber />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="employeeHandle"
              label={defaultLabels.employeeHandle}
              className="modal__form-group-item multiple-2"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="employeeMain"
              label={defaultLabels.employeeMain}
              className="modal__form-group-item multiple-2"
            >
              <Select />
            </Form.Item>
            <Form.Item
              name="reason"
              label={defaultLabels.reason}
              className={
                "modal__form-group-item multiple-2 " +
                (data?.status !== SalaryAdvanceStatus.pending
                  ? "margin-bottom-0"
                  : "")
              }
            >
              <TextArea className="multiple-2" />
            </Form.Item>
          </div>
        </div>
        <div className="modal__buttons">
          {data?.status !== SalaryAdvanceStatus.confirm && (
            <button
              className="modal__button secondary btn green-secondary"
              onClick={(e) =>
                callApiToUpdateSalaryAdvance(
                  data?.id!,
                  e.target as HTMLElement,
                  SalaryAdvanceStatus.confirm,
                )
              }
            >
              {SalaryAdvanceStatus.confirm}
            </button>
          )}
          {data?.status !== SalaryAdvanceStatus.canceled && (
            <button
              className="modal__button secondary btn red-secondary"
              onClick={(e) =>
                callApiToUpdateSalaryAdvance(
                  data?.id!,
                  e.target as HTMLElement,
                  SalaryAdvanceStatus.canceled,
                )
              }
            >
              {SalaryAdvanceStatus.canceled}
            </button>
          )}
        </div>
      </Form>
    </>
  );
};

export default ManagerUpdateSalaryAdvance;
