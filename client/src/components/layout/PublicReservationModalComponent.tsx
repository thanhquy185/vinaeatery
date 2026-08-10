import RestaurantLocationPickerComponent from "../RestaurantLocationPicker";
import { Button, Col, Divider, Modal, Row, Typography } from "antd";
import { getStatusTag } from "../../pages/public/ReservationsPage";
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
      title={<p className="text-4xl">Chi tiết đơn đặt bàn</p>}
      centered
      width={600}
      footer={null}
      style={{ borderRadius: 12 }}
      onCancel={() => setOpenModal(false)}
    >
      {selectedReservation && (
        <>
          <Divider />
          <Row style={{ marginBottom: 14 }}>
            <Col className="flex-1">
              <Typography.Paragraph
                strong
                style={{ marginBottom: 0, fontSize: 16 }}
              >
                Thời gian đặt bàn
              </Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 15 }}>
                {selectedReservation.createAt}
              </Typography.Paragraph>
            </Col>
            <Col className="flex-1">
              <Typography.Paragraph
                strong
                style={{ marginBottom: 0, fontSize: 16 }}
              >
                Thời gian dự kiến
              </Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 15 }}>
                {selectedReservation.arriveAt}
              </Typography.Paragraph>
            </Col>
          </Row>
          <Row style={{ marginBottom: 14 }}>
            <Col className="flex-1">
              <Typography.Paragraph
                strong
                style={{ marginBottom: 0, fontSize: 16 }}
              >
                Số lượng khách
              </Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 15 }}>
                {selectedReservation.customerGuests} khách
              </Typography.Paragraph>
            </Col>
            <Col className="flex-1">
              <Typography.Paragraph
                strong
                style={{ marginBottom: 0, fontSize: 16 }}
              >
                Trạng thái
              </Typography.Paragraph>
              <Typography.Paragraph style={{ fontSize: 15 }}>
                {getStatusTag(selectedReservation.status)}
              </Typography.Paragraph>
            </Col>
          </Row>
          <div style={{ marginBottom: 14 }}>
            <Typography.Paragraph
              strong
              style={{ marginBottom: 0, fontSize: 16 }}
            >
              Nhà hàng đã đặt
            </Typography.Paragraph>
            <Typography.Paragraph style={{ marginBottom: 0, fontSize: 15 }}>
              Tên nhà hàng: {selectedReservation.restaurant.name}
            </Typography.Paragraph>
            <Typography.Paragraph style={{ marginBottom: 0, fontSize: 15 }}>
              Số điện thoại: {selectedReservation.restaurant.phone}
            </Typography.Paragraph>
            <Typography.Paragraph style={{ marginBottom: 0, fontSize: 15 }}>
              Email: {selectedReservation.restaurant.email}
            </Typography.Paragraph>
            <Typography.Paragraph style={{ marginBottom: 0, fontSize: 15 }}>
              Địa chỉ: {selectedReservation.restaurant.houseNumber}{" "}
              {selectedReservation.restaurant.streetName},{" "}
              {selectedReservation.restaurant.ward},{" "}
              {selectedReservation.restaurant.province}
            </Typography.Paragraph>
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
          <div style={{ marginBottom: 14 }}>
            <Typography.Paragraph
              strong
              style={{ marginBottom: 0, fontSize: 16 }}
            >
              Thông tin bạn gửi
            </Typography.Paragraph>
            <Typography.Paragraph style={{ marginBottom: 0, fontSize: 15 }}>
              Họ và tên: {selectedReservation?.customerFullname}
            </Typography.Paragraph>
            <Typography.Paragraph style={{ marginBottom: 0, fontSize: 15 }}>
              Số điện thoại: {selectedReservation?.customerPhone}
            </Typography.Paragraph>
            <Typography.Paragraph style={{ marginBottom: 0, fontSize: 15 }}>
              Email: {selectedReservation?.customerEmail}
            </Typography.Paragraph>
            <Typography.Paragraph style={{ marginBottom: 0, fontSize: 15 }}>
              Ghi chú: {selectedReservation?.customerNote}
            </Typography.Paragraph>
          </div>
          <Divider />
          <div style={{ textAlign: "right", marginTop: 6 }}>
            <Button onClick={() => setOpenModal(false)} type="primary">
              Đóng
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default PublicReservationModalComponent;
