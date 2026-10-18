import { Button, Empty, Pagination, Skeleton } from "antd";
import { Link } from "react-router-dom";
import PublicBillItemComponent from "./PublicBillItemComponent";
import type { BillCustomerResponseType } from "../../../../types/BillType";

interface PublicBillsListComponentProps {
  bills: BillCustomerResponseType[];
  isLoading: boolean;
  isError: boolean;
  totalBills: number;
  currentPage: number;
  currentPageSize: number;
  emptyDescription: string;
  showRestaurantsAction: boolean;
  onRetry: () => void;
  onPageChange: (page: number, pageSize: number) => void;
  onViewBillDetails: (billId: number) => void;
}

const PublicBillsListComponent: React.FC<PublicBillsListComponentProps> = ({
  bills,
  isLoading,
  isError,
  totalBills,
  currentPage,
  currentPageSize,
  emptyDescription,
  showRestaurantsAction,
  onRetry,
  onPageChange,
  onViewBillDetails,
}) => (
  <>
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
          <Button type="primary" onClick={onRetry}>
            Tải lại danh sách
          </Button>
        </Empty>
      </div>
    ) : bills.length === 0 ? (
      <div className="public-account-state">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={emptyDescription}
        >
          {showRestaurantsAction && (
            <Link to="/public/restaurant">
              <Button type="primary">Xem nhà hàng</Button>
            </Link>
          )}
        </Empty>
      </div>
    ) : (
      <div className="public-bill-list__items">
        {bills.map((bill) => (
          <PublicBillItemComponent
            key={bill.id}
            bill={bill}
            onViewDetails={onViewBillDetails}
          />
        ))}
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
        showTotal={(total, range) => `${range[0]}–${range[1]} / ${total} hóa đơn`}
        onChange={onPageChange}
      />
    )}
  </>
);

export default PublicBillsListComponent;
