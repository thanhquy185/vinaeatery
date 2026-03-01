import { Form } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { UseTableType } from "../../../../common/types";
import { OrderSheetStatus, UseTableStatus } from "../../../../common/values";
import { vietnamMoneyFormat } from "../../../../utils/other-events";

// Admin Detail Table History
const AdminDetailTableHistory: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  defaultInputs,
  data,
}) => {
  const [form] = Form.useForm<UseTableType>();

  return (
    <>
      <div id="content-print">
        <div className="info">
          <b>Mã lịch sử bàn ăn:</b>#{data?.id}
        </div>
        <div className="info">
          <b>Thời gian bắt đầu:</b>
          {data?.timeStart}
        </div>
        <div className="info">
          <b>Thời gian kết thúc:</b>
          {data?.timeEnd}
        </div>
        <div className="info">
          <b>Bàn ăn:</b>
          {data?.table?.name} - {data?.table?.categoryTable?.name} -{" "}
          {data?.table?.floor?.name} - Số chỗ: {data?.table?.seats} -{" "}
          {data?.table?.status}
        </div>
        {data?.orderTable && (
          <div className="info">
            <b>Đơn đặt bàn:</b>#{data?.orderTable?.id} -{" "}
            {data?.orderTable?.createAt} - {data?.orderTable?.customerFullname}{" "}
            - {data?.orderTable?.customerPhone} -{" "}
            {data?.orderTable?.customerEmail}
          </div>
        )}
        {data?.status === UseTableStatus.occupied && data?.orderSheets && (
          <div className="info">
            {/* <b>Khách hàng:</b>{customer!.fullname} - {customer!.phone} -{" "}
              {customer!.email} - {customer!.address} */}
          </div>
        )}
        <div className="info">
          <b>Trạng thái:</b>
          <span
            className={
              "status " +
              (data?.status === UseTableStatus.occupied
                ? "red"
                : data?.status === UseTableStatus.reserved
                ? "yellow"
                : data?.status === UseTableStatus.empty
                ? "green"
                : "gray")
            }
          >
            {data?.status!}
          </span>
        </div>
        {data?.status === UseTableStatus.occupied && data?.orderSheets && (
          <div className="info">
            <b>Danh sách phiếu gọi món:</b>
            {(data as UseTableType)?.orderSheets?.map((orderSheet) => (
              <div className="sub-info">
                <p>
                  <b>- Mã phiếu gọi:</b>#{orderSheet!.id}
                </p>
                <p>
                  <b>- Thời gian tạo phiếu:</b>
                  {orderSheet!.createAt}
                </p>
                <p>
                  <b>- Thời gian phục vụ:</b>
                  {orderSheet!.serviceAt}
                </p>
                <p>
                  <b>- Tổng tiền món ăn:</b>
                  {vietnamMoneyFormat(orderSheet!.totalPrice!)}
                </p>
                <p>
                  <b>- Trạng thái:</b>
                  <span
                    className={
                      "status " +
                      (orderSheet?.status === OrderSheetStatus.serviced
                        ? "purple"
                        : orderSheet?.status === OrderSheetStatus.confirm
                        ? "green"
                        : orderSheet?.status === OrderSheetStatus.canceled
                        ? "red"
                        : "gray")
                    }
                  >
                    {orderSheet?.status}
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
                    {orderSheet?.orderSheetDetails?.map((orderSheetDetail) => (
                      <tr>
                        <td>{orderSheetDetail?.food?.id}</td>
                        <td className="left">{orderSheetDetail?.food?.name}</td>
                        <td>{orderSheetDetail?.food?.unit}</td>
                        <td>{vietnamMoneyFormat(orderSheetDetail?.price!)}</td>
                        <td>{orderSheetDetail?.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* <button
                    id="print-ticket-button"
                    className="ticket__print-btn"
                    onClick={() => {
                        handlePrintTicket({
                            contentPrint: "content-print",
                            // dateTime: dateTime,
                            // title: "PHDONHANG",
                            id: id,
                        });
                    }}
                >
                    <FontAwesomeIcon icon={faFileArrowDown} /> &nbsp;&nbsp;Tải xuống phiếu
                </button> */}
    </>
  );
};

export default AdminDetailTableHistory;
