import {
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import { ruleEmail, rulePhone, ruleRequired } from "../../../../constants/rules";
import { CommonGenderValue } from "../../../../constants/values";

type ProfileInformationFieldsComponentProps = {
  submitFormLoading: boolean;
};

const ProfileInformationFieldsComponent: React.FC<
  ProfileInformationFieldsComponentProps
> = ({ submitFormLoading }) => {
  return (
    <div className="public-account-profile__form-panel">
      <div className="public-account-section-heading">
        <Typography.Title level={4}>Thông tin liên hệ</Typography.Title>
        <Typography.Text type="secondary">
          Cập nhật thông tin để nhà hàng có thể hỗ trợ bạn tốt hơn.
        </Typography.Text>
      </div>
      <Row gutter={[20, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            hasFeedback
            name="fullname"
            htmlFor="fullname"
            label="Họ và tên"
            rules={[ruleRequired("Họ và tên không được để trống!")]}
          >
            <Input
              id="fullname"
              size="large"
              placeholder="Nhập họ và tên"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item
            name="birthdate"
            htmlFor="birthdate"
            label="Ngày sinh"
          >
            <DatePicker
              id="birthdate"
              allowClear
              format="YYYY-MM-DD"
              size="large"
              style={{ width: "100%" }}
              placeholder="Chọn ngày sinh"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item
            name="gender"
            htmlFor="gender"
            label="Giới tính"
          >
            <Select
              id="gender"
              allowClear
              size="large"
              options={[
                {
                  label: CommonGenderValue.male,
                  value: CommonGenderValue.male,
                },
                {
                  label: CommonGenderValue.female,
                  value: CommonGenderValue.female,
                },
              ]}
              placeholder="Chọn giới tính"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            hasFeedback
            name="phone"
            htmlFor="phone"
            label="Số điện thoại"
            rules={[
              ruleRequired("Số điện thoại không được để trống"),
              rulePhone(),
            ]}
          >
            <Input
              id="phone"
              size="large"
              placeholder="Nhập số điện thoại"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            hasFeedback
            name="email"
            htmlFor="email"
            label="Email"
            rules={[
              ruleRequired("Email không được để trống!"),
              ruleEmail(),
            ]}
          >
            <Input
              id="email"
              size="large"
              placeholder="Nhập email"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item
            name="houseNumber"
            htmlFor="houseNumber"
            label="Số nhà"
          >
            <Input
              id="houseNumber"
              size="large"
              placeholder="Số nhà"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={16}>
          <Form.Item name="streetName" htmlFor="streetName" label="Đường">
            <Input id="streetName" size="large" placeholder="Tên đường" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="ward" htmlFor="ward" label="Phường / xã">
            <Input id="ward" size="large" placeholder="Phường / xã" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="province" htmlFor="province" label="Tỉnh / thành phố">
            <Input
              id="province"
              size="large"
              placeholder="Tỉnh / thành phố"
            />
          </Form.Item>
        </Col>
      </Row>
      <Divider />
      <Form.Item className="public-account-profile__submit">
        <Button
          type="primary"
          htmlType="submit"
          loading={submitFormLoading}
          icon={<SaveOutlined />}
          size="large"
        >
          Lưu thay đổi
        </Button>
      </Form.Item>
    </div>
  );
};

export default ProfileInformationFieldsComponent;
