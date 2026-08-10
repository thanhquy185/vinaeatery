import React from "react";
import {
  Layout,
  Typography,
  Button,
  Row,
  Col,
  Card,
  Input,
  Select,
  Divider,
} from "antd";
import {
  SearchOutlined,
  ArrowRightOutlined,
  UserOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Paragraph } = Typography;

// --- Dữ liệu Giả định ---
const coreStats = [
  {
    value: "5,000+",
    label: "Đối Tác Chất Lượng",
    detail: "Nhà hàng được kiểm duyệt.",
  },
  {
    value: "4.8/5",
    label: "Đánh Giá Ưu Tú",
    detail: "Điểm trung bình hệ thống.",
  },
  {
    value: "500K+",
    label: "Lượt Đặt Bàn/Tháng",
    detail: "Giao dịch thành công.",
  },
];

const systemFeatures = [
  {
    icon: <UserOutlined style={{ color: "#fff", fontSize: 30 }} />,
    title: "Dành cho Khách Hàng",
    description:
      "Tìm kiếm thông minh, đặt bàn tức thì và nhận ưu đãi độc quyền từ mạng lưới nhà hàng lớn nhất.",
    buttonText: "Khám Phá Nhà Hàng",
  },
  {
    icon: <LineChartOutlined style={{ color: "#fff", fontSize: 30 }} />,
    title: "Dành cho Đối Tác",
    description:
      "Hệ thống quản lý thông minh giúp tối ưu hóa công suất, tăng trưởng doanh thu và phân tích dữ liệu chuyên sâu.",
    buttonText: "Tìm Hiểu Giải Pháp",
  },
];

const PublicHomePage: React.FC = ({}) => {
  return (
    <>
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-center items-center flex-col"
        style={{
          height: "calc(100vh - 50px)",
          textAlign: "center",
          background: "#f8f8f8",
        }}
      >
        <Title
          level={1}
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "#333",
            maxWidth: 900,
            margin: "0 auto 10px",
          }}
        >
          VINAEATERY: <span style={{ color: "#b91c1c" }}>Hệ Sinh Thái F&B</span>{" "}
          Cho Mọi Nhu Cầu
        </Title>
        <Paragraph
          style={{
            color: "#555",
            fontSize: 18,
            maxWidth: 800,
            margin: "0 auto 40px",
          }}
        >
          Nền tảng đặt bàn và quản lý nhà hàng thông minh, kết nối hàng triệu
          thực khách với những trải nghiệm ẩm thực chất lượng nhất.
        </Paragraph>
        {/* Thanh Search */}
        <div
          style={{
            width: 1000,
            margin: "0 auto",
            background: "#fff",
            padding: 12,
            borderRadius: 16,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Row gutter={8} justify="center">
            <Col flex="auto">
              <Input
                size="large"
                placeholder="Tìm nhà hàng, món ăn, khu vực..."
                prefix={<SearchOutlined style={{ color: "#ccc" }} />}
                style={{ border: "none" }}
              />
            </Col>
            <Col>
              <Select
                size="large"
                defaultValue="tat-ca"
                options={[
                  { label: "Tất cả khu vực", value: "tat-ca" },
                  { label: "TP. HCM", value: "hcm" },
                  { label: "Hà Nội", value: "hn" },
                ]}
                style={{ minWidth: 150 }}
              />
            </Col>
            <Col>
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                style={{
                  borderRadius: 8,
                  backgroundColor: "#b91c1c",
                  borderColor: "#b91c1c",
                }}
              >
                Tìm
              </Button>
            </Col>
          </Row>
        </div>
      </motion.div>
      {/* CORE STATS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ padding: "60px 40px" }}
      >
        <Row gutter={40} justify="center">
          {coreStats.map((stat, index) => (
            <Col xs={24} sm={8} md={8} key={index} style={{ marginBottom: 30 }}>
              <div style={{ textAlign: "center" }}>
                <Title
                  level={1}
                  style={{
                    fontSize: 60,
                    fontWeight: 800,
                    color: "#b91c1c",
                    marginBottom: 0,
                  }}
                >
                  {stat.value}
                </Title>
                <Paragraph
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#333",
                    marginBottom: 4,
                  }}
                >
                  {stat.label}
                </Paragraph>
                <Paragraph style={{ color: "#888", fontSize: 14 }}>
                  {stat.detail}
                </Paragraph>
              </div>
            </Col>
          ))}
        </Row>
      </motion.div>
      <Divider style={{ margin: "0 0 60px 0" }} />
      {/* SYSTEM FEATURES */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ padding: "0 40px 80px 40px" }}
      >
        <Title
          level={2}
          style={{ textAlign: "center", marginBottom: 50, fontWeight: 700 }}
        >
          VINAEATERY Mang Lại Gì Cho Bạn?
        </Title>
        <Row gutter={32}>
          {systemFeatures.map((feature, index) => (
            <Col xs={24} lg={12} key={index}>
              <Card
                hoverable
                style={{
                  height: "100%",
                  borderRadius: 16,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  borderTop: `4px solid ${index === 0 ? "#b91c1c" : "#1890ff"}`,
                  textAlign: "center",
                  transition: "transform 0.3s",
                }}
                className="hover:!scale-105"
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    backgroundColor: index === 0 ? "#b91c1c" : "#1890ff",
                    marginBottom: 20,
                  }}
                >
                  {feature.icon}
                </div>
                <Title
                  level={3}
                  style={{
                    fontWeight: 700,
                    color: index === 0 ? "#b91c1c" : "#1890ff",
                  }}
                >
                  {feature.title}
                </Title>
                <Paragraph style={{ color: "#555", minHeight: 60 }}>
                  {feature.description}
                </Paragraph>
                <Button
                  type="primary"
                  style={{
                    marginTop: 20,
                    backgroundColor: index === 0 ? "#b91c1c" : "#1890ff",
                    borderColor: index === 0 ? "#b91c1c" : "#1890ff",
                    borderRadius: 8,
                  }}
                >
                  {feature.buttonText} <ArrowRightOutlined />
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </motion.div>
      {/* CTA PARTNER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: "80px 40px",
          background: "#333",
          textAlign: "center",
          marginTop: 60,
        }}
      >
        <Title level={2} style={{ color: "#fff", fontWeight: 800 }}>
          Bạn là Chủ Nhà Hàng?
        </Title>
        <Paragraph
          style={{
            color: "#ccc",
            fontSize: 18,
            maxWidth: 800,
            margin: "0 auto 40px",
          }}
        >
          Tham gia ngay để nhận tư vấn miễn phí về giải pháp quản lý F&B thông
          minh và tăng trưởng doanh thu vượt trội.
        </Paragraph>
        <Button
          size="large"
          style={{
            borderRadius: 50,
            backgroundColor: "#b91c1c",
            borderColor: "#b91c1c",
            color: "#fff",
            fontWeight: 600,
          }}
          className="hover:!bg-red-700"
        >
          Đăng Ký Đối Tác Ngay <ArrowRightOutlined />
        </Button>
      </motion.div>
    </>
  );
};

export default PublicHomePage;
