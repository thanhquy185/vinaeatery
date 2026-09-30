import useEntityQuery from "../../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import TextArea from "antd/es/input/TextArea";
import CardInfoInModalComponent from "../../CardInfoInModalComponent";
import ReservationApiService from "../../../../services/api/v1/ReservationApiService";
import dayjs from "dayjs";
import { DatePicker, Form, Input, InputNumber, Spin } from "antd";
import {
  ModalAutoComplete,
  ModalLayout,
  ReservationStatusValue,
} from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmationUtil";
import { openNotification } from "../../../../utils/showNotificationUtil";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { ReservationStatusEnum } from "../../../../constants/enums";
import type {
  ReservationDetailResponseType,
  ReservationUpdateStatusRequestType,
} from "../../../../types/ReservationType";

const UpdateReservationModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  data,
  dataForCrud,
  closeModal,
}) => {
  const { data: reservationDetail, isLoading } =
    useEntityQuery<ReservationDetailResponseType>({
      keys: ["reservation", data.id],
      params: { id: data.id },
      api: ReservationApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<ReservationUpdateStatusRequestType>();

  const updateMutation = useEntityMutation<
    ReservationUpdateStatusRequestType,
    ReservationDetailResponseType
  >({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["reservation", data.id]],
    api: ReservationApiService.handleUpdateStatus,
  });

  // Hàm gọi API để cập nhật trạng thái Hoá đơn
  const callApiToUpdateOrderTable = async (
    id: number,
    button: HTMLElement,
    value: string,
  ) => {
    button.classList.add("active");

    const answer = await openConfirmation({
      title: `Bạn có chắc chắn cập nhật ?`,
      content: "Hành động này không thể hoàn tác.",
    });
    if (answer) {
      // Kiểm tra người dùng hiện tại
      if (
        reservationDetail?.employee &&
        reservationDetail?.employee.id !== dataForCrud?.infoLogin?.id
      ) {
        openNotification({
          type: "warning",
          message: "Cảnh báo",
          description:
            "Bạn không phải người tạo đơn này nên không thể cập nhật trạng thái!",
        });

        return;
      }

      const response = await updateMutation.mutateAsync({
        values: {
          id: id,
          employeeId: !reservationDetail?.employee
            ? dataForCrud?.infoLogin?.id
            : undefined,
          status: value as ReservationStatusEnum,
        },
      });
      if (response) {
        closeModal();
      }
    }
    button.classList.remove("active");
  };

  return (
    <Spin spinning={!reservationDetail || isLoading}>
      {reservationDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
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
                className={
                  "modal__form-group-item" +
                  (reservationDetail.status !== ReservationStatusValue.pending
                    ? " margin-bottom-0"
                    : "")
                }
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
                className={
                  "modal__form-group-item" +
                  (reservationDetail.status !== ReservationStatusValue.pending
                    ? " margin-bottom-0"
                    : "")
                }
              >
                <Input />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="customerNote"
                label={defaultLabels.customerNote}
                className={
                  "modal__form-group-item" +
                  (reservationDetail.status !== ReservationStatusValue.pending
                    ? " margin-bottom-0"
                    : "")
                }
              >
                <TextArea className="multiple-2" />
              </Form.Item>
            </div>
          </div>
          {data?.status === ReservationStatusValue.pending && (
            <div className="modal__buttons">
              <>
                <button
                  className="modal__button secondary btn green-secondary"
                  onClick={(e) =>
                    callApiToUpdateOrderTable(
                      data?.id!,
                      e.target as HTMLElement,
                      ReservationStatusValue.confirmed,
                    )
                  }
                >
                  {ReservationStatusValue.confirmed}
                </button>
                <button
                  className="modal__button secondary btn red-secondary"
                  onClick={(e) =>
                    callApiToUpdateOrderTable(
                      data?.id!,
                      e.target as HTMLElement,
                      ReservationStatusValue.cancelled,
                    )
                  }
                >
                  {ReservationStatusValue.cancelled}
                </button>
              </>
            </div>
          )}
        </Form>
      )}
    </Spin>
  );
};

export default UpdateReservationModalComponent;
