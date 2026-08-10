import useEntityMutation from "../../../../hooks/useEntityMutation";
import CardInfoInModalComponent from "../../CardInfoInModalComponent";
import ReservationApiService from "../../../../services/api/v1/ReservationApiService";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import {
  ruleEmail,
  rulePhone,
  ruleRequired,
} from "../../../../constants/rules";
import {
  ModalAutoComplete,
  ModalLayout,
  ReservationStatusValue,
} from "../../../../constants/values";
import { DatePicker, Form, Input, InputNumber } from "antd";
import { openConfirmation } from "../../../../utils/showConfirmation";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { ReservationStatusEnum } from "../../../../constants/enums";
import type {
  ReservationCreateRequestType,
  ReservationDetailResponseType,
} from "../../../../types/ReservationType";

const CreateReservationModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  dataForCrud,
  closeModal,
}) => {
  const [form] = Form.useForm<ReservationCreateRequestType>();

  const createMutation = useEntityMutation<
    ReservationCreateRequestType,
    ReservationDetailResponseType
  >({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: ReservationApiService.handleCreate,
  });

  return (
    <>
      {restaurantId && dataForCrud && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          initialValues={{
            createAt: dayjs(),
            status: ReservationStatusValue.pending,
          }}
          className="modal__form split-3"
          onFinish={async () => {
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']",
            );

            submitButton?.classList.add("active");

            const answer = await openConfirmation({
              title: `Bạn có chắc chắn thêm ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              const values = form.getFieldsValue();

              const response = await createMutation.mutateAsync({
                values: {
                  ...values,
                  restaurantId: restaurantId,
                  employeeId: dataForCrud.infoLogin?.id!,
                  customerId: 1, // Mặc định vì đây là khách hàng ảo (Chưa có tài khoản trên hệ thống)
                  createAt: values.createAt
                    ? dayjs(values.createAt).format("YYYY-MM-DD HH:mm:ss")
                    : dayjs().format("YYYY-MM-DD HH:mm:s"),
                  arriveAt: values.arriveAt
                    ? dayjs(values.arriveAt).format("YYYY-MM-DD HH:mm:ss")
                    : dayjs().format("YYYY-MM-DD HH:mm:s"),
                  status:
                    ReservationStatusValue.pending as ReservationStatusEnum,
                },
              });
              if (response) {
                closeModal();
              }

              submitButton?.classList.remove("active");
            }

            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title1}</p>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
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
                  <Input disabled />
                </Form.Item>
              </div>
              <Form.Item
                name="employee"
                label={defaultLabels.employee}
                className="modal__form-group-item multiple-3"
              >
                <CardInfoInModalComponent
                  hasImage={true}
                  image={dataForCrud.infoLogin?.image}
                  fullname={dataForCrud.infoLogin?.fullname}
                  phone={dataForCrud.infoLogin?.phone}
                  email={dataForCrud.infoLogin?.email}
                  address={`${dataForCrud.infoLogin?.houseNumber}, ${dataForCrud.infoLogin?.streetName}, ${dataForCrud.infoLogin?.ward}, ${dataForCrud.infoLogin?.province}`}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="createAt"
                label={defaultLabels.createAt}
                className="modal__form-group-item"
                rules={[ruleRequired("Thời gian đặt bàn không được để trống!")]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={defaultInputs.createAt}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="arriveAt"
                label={defaultLabels.arriveAt}
                className="modal__form-group-item"
                rules={[ruleRequired("Thời gian dự kiến không được để trống!")]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={defaultInputs.arriveAt}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title2}</p>
            <div className="modal__form-group">
              <Form.Item
                name="customerFullname"
                label={defaultLabels.customerFullname}
                className="modal__form-group-item"
                rules={[ruleRequired("Họ và tên không được để trống!")]}
              >
                <Input placeholder={defaultInputs.customerFullname} />
              </Form.Item>
              <Form.Item
                name="customerPhone"
                label={defaultLabels.customerPhone}
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Số điện thoại không được để trống!"),
                  rulePhone(),
                ]}
              >
                <Input placeholder={defaultInputs.customerPhone} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="customerGuests"
                label={defaultLabels.customerGuests}
                className="modal__form-group-item"
                rules={[ruleRequired("Số lượng khách không được để trống!")]}
              >
                <InputNumber
                  min={1}
                  placeholder={defaultInputs.customerGuests}
                />
              </Form.Item>
              <Form.Item
                name="customerEmail"
                label={defaultLabels.customerEmail}
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Email không được để trống!"),
                  ruleEmail(),
                ]}
              >
                <Input placeholder={defaultInputs.customerEmail} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="customerNote"
                label={defaultLabels.customerNote}
                className="modal__form-group-item"
              >
                <TextArea
                  className="multiple-2"
                  placeholder={defaultInputs.customerNote}
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
      )}
    </>
  );
};

export default CreateReservationModalComponent;
