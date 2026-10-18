import useEntityMutation from "../../../../../hooks/useEntityMutation";
import ReservationApiService from "../../../../../services/api/v1/ReservationApiService";
import dayjs from "dayjs";
import {
  DatePicker,
  Input,
  InputNumber,
  Form,
  Button,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ruleRequired, rulePhone, ruleEmail } from "../../../../../constants/rules";
import { ReservationStatusValue } from "../../../../../constants/values";
import { openConfirmation } from "../../../../../utils/showConfirmationUtil";
import type { Dispatch, SetStateAction } from "react";
import type { ReservationStatusEnum } from "../../../../../constants/enums";
import type { RestaurantPublicResponseType } from "../../../../../types/RestaurantType";
import type { CustomerDetailResponseType } from "../../../../../types/CustomerType";
import type {
  ReservationCustomerCreateRequestType,
  ReservationDetailResponseType,
} from "../../../../../types/ReservationType";

type RestaurantDetailHeaderReservationComponentProps = {
  customerLogin: CustomerDetailResponseType;
  restaurant: RestaurantPublicResponseType;
  setShowReservation: Dispatch<SetStateAction<boolean>>;
};

const RestaurantDetailHeaderReservationComponent: React.FC<
  RestaurantDetailHeaderReservationComponentProps
> = ({ customerLogin, restaurant, setShowReservation }) => {
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
    <section
      className="restaurant-reservation-panel"
      aria-labelledby="reservation-title"
    >
      <header className="restaurant-reservation-panel__header">
        <Button
          className="restaurant-reservation-panel__back"
          icon={<ArrowLeftOutlined />}
          onClick={() => setShowReservation(false)}
          aria-label="Quay lại chi tiết nhà hàng"
        />
        <div className="restaurant-reservation-panel__heading">
          <span className="restaurant-reservation-panel__eyebrow">
            ĐẶT BÀN TRỰC TUYẾN
          </span>
          <Typography.Title level={3} id="reservation-title">
            Đặt bàn tại {restaurant.name}
          </Typography.Title>
          <p>Để lại thông tin, nhà hàng sẽ chuẩn bị đón tiếp bạn.</p>
        </div>
      </header>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        className="restaurant-reservation-panel__form"
        initialValues={{
          createAt: dayjs(),
          customerFullname: customerLogin.fullname || undefined,
          customerPhone: customerLogin.phone || undefined,
          customerEmail: customerLogin.email || undefined,
        }}
        onFinish={async () => {
          const answer = await openConfirmation({
            title: "Xác nhận đặt bàn",
            content: `Gửi yêu cầu đặt bàn tại ${restaurant.name}?`,
          });
          if (answer) {
            const values = form.getFieldsValue();

            const response = await customerCreateMutation.mutateAsync({
              values: {
                ...values,
                restaurantId: restaurant.id,
                createAt: values.createAt
                  ? dayjs(values.createAt).format("YYYY-MM-DD HH:mm:ss")
                  : dayjs().format("YYYY-MM-DD HH:mm:ss"),
                arriveAt: values.arriveAt
                  ? dayjs(values.arriveAt).format("YYYY-MM-DD HH:mm:ss")
                  : dayjs().format("YYYY-MM-DD HH:mm:ss"),
                status: ReservationStatusValue.pending as ReservationStatusEnum,
              },
            });
            if (response) {
              setShowReservation(false);
            }
          }
        }}
      >
        <div className="restaurant-reservation-panel__fields">
          <div className="restaurant-reservation-panel__section-heading">
            <span><CalendarOutlined /></span>
            <div>
              <strong>Thời gian</strong>
              <small>Chọn thời điểm bạn dự định đến nhà hàng.</small>
            </div>
          </div>
          <div className="restaurant-reservation-panel__field-grid">
            <Form.Item name="createAt" label="Thời gian đặt bàn">
              <DatePicker
                showTime
                style={{ width: "100%", height: 40 }}
                disabled
              />
            </Form.Item>
            <Form.Item
              hasFeedback
              name="arriveAt"
              label="Thời gian dự kiến"
              rules={[ruleRequired("Cần chọn Thời gian dự kiến!")]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Chọn Thời gian dự kiến"
                style={{ width: "100%", height: 40 }}
              />
            </Form.Item>
          </div>

          <div className="restaurant-reservation-panel__section-heading">
            <span>
              <UserOutlined />
            </span>
            <div>
              <strong>Thông tin liên hệ</strong>
              <small>Nhà hàng dùng thông tin này để xác nhận đặt bàn.</small>
            </div>
          </div>
          <div className="restaurant-reservation-panel__field-grid">
            <Form.Item
              hasFeedback
              name="customerFullname"
              label="Họ và tên"
              rules={[ruleRequired("Cần nhập Họ và tên!")]}
            >
              <Input placeholder="Nhập Họ và tên" style={{ height: 40 }} />
            </Form.Item>
            <Form.Item
              hasFeedback
              name="customerGuests"
              label="Số lượng khách"
              rules={[ruleRequired("Cần nhập Số lượng khách!")]}
            >
              <InputNumber
                min={1}
                placeholder="Nhập Số lượng khách"
                style={{ width: "100%", height: 40 }}
              />
            </Form.Item>
            <Form.Item
              hasFeedback
              name="customerPhone"
              label="Số điện thoại"
              rules={[ruleRequired("Cần nhập Số điện thoại!"), rulePhone()]}
            >
              <Input placeholder="Nhập Số điện thoại" style={{ height: 40 }} />
            </Form.Item>
            <Form.Item
              hasFeedback
              name="customerEmail"
              label="Email"
              rules={[ruleRequired("Cần nhập Email!"), ruleEmail()]}
            >
              <Input placeholder="Nhập Email" style={{ height: 40 }} />
            </Form.Item>
          </div>
          <Form.Item
            name="customerNote"
            htmlFor="customerNote"
            label="Ghi chú cho nhà hàng"
          >
            <Input.TextArea
              id="customerNote"
              rows={4}
              placeholder="Dị ứng thực phẩm, yêu cầu chỗ ngồi..."
              showCount
              maxLength={500}
            />
          </Form.Item>
        </div>

        <div className="restaurant-reservation-panel__actions">
          <Button
            className="restaurant-reservation-panel__cancel"
            onClick={() => setShowReservation(false)}
          >
            Quay lại nhà hàng
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="restaurant-reservation-panel__submit"
            loading={customerCreateMutation.isPending}
          >
            Xác nhận đặt bàn
          </Button>
        </div>
      </Form>
    </section>
  );
};

export default RestaurantDetailHeaderReservationComponent;
