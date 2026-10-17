import useEntityQuery from "../../hooks/useEntityQuery2";
import PublicAccountPageHeaderComponent from "../../components/layout/PublicAccountPageHeaderComponent";
import PublicAccountFilterBarComponent from "../../components/layout/PublicAccountFilterBarComponent";
import PublicBillDetailModalComponent from "../../components/layout/PublicBillDetailModalComponent";
import BillApiService from "../../services/api/v1/BillApiService";
import {
  BillPaymentStatusValue,
  BillStatusValue,
} from "../../constants/values";
import { vietnamMoneyFormat } from "../../utils/otherEvents";
import {
  Button,
  Card,
  Empty,
  Layout,
  Pagination,
  Skeleton,
  Tag,
  Typography,
} from "antd";
import {
  Armchair,
  CalendarDays,
  CircleCheck,
  CircleX,
  Clock3,
  CreditCard,
  Utensils,
} from "lucide-react";
import dayjs from "dayjs";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { PublicPageProps } from "../../constants/props";
import type { BillCustomerResponseType } from "../../types/BillType";
import type { PageResponseType } from "../../types/PageResponseType";

type BillFilter = "all" | "pending" | "confirmed" | "cancelled";

const statusLabel: Record<Exclude<BillFilter, "all">, string> = {
  pending: BillStatusValue.pending,
  confirmed: BillStatusValue.confirmed,
  cancelled: BillStatusValue.cancelled,
};

const getBillStatus = (status: BillCustomerResponseType["status"]) => {
  if (status === BillStatusValue.confirmed) {
    return { color: "success" };
  }
  if (status === BillStatusValue.cancelled) {
    return { color: "error" };
  }
  return { color: "warning" };
};

