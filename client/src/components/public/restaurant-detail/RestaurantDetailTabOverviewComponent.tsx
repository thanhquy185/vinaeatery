import { BarChart } from "@mui/x-charts";
import {
  Col,
  Descriptions,
  Flex,
  Rate,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { Check } from "lucide-react";

const amenities = [
  "WiFi miễn phí",
  "Bãi đỗ xe",
  "Thanh toán QR",
  "Visa / Thẻ",
  "Ăn tại chỗ",
];

type RestaurantDetailTabOverviewComponentProps = {};

const RestaurantDetailTabOverviewComponent: React.FC<
  RestaurantDetailTabOverviewComponentProps
> = ({}) => {
  return (
    <div style={{ padding: 16 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Typography.Title level={5} style={{ margin: 0 }}>
                Thông tin nhanh
              </Typography.Title>
              <Descriptions column={1}>
                <Descriptions.Item
                  label="Khoảng giá"
                  style={{ padding: "10px 0 0" }}
                >
                  100.000đ - 300.000đ
                </Descriptions.Item>
                <Descriptions.Item
                  label="Giờ mở cửa"
                  style={{ padding: "6px 0 0" }}
                >
                  09:00 - 22:00
                </Descriptions.Item>
                <Descriptions.Item
                  label="Sức chứa"
                  style={{ padding: "6px 0 0" }}
                >
                  180 khách
                </Descriptions.Item>
                <Descriptions.Item
                  label="Bãi đỗ xe"
                  style={{ padding: "6px 0 0" }}
                >
                  Có
                </Descriptions.Item>
                <Descriptions.Item label="Wifi" style={{ padding: "6px 0 0" }}>
                  Miễn phí
                </Descriptions.Item>
                <Descriptions.Item
                  label="Thanh toán"
                  style={{ padding: "6px 0 0" }}
                >
                  Tiền mặt, QR, Visa
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} lg={12}>
              <Typography.Title level={5} style={{ margin: 0 }}>
                Đánh giá khách hàng
              </Typography.Title>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%", margin: "10px 0 0" }}
              >
                <Flex justify="space-between" align="center">
                  <Typography.Text type="secondary">
                    Chất lượng món ăn
                  </Typography.Text>
                  <Space>
                    <Rate disabled allowHalf defaultValue={4.9} />
                    <Typography.Text>4.9</Typography.Text>
                  </Space>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Typography.Text type="secondary">
                    Tốc độ phục vụ
                  </Typography.Text>
                  <Space>
                    <Rate disabled allowHalf defaultValue={4.8} />
                    <Typography.Text>4.8</Typography.Text>
                  </Space>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Typography.Text type="secondary">
                    Thái độ nhân viên
                  </Typography.Text>
                  <Space>
                    <Rate disabled allowHalf defaultValue={4.7} />
                    <Typography.Text>4.7</Typography.Text>
                  </Space>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Typography.Text type="secondary">
                    Dịch vụ mang lại
                  </Typography.Text>
                  <Space>
                    <Rate disabled allowHalf defaultValue={4.5} />
                    <Typography.Text>4.5</Typography.Text>
                  </Space>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Typography.Text type="secondary">
                    Không gian và vệ sinh
                  </Typography.Text>
                  <Space>
                    <Rate disabled allowHalf defaultValue={4.2} />
                    <Typography.Text>4.2</Typography.Text>
                  </Space>
                </Flex>
              </Space>
            </Col>
          </Row>
        </div>
        <div>
          <Flex justify="space-between" align="center">
            <Typography.Title level={5} style={{ margin: 0 }}>
              Giờ đông khách trong tuần
            </Typography.Title>
            <Select
              defaultValue="T3"
              style={{ width: 140 }}
              options={[
                { label: "Thứ Hai", value: "T2" },
                { label: "Thứ Ba", value: "T3" },
                { label: "Thứ Tư", value: "T4" },
                { label: "Thứ Năm", value: "T5" },
                { label: "Thứ Sáu", value: "T6" },
                { label: "Thứ Bảy", value: "T7" },
                { label: "Chủ Nhật", value: "CN" },
              ]}
            />
          </Flex>
          <BarChart
            height={250}
            borderRadius={6}
            xAxis={[
              {
                scaleType: "band",
                data: [
                  "00",
                  "01",
                  "02",
                  "03",
                  "04",
                  "05",
                  "06",
                  "07",
                  "08",
                  "09",
                  "10",
                  "11",
                  "12",
                  "13",
                  "14",
                  "15",
                  "16",
                  "17",
                  "18",
                  "19",
                  "20",
                  "21",
                  "22",
                  "23",
                ],
              },
            ]}
            yAxis={[{ min: 0, max: 100 }]}
            series={[
              {
                data: [
                  0, 0, 0, 0, 5, 12, 22, 38, 55, 72, 88, 96, 100, 94, 80, 60,
                  40, 20,
                ],
                color: "#b91c1c",
              },
            ]}
            grid={{ horizontal: false, vertical: false }}
          />
          <Typography.Text type="secondary">
            Thường đông khách nhất từ <b>19:00 - 21:00</b>
          </Typography.Text>
        </div>
        <div>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Các tiện ích và dịch vụ
          </Typography.Title>
          <Space wrap size={[8, 8]} style={{ margin: "10px 0 0" }}>
            {amenities.map((item) => (
              <div
                key={item}
                style={{
                  padding: "4px 10px",
                  borderRadius: 4,
                  background: "#f5f5f5",
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Check style={{ color: "#16a34a" }} />
                {item}
              </div>
            ))}
          </Space>
        </div>
      </Space>
    </div>
  );
};

export default RestaurantDetailTabOverviewComponent;
