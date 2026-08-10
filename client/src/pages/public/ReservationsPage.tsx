import useEntityQuery from "../../hooks/useEntityQuery2";
import PublicReservationListComponent from "../../components/layout/PublicReservationListComponent";
import PublicReservationModalComponent from "../../components/layout/PublicReservationModalComponent";
import ReservationApiService from "../../services/api/v1/ReservationApiService";
import { useState } from "react";
import { Layout, Typography, Row, Card, Select, Col, Tag } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { ReservationStatusValue } from "../../constants/values";
import type { SelectProps } from "antd";
import type { PublicPageProps } from "../../constants/props";
import type { ReservationCustomerResponseType } from "../../types/ReservationType";
import type { PageResponseType } from "../../types/PageResponseType";
import type { ReservationStatusEnum } from "../../constants/enums";

export const getStatusTag = (status: ReservationStatusEnum) => {
  const statusStyle = {
    padding: "6px 10px",
    fontSize: 14,
  };

  switch (status) {
    case ReservationStatusValue.confirmed:
      return (
        <Tag
          icon={<CheckCircleOutlined />}
          color="success"
          style={statusStyle}
          bordered={false}
        >
          {ReservationStatusValue.confirmed}
        </Tag>
      );
    case ReservationStatusValue.cancelled:
      return (
        <Tag
          icon={<CloseCircleOutlined />}
          color="error"
          style={statusStyle}
          bordered={false}
        >
          {ReservationStatusValue.cancelled}
        </Tag>
      );
    case ReservationStatusValue.pending:
      return (
        <Tag
          icon={<LoadingOutlined />}
          color="default"
          style={statusStyle}
          bordered={false}
        >
          {ReservationStatusValue.pending}
        </Tag>
      );
  }
};

const PublicReservationsPage: React.FC<PublicPageProps> = ({
  customerLogin,
}) => {
  // Các biến giữ giá trị từ việc lọc thông tin
  // - Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(3);
  /// - Trạng thái
  const statusOptions: SelectProps["options"] = [
    {
      label: ReservationStatusValue.confirmed,
      value: ReservationStatusValue.confirmed,
    },
    {
      label: ReservationStatusValue.cancelled,
      value: ReservationStatusValue.cancelled,
    },
    {
      label: ReservationStatusValue.pending,
      value: ReservationStatusValue.pending,
    },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );

  // Dữ liệu Đơn đặt bàn
  const { data: reservationData, isLoading } = useEntityQuery<
    PageResponseType<ReservationCustomerResponseType>
  >({
    keys: ["reservations", page, size, filterStatusValue, customerLogin?.id],
    params: {
      page: page,
      size: size,
      statusValue: filterStatusValue!,
      customerId: customerLogin?.id,
    },
    api: ReservationApiService.handleGetAllByCustomerId,
  });

  // Modal chi tiết Đơn đặt bàn
  const [openModal, setOpenModal] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationCustomerResponseType | null>(null);

  return (
    <>
      <Layout
        style={{ minHeight: "calc(100vh - 90px)", backgroundColor: "#f4f6fa" }}
      >
        <div className="container mx-auto sm:px-6 lg:px-8 py-8 py-14!">
          <Card
            style={{
              padding: 8,
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <Typography.Title
              level={3}
              style={{ fontWeight: 700, color: "#333" }}
            >
              Lịch sử đặt bàn
            </Typography.Title>
            <div
              style={{
                background: "#fff",
                padding: 24,
                border: "1px solid #eee",
                borderRadius: 16,
                marginTop: 20,
              }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <p className="text-2xl font-semibold">Trạng thái</p>
                  <Select
                    allowClear
                    placeholder="Chọn Trạng thái"
                    style={{
                      width: "100%",
                      height: 40,
                      marginTop: 6,
                      borderRadius: 8,
                    }}
                    options={statusOptions}
                    onChange={setFilterStatusValue}
                  />
                </Col>
              </Row>
            </div>
            <PublicReservationListComponent
              reservationData={reservationData!}
              isLoading={isLoading}
              setPage={setPage}
              setSize={setSize}
              setSelectedReservation={setSelectedReservation}
              setOpenModal={setOpenModal}
            />
          </Card>
        </div>
      </Layout>
      <PublicReservationModalComponent
        selectedReservation={selectedReservation}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};

export default PublicReservationsPage;
