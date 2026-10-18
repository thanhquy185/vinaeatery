import useEntityQuery from "../../hooks/useEntityQuery2";
import PublicAccountPageHeaderComponent from "../../components/pages/public/account/PublicAccountPageHeaderComponent";
import PublicAccountFilterBarComponent from "../../components/pages/public/account/PublicAccountFilterBarComponent";
import PublicReservationListComponent from "../../components/pages/public/account/PublicReservationListComponent";
import PublicReservationModalComponent from "../../components/pages/public/account/PublicReservationModalComponent";
import ReservationApiService from "../../services/api/v1/ReservationApiService";
import { ReservationStatusValue } from "../../constants/values";
import { Button, Card, Layout, Typography } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { PublicPageProps } from "../../constants/props";
import type { ReservationStatusEnum } from "../../constants/enums";
import type { ReservationCustomerResponseType } from "../../types/ReservationType";
import type { PageResponseType } from "../../types/PageResponseType";

type ReservationFilter = "all" | ReservationStatusEnum;

const PublicReservationsPage: React.FC<PublicPageProps> = ({
  isCustomer,
  customerLogin,
}) => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(5);
  const [filterStatus, setFilterStatus] = useState<ReservationFilter>("all");

  const {
    data: reservationData,
    isLoading,
    isError,
    refetch,
  } = useEntityQuery<PageResponseType<ReservationCustomerResponseType>>({
    keys: ["reservations", customerLogin?.id, page, size, filterStatus],
    params: {
      page,
      size,
      statusValue: filterStatus === "all" ? undefined : [filterStatus],
    },
    enabled: isCustomer,
    api: ReservationApiService.handleGetCurrentCustomerReservations,
  });

  const [openModal, setOpenModal] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationCustomerResponseType | null>(null);

  return (
    <Layout className="public-account-layout">
      <div className="public-account-page">
        <PublicAccountPageHeaderComponent
          title="Lịch sử đặt bàn"
          action={
            <Link to="/public/restaurant">
              <Button
                type="primary"
                size="large"
                className="public-account-page__action"
              >
                Đặt bàn mới
              </Button>
            </Link>
          }
        />
        <Card styles={{ body: { padding: 0 } }} className="public-account-card">
          <div className="public-account-card__header">
            <div className="public-account-card__title-row">
              <div>
                <Typography.Title
                  level={4}
                  className="public-account-card__title"
                >
                  Danh sách đặt bàn
                </Typography.Title>
                <Typography.Text type="secondary">
                  {isLoading
                    ? "Đang cập nhật lịch đặt bàn..."
                    : `${reservationData?.totalElements ?? 0} lịch đặt bàn`}
                </Typography.Text>
              </div>
            </div>
            <PublicAccountFilterBarComponent
              value={filterStatus}
              onChange={(value) => {
                setFilterStatus(value as ReservationFilter);
                setPage(1);
              }}
              options={[
                { key: "all", label: "Tất cả" },
                {
                  key: ReservationStatusValue.pending,
                  label: ReservationStatusValue.pending,
                },
                {
                  key: ReservationStatusValue.confirmed,
                  label: ReservationStatusValue.confirmed,
                },
                {
                  key: ReservationStatusValue.cancelled,
                  label: ReservationStatusValue.cancelled,
                },
              ]}
            />
          </div>
          {isError ? (
            <div className="public-account-state">
              <Typography.Paragraph type="secondary">
                Chưa thể tải danh sách đặt bàn lúc này.
              </Typography.Paragraph>
              <Button type="primary" onClick={() => refetch()}>
                Tải lại danh sách
              </Button>
            </div>
          ) : (
            <div className="public-account-card__content">
              <PublicReservationListComponent
                reservationData={reservationData!}
                isLoading={isLoading}
                setPage={setPage}
                setSize={setSize}
                setSelectedReservation={setSelectedReservation}
                setOpenModal={setOpenModal}
              />
            </div>
          )}
        </Card>
      </div>
      <PublicReservationModalComponent
        selectedReservation={selectedReservation}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </Layout>
  );
};

export default PublicReservationsPage;