const BillsPage: React.FC<PublicPageProps> = ({
  isCustomer,
  customerLogin,
}) => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [filter, setFilter] = useState<BillFilter>("all");
  const [selectedBillId, setSelectedBillId] = useState<number | null>(null);
  const {
    data: billResponse,
    isLoading,
    isError,
    refetch,
  } = useEntityQuery<
    PageResponseType<BillCustomerResponseType> | BillCustomerResponseType[]
  >({
    keys: ["customer-bills", customerLogin?.id, page, size, filter],
    params: {
      page,
      size,
      sort: "create_at__desc",
      statusValue: filter === "all" ? undefined : [statusLabel[filter]],
    },
    enabled: isCustomer,
    api: BillApiService.handleGetCurrentCustomerBills,
  });

  const allBills = Array.isArray(billResponse)
    ? billResponse
    : billResponse?.content || [];
  const selectedStatus = filter === "all" ? undefined : statusLabel[filter];
  const legacyBills = Array.isArray(billResponse)
    ? allBills.filter(
        (bill) => !selectedStatus || bill.status === selectedStatus,
      )
    : [];
  const visibleBills = Array.isArray(billResponse)
    ? legacyBills.slice((page - 1) * size, page * size)
    : allBills;
  const totalBills = Array.isArray(billResponse)
    ? legacyBills.length
    : (billResponse?.totalElements ?? 0);
  const currentPage = Array.isArray(billResponse)
    ? page
    : (billResponse?.number ?? 0) + 1;
  const currentPageSize = Array.isArray(billResponse)
    ? size
    : (billResponse?.size ?? size);

  const tabs: { key: BillFilter; label: string }[] = [
    { key: "all", label: "Tất cả" },
    {
      key: "pending",
      label: BillStatusValue.pending,
    },
    {
      key: "confirmed",
      label: BillStatusValue.confirmed,
    },
    {
      key: "cancelled",
      label: BillStatusValue.cancelled,
    },
  ];

  return (
    <Layout className="public-account-layout">
      <div className="public-account-page">
        <PublicAccountPageHeaderComponent
          title="Hóa đơn bàn ăn"
          action={
            <Link to="/public/restaurant">
              <Button
                size="large"
                className="public-account-page__action public-account-page__action--secondary"
              >
                Khám phá nhà hàng
              </Button>
            </Link>
          }
        />
        <Card styles={{ body: { padding: 0 } }} className="public-account-card">
          <div className="public-account-card__header">
            <div>
              <Typography.Title
                level={4}
                className="public-account-card__title"
              >
                Danh sách hóa đơn
              </Typography.Title>
              <Typography.Text type="secondary">
                {isLoading
                  ? "Đang cập nhật hóa đơn..."
                  : `${totalBills} hóa đơn`}
              </Typography.Text>
            </div>
            <PublicAccountFilterBarComponent
              value={filter}
              onChange={(value) => {
                setFilter(value as BillFilter);
                setPage(1);
              }}
              options={tabs.map(({ key, label }) => ({
                key,
                label,
              }))}
            />
          </div>
          <div className="public-account-card__content public-bill-list">
            {isLoading ? (
              <div className="public-bill-list__loading">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="public-bill-list__skeleton">
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="public-account-state">
                <Empty description="Chưa thể tải danh sách hóa đơn lúc này.">
                  <Button type="primary" onClick={() => refetch()}>
                    Tải lại danh sách
                  </Button>
                </Empty>
              </div>
            ) : visibleBills.length === 0 ? (
              <div className="public-account-state">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    filter === "all"
                      ? "Bạn chưa có hóa đơn bàn ăn nào."
                      : "Không có hóa đơn ở trạng thái này."
                  }
                >
                  {filter === "all" && (
                    <Link to="/public/restaurant">
                      <Button type="primary">Xem nhà hàng</Button>
                    </Link>
                  )}
                </Empty>
              </div>
            ) : (
              <div className="public-bill-list__items">
                {visibleBills.map((bill) => {
                  const status = getBillStatus(bill.status);
                  const formattedDate = dayjs(bill.createAt);
                  const total = Number(
                    bill.paymentTotalPrice || bill.totalPrice || 0,
                  );
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
                        .join(
                          ", ",
                        )}${bill.items.length > 3 ? ` và ${bill.items.length - 3} món khác` : ""}`
                    : "Chưa có món ăn";

                  return (
                    <article key={bill.id} className="public-bill-item">
                      <div className="public-bill-item__header">
                        <div className="public-bill-item__identity">
                          <div className="public-bill-item__code">
                            <div className="public-bill-item__eyebrow">
                              Mã hóa đơn
                            </div>
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
                          color={status.color}
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
                            <div className="public-bill-item__eyebrow">
                              Bàn ăn
                            </div>
                            <div className="public-bill-item__value">
                              {tableSummary}
                            </div>
                          </div>
                        </div>
                        <div className="public-bill-item__detail">
                          <Utensils size={16} />
                          <div>
                            <div className="public-bill-item__eyebrow">
                              Món ăn
                            </div>
                            <div className="public-bill-item__value">
                              {itemSummary}
                            </div>
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
                                {bill.paymentMethod?.name ||
                                  "Chưa chọn phương thức"}
                              </div>
                            </div>
                          </div>
                          <div className="public-bill-item__detail">
                            {bill.paymentStatus ===
                            BillPaymentStatusValue.paid ? (
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
                                  bill.paymentStatus ===
                                  BillPaymentStatusValue.paid
                                    ? "is-paid"
                                    : "is-unpaid"
                                }`}
                              >
                                {bill.paymentStatus ||
                                  BillPaymentStatusValue.unpaid}
                              </div>
                              {bill.paymentAt && (
                                <div className="public-bill-item__paid-date">
                                  {dayjs(bill.paymentAt).format(
                                    "DD/MM/YYYY · HH:mm",
                                  )}
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
                          onClick={() => setSelectedBillId(bill.id)}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
            {!isLoading && !isError && totalBills > 0 && (
              <Pagination
                className="public-bill-list__pagination"
                current={currentPage}
                pageSize={currentPageSize}
                total={totalBills}
                showSizeChanger
                pageSizeOptions={[5, 10, 15, 20]}
                showTotal={(total, range) =>
                  `${range[0]}–${range[1]} / ${total} hóa đơn`
                }
                onChange={(nextPage, pageSize) => {
                  setPage(nextPage);
                  setSize(pageSize);
                }}
              />
            )}
          </div>
        </Card>
        <PublicBillDetailModalComponent
          billId={selectedBillId}
          open={selectedBillId !== null}
          onClose={() => setSelectedBillId(null)}
        />
      </div>
    </Layout>
  );
};

export default BillsPage;
