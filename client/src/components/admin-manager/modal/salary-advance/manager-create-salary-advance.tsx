import type { FC } from "react";
import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { SalaryAdvanceType } from "../../../../common/types";
import {
  ModalAutoComplete,
  ModalLayout,
  SalaryAdvanceStatus,
} from "../../../../common/values";
import { ruleRequired } from "../../../../common/rules";
import ConfigVN from "../../../common/config-vn";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleCreateSalaryAdvance } from "../../../../requests/salary-advances";
import { openConfirmation } from "../../../../utils/show-confirmation";
import dayjs from "dayjs";

// Manager Create Salary Advances
const ManagerCreateSalaryAdvance: FC<CrudObjectModalProps> = ({
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
  const createMutation = useEntityMutation<SalaryAdvanceType>({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleCreateSalaryAdvance,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        initialValues={{
          createAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          employeeHandle:
            "#" +
            dataForCrud?.infoLogin!.id +
            " - " +
            dataForCrud?.infoLogin!.fullname +
            " - " +
            dataForCrud?.infoLogin!.phone +
            " - " +
            dataForCrud?.infoLogin!.email,
          status: SalaryAdvanceStatus.pending,
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
            const response = await createMutation.mutateAsync({
              values: {
                ...values,
                restaurantId: restaurantId,
                employeeHandleId: dataForCrud?.infoLogin?.id,
                employeeMainId: values.employeeMainId || undefined,
                date:
                  values?.date && dayjs(values?.date).isValid()
                    ? dayjs(values?.date).format("YYYY-MM-DD")
                    : undefined,
                money: values.money || undefined,
                reason: values.reason || undefined,
                status: values.status || undefined,
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
                name="createAt"
                label={defaultLabels.createAt}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled />
              </Form.Item>
            </div>
            <Form.Item
              name="status"
              label={defaultLabels.status}
              className="modal__form-group-item"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="date"
              label={defaultLabels.date}
              className="modal__form-group-item"
              rules={[ruleRequired("Cần chọn Ngày!")]}
            >
              <DatePicker allowClear placeholder={defaultInputs.date} />
            </Form.Item>
            <Form.Item
              name="money"
              label={defaultLabels.money}
              className="modal__form-group-item"
              rules={[ruleRequired("Cần nhập Số tiền!")]}
            >
              <InputNumber min={0} placeholder={defaultInputs.money} />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="employeeHandle"
              label={defaultLabels.employeeHandle}
              className="modal__form-group-item multiple-2"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="employeeMainId"
              label={defaultLabels.employeeMain}
              className="modal__form-group-item multiple-2"
              rules={[
                ruleRequired("Nhân viên thưởng - phạt không được để trống!"),
              ]}
            >
              <Select
                allowClear
                showSearch
                placeholder={defaultInputs.employeeMain}
                options={dataForCrud?.employees?.map((employeeMain) => ({
                  label: `#${employeeMain?.id} - ${employeeMain?.fullname} - ${employeeMain?.phone} - ${employeeMain?.email}`,
                  value: employeeMain?.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              name="reason"
              label={defaultLabels.reason}
              className="modal__form-group-item multiple-2"
              rules={[ruleRequired("Lý do không được để trống!")]}
            >
              <TextArea
                placeholder={defaultInputs.reason}
                className="multiple-2"
              />
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

export default ManagerCreateSalaryAdvance;
