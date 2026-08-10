import { Card, Row, Col, Avatar } from "antd";
import { ImageSourcePath } from "../../constants/values";
import type { CardSize } from "antd/es/card/Card";

type CardInfoInModalComponentProps = {
  cardSize?: CardSize;
  hasImage?: boolean;
  image?: string;
  fullname?: string;
  phone?: string;
  email?: string;
  address?: string;
};

const CardInfoInModalComponent: React.FC<CardInfoInModalComponentProps> = ({
  cardSize = "small",
  hasImage = false,
  image,
  fullname,
  phone,
  email,
  address,
}) => {
  return (
    <Card size={cardSize}>
      <Row gutter={0}>
        <Col span={hasImage ? 2 : 0}>
          <Avatar
            src={image ? image : ImageSourcePath + "no-image.png"}
            size={80}
          />
        </Col>
        <Col span={hasImage ? 22 : 24}>
          <p>
            <b>Họ và tên: </b>
            <span>{fullname ?? "Chưa xác nhận"}</span>
          </p>
          <p>
            <b>Điện thoại: </b>
            <span>{phone ?? "Chưa xác nhận"}</span>
          </p>
          <p>
            <b>Email: </b>
            <span>{email ?? "Chưa xác nhận"}</span>
          </p>
          <p>
            <b>Địa chỉ: </b>
            <span>{address ?? "Chưa xác nhận"}</span>
          </p>
        </Col>
      </Row>
    </Card>
  );
};

export default CardInfoInModalComponent;
