import CardUseTableComponent from "./CardUseTableComponent";
import { List } from "antd";
import {
  ModalTitleValue,
  ModalWidthValue,
  UseTableStatusValue,
} from "../../constants/values";
import type { Dispatch, SetStateAction } from "react";
import type { ModalState } from "../../hooks/useModal";
import type { PageResponseType } from "../../types/PageResponseType";
import type { UseTableSummaryResponseType } from "../../types/UseTableType";

type MainUseTableListComponentProps = {
  nameEN: string;
  nameVN: string;
  useTableData: PageResponseType<UseTableSummaryResponseType>;
  isLoading: boolean;
  ManagerUseTableModals: {
    occupied: (
      useTableSummary: UseTableSummaryResponseType,
    ) => React.JSX.Element;
    reserved: (
      useTableSummary: UseTableSummaryResponseType,
    ) => React.JSX.Element;
    empty: (useTableSummary: UseTableSummaryResponseType) => React.JSX.Element;
    repair: (useTableSummary: UseTableSummaryResponseType) => React.JSX.Element;
  };
  openModal: (payload: Omit<ModalState, "open">) => void;
  setPage: Dispatch<SetStateAction<number>>;
  setSize: Dispatch<SetStateAction<number>>;
};

const MainUseTableListComponent: React.FC<MainUseTableListComponentProps> = ({
  nameEN,
  nameVN,
  useTableData,
  isLoading,
  ManagerUseTableModals,
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
        xl: 4,
      }}
      dataSource={useTableData?.content || []}
      loading={isLoading}
      pagination={{
        current: (useTableData?.number ?? 0) + 1,
        pageSize: useTableData?.size ?? 12,
        total: useTableData?.totalElements ?? 0,

        showSizeChanger: true,
        pageSizeOptions: [10, 15, 20, 25, 30, 35, 40, 45, 50],

        showTotal: (total, range) =>
          `${range[0]}-${range[1]} trong tổng số ${total} bản ghi`,
        onChange: (page, pageSize) => {
          setPage(page);
          setSize(pageSize);
        },
      }}
      renderItem={(useTable: UseTableSummaryResponseType) => (
        <List.Item
          style={{
            padding: 0,
            border: "none",
          }}
        >
          <CardUseTableComponent
            key={useTable.id}
            useTable={useTable}
            onClick={() =>
              openModal({
                title: ModalTitleValue.handle(nameVN.toLowerCase()),
                width: ModalWidthValue.active,
                className: nameEN,
                children:
                  useTable.status === UseTableStatusValue.occupied
                    ? ManagerUseTableModals.occupied(useTable)
                    : useTable.status === UseTableStatusValue.reserved
                      ? ManagerUseTableModals.reserved(useTable)
                      : useTable.status === UseTableStatusValue.empty
                        ? ManagerUseTableModals.empty(useTable)
                        : ManagerUseTableModals.repair(useTable),
              })
            }
          />
        </List.Item>
      )}
      className="admin-manager-main__use-tables"
    />
  );
};

export default MainUseTableListComponent;
