import useEntityQuery from "../../hooks/useEntityQuery2";
import PublicAccountPageHeaderComponent from "../../components/pages/public/account/PublicAccountPageHeaderComponent";
import PublicAccountFilterBarComponent from "../../components/pages/public/account/PublicAccountFilterBarComponent";
import PublicBillDetailModalComponent from "../../components/pages/public/account/PublicBillDetailModalComponent";
import PublicBillsListComponent from "../../components/pages/public/account/PublicBillsListComponent";
import BillApiService from "../../services/api/v1/BillApiService";
import { BillStatusValue } from "../../constants/values";
import { Button, Card, Layout, Typography } from "antd";
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
            <PublicBillsListComponent
              bills={visibleBills}
              isLoading={isLoading}
              isError={isError}
              totalBills={totalBills}
              currentPage={currentPage}
              currentPageSize={currentPageSize}
              emptyDescription={
                filter === "all"
                  ? "Bạn chưa có hóa đơn bàn ăn nào."
                  : "Không có hóa đơn ở trạng thái này."
              }
              showRestaurantsAction={filter === "all"}
              onRetry={() => refetch()}
              onPageChange={(nextPage, pageSize) => {
                setPage(nextPage);
                setSize(pageSize);
              }}
              onViewBillDetails={setSelectedBillId}
            />
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
