import { List } from "antd";
import { OrderSheetStatusValue } from "../../../../constants/values";
import { vietnamMoneyFormat } from "../../../../utils/otherEvents";
import type { OrderSheetInfoResponseType } from "../../../../types/OrderSheetType";

interface ListOrderSheetComponentProps {
  orderSheets: OrderSheetInfoResponseType[];
}

const ListOrderSheetComponent: React.FC<ListOrderSheetComponentProps> = ({
  orderSheets,
}) => {
  return (
    <List
      dataSource={orderSheets}
      pagination={
        orderSheets.length >= 5
          ? {
              pageSize: 5,
              hideOnSinglePage: true,
            }
          : undefined
      }
      renderItem={(orderSheet) => {
        const isCancelled =
          orderSheet.status === OrderSheetStatusValue.cancelled;
        const isServiced = orderSheet.status === OrderSheetStatusValue.serviced;

        return (
          <List.Item>
            <div className="order-sheet-info" style={{ width: "100%" }}>
              <p>
                <b>Mã phiếu gọi:</b> #{orderSheet.id}
              </p>

              <p>
                <b>Thời gian tạo:</b> {orderSheet.createAt}
              </p>

              {isServiced && (
                <p>
                  <b>Thời gian phục vụ:</b> {orderSheet.serviceAt}
                </p>
              )}

              {isCancelled && (
                <p>
                  <b>Thời gian huỷ:</b> {orderSheet.cancelAt}
                </p>
              )}

              <p>
                <b>Tổng tiền:</b> {vietnamMoneyFormat(orderSheet.totalPrice!)}
              </p>

              <p>
                <b>Trạng thái:</b>{" "}
                <span
                  className={
                    "status " +
                    (orderSheet.status === OrderSheetStatusValue.serviced
                      ? "purple"
                      : orderSheet.status === OrderSheetStatusValue.confirmed
                        ? "green"
                        : orderSheet.status === OrderSheetStatusValue.cancelled
                          ? "red"
                          : "gray")
                  }
                >
                  {orderSheet.status}
                </span>
              </p>

              <table>
                <colgroup>
                  <col width="12%" />
                  <col width="36%" />
                  <col width="12%" />
                  <col width="20%" />
                  <col width="20%" />
                </colgroup>

                <thead>
                  <tr>
                    <th>Mã món ăn</th>
                    <th>Tên món ăn</th>
                    <th>Đơn vị</th>
                    <th>Giá bán</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>

                <tbody>
                  {orderSheet.orderSheetDetails?.map((detail) => (
                    <tr key={detail.food.id}>
                      <td>{detail.food.id}</td>
                      <td>{detail.foodNameSnapshot}</td>
                      <td>{detail.food.unit}</td>
                      <td>{vietnamMoneyFormat(detail.foodPriceSnapshot)}</td>
                      <td>{detail.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </List.Item>
        );
      }}
      style={{ padding: 0 }}
    />
  );
};

export default ListOrderSheetComponent;
