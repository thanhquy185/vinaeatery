import CardUseFoodComponent from "./CardUseFoodComponent";
import { List } from "antd";
import {
  FoodStatusValue,
  ModalTitleValue,
  ModalWidthValue,
} from "../../constants/values";
import type { Dispatch, SetStateAction } from "react";
import type { ModalState } from "../../hooks/useModal";
import type { PageResponseType } from "../../types/PageResponseType";
import type { UseFoodSummaryResponseType } from "../../types/UseFoodType";

type MainUseFoodListComponentProps = {
  nameEN: string;
  nameVN: string;
  useFoodData: PageResponseType<UseFoodSummaryResponseType>;
  isLoading: boolean;
  ManagerUseFoodModals: {
    update: (useFoodSummary: UseFoodSummaryResponseType) => React.JSX.Element;
  };
  openModal: (payload: Omit<ModalState, "open">) => void;
  setPage: Dispatch<SetStateAction<number>>;
  setSize: Dispatch<SetStateAction<number>>;
};

const MainUseFoodListComponent: React.FC<MainUseFoodListComponentProps> = ({
  nameEN,
  nameVN,
  useFoodData,
  isLoading,
  ManagerUseFoodModals,
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
        lg: 3,
        xl: 4,
      }}
      dataSource={useFoodData?.content || []}
      loading={isLoading}
      pagination={{
        current: (useFoodData?.number ?? 0) + 1,
        pageSize: useFoodData?.size ?? 12,
        total: useFoodData?.totalElements ?? 0,

        showSizeChanger: true,
        pageSizeOptions: [10, 15, 20, 25, 30, 35, 40, 45, 50],

        showTotal: (total, range) =>
          `${range[0]}-${range[1]} trong tổng số ${total} bản ghi`,
        onChange: (page, pageSize) => {
          setPage(page);
          setSize(pageSize);
        },
      }}
      renderItem={(useFood) => {
        if (useFood.food.status !== FoodStatusValue.active) return;

        return (
          <List.Item>
            <CardUseFoodComponent
              useFood={useFood}
              onClick={() => {
                openModal({
                  title: ModalTitleValue.handle(nameVN.toLowerCase()),
                  width: ModalWidthValue.active,
                  className: nameEN,
                  children: ManagerUseFoodModals.update(useFood),
                });
              }}
            />
          </List.Item>
        );
      }}
      className="admin-manager-main__use-foods"
    />
  );
};

export default MainUseFoodListComponent;
