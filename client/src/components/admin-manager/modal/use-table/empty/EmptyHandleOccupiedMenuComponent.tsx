import useEntityQuery from "../../../../../hooks/useEntityQuery2";
import CardMenuComponent from "../CardMenuComponent";
import MenuApiService from "../../../../../services/api/v1/MenuApiService";
import { useMemo, useState } from "react";
import { List, Radio } from "antd";
import {
  CommonStatusValue,
  MenuTypeValue,
} from "../../../../../constants/values";
import type { MenuSummaryResponseType } from "../../../../../types/MenuType";
import type { PageResponseType } from "../../../../../types/PageResponseType";
import type { ManagerHandleUpdateStatusUseTableProps } from "../../../../../constants/props";

const EmptyHandleOccupiedMenuComponent: React.FC<
  ManagerHandleUpdateStatusUseTableProps
> = ({
  restaurantId,
  infoRequest,
  setInfoRequest,
  menuAlaCarte,
  setMenuAlaCarte,
}) => {
  // Các biến để lọc dữ liệu
  // - Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(4);

  // Dữ liệu về thực đơn
  const { data: menuData, isLoading } = useEntityQuery<
    PageResponseType<MenuSummaryResponseType>
  >({
    keys: [
      "menus",
      page,
      size,
      restaurantId,
      menuAlaCarte,
      CommonStatusValue.active,
    ],
    params: {
      page: page,
      size: size,
      restaurantId: restaurantId,
      categoryValue: menuAlaCarte
        ? [MenuTypeValue.ala_carte]
        : [MenuTypeValue.buffet],
      statusValue: [CommonStatusValue.active],
    },
    api: MenuApiService.handleGetSummary,
  });

  useMemo(() => {
    setInfoRequest!({ ...infoRequest!, menuId: 0 });
  }, [menuAlaCarte]);

  return (
    <>
      <div className="info">
        <b>Thông tin thực đơn</b>
      </div>
      <Radio.Group
        defaultValue={true}
        buttonStyle="solid"
        style={{ width: "100%", margin: "10px 0 16px" }}
        onChange={(e) => setMenuAlaCarte!(e.target.value)}
      >
        <Radio.Button value={true}>{MenuTypeValue.ala_carte}</Radio.Button>
        <Radio.Button value={false}>{MenuTypeValue.buffet}</Radio.Button>
      </Radio.Group>
      <List
        itemLayout="horizontal"
        grid={{
          gutter: [16, 16],
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4,
        }}
        pagination={{
          current: (menuData?.number ?? 0) + 1,
          pageSize: menuData?.size ?? 4,
          total: menuData?.totalElements ?? 0,

          showSizeChanger: true,
          pageSizeOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trong tổng số ${total} bản ghi`,
          onChange: (page, pageSize) => {
            setPage(page);
            setSize(pageSize);
          },
        }}
        dataSource={menuData?.content || []}
        loading={isLoading}
        renderItem={(menu) => {
          return (
            <List.Item
              onClick={() => {
                if (menu.id !== infoRequest?.menuId) {
                  setInfoRequest!({ ...infoRequest!, menuId: menu.id });
                } else {
                  setInfoRequest!({ ...infoRequest!, menuId: 0 });
                }
              }}
              className={`${infoRequest?.menuId === menu.id ? "active" : ""}`}
            >
              <CardMenuComponent menu={menu} />
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default EmptyHandleOccupiedMenuComponent;
