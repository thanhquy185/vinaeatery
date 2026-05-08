import { DatePicker, Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { InsuranceType } from "../../../../common/types";
import { ModalAutoComplete, ModalLayout } from "../../../../common/values";
import dayjs from "dayjs";
import TableInsurance from "./table-insurance";

// Manager Detail Insurance
const ManagerDetailInsurance: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
  dataForCrud,
}) => {
  // Form
  const [form] = Form.useForm<InsuranceType>();

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
        disabled
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
                <Input className="text-center" />
              </Form.Item>
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Select />
              </Form.Item>
            </div>
            <Form.Item
              name="name"
              label={defaultLabels.name}
              className="modal__form-group-item multiple-2"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="insuranceDetails"
              label={defaultLabels.insuranceDetails}
              className="modal__form-group-item multiple-3 margin-bottom-0"
            >
              <div className="has-employees">
                <TableInsurance
                  isDetail={true}
                  employees={dataForCrud?.employees || []}
                  categoryInsurances={dataForCrud?.categoryInsurances || []}
                  insuranceDetails={data?.insuranceDetails || []}
                  newInsuranceDetails={[]}
                  setNewInsuranceDetails={() => {}}
                />
              </div>
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="month"
              label={defaultLabels.month}
              className="modal__form-group-item"
            >
              <DatePicker picker="month" format="YYYY-MM" />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="note"
              label={defaultLabels.note}
              className="modal__form-group-item"
            >
              <TextArea className="multiple-2" />
            </Form.Item>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ManagerDetailInsurance;
