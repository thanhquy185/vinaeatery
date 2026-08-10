import useEntityQuery from "../../../../hooks/useEntityQuery2";
import UseTableApiService from "../../../../services/api/v1/UseTableApiService";
import ListOrderSheetComponent from "./ListOrderSheetComponent";
import { Rate, Spin } from "antd";
import { UseTableStatusValue } from "../../../../constants/values";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { UseTableDetailResponseType } from "../../../../types/UseTableType";

const DetailTableHistoryModalComponent: React.FC<CrudObjectModalProps> = ({
  data,
}) => {
  const { data: useTableDetail, isLoading } =
    useEntityQuery<UseTableDetailResponseType>({
      keys: ["use-table", data.id],
      params: { id: data.id },
      api: UseTableApiService.handleGetDetailById,
    });

  return (
    <Spin spinning={!useTableDetail || isLoading}>
      {useTableDetail && (
        <div id="content-print">
          <div className="info">
            <b>Mã lịch sử bàn ăn:</b>#{useTableDetail.id}
          </div>
          <div className="info">
            <b>Thời gian bắt đầu:</b>
            {useTableDetail.startAt}
          </div>
          <div className="info">
            <b>Thời gian kết thúc:</b>
            {useTableDetail.endAt}
          </div>
          <div className="info">
            <b>Thông tin bàn ăn:</b>
            <div className="sub-info">
              <b>- Tên bàn:</b>
              {useTableDetail.table.name}
            </div>
            <div className="sub-info">
              <b>- Loại bàn:</b>
              {useTableDetail.table.categoryTable.name}
            </div>
            <div className="sub-info">
              <b>- Tầng:</b>
              {useTableDetail.table.floor.name}
            </div>
          </div>
          {useTableDetail.status === UseTableStatusValue.reserved && (
            <>
              <div className="info">
                <b>Thông tin đơn đặt bàn:</b>
                <div className="sub-info">
                  <b>- Thời gian đặt bàn:</b>
                  {useTableDetail.reservation.createAt}
                </div>
                <div className="sub-info">
                  <b>- Thời gian nhận bàn:</b>
                  {useTableDetail.reservation.arriveAt}
                </div>
                <div className="sub-info">
                  <b>- Số lượng khách:</b>
                  {useTableDetail.reservation.customerGuests}
                </div>
              </div>
              <div className="info">
                <b>Thông tin người đặt bàn:</b>
                <div className="sub-info">
                  <b>- Họ và tên:</b>
                  {useTableDetail.reservation.customerFullname}
                </div>
                <div className="sub-info">
                  <b>- Số điện thoại:</b>
                  {useTableDetail.reservation.customerPhone}
                </div>
                <div className="sub-info">
                  <b>- Email:</b>
                  {useTableDetail.reservation.customerEmail}
                </div>
                <div className="sub-info">
                  <b>- Ghi chú:</b>
                  {useTableDetail.reservation.customerNote}
                </div>
              </div>
            </>
          )}
          {useTableDetail.status === UseTableStatusValue.occupied && (
            <>
              <div className="info">
                <b>Thông tin khách hàng:</b>
                <div className="sub-info">
                  <b>- Họ và tên:</b>
                  {useTableDetail.customerFullname}
                </div>
                <div className="sub-info">
                  <b>- Số điện thoại:</b>
                  {useTableDetail.customerPhone}
                </div>
                <div className="sub-info">
                  <b>- Email:</b>
                  {useTableDetail.customerEmail}
                </div>
                <div className="sub-info">
                  <b>- Số lượng:</b>
                  {useTableDetail.customerGuests} (Người lớn:{" "}
                  {useTableDetail.customerAdult}, Trẻ em:{" "}
                  {useTableDetail.customerChild})
                </div>
              </div>
              {useTableDetail.bill && (
                <div className="info">
                  <b>Thông tin thanh toán:</b>
                  <div className="sub-info">
                    <b>- Mã giao dịch:</b>
                    {useTableDetail.bill.paymentId}
                  </div>
                  <div className="sub-info">
                    <b>- Thời gian:</b>
                    {useTableDetail.bill.paymentAt}
                  </div>
                  <div className="sub-info">
                    <b>- Phương thức:</b>
                    {useTableDetail.bill.paymentMethod.name}
                  </div>
                  <div className="sub-info">
                    <b>- Số tiền:</b>
                    {vietnamMoneyFormat(useTableDetail.bill.paymentTotalPrice)}
                    &nbsp;(
                    {numberToVietnamWords(
                      useTableDetail.bill.paymentTotalPrice,
                    )}
                    )
                  </div>
                </div>
              )}
              {useTableDetail.feedback && (
                <div className="info">
                  <b>Thông tin đánh giá:</b>
                  <div className="sub-info">
                    <b>- Thời gian:</b>
                    {useTableDetail.feedback.at}
                  </div>
                  <div className="sub-info">
                    <b>- Trải nghiệm:</b>
                    {useTableDetail.feedback.experience}
                  </div>
                  <div className="sub-info">
                    <b>- Chất lượng món ăn:</b>
                    <Rate value={useTableDetail.feedback.score1} />
                  </div>
                  <div className="sub-info">
                    <b>- Tốc độ phục vụ:</b>
                    <Rate value={useTableDetail.feedback.score2} />
                  </div>
                  <div className="sub-info">
                    <b>- Thái độ nhân viên:</b>
                    <Rate value={useTableDetail.feedback.score3} />
                  </div>
                  <div className="sub-info">
                    <b>- Dịch vụ mang lại:</b>
                    <Rate value={useTableDetail.feedback.score4} />
                  </div>
                  <div className="sub-info">
                    <b>- Không gian và vệ sinh:</b>
                    <Rate value={useTableDetail.feedback.score5} />
                  </div>
                  <div className="sub-info">
                    <b>- Ghi chú:</b>
                    {useTableDetail.feedback.message}
                  </div>
                </div>
              )}
            </>
          )}
          <div className="info">
            <b>Trạng thái:</b>
            <span
              className={
                "status " +
                (useTableDetail.status === UseTableStatusValue.occupied
                  ? "red"
                  : useTableDetail.status === UseTableStatusValue.reserved
                    ? "yellow"
                    : useTableDetail.status === UseTableStatusValue.empty
                      ? "green"
                      : "gray")
              }
            >
              {useTableDetail.status!}
            </span>
          </div>
          {useTableDetail.status === UseTableStatusValue.occupied &&
            useTableDetail.orderSheets && (
              <div className="info">
                <b>Danh sách phiếu gọi món:</b>
                <ListOrderSheetComponent
                  orderSheets={useTableDetail.orderSheets}
                />
              </div>
            )}
        </div>
      )}
    </Spin>
  );
};

export default DetailTableHistoryModalComponent;
