import RestaurantLocationPickerComponent from "../RestaurantLocationPicker";
import { Button, Divider, Modal, Typography } from "antd";
import ReservationStatusTagComponent from "../public/ReservationStatusTagComponent";
import type { Dispatch, SetStateAction } from "react";
import type { ReservationCustomerResponseType } from "../../types/ReservationType";

type PublicReservationModalComponentProps = {
  selectedReservation: ReservationCustomerResponseType | null;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

const PublicReservationModalComponent: React.FC<
  PublicReservationModalComponentProps
> = ({ selectedReservation, openModal, setOpenModal }) => {
  return (
    <Modal
      open={openModal}
      title={
        <div className="pr-6">
          <div className="public-reservation-detail-modal__title font-bold text-stone-900">
            Chi tiết đặt bàn
          </div>
          {selectedReservation && (
            <div className="public-reservation-detail-modal__subtitle mt-1 font-medium text-stone-500">
              #{String(selectedReservation.id).padStart(6, "0")} · {selectedReservation.restaurant.name}
            </div>
          )}
        </div>
      }
      centered
      width={680}
      footer={null}
      className="public-reservation-detail-modal"
      onCancel={() => setOpenModal(false)}
    >
      {selectedReservation && (
        <>
          <Divider className="my-4!" />
          <div className="public-reservation-detail-summary">
            <div className="public-reservation-detail-summary__field">
              <Typography.Text className="public-reservation-detail-summary__label">
                Thời gian đặt bàn
              </Typography.Text>
              <div className="public-reservation-detail-summary__value">
                {selectedReservation.createAt}
              </div>
            </div>
            <div className="public-reservation-detail-summary__field">
              <Typography.Text className="public-reservation-detail-summary__label">
                Thời gian dự kiến
              </Typography.Text>
              <div className="public-reservation-detail-summary__value">
                {selectedReservation.arriveAt}
              </div>
            </div>
            <div className="public-reservation-detail-summary__field">
              <Typography.Text className="public-reservation-detail-summary__label">
                Số lượng khách
              </Typography.Text>
              <div className="public-reservation-detail-summary__value">
                {selectedReservation.customerGuests} khách
              </div>
            </div>
            <div className="public-reservation-detail-summary__field">
              <Typography.Text className="public-reservation-detail-summary__label">
                Trạng thái
              </Typography.Text>
              <div className="public-reservation-detail-summary__status">
                <ReservationStatusTagComponent status={selectedReservation.status} />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <Typography.Title level={5} className="mb-2!">
              Nhà hàng đã đặt
            </Typography.Title>
            <div className="public-reservation-detail-meta mb-3 grid gap-x-6 gap-y-1 text-sm text-stone-600 sm:grid-cols-2">
              <p className="m-0"><b>Điện thoại:</b> {selectedReservation.restaurant.phone}</p>
              <p className="m-0"><b>Email:</b> {selectedReservation.restaurant.email}</p>
              <p className="m-0 sm:col-span-2">
                <b>Địa chỉ:</b> {selectedReservation.restaurant.houseNumber}{" "}
                {selectedReservation.restaurant.streetName},{" "}
                {selectedReservation.restaurant.ward},{" "}
                {selectedReservation.restaurant.province}
              </p>
            </div>
            <RestaurantLocationPickerComponent
              key={selectedReservation.restaurant.id}
              type="detail"
              height={250}
              marginTop={6}
              isShowInfo={false}
              latitude={selectedReservation.restaurant.latitude}
              longitude={selectedReservation.restaurant.longitude}
            />
          </div>
          <div className="public-reservation-detail-customer-card rounded-2xl border border-stone-200 p-4 sm:p-5">
            <Typography.Title level={5} className="mb-3!">
              Thông tin bạn gửi
            </Typography.Title>
            <div className="public-reservation-detail-customer-info grid gap-x-6 gap-y-2 text-sm text-stone-600 sm:grid-cols-2">
              <p className="m-0"><b>Họ và tên:</b> {selectedReservation.customerFullname}</p>
              <p className="m-0"><b>Số điện thoại:</b> {selectedReservation.customerPhone}</p>
              <p className="m-0"><b>Email:</b> {selectedReservation.customerEmail}</p>
              <p className="m-0 sm:col-span-2"><b>Ghi chú:</b> {selectedReservation.customerNote || "Không có"}</p>
            </div>
          </div>
          <Divider className="my-4!" />
          <div className="flex justify-end">
            <Button onClick={() => setOpenModal(false)} type="primary" size="large">
              Đóng
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default PublicReservationModalComponent;
