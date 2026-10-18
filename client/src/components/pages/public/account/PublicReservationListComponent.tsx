import useEntityMutation from "../../../../hooks/useEntityMutation";
import ReservationApiService from "../../../../services/api/v1/ReservationApiService";
import ReservationStatusTagComponent from "../../../shared/ReservationStatusTagComponent";
import { ReservationStatusValue } from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmationUtil";
import { Button, Empty, List, Typography } from "antd";
import { CalendarDays, Clock3, MapPin, UsersRound, X } from "lucide-react";
import dayjs from "dayjs";
import type { Dispatch, SetStateAction } from "react";
import type { ReservationStatusEnum } from "../../../../constants/enums";
import type { PageResponseType } from "../../../../types/PageResponseType";
import type {
  ReservationCustomerResponseType,
  ReservationDetailResponseType,
  ReservationUpdateStatusRequestType,
} from "../../../../types/ReservationType";

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
      success: "Huỷ đơn đặt bàn thành công!",
      error: "Huỷ đơn đặt bàn thất bại!",
    },
    invalidateKeys: [["reservations"]],
    api: ReservationApiService.handleCustomerUpdateStatus,
  });

  return (
    <List
      className="public-reservation-list"
      dataSource={reservationData?.content || []}
      loading={isLoading}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span>Bạn chưa có lịch đặt bàn phù hợp.</span>
            }
          />
        ),
      }}
      pagination={
        (reservationData?.totalElements ?? 0) > 0
          ? {
              current: (reservationData?.number ?? 0) + 1,
              pageSize: reservationData?.size ?? 5,
              total: reservationData?.totalElements ?? 0,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 15, 20],
              showTotal: (total, range) =>
                `${range[0]}–${range[1]} / ${total} lịch đặt`,
              onChange: (nextPage, pageSize) => {
                setPage(nextPage);
                setSize(pageSize);
              },
            }
          : false
      }
      renderItem={(reservation) => {
        const arriveAt = dayjs(reservation.arriveAt);
        const restaurantAddress = [
          reservation.restaurant?.houseNumber,
          reservation.restaurant?.streetName,
          reservation.restaurant?.ward,
          reservation.restaurant?.province,
        ]
          .filter(Boolean)
          .join(", ");

        return (
          <List.Item className="public-reservation-list__item">
            <article className="public-reservation-row">
              <div className="public-reservation-date">
                <span className="public-reservation-date__month">
                  {arriveAt.isValid() ? `Tháng ${arriveAt.format("MM")}` : "Ngày"}
                </span>
                <span className="public-reservation-date__day">
                  {arriveAt.isValid() ? arriveAt.format("DD") : "—"}
                </span>
              </div>

              <div className="public-reservation-info">
                <div className="public-reservation-info__title-row">
                  <Typography.Title
                    level={5}
                    className="public-reservation-info__title"
                  >
                    {reservation.restaurant?.name || "Nhà hàng"}
                  </Typography.Title>
                  <ReservationStatusTagComponent status={reservation.status} />
                </div>
                <Typography.Text type="secondary" className="public-reservation-info__code">
                  Mã đặt bàn #{String(reservation.id).padStart(6, "0")}
                </Typography.Text>

                <div className="public-reservation-info__facts">
                  <span>
                    <Clock3 size={15} />
                    {arriveAt.isValid() ? arriveAt.format("HH:mm") : "Chưa xác định"}
                  </span>
                  <span>
                    <UsersRound size={15} />
                    {reservation.customerGuests} khách
                  </span>
                </div>
                {restaurantAddress && (
                  <div className="public-reservation-info__address">
                    <MapPin size={15} />
                    <span>{restaurantAddress}</span>
                  </div>
                )}
              </div>

              <div className="public-reservation-actions">
                <Button
                  type="text"
                  className="public-reservation-actions__detail"
                  icon={<CalendarDays size={15} />}
                  onClick={() => {
                    setSelectedReservation(reservation);
                    setOpenModal(true);
                  }}
                >
                  Chi tiết
                </Button>
                {reservation.status === ReservationStatusValue.pending && (
                  <Button
                    type="text"
                    danger
                    className="public-reservation-actions__cancel"
                    icon={<X size={15} />}
                    loading={updateMutation.isPending}
                    onClick={async () => {
                      const answer = await openConfirmation({
                        title: "Bạn có chắc chắn muốn hủy đặt bàn?",
                        content: "Hành động này không thể hoàn tác.",
                      });
                      if (answer) {
                        await updateMutation.mutateAsync({
                          values: {
                            id: reservation.id,
                            status: ReservationStatusValue.cancelled as ReservationStatusEnum,
                          },
                        });
                      }
                    }}
                  >
                    Hủy đặt
                  </Button>
                )}
              </div>
            </article>
          </List.Item>
        );
      }}
    />
  );
};

export default PublicReservationListComponent;
