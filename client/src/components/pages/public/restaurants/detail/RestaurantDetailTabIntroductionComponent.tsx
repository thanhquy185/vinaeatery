import {
  Avatar,
  Badge,
  Card,
  Col,
  Flex,
  Image,
  Row,
  Space,
  Tag,
  Timeline,
  Typography,
} from "antd";

const chefs = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    role: "Bếp trưởng",
    experience: "15 năm",
    avatar: "https://i.pravatar.cc/300?img=12",
    achievements: ["Top Chef Vietnam 2022", "Michelin Guide Partner"],
    description: "Đam mê ẩm thực và luôn mang đến những món ăn chất lượng cao.",
  },
  {
    id: 2,
    name: "Trần Minh Khoa",
    role: "Bếp phó",
    experience: "10 năm",
    avatar: "https://i.pravatar.cc/300?img=15",
    achievements: ["Asian Culinary Award", "Best Seafood Chef"],
    description: "Chuyên gia chế biến các món Âu và steak cao cấp.",
  },
  {
    id: 2,
    name: "Trần Minh Khoa",
    role: "Bếp phó",
    experience: "10 năm",
    avatar: "https://i.pravatar.cc/300?img=15",
    achievements: ["Asian Culinary Award", "Best Seafood Chef"],
    description: "Chuyên gia chế biến các món Âu và steak cao cấp.",
  },
];

const RestaurantDetailTabIntroductionComponent: React.FC = () => {
  return (
    <div className="ve-restaurant-introduction">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div className="ve-restaurant-introduction__story">
          <span className="ve-restaurant-introduction__eyebrow">CÂU CHUYỆN</span>
          <Typography.Title level={4} className="ve-restaurant-introduction__title">
            Giới thiệu
          </Typography.Title>
          <Typography.Paragraph
            className="ve-restaurant-introduction__copy"
          >
            Hải Sản Biển Xanh được thành lập vào năm 2018, chuyên phục vụ các
            món hải sản tươi sống được tuyển chọn mỗi ngày. Với mong muốn mang
            đến trải nghiệm ẩm thực chất lượng trong không gian hiện đại, nhà
            hàng luôn chú trọng vào chất lượng nguyên liệu, dịch vụ và sự hài
            lòng của khách hàng.
          </Typography.Paragraph>
        </div>
        <div className="ve-restaurant-introduction__team">
          <Typography.Title level={5} className="ve-restaurant-introduction__title">
            Đội ngũ đầu bếp
          </Typography.Title>
          <Row gutter={[16, 16]} style={{ margin: "14px 0 0" }}>
            {chefs.map((chef) => (
              <Col xs={24} md={12} lg={8} key={chef.id}>
                <Card>
                  <Flex vertical align="center" gap={12}>
                    <Badge.Ribbon text={chef.role}>
                      <Avatar size={90} src={chef.avatar} />
                    </Badge.Ribbon>
                    <Space direction="vertical" align="center" size={2}>
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        {chef.name}
                      </Typography.Title>
                      <Typography.Text type="secondary" style={{ margin: 0 }}>
                        {chef.experience} kinh nghiệm
                      </Typography.Text>
                    </Space>
                    <Space
                      direction="vertical"
                      align="center"
                      style={{ width: "100%" }}
                    >
                      {chef.achievements.map((item) => (
                        <Tag color="gold" key={item}>
                          {item}
                        </Tag>
                      ))}
                    </Space>
                    <Typography.Paragraph
                      type="secondary"
                      style={{
                        textAlign: "center",
                        marginBottom: 0,
                      }}
                    >
                      {chef.description}
                    </Typography.Paragraph>
                  </Flex>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        <div className="ve-restaurant-introduction__milestones">
          <Typography.Title level={5} className="ve-restaurant-introduction__title">
            Thành tích đạt được
          </Typography.Title>
          <Timeline
            mode="left"
            style={{ margin: "14px 0 0" }}
            items={[
              {
                label: "2015-09-01",
                children: (
                  <div>
                    <Image
                      preview={false}
                      width="100%"
                      height={180}
                      src="https://i.pravatar.cc/300?img=15"
                      style={{ borderRadius: 8 }}
                    />
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      Michelin Selected 2025
                    </Typography.Title>
                    <Typography.Paragraph>
                      Nhà hàng được Michelin Guide lựa chọn...
                    </Typography.Paragraph>
                  </div>
                ),
              },
              {
                label: "2015-09-01",
                children: (
                  <div>
                    <Image
                      width="100%"
                      height={180}
                      src="https://i.pravatar.cc/300?img=15"
                      style={{ borderRadius: 8 }}
                    />
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      Michelin Selected 2025
                    </Typography.Title>
                    <Typography.Paragraph>
                      Nhà hàng được Michelin Guide lựa chọn...
                    </Typography.Paragraph>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Space>
    </div>
  );
};

export default RestaurantDetailTabIntroductionComponent;
