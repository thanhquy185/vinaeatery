import useEntityMutation from "../../../hooks/useEntityMutation";
import ReservationApiService from "../../../services/api/v1/ReservationApiService";
import dayjs from "dayjs";
import {
  Divider,
  Row,
  Col,
  DatePicker,
  Input,
  InputNumber,
  Form,
  Button,
  Typography,
  Space,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { ruleRequired, rulePhone, ruleEmail } from "../../../constants/rules";
import { ReservationStatusValue } from "../../../constants/values";
import { openConfirmation } from "../../../utils/showConfirmation";
import type { Dispatch, SetStateAction } from "react";
import type { ReservationStatusEnum } from "../../../constants/enums";
import type { RestaurantPublicResponseType } from "../../../types/RestaurantType";
import type { CustomerDetailResponseType } from "../../../types/CustomerType";
import type {
  ReservationCustomerCreateRequestType,
  ReservationDetailResponseType,
} from "../../../types/ReservationType";

type RestaurantDetailHeaderReservationComponentProps = {
  customerLogin: CustomerDetailResponseType;
  restaurant: RestaurantPublicResponseType;
  showReservation: boolean;
  setShowReservation: Dispatch<SetStateAction<boolean>>;
};

const RestaurantDetailHeaderReservationComponent: React.FC<
  RestaurantDetailHeaderReservationComponentProps
> = ({ customerLogin, restaurant, showReservation, setShowReservation }) => {
  const [form] = Form.useForm<ReservationCustomerCreateRequestType>();

  const customerCreateMutation = useEntityMutation<
    ReservationCustomerCreateRequestType,
    ReservationDetailResponseType
  >({
    messages: {
      success: `Khách hàng tạo đơn đặt bàn thành công!`,
      error: `Khách hàng tạo đơn đặt bàn thất bại!`,
    },
    invalidateKeys: [["customer", "reservation"]],
    api: ReservationApiService.handleCustomerCreate,
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: "calc(50% + 65px)",
        zIndex: 1000,
        background: "#fff",
        width: "35%",
        padding: 16,
        borderRadius: 12,
        overflowY: "auto",
        opacity: showReservation ? 1 : 0,
        transform: showReservation ? "translateX(0)" : "translateX(-30px)",
        transition: "all 0.3s ease",
        pointerEvents: showReservation ? "auto" : "none",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}
      className="restaurant-detail-header-reservation"
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        initialValues={{
          createAt: dayjs(),
          customerFullname: customerLogin.fullname || undefined,
          customerPhone: customerLogin.phone || undefined,
          customerEmail: customerLogin.email || undefined,
        }}
        onFinish={async () => {
          const answer = await openConfirmation({
            title: `Bạn có chắc chắn cập nhật thông tin ?`,
            content: "Hành động này không thể hoàn tác.",
          });
          if (answer) {
            const values = form.getFieldsValue();

            const response = await customerCreateMutation.mutateAsync({
              values: {
                ...values,
                restaurantId: restaurant.id,
                customerId: customerLogin.id,
                createAt: values.createAt
                  ? dayjs(values.createAt).format("YYYY-MM-DD HH:mm:ss")
                  : dayjs().format("YYYY-MM-DD HH:mm:s"),
                arriveAt: values.arriveAt
                  ? dayjs(values.arriveAt).format("YYYY-MM-DD HH:mm:ss")
                  : dayjs().format("YYYY-MM-DD HH:mm:s"),
                status: ReservationStatusValue.pending as ReservationStatusEnum,
              },
            });
            if (response) {
              setShowReservation(false);
            }
          }
        }}
      >
        <Space>
          <Button
            color="primary"
            variant="filled"
            icon={<CloseOutlined />}
            onClick={() => setShowReservation(false)}
          />
          <Typography.Title
            level={4}
            style={{
              marginBottom: 0,
            }}
          >
            Đặt bàn {restaurant.name}
          </Typography.Title>
        </Space>
        <Divider style={{ margin: "16px 0" }} />
        <Row className="gap-6 mt-6!">
          <Col className="flex-1">
            <Form.Item
              name="createAt"
              label={<span style={{ fontWeight: 600 }}>Thời gian đặt bàn</span>}
            >
              <DatePicker
                showTime
                style={{ width: "100%", height: 40 }}
                disabled
              />
            </Form.Item>
          </Col>
          <Col className="flex-1">
            <Form.Item
              hasFeedback
              name="arriveAt"
              label={<span style={{ fontWeight: 600 }}>Thời gian dự kiến</span>}
              rules={[ruleRequired("Cần chọn Thời gian dự kiến!")]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Chọn Thời gian dự kiến"
                style={{ width: "100%", height: 40 }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="gap-6 mt-6!">
          <Col className="flex-1">
            <Form.Item
              hasFeedback
              name="customerFullname"
              label={<span style={{ fontWeight: 600 }}>Họ và tên</span>}
              rules={[ruleRequired("Cần nhập Họ và tên!")]}
            >
              <Input placeholder="Nhập Họ và tên" style={{ height: 40 }} />
            </Form.Item>
          </Col>
          <Col className="flex-1">
            <Form.Item
              hasFeedback
              name="customerGuests"
              label={<span style={{ fontWeight: 600 }}>Số lượng khách</span>}
              rules={[ruleRequired("Cần nhập Số lượng khách!")]}
            >
              <InputNumber
                min={1}
                placeholder="Nhập Số lượng khách"
                style={{ width: "100%", height: 40 }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="gap-6 mt-6!">
          <Col className="flex-1">
            <Form.Item
              hasFeedback
              name="customerPhone"
              label={<span style={{ fontWeight: 600 }}>Số điện thoại</span>}
              rules={[ruleRequired("Cần nhập Số điện thoại!"), rulePhone()]}
            >
              <Input placeholder="Nhập Số điện thoại" style={{ height: 40 }} />
            </Form.Item>
          </Col>
          <Col className="flex-1">
            <Form.Item
              hasFeedback
              name="customerEmail"
              label={<span style={{ fontWeight: 600 }}>Email</span>}
              rules={[ruleRequired("Cần nhập Email!"), ruleEmail()]}
            >
              <Input placeholder="Nhập Email" style={{ height: 40 }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="customerNote"
          htmlFor="customerNote"
          label={<span style={{ fontWeight: 600 }}>Ghi chú</span>}
          className="mt-6!"
        >
          <Input.TextArea
            id="customerNote"
            rows={5}
            placeholder="Nhập Ghi chú"
          />
        </Form.Item>
        <Divider style={{ margin: "16px 0" }} />
        <Button
          type="primary"
          htmlType="submit"
          className="w-full mt-6"
          style={{ height: 35, fontWeight: 600 }}
        >
          Xác nhận đặt bàn
        </Button>
      </Form>
    </div>
  );
};

export default RestaurantDetailHeaderReservationComponent;
