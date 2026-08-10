import useEntityQuery from "../../../../hooks/useEntityQuery2";
import PrintTicketModalComponent from "../../PrintTicketModalComponent";
import TableBillDetailsComponent from "../../TableBillDetailsComponent";
import BillApiService from "../../../../services/api/v1/BillApiService";
import { Spin } from "antd";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { BillDetailResponseType } from "../../../../types/BillType";

const PrintBillModalComponent: React.FC<CrudObjectModalProps> = ({ data }) => {
  const { data: billDetail, isLoading } =
    useEntityQuery<BillDetailResponseType>({
      keys: ["bill", data.id],
      params: { id: data.id },
      api: BillApiService.handleGetDetailById,
    });

  // Ngày hiện tại
  const today = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString();
  const day = today.slice(8, 10);
  const month = today.slice(5, 7);
  const year = today.slice(0, 4);

  return (
    <Spin spinning={!billDetail || isLoading}>
      {billDetail && (
        <PrintTicketModalComponent
          restaurant={billDetail.restaurant}
          mainContent={
            <>
              <h1 className="ticket__title">PHIẾU HOÁ ĐƠN #{billDetail.id}</h1>
              <p className="ticket__date">
                Thời gian lập đơn:{" "}
                <span className="date-start">{billDetail.createAt}</span>
              </p>
              <p className="ticket__info">
                <b>Khách hàng: </b>
                {billDetail.customerFullname}
              </p>
              <p className="ticket__info">
                <b>Nhân viên xác nhận: </b>
                <span>{billDetail.employee.fullname}</span>
              </p>
              <p className="ticket__info">
                <b>Trạng thái: </b>
                {billDetail.status} ({billDetail.paymentStatus})
              </p>
              <p className="ticket__info">
                <b>Tổng thanh toán (VNĐ): </b>
                {vietnamMoneyFormat(billDetail.totalPrice)} (
                {numberToVietnamWords(billDetail.totalPrice)})
              </p>
              <p className="ticket__info">
                <b>Chi tiết hoá đơn:</b>
              </p>
              <TableBillDetailsComponent
                className="ticket__table"
                billDetails={billDetail.billDetails}
              />
            </>
          }
          footerContent={
            <>
              <p className="ticket__customer">
                Ngày {day} tháng {month} năm {year}
                <b>Khách hàng</b>
                (Ký tên, ghi rõ họ tên)
              </p>
              <p className="ticket__customer">
                Ngày {day} tháng {month} năm {year}
                <b>Nhân viên lập phiếu</b>
                (Ký tên, ghi rõ họ tên)
              </p>
            </>
          }
          titlePdf="PHHOADON"
          idPdf={billDetail.id}
          className="bill"
        />
      )}
    </Spin>
  );
};

export default PrintBillModalComponent;
