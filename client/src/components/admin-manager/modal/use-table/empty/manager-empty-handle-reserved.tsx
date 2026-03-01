import { useState, type FC } from "react";
import { Divider, List } from "antd";
import {
  ClockCheck,
  ClockPlus,
  ListOrdered,
  Mail,
  NotebookPen,
  Phone,
  User,
} from "lucide-react";
import type { ManagerHandleUseTableProps } from "../../../../../common/props";
import {
  ImageSourcePath,
  OrderStatus,
  UseTableStatus,
} from "../../../../../common/values";
import type { OrderTableType } from "../../../../../common/types";
import { useEntityQuery } from "../../../../../hook/use-entity-query";
import { FindAllOrderTable } from "../../../../../requests/order-tables";
import { openNotification } from "../../../../../utils/show-notification";
import dayjs from "dayjs";

// Manager Empty Handle Reserved
const ManagerEmptyHandleReserved: FC<ManagerHandleUseTableProps> = ({
  restaurantId,
  useTableId,
  callApiToUpdateUseTable,
  clickBack,
}) => {
  // - Ngày hiện tại
  const currentDateString = dayjs().format("YYYY-MM-DD");
  //   - Dữ liệu đơn đặt bàn
  const { data: orderTables } = useEntityQuery<OrderTableType[]>({
    keys: [
      "order-tables",
      restaurantId,
      `${currentDateString} 00:00:00`,
      `${currentDateString} 23:59:59`,
      OrderStatus.confirm,
    ],
    params: {
      restaurantId: restaurantId,
      arriveAtValue: [
        `${currentDateString} 00:00:00`,
        `${currentDateString} 23:59:59`,
      ],
      statusValue: [OrderStatus.confirm],
    },
    api: FindAllOrderTable,
  });
  // - State xử lý sự kiện chọn một đơn đặt bàn
  const [selectedOrderTable, setSelectedOrderTable] =
    useState<OrderTableType | null>(null);

  return (
    <div className="info diff">
      <b>Bàn đã được đặt</b>
      <List
        // pagination={{ pageSize: 5 }}
        grid={{
          gutter: 16, // khoảng cách giữa các item
          column: 4, // SỐ ITEM TRÊN 1 HÀNG (đổi 2 / 3 / 4)
        }}
        locale={{
          emptyText: (
            <div className="empty">
              <img
                src={ImageSourcePath + "empty-order-table-icon.png"}
                alt="empty-order-table"
              />
              <h3>Không có đơn đặt bàn</h3>
              <p>Hôm nay chưa có đơn đặt bàn nào</p>
            </div>
          ),
        }}
        dataSource={orderTables}
        renderItem={(item) => {
          return (
            <List.Item
              onClick={() => {
                if (item.id !== selectedOrderTable?.id) {
                  setSelectedOrderTable(item);
                } else {
                  setSelectedOrderTable(null);
                }
              }}
              className={`${
                selectedOrderTable?.id === item.id ? "active" : ""
              }`}
            >
              <List.Item.Meta
                title={<>Đơn đặt bàn #{item?.id}</>}
                description={
                  <>
                    <Divider />
                    <h5>Thông tin đơn đặt bàn</h5>
                    <p>
                      <ClockPlus />
                      <span>Đặt lúc:</span>
                      <b>{item?.createAt}</b>
                    </p>
                    <p>
                      <ClockCheck />
                      <span>Đến lúc:</span>
                      <b>{item?.arriveAt}</b>
                    </p>
                    <p>
                      <ListOrdered />
                      <span>Số khách:</span>
                      <b>{item?.guests}</b>
                    </p>
                    <h5>Thông tin người đặt bàn</h5>
                    <p>
                      <User />
                      <span>Họ tên:</span>
                      <b>{item?.customerFullname}</b>
                    </p>
                    <p>
                      <Phone />
                      <span>Điện thoại:</span>
                      <b>{item?.customerPhone}</b>
                    </p>
                    <p>
                      <Mail />
                      <span>Email:</span>
                      <b>{item?.customerEmail}</b>
                    </p>
                    <p>
                      <NotebookPen />
                      <span>Ghi chú:</span>
                      <b>{item?.customerNote}</b>
                    </p>
                  </>
                }
              />
            </List.Item>
          );
        }}
      />
      <div className="modal__buttons mg-top">
        <button
          type="button"
          className="modal__button secondary btn"
          onClick={(e) => {
            if (!selectedOrderTable) {
              openNotification({
                type: "warning",
                message: "Cảnh báo!",
                description:
                  "Bạn chưa chọn đơn đặt bàn nào. Hãy chọn một đơn đặt bàn!",
              });

              return;
            }

            callApiToUpdateUseTable!({
              id: useTableId!,
              orderTableId: selectedOrderTable?.id,
              button: e.target as HTMLElement,
              value: UseTableStatus.reserved,
            });
          }}
        >
          Xác nhận
        </button>
        <button
          type="button"
          className="modal__button secondary btn"
          onClick={clickBack}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default ManagerEmptyHandleReserved;
