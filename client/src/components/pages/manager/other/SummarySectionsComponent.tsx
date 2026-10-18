import { Avatar, Card, Col, List, Progress, Row, Select, Table } from "antd";
import { CrownOutlined } from "@ant-design/icons";
import { BarChart, PieChart } from "@mui/x-charts";
import type { ReactNode } from "react";

type SummaryCard = {
  title: string;
  value: string | number;
  suffix?: string;
  icon: ReactNode;
  color: string;
};

type SummaryDish = {
  name: string;
  quantity: number;
  revenue: string;
  image: string;
};

type SummaryStaff = {
  name: string;
  orders: number;
  revenue: number;
  image: string;
};

type SummaryCustomer = {
  name: string;
  spent: number;
};

type SummaryChartEntry = {
  label: string;
  value: number;
};

type SummaryStatisticsSectionComponentProps = {
  cards: SummaryCard[];
};

export const SummaryStatisticsSectionComponent: React.FC<
  SummaryStatisticsSectionComponentProps
> = ({ cards }) => {
  const cardStyle = {
    borderRadius: "12px",
    color: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  };

  return (
    <Row gutter={[16, 16]}>
      {cards.map((card, i) => (
        <Col xs={24} sm={12} md={8} key={i}>
          <Card
            style={{ ...cardStyle, background: card.color }}
            bodyStyle={{ padding: 16 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p
                  style={{ color: "rgba(255,255,255,0.8)", marginBottom: 4 }}
                >
                  {card.title}
                </p>
                <h2 style={{ color: "white", margin: 0 }}>
                  {card.value}
                  {card.suffix || ""}
                </h2>
              </div>
              {card.icon}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

type SummaryChartsSectionComponentProps = {
  dishOrderData: { day: string; orders: number }[];
  dishCategoryData: SummaryChartEntry[];
  orderTypeData: SummaryChartEntry[];
};

export const SummaryChartsSectionComponent: React.FC<
  SummaryChartsSectionComponentProps
> = ({ dishOrderData, dishCategoryData, orderTypeData }) => {
  return (
    <Row gutter={[16, 16]} style={{ marginTop: 28 }}>
      <Col xs={24} lg={14}>
        <Card
          title="📊 Số Hoá đơn 7 ngày gần nhất"
          bordered={false}
          style={{ borderRadius: 12 }}
        >
          <BarChart
            xAxis={[{ data: dishOrderData.map((r) => r.day) }]}
            series={[
              { data: dishOrderData.map((r) => r.orders), label: "Số đơn" },
            ]}
            width={600}
            height={300}
          />
        </Card>
      </Col>

      <Col xs={24} lg={10}>
        <Card
          title="📦 Phân loại doanh thu"
          bordered={false}
          style={{ borderRadius: 12 }}
        >
          <PieChart
            series={[
              {
                data: dishCategoryData.map((item, i) => ({
                  id: i,
                  value: item.value,
                  label: item.label,
                })),
              },
            ]}
            width={350}
            height={250}
          />
        </Card>
        <Card
          title="🛍️ Loại đơn hàng"
          bordered={false}
          style={{ marginTop: 16, borderRadius: 12 }}
        >
          {orderTypeData.map((type) => (
            <div key={type.label} style={{ marginBottom: 8 }}>
              <p style={{ margin: 0, fontWeight: 500 }}>{type.label}</p>
              <Progress percent={type.value} size="small" />
            </div>
          ))}
        </Card>
      </Col>
    </Row>
  );
};

type SummaryRankingsSectionComponentProps = {
  topDishes: SummaryDish[];
  topStaff: SummaryStaff[];
  topCustomers: SummaryCustomer[];
  topDishCount: number;
  onTopDishCountChange: (count: number) => void;
  topStaffCount: number;
  onTopStaffCountChange: (count: number) => void;
  topCustomerCount: number;
  onTopCustomerCountChange: (count: number) => void;
};

export const SummaryRankingsSectionComponent: React.FC<
  SummaryRankingsSectionComponentProps
> = ({
  topDishes,
  topStaff,
  topCustomers,
  topDishCount,
  onTopDishCountChange,
  topStaffCount,
  onTopStaffCountChange,
  topCustomerCount,
  onTopCustomerCountChange,
}) => {
  return (
    <Row gutter={[16, 16]} style={{ marginTop: 28 }}>
      {/* MÓN ĂN */}
      <Col xs={24} lg={8}>
        <Card
          title="🔥 Món ăn bán chạy"
          bordered={false}
          style={{ borderRadius: 12 }}
          extra={
            <Select
              value={topDishCount}
              onChange={onTopDishCountChange}
              options={[
                { value: 3, label: "Top 3" },
                { value: 5, label: "Top 5" },
                { value: 10, label: "Top 10" },
              ]}
            />
          }
        >
          <Table
            dataSource={topDishes}
            rowKey="name"
            columns={[
              {
                title: "Món",
                dataIndex: "name",
                render: (text, r) => (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Avatar src={r.image} shape="square" />
                    <span>{text}</span>
                  </div>
                ),
              },
              { title: "SL", dataIndex: "quantity", align: "center" },
              { title: "Doanh thu", dataIndex: "revenue", align: "right" },
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      </Col>

      {/* NHÂN VIÊN */}
      <Col xs={24} lg={8}>
        <Card
          title="👨‍🍳 Hiệu suất nhân viên"
          style={{ borderRadius: 12 }}
          extra={
            <Select
              value={topStaffCount}
              onChange={onTopStaffCountChange}
              style={{ width: 90 }}
              options={[
                { value: 3, label: "Top 3" },
                { value: 5, label: "Top 5" },
                { value: 10, label: "Top 10" },
              ]}
            />
          }
        >
          <List
            itemLayout="horizontal"
            dataSource={topStaff}
            renderItem={(staff) => (
              <List.Item
                style={{
                  // background: idx === 0 ? "#f3e5f5" : "#fafafa",
                  borderRadius: 8,
                  marginBottom: 8,
                  padding: 10,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <List.Item.Meta
                  avatar={<Avatar src={staff.image} size="large" />}
                  title={
                    <div style={{ fontWeight: 600, fontSize: 15 }}>
                      {staff.name}
                    </div>
                  }
                  description={
                    <div style={{ color: "#666" }}>
                      🧾 {staff.orders} đơn • 💰{" "}
                      {(staff.revenue / 1000000).toFixed(1)} triệu
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>

      {/* KHÁCH HÀNG */}
      <Col xs={24} lg={8}>
        <Card
          title="🏆 Khách hàng chi tiêu nhiều nhất"
          bordered={false}
          style={{ borderRadius: 12 }}
          extra={
            <Select
              value={topCustomerCount}
              onChange={onTopCustomerCountChange}
              style={{ width: 90 }}
              options={[
                { value: 3, label: "Top 3" },
                { value: 5, label: "Top 5" },
                { value: 10, label: "Top 10" },
              ]}
            />
          }
        >
          {topCustomers.map((cust, idx) => {
              // Màu huy chương
              const medalColor =
                idx === 0
                  ? "#fdd835" // vàng
                  : idx === 1
                    ? "#c0c0c0" // bạc
                    : idx === 2
                      ? "#cd7f32" // đồng
                      : "#90caf9"; // thường

              // Nền theo vị trí
              const bgColor =
                idx === 0
                  ? "#fff8e1" // vàng nhạt
                  : idx === 1
                    ? "#f0f0f0" // bạc nhạt
                    : idx === 2
                      ? "#fbe9e7" // đồng nhạt
                      : idx % 2 === 0
                        ? "#fafafa"
                        : "#fff";

              return (
                <div
                  key={cust.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 10,
                    background: bgColor,
                    padding: 10,
                    borderRadius: 10,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <Avatar
                    size="large"
                    style={{
                      backgroundColor: medalColor,
                      marginRight: 12,
                    }}
                    icon={<CrownOutlined />}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{cust.name}</div>
                    <div style={{ color: "#666", fontSize: 13 }}>
                      Tổng chi tiêu:{" "}
                      <span style={{ fontWeight: 600, color: "#000" }}>
                        {cust.spent.toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                  {/* <div style={{ fontWeight: 600, color: "#333" }}>
                    {(cust.spent / 1000000).toFixed(1)}tr
                  </div> */}
                </div>
              );
            })}
        </Card>
      </Col>
    </Row>
  );
};
