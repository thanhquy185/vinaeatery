import CardOrderSheetComponent from "./CardOrderSheetComponent";
import { List } from "antd";
import { ModalTitleValue, ModalWidthValue } from "../../constants/values";
import type { Dispatch, SetStateAction } from "react";
import type { ModalState } from "../../hooks/useModal";
import type { PageResponseType } from "../../types/PageResponseType";
import type { OrderSheetSummaryResponseType } from "../../types/OrderSheetType";

type MainOrderSheetListComponentProps = {
  nameEN: string;
  nameVN: string;
  orderSheetData: PageResponseType<OrderSheetSummaryResponseType>;
  isLoading: boolean;
  ManagerOrderSheetModals: {
    update: (
      orderSheetSummary: OrderSheetSummaryResponseType,
    ) => React.JSX.Element;
  };
  openModal: (payload: Omit<ModalState, "open">) => void;
  setPage: Dispatch<SetStateAction<number>>;
  setSize: Dispatch<SetStateAction<number>>;
};

const MainOrderSheetListComponent: React.FC<
  MainOrderSheetListComponentProps
> = ({
  nameEN,
  nameVN,
  orderSheetData,
  isLoading,
  ManagerOrderSheetModals,
  openModal,
  setPage,
  setSize,
}) => {
  return (
    <List
      itemLayout="horizontal"
      grid={{
        gutter: [12, 12],
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 5,
      }}
      dataSource={orderSheetData?.content || []}
      loading={isLoading}
      pagination={{
        current: (orderSheetData?.number ?? 0) + 1,
        pageSize: orderSheetData?.size ?? 10,
        total: orderSheetData?.totalElements ?? 0,

        showSizeChanger: true,
        pageSizeOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

        showTotal: (total, range) =>
          `${range[0]}-${range[1]} trong tổng số ${total} bản ghi`,
        onChange: (page, pageSize) => {
          setPage(page);
          setSize(pageSize);
        },
      }}
      renderItem={(orderSheet: OrderSheetSummaryResponseType) => (
        <List.Item
          style={{
            padding: 0,
            border: "none",
          }}
        >
          <CardOrderSheetComponent
            key={orderSheet.id}
            orderSheet={orderSheet}
            onClick={() =>
              openModal({
                title: ModalTitleValue.handle(nameVN.toLowerCase()),
                width: ModalWidthValue.active,
                className: nameEN,
                children: ManagerOrderSheetModals.update(orderSheet),
              })
            }
          />
        </List.Item>
      )}
      style={{ marginTop: 30 }}
    />
  );
};

export default MainOrderSheetListComponent;
