import { useState } from "react";
import {
  SummaryChartsSectionComponent,
  SummaryRankingsSectionComponent,
  SummaryStatisticsSectionComponent,
} from "../../../components/pages/manager/other/SummarySectionsComponent";
import {
  DollarCircleOutlined,
  UserOutlined,
  CoffeeOutlined,
  TeamOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const ManagerSummaryPage = () => {
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
  const topCustomers = allCustomers
    .sort((a, b) => b.spent - a.spent)
    .slice(0, topCustomerCount);

  const cards = [
    {
      title: "Tổng doanh thu",
      value: "58,200,000",
      suffix: "đ",
      icon: <DollarCircleOutlined style={{ fontSize: 36, color: "white" }} />,
      color: "linear-gradient(135deg, #ffb74d, #ef6c00)", // vàng cam đậm, nổi bật tài chính
    },
    {
      title: "Tổng Hoá đơn",
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

      <SummaryStatisticsSectionComponent cards={cards} />
      <SummaryChartsSectionComponent
        dishOrderData={dishOrderData}
        dishCategoryData={dishCategoryData}
        orderTypeData={orderTypeData}
      />
      <SummaryRankingsSectionComponent
        topDishes={topDishes}
        topStaff={topStaff}
        topCustomers={topCustomers}
        topDishCount={topDishCount}
        onTopDishCountChange={setTopDishCount}
        topStaffCount={topStaffCount}
        onTopStaffCountChange={setTopStaffCount}
        topCustomerCount={topCustomerCount}
        onTopCustomerCountChange={setTopCustomerCount}
      />
    </main>
  );
};

export default ManagerSummaryPage;
