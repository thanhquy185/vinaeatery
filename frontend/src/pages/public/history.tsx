import React, { useState } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  List,
  Button,
  Tag,
  Rate,
  Tabs,
  Input,
  Select,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  MessageOutlined,
  DeleteOutlined,
  StarOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

// --- Dữ liệu Giả định ---
// Lịch sử Đặt bàn
const bookingHistory = [
  {
    id: 1,
    restaurant: "Nhà hàng Hải sản Bờ Vịnh",
    date: "15/11/2025",
    time: "19:30",
    guests: 4,
    status: "Completed", // Completed, Cancelled, Pending
    total: 850000,
    review: 5, // Đã đánh giá
  },
  {
    id: 2,
    restaurant: "Buffet Lẩu Nướng King BBQ",
    date: "01/12/2025",
    time: "12:00",
    guests: 2,
    status: "Pending",
    total: 0, // Dạng buffet thường không có tổng tiền trước
    review: null,
  },
  {
    id: 3,
    restaurant: "Quán Cafe View Đẹp The Hill",
    date: "05/10/2025",
    time: "15:00",
    guests: 3,
    status: "Cancelled",
    total: 0,
    review: null,
  },
];
// Lịch sử Hoạt động (Ưu đãi đã dùng, đánh giá đã viết, v.v.)
const activityHistory = [
  {
    type: "Review",
    date: "16/11/2025",
    restaurant: "Nhà hàng Hải sản Bờ Vịnh",
    content: "Đồ ăn tươi ngon, phục vụ nhanh nhẹn. Rất đáng tiền!",
    rating: 5,
  },
  {
    type: "Promotion",
    date: "20/09/2025",
    restaurant: "Nhà hàng Ý Pasta Fresca",
    content: "Đã sử dụng mã giảm giá 15% cho hóa đơn trên 500k.",
    value: "15%",
  },
];

//
const getStatusTag = (status: any) => {
  switch (status) {
    case "Completed":
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Hoàn thành
        </Tag>
      );
    case "Cancelled":
      return (
        <Tag icon={<CloseCircleOutlined />} color="error">
          Đã hủy
        </Tag>
      );
    case "Pending":
      return (
        <Tag icon={<ClockCircleOutlined />} color="processing">
          Sắp tới
        </Tag>
      );
    default:
      return <Tag>Khác</Tag>;
  }
};

const PublicHistoryPage = () => {
  const [activeTab, setActiveTab] = useState("bookings");

  // Giả lập filter
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredBookings = bookingHistory.filter((b) => {
    if (filterStatus === "all") return true;
    return b.status === filterStatus;
  });

  const renderBookingHistory = () => (
    <>
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Paragraph strong style={{ margin: 0 }}>
          Lọc theo trạng thái:
        </Paragraph>
        <Select
          defaultValue="all"
          onChange={setFilterStatus}
          style={{ width: 150 }}
          options={[
            { value: "all", label: "Tất cả" },
            { value: "Completed", label: "Hoàn thành" },
            { value: "Pending", label: "Sắp tới" },
            { value: "Cancelled", label: "Đã hủy" },
          ]}
        />
      </div>

      <List
        dataSource={filteredBookings}
        renderItem={(item) => (
          <List.Item
            style={{
              backgroundColor: "#fff",
              borderRadius: 8,
              padding: 20,
              marginBottom: 16,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <Row gutter={24} style={{ width: "100%", alignItems: "center" }}>
              {/* Cột 1: Thông tin chính */}
              <Col xs={24} md={10}>
                <Title
                  level={4}
                  style={{ margin: 0, fontWeight: 700, color: "#fa541c" }}
                >
                  {item.restaurant}
                </Title>
                <Paragraph style={{ margin: "8px 0 0 0", color: "#555" }}>
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  {item.date} lúc {item.time} ({item.guests} Khách)
                </Paragraph>
              </Col>

              {/* Cột 2: Trạng thái & Tổng tiền */}
              <Col xs={12} md={6} style={{ textAlign: "center" }}>
                <div style={{ marginBottom: 4 }}>
                  {getStatusTag(item.status)}
                </div>
                {item.total > 0 && (
                  <Paragraph
                    style={{ margin: 0, fontWeight: 600, color: "#333" }}
                  >
                    <DollarCircleOutlined
                      style={{ marginRight: 4, color: "#52c41a" }}
                    />
                    {item.total.toLocaleString()} VNĐ
                  </Paragraph>
                )}
              </Col>

              {/* Cột 3: Hành động */}
              <Col xs={12} md={8} style={{ textAlign: "right" }}>
                {item.status === "Completed" ? (
                  item.review ? (
                    <Rate
                      disabled
                      defaultValue={item.review}
                      style={{ fontSize: 16, color: "#faad14" }}
                    />
                  ) : (
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: "#fa541c",
                        borderColor: "#fa541c",
                        marginRight: 8,
                      }}
                    >
                      Viết đánh giá
                    </Button>
                  )
                ) : item.status === "Pending" ? (
                  <Button icon={<DeleteOutlined />} danger>
                    Hủy đặt bàn
                  </Button>
                ) : (
                  <Button
                    icon={<ClockCircleOutlined />}
                    type="default"
                    disabled
                  >
                    Xem chi tiết
                  </Button>
                )}
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </>
  );

  const renderActivityHistory = () => (
    <List
      dataSource={activityHistory}
      renderItem={(item) => (
        <List.Item
          style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 20,
            marginBottom: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <List.Item.Meta
            avatar={
              item.type === "Review" ? (
                <StarOutlined style={{ fontSize: 28, color: "#faad14" }} />
              ) : (
                <DollarCircleOutlined
                  style={{ fontSize: 28, color: "#52c41a" }}
                />
              )
            }
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 600 }}>
                  {item.type === "Review"
                    ? "Đánh giá nhà hàng"
                    : "Ưu đãi đã dùng"}
                </span>
                <span style={{ color: "#888", fontSize: 13 }}>{item.date}</span>
              </div>
            }
            description={
              <>
                <Paragraph
                  style={{
                    margin: "4px 0 0 0",
                    color: "#333",
                    fontWeight: 500,
                  }}
                >
                  <EnvironmentOutlined style={{ marginRight: 4 }} />
                  {item.restaurant}
                </Paragraph>
                <Paragraph
                  style={{
                    margin: "4px 0 0 0",
                    fontStyle: "italic",
                    color: "#555",
                  }}
                >
                  {item.content}
                </Paragraph>
                {item.type === "Review" && (
                  <Rate
                    disabled
                    defaultValue={item.rating}
                    style={{ fontSize: 14, color: "#faad14" }}
                  />
                )}
              </>
            }
          />
        </List.Item>
      )}
    />
  );

  const tabItems = [
    {
      key: "bookings",
      label: (
        <span>
          <CalendarOutlined /> Lịch sử Đặt bàn
        </span>
      ),
      children: renderBookingHistory(),
    },
    {
      key: "activities",
      label: (
        <span>
          <MessageOutlined /> Hoạt động & Đánh giá
        </span>
      ),
      children: renderActivityHistory(),
    },
  ];

  return (
    <Layout style={{ backgroundColor: "#f4f6fa" }}>
      <div className="container mx-auto sm:px-6 lg:px-8 py-8 py-14!">
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
          bodyStyle={{ padding: 40 }}
        >
          <Title level={2} style={{ fontWeight: 700, color: "#333" }}>
            Lịch sử hoạt động
          </Title>
          <Tabs
            defaultActiveKey="bookings"
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="large"
          />
        </Card>
      </div>
    </Layout>
  );
};

export default PublicHistoryPage;
