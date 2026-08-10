import useEntityQuery from "../../../../../hooks/useEntityQuery2";
import ReservationApiService from "../../../../../services/api/v1/ReservationApiService";
import dayjs from "dayjs";
import { useState } from "react";
import { Divider, List } from "antd";
import {
  ClockCheck,
  ClockPlus,
  ListOrdered,
  Mail,
  NotebookPen,
  Phone,
  User,
} from "lucide-react";
import {
  ImageSourcePath,
  ReservationStatusValue,
  UseTableStatusValue,
} from "../../../../../constants/values";
import { openNotification } from "../../../../../utils/showNotification";
import type { ManagerHandleUpdateStatusUseTableProps } from "../../../../../constants/props";
import type { PageResponseType } from "../../../../../types/PageResponseType";
import type { ReservationSummaryResponseType } from "../../../../../types/ReservationType";

const EmptyHandleReservedComponent: React.FC<
  ManagerHandleUpdateStatusUseTableProps
> = ({ restaurantId, useTableId, callApiToUpdateUseTable, clickBack }) => {
  // Ngày hiện tại
  const currentDateString = dayjs().format("YYYY-MM-DD");

  // Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(3);
  // Đơn đặt bàn được chọn
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationSummaryResponseType | null>(null);

  // Dữ liệu đơn đặt bàn
  const { data: reservationData, isLoading } = useEntityQuery<
    PageResponseType<ReservationSummaryResponseType>
  >({
    keys: [
      "reservations",
      restaurantId,
      page,
      size,
      `${currentDateString} 00:00:00`,
      `${currentDateString} 23:59:59`,
      ReservationStatusValue.confirmed,
    ],
    params: {
      restaurantId: restaurantId,
      page: page,
      size: size,
      arriveAtValue: [
        `${currentDateString} 00:00:00`,
        `${currentDateString} 23:59:59`,
      ],
      statusValue: [ReservationStatusValue.confirmed],
    },
    api: ReservationApiService.handleGetSummary,
  });

  return (
    <div className="info diff">
      <b>Bàn đã được đặt</b>
      <List
        itemLayout="horizontal"
        grid={{
          gutter: [16, 16],
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 3,
        }}
        pagination={{
          current: (reservationData?.number ?? 0) + 1,
          pageSize: reservationData?.size ?? 4,
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
        dataSource={reservationData?.content || []}
        loading={isLoading}
        renderItem={(reservation) => {
          return (
            <List.Item
              onClick={() => {
                if (reservation.id !== selectedReservation?.id) {
                  setSelectedReservation(reservation);
                } else {
                  setSelectedReservation(null);
                }
              }}
              className={`${
                selectedReservation?.id === reservation.id ? "active" : ""
              }`}
            >
              <List.Item.Meta
                title={<>Đơn đặt bàn #{reservation.id}</>}
                description={
                  <>
                    <Divider />
                    <h5>Thông tin cơ bản</h5>
                    <p>
                      <ClockPlus />
                      <span>Đặt lúc:</span>
                      <b>{reservation.createAt}</b>
                    </p>
                    <p>
                      <ClockCheck />
                      <span>Đến lúc:</span>
                      <b>{reservation.arriveAt}</b>
                    </p>
                    <p>
                      <ListOrdered />
                      <span>Số khách:</span>
                      <b>{reservation.customerGuests}</b>
                    </p>
                    <h5>Thông tin khách hàng</h5>
                    <p>
                      <User />
                      <span>Họ tên:</span>
                      <b>{reservation.customerFullname}</b>
                    </p>
                    <p>
                      <Phone />
                      <span>Điện thoại:</span>
                      <b>{reservation.customerPhone}</b>
                    </p>
                    <p>
                      <Mail />
                      <span>Email:</span>
                      <b>{reservation.customerEmail}</b>
                    </p>
                    <p>
                      <NotebookPen />
                      <span>Ghi chú:</span>
                      <b>{reservation.customerNote}</b>
                    </p>
                  </>
                }
              />
            </List.Item>
          );
        }}
        locale={{
          emptyText: (
            <div className="empty">
              <img
                src={ImageSourcePath + "empty-order-table-icon.png"}
                alt="empty-order-table"
              />
              <h3>Không có đơn đặt bàn</h3>
              <p>Hôm nay chưa có đơn đặt bàn nào</p>
            </div>
          ),
        }}
      />
      <div className="modal__buttons mg-top">
        <button
          type="button"
          className="modal__button secondary btn"
          onClick={(e) => {
            if (!selectedReservation) {
              openNotification({
                type: "warning",
                message: "Cảnh báo!",
                description:
                  "Bạn chưa chọn đơn đặt bàn nào. Hãy chọn một đơn đặt bàn!",
              });

              return;
            }

            callApiToUpdateUseTable!({
              id: useTableId,
              reservationId: selectedReservation.id,
              button: e.target as HTMLElement,
              value: UseTableStatusValue.reserved,
            });
          }}
        >
          Xác nhận
        </button>
        <button
          type="button"
          className="modal__button secondary btn"
          onClick={clickBack}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default EmptyHandleReservedComponent;
