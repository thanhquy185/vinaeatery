import { useState } from "react";
import { DatePicker, Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type {
  InsuranceDetailType,
  InsuranceType,
} from "../../../../common/types";
import { ModalAutoComplete, ModalLayout } from "../../../../common/values";
import TableInsurance from "./table-insurance";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdateInsurance } from "../../../../requests/insurances";
import { openConfirmation } from "../../../../utils/show-confirmation";
import dayjs from "dayjs";

// Manager Update Insurance
const ManagerUpdateInsurance: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  data,
  dataForCrud,
  restaurantId,
  closeModal,
}) => {
  // Form
  const [form] = Form.useForm<InsuranceType>();
  // State
  const [newInsuranceDetails, setNewInsuranceDetails] = useState<
    InsuranceDetailType[]
  >(data.insuranceDetails);
  // Mutation
  const updateMutation = useEntityMutation<InsuranceType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleUpdateInsurance,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        initialValues={{
          id: data?.id || undefined,
          name: data?.name || undefined,
          month: data?.month ? dayjs(data.month, "YYYY-MM") : undefined,
          note: data?.note || undefined,
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
                month:
                  values?.month && dayjs(values?.month).isValid()
                    ? dayjs(values?.month).format("YYYY-MM")
                    : undefined,
                insuranceDetails: newInsuranceDetails || [],
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
          <p className="modal__form-group-title">{defaultLabels.title1}</p>
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
                className="modal__form-group-item"
              >
                <Select disabled />
              </Form.Item>
            </div>
            <Form.Item
              name="name"
              label={defaultLabels.name}
              className="modal__form-group-item multiple-2"
              rules={[ruleRequired("Tên ca làm không được để trống!")]}
            >
              <Input placeholder={defaultInputs.name} />
            </Form.Item>
            <Form.Item
              name="insuranceDetails"
              label={defaultLabels.insuranceDetails}
              className="modal__form-group-item multiple-3"
            >
              <div className="has-employees">
                <TableInsurance
                  employees={dataForCrud?.employees || []}
                  categoryInsurances={dataForCrud?.categoryInsurances || []}
                  // insuranceDetails={data?.insuranceDetails || []}
                  newInsuranceDetails={newInsuranceDetails}
                  setNewInsuranceDetails={setNewInsuranceDetails}
                />
              </div>
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="month"
              label={defaultLabels.month}
              className="modal__form-group-item"
              rules={[ruleRequired("Cần chọn Tháng!")]}
            >
              <DatePicker
                picker="month"
                format="YYYY-MM"
                placeholder={defaultInputs.month}
                disabledDate={(current) => {
                  if (!current) return false;

                  const disabledMonths =
                    dataForCrud?.insuranceMonthIsActives || [];

                  return disabledMonths.includes(current.format("YYYY-MM"));
                }}
              />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="note"
              label={defaultLabels.note}
              className="modal__form-group-item"
            >
              <TextArea
                placeholder={defaultInputs.note}
                className="multiple-2"
              />
            </Form.Item>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn update">
              Xác nhận
            </button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ManagerUpdateInsurance;
