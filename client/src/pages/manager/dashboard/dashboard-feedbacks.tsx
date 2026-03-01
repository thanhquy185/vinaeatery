import React, { useState } from "react";
import FilterDashboard from "../../../components/admin-manager/common/filter-dashboard";
import {
  Card,
  List,
  Avatar,
  Rate,
  Tag,
  Row,
  Col,
  Typography,
  Divider,
  Progress,
} from "antd";
import { SmileOutlined, MehOutlined, FrownOutlined } from "@ant-design/icons";
import { PieChart } from "@mui/x-charts";

const { Title, Text } = Typography;

const AdminDashboardFeedbacks: React.FC = () => {
  const [filterTimelineValue, setFilterTimelineValue] = useState<string | null>(
    null
  );
  const [filterTimeDetailValue, setFilterTimeDetailValue] = useState<
    string | null
  >(null);

  // Dữ liệu mẫu (feedback)
  const feedbacks = [
    {
      id: 1,
      customer: "Nguyễn Văn A",
      experience: "Tuyệt vời",
      food: 5,
      speed: 4,
      staff: 5,
      hygiene: 5,
      service: 5,
      comment: "Món ăn ngon, nhân viên thân thiện!",
      date: "2025-11-06",
    },
    {
      id: 2,
      customer: "Trần Thị B",
      experience: "Hài lòng",
      food: 4,
      speed: 4,
      staff: 4,
      hygiene: 4,
      service: 4,
      comment: "Ổn áp, nhưng đợi hơi lâu.",
      date: "2025-11-06",
    },
    {
      id: 3,
      customer: "Phạm Minh C",
      experience: "Bình thường",
      food: 3,
      speed: 3,
      staff: 3,
      hygiene: 3,
      service: 3,
      comment: "Tạm ổn, chưa đặc sắc.",
      date: "2025-11-05",
    },
    {
      id: 4,
      customer: "Lê Thị D",
      experience: "Không hài lòng",
      food: 2,
      speed: 2,
      staff: 2,
      hygiene: 3,
      service: 2,
      comment: "Phục vụ chậm, món ăn nguội.",
      date: "2025-11-04",
    },
  ];

  // Tính trung bình từng tiêu chí (theo sao)
  const calcAverage = (field: keyof (typeof feedbacks)[0]) => {
    const total = feedbacks.reduce((sum, fb) => sum + (fb[field] as number), 0);
    return +(total / feedbacks.length).toFixed(1);
  };

  const avgFood = calcAverage("food");
  const avgSpeed = calcAverage("speed");
  const avgStaff = calcAverage("staff");
  const avgHygiene = calcAverage("hygiene");
  const avgService = calcAverage("service");

  // Dữ liệu trải nghiệm tổng quan (PieChart)
  const experienceData = [
    { id: "Tuyệt vời", label: "Tuyệt vời", value: 10 },
    { id: "Hài lòng", label: "Hài lòng", value: 15 },
    { id: "Bình thường", label: "Bình thường", value: 6 },
    { id: "Không hài lòng", label: "Không hài lòng", value: 3 },
    { id: "Dở tệ", label: "Dở tệ", value: 1 },
  ];

  const getExperienceIcon = (exp: string) => {
    switch (exp) {
      case "Tuyệt vời":
        return <SmileOutlined style={{ color: "#52c41a" }} />;
      case "Hài lòng":
        return <SmileOutlined style={{ color: "#1890ff" }} />;
      case "Bình thường":
        return <MehOutlined style={{ color: "#faad14" }} />;
      default:
        return <FrownOutlined style={{ color: "#f5222d" }} />;
    }
  };

  return (
    <main className="main">
      <div className="main__header">
        <div className="main__title">Thống kê Đánh giá</div>
      </div>
      <div className="main__filter">
        <FilterDashboard
          setFilterTimelineValue={setFilterTimelineValue}
          setFilterTimeDetailValue={setFilterTimeDetailValue}
          typeDashboard="dashboard-feedback"
          titleDashboard="THỐNG KÊ ĐÁNH GIÁ"
          titlePrint="TKDANHGIA"
        />
      </div>
      <div className="main__dashboard" style={{ marginTop: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={14}>
            <Card title="Tổng quan đánh giá" bordered={false}>
              <Title level={5}>Tỷ lệ trải nghiệm</Title>
              <div style={{ height: 260 }}>
                <PieChart
                  series={[
                    {
                      data: experienceData,
                      innerRadius: 0,
                      outerRadius: 100,
                      //   highlightScope: { faded: "global", highlighted: "item" },
                      faded: { innerRadius: 30, additionalRadius: -30 },
                    },
                  ]}
                  height={260}
                />
              </div>

              <Divider />

              <Title level={5}>Trung bình các tiêu chí (⭐)</Title>
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex justify-between items-center">
                  <Text>Chất lượng món ăn</Text>
                  <div>
                    <Rate disabled allowHalf value={avgFood} />
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      {avgFood.toFixed(1)}
                    </Text>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Text>Tốc độ phục vụ</Text>
                  <div>
                    <Rate disabled allowHalf value={avgSpeed} />
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      {avgSpeed.toFixed(1)}
                    </Text>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Text>Thái độ nhân viên</Text>
                  <div>
                    <Rate disabled allowHalf value={avgStaff} />
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      {avgStaff.toFixed(1)}
                    </Text>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Text>Không gian & vệ sinh</Text>
                  <div>
                    <Rate disabled allowHalf value={avgHygiene} />
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      {avgHygiene.toFixed(1)}
                    </Text>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Text>Dịch vụ mang lại</Text>
                  <div>
                    <Rate disabled allowHalf value={avgService} />
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      {avgService.toFixed(1)}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={10}>
            <Card title="Danh sách đánh giá" bordered={false}>
              <List
                itemLayout="vertical"
                dataSource={feedbacks}
                renderItem={(item) => (
                  <List.Item
                    key={item.id}
                    style={{ padding: 12 }}
                    extra={<Text type="secondary">{item.date}</Text>}
                  >
                    <List.Item.Meta
                      avatar={<Avatar>{item.customer[0]}</Avatar>}
                      title={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Text strong>{item.customer}</Text>
                          <Tag color="blue">{item.experience}</Tag>
                        </div>
                      }
                      description={
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 6,
                            }}
                          >
                            <Text type="secondary">Chất lượng món ăn:</Text>
                            <Rate disabled value={item.food} />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 6,
                            }}
                          >
                            <Text type="secondary">Tốc độ phục vụ:</Text>
                            <Rate disabled value={item.food} />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 6,
                            }}
                          >
                            <Text type="secondary">Thái độ nhân viên:</Text>
                            <Rate disabled value={item.food} />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 6,
                            }}
                          >
                            <Text type="secondary">Dịch vụ mang lại:</Text>
                            <Rate disabled value={item.food} />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 6,
                            }}
                          >
                            <Text type="secondary">Không gian và vệ sinh:</Text>
                            <Rate disabled value={item.food} />
                          </div>
                          <Text italic>“{item.comment}”</Text>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </main>
  );
};

export default AdminDashboardFeedbacks;
