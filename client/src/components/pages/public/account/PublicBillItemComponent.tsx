import {
  Armchair,
  CalendarDays,
  CircleCheck,
  Clock3,
  CreditCard,
  Utensils,
} from "lucide-react";
import { Button, Tag } from "antd";
import dayjs from "dayjs";
import {
  BillPaymentStatusValue,
  BillStatusValue,
} from "../../../../constants/values";
import { vietnamMoneyFormat } from "../../../../utils/otherEvents";
import type { BillCustomerResponseType } from "../../../../types/BillType";

interface PublicBillItemComponentProps {
  bill: BillCustomerResponseType;
  onViewDetails: (billId: number) => void;
}

const PublicBillItemComponent: React.FC<PublicBillItemComponentProps> = ({
  bill,
  onViewDetails,
}) => {
  const statusColor =
    bill.status === BillStatusValue.confirmed
      ? "success"
      : bill.status === BillStatusValue.cancelled
        ? "error"
        : "warning";
  const formattedDate = dayjs(bill.createAt);
  const total = Number(bill.paymentTotalPrice || bill.totalPrice || 0);
  const tableSummary = bill.tables?.length
    ? bill.tables
        .map(
          (table) =>
            `${table.name}${table.floor?.name ? ` · ${table.floor.name}` : ""}`,
        )
        .join(", ")
    : "Chưa có thông tin bàn";
  const itemSummary = bill.items?.length
    ? `${bill.items
        .slice(0, 3)
        .map((item) => `${item.foodName} × ${item.quantity}`)
        .join(", ")}${bill.items.length > 3 ? ` và ${bill.items.length - 3} món khác` : ""}`
    : "Chưa có món ăn";

  return (
    <article className="public-bill-item">
      <div className="public-bill-item__header">
        <div className="public-bill-item__identity">
          <div className="public-bill-item__code">
            <div className="public-bill-item__eyebrow">Mã hóa đơn</div>
            <div className="public-bill-item__number">
              #{String(bill.id).padStart(6, "0")}
            </div>
          </div>
          <div className="public-bill-item__date">
            <CalendarDays size={15} />
            {formattedDate.isValid()
              ? formattedDate.format("DD/MM/YYYY · HH:mm")
              : "Chưa có thời gian"}
          </div>
        </div>
        <Tag
          color={statusColor}
          bordered={false}
          className="public-bill-item__status"
        >
          {bill.status}
        </Tag>
      </div>
      <div className="public-bill-item__facts">
        <div className="public-bill-item__detail">
          <Armchair size={16} />
          <div>
            <div className="public-bill-item__eyebrow">Bàn ăn</div>
            <div className="public-bill-item__value">{tableSummary}</div>
          </div>
        </div>
        <div className="public-bill-item__detail">
          <Utensils size={16} />
          <div>
            <div className="public-bill-item__eyebrow">Món ăn</div>
            <div className="public-bill-item__value">{itemSummary}</div>
          </div>
        </div>
      </div>
      <div className="public-bill-item__body">
        <div className="public-bill-item__details">
          <div className="public-bill-item__detail">
            <CreditCard size={16} />
            <div>
              <div className="public-bill-item__eyebrow">
                Phương thức thanh toán
              </div>
              <div className="public-bill-item__value">
                {bill.paymentMethod?.name || "Chưa chọn phương thức"}
              </div>
            </div>
          </div>
          <div className="public-bill-item__detail">
            {bill.paymentStatus === BillPaymentStatusValue.paid ? (
              <CircleCheck size={16} className="is-paid" />
            ) : (
              <Clock3 size={16} className="is-unpaid" />
            )}
            <div>
              <div className="public-bill-item__eyebrow">
                Trạng thái thanh toán
              </div>
              <div
                className={`public-bill-item__value ${
                  bill.paymentStatus === BillPaymentStatusValue.paid
                    ? "is-paid"
                    : "is-unpaid"
                }`}
              >
                {bill.paymentStatus || BillPaymentStatusValue.unpaid}
              </div>
              {bill.paymentAt && (
                <div className="public-bill-item__paid-date">
                  {dayjs(bill.paymentAt).format("DD/MM/YYYY · HH:mm")}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="public-bill-item__summary">
          <div className="public-bill-item__total">
            <span className="public-bill-item__eyebrow public-bill-item__total-label">
              Tổng thanh toán
            </span>
            <div className="public-bill-item__amount">
              {vietnamMoneyFormat(total)}
            </div>
          </div>
        </div>
      </div>
      <div className="public-bill-item__actions">
        <Button
          type="text"
          className="public-bill-item__detail-action"
          icon={<CalendarDays size={15} />}
          onClick={() => onViewDetails(bill.id)}
        >
          Xem chi tiết
        </Button>
      </div>
    </article>
  );
};

export default PublicBillItemComponent;
