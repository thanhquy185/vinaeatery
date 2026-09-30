import useEntityQuery from "../../../../hooks/useEntityQuery2";
import TextArea from "antd/es/input/TextArea";
import CardInfoInModalComponent from "../../CardInfoInModalComponent";
import ReservationApiService from "../../../../services/api/v1/ReservationApiService";
import dayjs from "dayjs";
import { DatePicker, Form, Input, InputNumber, Spin } from "antd";
import { ModalLayout } from "../../../../constants/values";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { ReservationDetailResponseType } from "../../../../types/ReservationType";

const DetailReservationModalComponent: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
}) => {
  const { data: reservationDetail, isLoading } =
    useEntityQuery<ReservationDetailResponseType>({
      keys: ["reservation", data.id],
      params: { id: data.id },
      api: ReservationApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<ReservationDetailResponseType>();

  return (
    <Spin spinning={!reservationDetail || isLoading}>
      {reservationDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          initialValues={{
            ...reservationDetail,
            createAt: dayjs(reservationDetail.createAt),
            arriveAt: dayjs(reservationDetail.arriveAt),
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
                  <Input />
                </Form.Item>
              </div>
              <Form.Item
                name="employee"
                label={defaultLabels.employee}
                className="modal__form-group-item multiple-3"
              >
                {reservationDetail.employee ? (
                  <CardInfoInModalComponent
                    hasImage={true}
                    image={reservationDetail.employee.imageUrl}
                    fullname={reservationDetail.employee.fullname}
                    phone={reservationDetail.employee.phone}
                    email={reservationDetail.employee.email}
                    address={`${reservationDetail.employee.houseNumber}, ${reservationDetail.employee.streetName}, ${reservationDetail.employee.ward}, ${reservationDetail.employee.province}`}
                  />
                ) : (
                  <CardInfoInModalComponent
                    hasImage={true}
                    image={undefined}
                    fullname={undefined}
                    phone={undefined}
                    email={undefined}
                    address={undefined}
                  />
                )}
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="createAt"
                label={defaultLabels.createAt}
                className="modal__form-group-item"
              >
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="arriveAt"
                label={defaultLabels.arriveAt}
                className="modal__form-group-item"
              >
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
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
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="customerPhone"
                label={defaultLabels.customerPhone}
                className="modal__form-group-item margin-bottom-0"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="customerGuests"
                label={defaultLabels.customerGuests}
                className="modal__form-group-item"
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                name="customerEmail"
                label={defaultLabels.customerEmail}
                className="modal__form-group-item margin-bottom-0"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="customerNote"
                label={defaultLabels.customerNote}
                className="modal__form-group-item margin-bottom-0"
              >
                <TextArea className="multiple-2" />
              </Form.Item>
            </div>
          </div>
        </Form>
      )}
    </Spin>
  );
};

export default DetailReservationModalComponent;
