import useEntityMutation from "../../hooks/useEntityMutation";
import ReservationApiService from "../../services/api/v1/ReservationApiService";
import { List, Row, Col, Button, Typography } from "antd";
import {
  CloseCircleOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ReservationStatusValue } from "../../constants/values";
import { getStatusTag } from "../../pages/public/ReservationsPage";
import { openConfirmation } from "../../utils/showConfirmationUtil";
import type { Dispatch, SetStateAction } from "react";
import type { ReservationStatusEnum } from "../../constants/enums";
import type { PageResponseType } from "../../types/PageResponseType";
import type {
  ReservationCustomerResponseType,
  ReservationDetailResponseType,
  ReservationUpdateStatusRequestType,
} from "../../types/ReservationType";

type PublicReservationListComponentProps = {
  reservationData: PageResponseType<ReservationCustomerResponseType>;
  isLoading: boolean;
  setPage: Dispatch<SetStateAction<number>>;
  setSize: Dispatch<SetStateAction<number>>;
  setSelectedReservation: Dispatch<
    SetStateAction<ReservationCustomerResponseType | null>
  >;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

const PublicReservationListComponent: React.FC<
  PublicReservationListComponentProps
> = ({
  reservationData,
  isLoading,
  setPage,
  setSize,
  setSelectedReservation,
  setOpenModal,
}) => {
  const updateMutation = useEntityMutation<
    ReservationUpdateStatusRequestType,
    ReservationDetailResponseType
  >({
    messages: {
      success: `Huỷ đơn đặt bàn thành công!`,
      error: `Huỷ đơn đặt bàn thất bại!`,
    },
    invalidateKeys: [["reservations"]],
    api: ReservationApiService.handleCustomerUpdateStatus,
  });

  return (
    <List
      dataSource={reservationData?.content || []}
      loading={isLoading}
      pagination={{
        current: (reservationData?.number ?? 0) + 1,
        pageSize: reservationData?.size ?? 10,
        total: reservationData?.totalElements ?? 0,

        showSizeChanger: true,
        pageSizeOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

        showTotal: (total, range) =>
          `${range[0]}-${range[1]} trong tổng số ${total} bản ghi`,
        onChange: (page, pageSize) => {
          setPage(page);
          setSize(pageSize);
        },
      }}
      renderItem={(reservation) => (
        <List.Item
          style={{
            padding: 0,
            border: "none",
          }}
        >
          <Row
            gutter={8}
            style={{ width: "100%", alignItems: "center" }}
            className="public-reservation-restaurant"
          >
            <Col xs={24} md={10}>
              <Typography.Title
                level={5}
                style={{ margin: 0, fontWeight: 700 }}
              >
                {reservation.restaurant?.name}
              </Typography.Title>
              <Typography.Paragraph
                style={{
                  margin: "8px 0 0 0",
                  color: "#555",
                  fontSize: 16,
                }}
              >
                <CalendarOutlined style={{ marginRight: 8 }} />
                {reservation.arriveAt?.split(" ")[0]} lúc{" "}
                {reservation.arriveAt?.split(" ")[1]}
              </Typography.Paragraph>
            </Col>
            <Col xs={12} md={6} style={{ textAlign: "center" }}>
              <div style={{ marginBottom: 4 }}>
                {getStatusTag(reservation.status)}
              </div>
            </Col>
            <Col xs={12} md={8} style={{ display: "flex", gap: 10 }}>
              <Button
                variant="solid"
                color="blue"
                icon={<InfoCircleOutlined />}
                style={{ marginLeft: "auto" }}
                onClick={() => {
                  setSelectedReservation(reservation);
                  setOpenModal(true);
                }}
              >
                Chi tiết
              </Button>
              {reservation.status === ReservationStatusValue.pending && (
                <Button
                  variant="outlined"
                  color="red"
                  icon={<CloseCircleOutlined />}
                  onClick={async () => {
                    const answer = await openConfirmation({
                      title: `Bạn có chắc chắn huỷ đặt bàn ?`,
                      content: "Hành động này không thể hoàn tác.",
                    });
                    if (answer) {
                      const response = await updateMutation.mutateAsync({
                        values: {
                          id: reservation.id,
                          status:
                            ReservationStatusValue.cancelled as ReservationStatusEnum,
                        },
                      });
                      if (response) {
                      }
                    }
                  }}
                >
                  Hủy đặt
                </Button>
              )}
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

export default PublicReservationListComponent;
