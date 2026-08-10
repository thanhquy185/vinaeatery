import {
  Card,
  Row,
  Col,
  Space,
  Progress,
  Rate,
  Image,
  Divider,
  Button,
  Select,
  List,
  Avatar,
  Typography,
  Input,
  Flex,
} from "antd";
import {
  MessageCircleMore,
  MoreHorizontal,
  Share,
  ThumbsUp,
} from "lucide-react";

const ratingStatistic = [
  { star: 5, percent: 95 },
  { star: 4, percent: 4 },
  { star: 3, percent: 2 },
  { star: 2, percent: 1 },
  { star: 1, percent: 3 },
];

const reviews = [
  {
    id: 1,
    name: "Thuỷ Tiên Phan",
    totalReview: 7,
    totalPhoto: 10,
    rating: 5,
    time: "3 tháng trước",
    content:
      "Quán phục vụ nhanh, nhiệt tình. Món ăn ngon, món ra nhanh lắm, không phải đợi lâu, mà giá cả cũng rẻ nữa. Sẽ quay lại lần sau ❤️❤️",
    images: [
      "https://picsum.photos/500?1",
      "https://picsum.photos/500?2",
      "https://picsum.photos/500?3",
      "https://picsum.photos/500?4",
    ],
  },
  {
    id: 1,
    name: "Thuỷ Tiên Phan",
    totalReview: 7,
    totalPhoto: 10,
    rating: 5,
    time: "3 tháng trước",
    content:
      "Quán phục vụ nhanh, nhiệt tình. Món ăn ngon, món ra nhanh lắm, không phải đợi lâu, mà giá cả cũng rẻ nữa. Sẽ quay lại lần sau ❤️❤️",
    images: [
      "https://picsum.photos/500?1",
      "https://picsum.photos/500?2",
      "https://picsum.photos/500?3",
      "https://picsum.photos/500?4",
    ],
  },
];

type RestaurantDetailReviewsComponentProps = {};

const RestaurantDetailReviewsComponent: React.FC<
  RestaurantDetailReviewsComponentProps
> = ({}) => {
  return (
    <div className="space-y-6">
      {/* SUMMARY */}
      <div style={{ padding: 16 }}>
        <Row gutter={[48, 24]} align="middle">
          <Col xs={24} md={15}>
            <Space direction="vertical" style={{ width: "100%" }} size={10}>
              {ratingStatistic.map((item) => (
                <div key={item.star} className="flex items-center gap-3">
                  <Typography.Text style={{ width: 10 }}>
                    {item.star}
                  </Typography.Text>
                  <Progress
                    percent={item.percent}
                    showInfo={false}
                    strokeColor="#fadb14"
                  />
                </div>
              ))}
            </Space>
          </Col>
          <Col xs={24} md={9}>
            <div className="text-center">
              <Typography.Title level={1} style={{ marginBottom: 0 }}>
                4.7
              </Typography.Title>
              <Rate disabled allowHalf value={4.7} />
              <br />
              <Typography.Text type="secondary">
                538 bài đánh giá
              </Typography.Text>
            </div>
          </Col>
        </Row>
        <Divider style={{ marginTop: 0 }} />
        <div className="text-center">
          <Button
            icon={<MessageCircleMore />}
            type="primary"
            size="large"
            shape="round"
          >
            Viết bài đánh giá
          </Button>
        </div>
      </div>
      {/* TOOLBAR */}
      <div style={{ padding: 16 }}>
        <Divider style={{ marginTop: 0 }} />
        <Flex justify="center" align="center" gap="small">
          <Input
            allowClear
            placeholder="Tìm bài đánh giá"
            style={{
              width: "50%",
              height: 40,
            }}
          />
          <Select
            defaultValue="relevant"
            options={[
              {
                value: "relevant",
                label: "Phù hợp nhất",
              },
              {
                value: "latest",
                label: "Mới nhất",
              },
              {
                value: "highest",
                label: "Đánh giá cao nhất",
              },
            ]}
            style={{
              width: "50%",
              height: 40,
              overflow: "visible",
            }}
          />
        </Flex>
      </div>
      {/* REVIEW */}
      <div style={{ padding: 16 }}>
        <Divider style={{ marginTop: 0 }} />
        <List
          dataSource={reviews}
          renderItem={(review) => (
            <Card style={{ marginTop: 20 }}>
              {/* Header */}
              <div className="flex justify-between">
                <Space align="start">
                  <Avatar
                    size={56}
                    style={{
                      background: "#9254de",
                    }}
                  >
                    T
                  </Avatar>
                  <div>
                    <Typography.Title level={5} style={{ marginBottom: 0 }}>
                      {review.name}
                    </Typography.Title>
                    <Typography.Text type="secondary">
                      {review.totalReview} bài đánh giá · {review.totalPhoto}{" "}
                      ảnh
                    </Typography.Text>
                  </div>
                </Space>
                <Button type="text" icon={<MoreHorizontal />} />
              </div>
              {/* Rating */}
              <Space
                style={{
                  marginTop: 20,
                }}
              >
                <Rate disabled value={review.rating} />
                <Typography.Text type="secondary">
                  {review.time}
                </Typography.Text>
              </Space>
              {/* Content */}
              <Typography.Paragraph
                style={{
                  marginTop: 16,
                  fontSize: 16,
                }}
              >
                {review.content}
              </Typography.Paragraph>
              {/* Images */}
              <Image.PreviewGroup>
                <div className="grid grid-cols-2 gap-2">
                  {review.images.map((image) => (
                    <Image
                      key={image}
                      src={image}
                      height={220}
                      style={{
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </div>
              </Image.PreviewGroup>
              <Divider />
              {/* Footer */}
              <Space size="large">
                <Button type="text" icon={<ThumbsUp />}>
                  Thích
                </Button>
                <Button type="text" icon={<Share />}>
                  Chia sẻ
                </Button>
              </Space>
            </Card>
          )}
        />
      </div>
    </div>
  );
};

export default RestaurantDetailReviewsComponent;
