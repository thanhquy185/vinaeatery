import useEntityQuery from "../../../../hooks/useEntityQuery2";
import RestaurantLocationPickerComponent from "../../../shared/RestaurantLocationPicker";
import BillApiService from "../../../../services/api/v1/BillApiService";
import {
  BillPaymentStatusValue,
  BillStatusValue,
} from "../../../../constants/values";
import { vietnamMoneyFormat } from "../../../../utils/otherEvents";
import { Button, Divider, Empty, Modal, Spin, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import type { BillCustomerDetailResponseType } from "../../../../types/BillType";

const INITIAL_VISIBLE_BILL_ITEMS = 3;

type PublicBillDetailModalComponentProps = {
  billId: number | null;
  open: boolean;
  onClose: () => void;
};

const PublicBillDetailModalComponent: React.FC<
  PublicBillDetailModalComponentProps
> = ({ billId, open, onClose }) => {
  const [showAllItems, setShowAllItems] = useState(false);
  const {
    data: bill,
    isLoading,
    isError,
    refetch,
  } = useEntityQuery<BillCustomerDetailResponseType>({
    keys: ["customer-bill-detail", billId],
    params: { id: billId ?? undefined },
    enabled: open && billId !== null,
    api: BillApiService.handleGetCurrentCustomerBillDetail,
  });

  useEffect(() => {
    setShowAllItems(false);
  }, [billId, open]);

  const formattedCreateAt = bill ? dayjs(bill.createAt) : null;
  const statusColor =
    bill?.status === BillStatusValue.confirmed
      ? "success"
      : bill?.status === BillStatusValue.cancelled
        ? "error"
        : "default";

  return (
    <Modal
      open={open}
      centered
      width={760}
      footer={null}
      className="public-reservation-detail-modal public-bill-detail-modal"
      title={
        <div className="pr-6">
          <div className="public-reservation-detail-modal__title font-bold text-stone-900">
            Chi tiết hóa đơn bàn ăn
          </div>
          {billId !== null && (
            <div className="public-reservation-detail-modal__subtitle mt-1 font-medium text-stone-500">
              #{String(billId).padStart(6, "0")}{" "}
              {bill?.restaurant?.name ? `· ${bill.restaurant.name}` : ""}
            </div>
          )}
        </div>
      }
      onCancel={onClose}
    >
      <Divider className="my-4!" />
      <Spin spinning={isLoading}>
        {isError ? (
          <div className="py-8">
            <Empty description="Chưa thể tải chi tiết hóa đơn lúc này.">
              <Button onClick={() => refetch()}>Tải lại</Button>
            </Empty>
          </div>
        ) : bill ? (
          <>
            <div className="public-reservation-detail-summary public-bill-detail-summary">
              <div className="public-reservation-detail-summary__field">
                <Typography.Text className="public-reservation-detail-summary__label">
                  Thời gian lập hóa đơn
                </Typography.Text>
                <div className="public-reservation-detail-summary__value">
                  {formattedCreateAt?.isValid()
                    ? formattedCreateAt.format("DD/MM/YYYY · HH:mm")
                    : "—"}
                </div>
              </div>
              <div className="public-reservation-detail-summary__field">
                <Typography.Text className="public-reservation-detail-summary__label">
                  Trạng thái hóa đơn
                </Typography.Text>
                <div className="public-reservation-detail-summary__status">
                  <Tag color={statusColor} bordered={false}>
                    {bill.status}
                  </Tag>
                </div>
              </div>
              <div className="public-reservation-detail-summary__field">
                <Typography.Text className="public-reservation-detail-summary__label">
                  Phương thức thanh toán
                </Typography.Text>
                <div className="public-reservation-detail-summary__value">
                  {bill.paymentMethod?.name || "Chưa chọn phương thức"}
                </div>
              </div>
              <div className="public-reservation-detail-summary__field">
                <Typography.Text className="public-reservation-detail-summary__label">
                  Trạng thái thanh toán
                </Typography.Text>
                <div className="public-reservation-detail-summary__value">
                  {bill.paymentStatus || BillPaymentStatusValue.unpaid}
                </div>
              </div>
            </div>

            <section className="public-bill-detail-section">
              <Typography.Title level={5} className="mb-2!">
                Nhà hàng và bàn ăn
              </Typography.Title>
              <div className="public-reservation-detail-meta public-bill-detail-restaurant grid gap-x-6 gap-y-1 text-sm text-stone-600 sm:grid-cols-2">
                <p className="m-0">
                  <b>Nhà hàng:</b> {bill.restaurant?.name || "—"}
                </p>
                <p className="m-0">
                  <b>Điện thoại:</b> {bill.restaurant?.phone || "—"}
                </p>
                <p className="m-0">
                  <b>Email:</b> {bill.restaurant?.email || "—"}
                </p>
                <p className="m-0 sm:col-span-2">
                  <b>Địa chỉ:</b>{" "}
                  {[
                    bill.restaurant?.houseNumber,
                    bill.restaurant?.streetName,
                    bill.restaurant?.ward,
                    bill.restaurant?.province,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </p>
                <p className="m-0 sm:col-span-2">
                  <b>Bàn đã sử dụng:</b>{" "}
                  {bill.tables?.length
                    ? bill.tables
                        .map(
                          (table) =>
                            `${table.name}${table.floor?.name ? ` · ${table.floor.name}` : ""}`,
                        )
                        .join(", ")
                    : "Chưa có thông tin bàn"}
                </p>
              </div>
              <RestaurantLocationPickerComponent
                key={bill.restaurant.id}
                type="detail"
                height={400}
                marginTop={6}
                isShowInfo={false}
                latitude={bill.restaurant.latitude}
                longitude={bill.restaurant.longitude}
              />
            </section>

            <section className="public-bill-detail-section">
              <Typography.Title level={5} className="mb-3!">
                Món ăn đã gọi
              </Typography.Title>
              <div className="public-bill-detail-items">
                {bill.billDetails?.length ? (
                  bill.billDetails
                    .slice(
                      0,
                      showAllItems
                        ? bill.billDetails.length
                        : INITIAL_VISIBLE_BILL_ITEMS,
                    )
                    .map((item) => (
                      <div
                        className="public-bill-detail-item"
                        key={item.food?.id ?? item.foodNameSnapshot}
                      >
                        <div className="public-bill-detail-item__main">
                          <Typography.Text strong>
                            {item.foodNameSnapshot ||
                              item.food?.name ||
                              "Món ăn"}
                          </Typography.Text>
                          <Typography.Text type="secondary">
                            {item.quantity} {item.foodUnitSnapshot}
                          </Typography.Text>
                        </div>
                        <div className="public-bill-detail-item__price">
                          <span>{vietnamMoneyFormat(item.price)}</span>
                          <Typography.Text strong>
                            {vietnamMoneyFormat(item.totalPriceDetail)}
                          </Typography.Text>
                        </div>
                      </div>
                    ))
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Hóa đơn chưa có món ăn"
                  />
                )}
                {bill.billDetails?.length > INITIAL_VISIBLE_BILL_ITEMS && (
                  <div className="public-bill-detail-expand-row">
                    <Button
                      type="text"
                      className="public-bill-detail-expand"
                      onClick={() => setShowAllItems((visible) => !visible)}
                    >
                      {showAllItems
                        ? "Thu gọn"
                        : `Xem tất cả ${bill.billDetails.length} món`}
                    </Button>
                  </div>
                )}
                <div className="public-bill-detail-total">
                  <span>Tổng thanh toán</span>
                  <Typography.Text strong type="danger">
                    {vietnamMoneyFormat(
                      Number(bill.paymentTotalPrice || bill.totalPrice || 0),
                    )}
                  </Typography.Text>
                </div>
              </div>
            </section>

            <div className="public-reservation-detail-customer-card rounded-2xl border border-stone-200 p-4 sm:p-5">
              <Typography.Title level={5} className="mb-3!">
                Thông tin khách hàng
              </Typography.Title>
              <div className="public-reservation-detail-customer-info grid gap-x-6 gap-y-2 text-sm text-stone-600 sm:grid-cols-2">
                <p className="m-0">
                  <b>Họ và tên:</b> {bill.customerFullname}
                </p>
                <p className="m-0">
                  <b>Số điện thoại:</b> {bill.customerPhone}
                </p>
                <p className="m-0 sm:col-span-2">
                  <b>Email:</b> {bill.customerEmail}
                </p>
              </div>
            </div>
          </>
        ) : null}
      </Spin>
      <Divider className="my-4!" />
      <div className="flex justify-end">
        <Button onClick={onClose} type="primary" size="large">
          Đóng
        </Button>
      </div>
    </Modal>
  );
};

export default PublicBillDetailModalComponent;
