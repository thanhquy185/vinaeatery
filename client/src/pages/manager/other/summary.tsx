import { useState } from "react";
import { Row, Col, Card, Table, Avatar, Progress, Select, List } from "antd";
import {
  DollarCircleOutlined,
  UserOutlined,
  CoffeeOutlined,
  TeamOutlined,
  ShoppingOutlined,
  CrownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts";

const ManagerSummary = () => {
  // ==== TOP COUNT CHO TỪNG BẢNG ====
  const [topDishCount, setTopDishCount] = useState(5);
  const [topStaffCount, setTopStaffCount] = useState(5);
  const [topCustomerCount, setTopCustomerCount] = useState(5);

  // ==== DỮ LIỆU GIẢ ====
  const allDishes = [
    {
      name: "Phở bò tái",
      quantity: 180,
      revenue: "36,000,000đ",
      image: "/img/pho.jpg",
    },
    {
      name: "Cơm gà xối mỡ",
      quantity: 150,
      revenue: "27,000,000đ",
      image: "/img/comga.jpg",
    },
    {
      name: "Bún chả Hà Nội",
      quantity: 120,
      revenue: "22,000,000đ",
      image: "/img/buncha.jpg",
    },
    {
      name: "Mì quảng",
      quantity: 100,
      revenue: "18,000,000đ",
      image: "/img/miquang.jpg",
    },
    {
      name: "Gỏi cuốn",
      quantity: 90,
      revenue: "16,000,000đ",
      image: "/img/goicuon.jpg",
    },
  ];

  const allStaff = [
    {
      name: "Nguyễn Văn A",
      orders: 85,
      revenue: 21000000,
      image: "/img/staff1.jpg",
    },
    {
      name: "Trần Thị B",
      orders: 70,
      revenue: 18000000,
      image: "/img/staff2.jpg",
    },
    {
      name: "Lê Văn C",
      orders: 68,
      revenue: 17000000,
      image: "/img/staff3.jpg",
    },
    {
      name: "Phạm Thị D",
      orders: 60,
      revenue: 15000000,
      image: "/img/staff4.jpg",
    },
  ];

  const allCustomers = [
    { name: "Ngọc Trâm", spent: 6800000 },
    { name: "Hoàng Nam", spent: 5200000 },
    { name: "Hoàng Luân", spent: 5200000 },
    { name: "Thanh Bình", spent: 4700000 },
    { name: "Thảo Vy", spent: 3500000 },
    { name: "Anh Quân", spent: 3200000 },
  ];

  // ==== CẮT THEO TOP CHỌN ====
  const topDishes = allDishes.slice(0, topDishCount);
  const topStaff = allStaff.slice(0, topStaffCount);
  const topCustomers = allCustomers.slice(0, topCustomerCount);

  // ==== STYLE THẺ ====
  const cardStyle = {
    borderRadius: "12px",
    color: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  };

  const cards = [
    {
      title: "Tổng doanh thu",
      value: "58,200,000",
      suffix: "đ",
      icon: <DollarCircleOutlined style={{ fontSize: 36, color: "white" }} />,
      color: "linear-gradient(135deg, #ffb74d, #ef6c00)", // vàng cam đậm, nổi bật tài chính
    },
    {
      title: "Tổng đơn món ăn",
      value: 18,
      icon: <ShoppingCartOutlined style={{ fontSize: 36, color: "white" }} />,
      color: "linear-gradient(135deg, #ba68c8, #8e24aa)", // tím nhẹ - giữ tông ấm mà khác vàng
    },
    {
      title: "Bàn đang phục vụ",
      value: 18,
      icon: <CoffeeOutlined style={{ fontSize: 36, color: "white" }} />,
      color: "linear-gradient(135deg, #4dd0e1, #00796b)", // xanh ngọc tươi – cân giữa ấm & lạnh
    },
    {
      title: "Món ăn hiện có",
      value: 128,
      icon: <ShoppingOutlined style={{ fontSize: 36, color: "white" }} />,
      color: "linear-gradient(135deg, #ff8a65, #d84315)", // cam san hô – năng động, khác hẳn tím/xanh
    },
    {
      title: "Nhân viên làm việc",
      value: 12,
      icon: <TeamOutlined style={{ fontSize: 36, color: "white" }} />,
      color: "linear-gradient(135deg, #64b5f6, #1976d2)", // xanh dương sáng – thân thiện, ổn định
    },
    {
      title: "Khách hàng đã từng ghé nhà hàng",
      value: 98,
      icon: <UserOutlined style={{ fontSize: 36, color: "white" }} />,
      color: "linear-gradient(135deg, #81c784, #388e3c)", // xanh lá chuẩn “phục vụ/hoạt động”
    },
  ];

  // ==== DỮ LIỆU BIỂU ĐỒ ====
  const dishOrderData = Array.from({ length: 7 }).map((_, i) => ({
    day: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    }),
    orders: Math.floor(Math.random() * 250) + 100,
  }));

  const dishCategoryData = [
    { label: "Món chính", value: 55 },
    { label: "Đồ uống", value: 25 },
    { label: "Tráng miệng", value: 20 },
  ];

  const orderTypeData = [
    { label: "Tại bàn", value: 65 },
    { label: "Mang về", value: 20 },
    { label: "Giao hàng", value: 15 },
  ];

  return (
    <main style={{ padding: 24, minHeight: "100vh" }}>
      {/* HEADER */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#333" }}>
          🍽️ Bảng điều khiển nhà hàng
        </h1>
        <p style={{ color: "#777" }}>
          Hôm nay: {new Date().toLocaleDateString("vi-VN")}
        </p>
      </div>

      {/* THẺ THỐNG KÊ */}
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

      {/* BIỂU ĐỒ */}
      <Row gutter={[16, 16]} style={{ marginTop: 28 }}>
        <Col xs={24} lg={14}>
          <Card
            title="📊 Số đơn món ăn 7 ngày gần nhất"
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

      {/* BẢNG XẾP HẠNG */}
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
                onChange={(v) => setTopDishCount(v)}
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
                onChange={(v) => setTopStaffCount(v)}
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
              renderItem={(staff, idx) => (
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
                onChange={(v) => setTopCustomerCount(v)}
                style={{ width: 90 }}
                options={[
                  { value: 3, label: "Top 3" },
                  { value: 5, label: "Top 5" },
                  { value: 10, label: "Top 10" },
                ]}
              />
            }
          >
            {allCustomers
              .sort((a, b) => b.spent - a.spent)
              .slice(0, topCustomerCount)
              .map((cust, idx) => {
                // Màu huy chương
                let medalColor =
                  idx === 0
                    ? "#fdd835" // vàng
                    : idx === 1
                    ? "#c0c0c0" // bạc
                    : idx === 2
                    ? "#cd7f32" // đồng
                    : "#90caf9"; // thường

                // Nền theo vị trí
                let bgColor =
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
                          {cust.spent.toLocaleString("vi-VN")}đ
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
    </main>
  );
};

export default ManagerSummary;
