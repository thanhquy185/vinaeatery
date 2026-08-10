import useEntityQuery from "../../../../hooks/useEntityQuery2";
import PrintTicketModalComponent from "../../PrintTicketModalComponent";
import TableInputTicketDetailsComponent from "../../TableInputTicketDetailsComponent";
import InputTicketApiService from "../../../../services/api/v1/InputTicketApiService";
import { Spin } from "antd";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { InputTicketDetailResponseType } from "../../../../types/InputTicketType";

const PrintInputTicketModalComponent: React.FC<CrudObjectModalProps> = ({
  data,
}) => {
  const { data: inputTicketDetail, isLoading } =
    useEntityQuery<InputTicketDetailResponseType>({
      keys: ["input-ticket", data.id],
      params: { id: data.id },
      api: InputTicketApiService.handleGetDetailById,
    });

  // Ngày hiện tại
  const today = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString();
  const day = today.slice(8, 10);
  const month = today.slice(5, 7);
  const year = today.slice(0, 4);

  return (
    <Spin spinning={!inputTicketDetail || isLoading}>
      {inputTicketDetail && (
        <PrintTicketModalComponent
          restaurant={inputTicketDetail.restaurant}
          mainContent={
            <>
              <h1 className="ticket__title">
                PHIẾU NHẬP HÀNG #{inputTicketDetail.id}
              </h1>
              <p className="ticket__date">
                <span>Thời gian lập phiếu: </span>
                <span className="date-start">{inputTicketDetail.createAt}</span>
              </p>
              <p className="ticket__info">
                <b>Nhà cung cấp: </b>
                <span>{inputTicketDetail.supplier.fullname}</span>
              </p>
              <p className="ticket__info">
                <b>Nhân viên xác nhận: </b>
                <span>{inputTicketDetail.employee.fullname}</span>
              </p>
              <p className="ticket__info">
                <b>Trạng thái: </b>
                <span>
                  {inputTicketDetail.status} ({inputTicketDetail.paymentStatus})
                </span>
              </p>
              <p className="ticket__info">
                <b>Tổng thanh toán (VNĐ): </b>
                <span>
                  {vietnamMoneyFormat(inputTicketDetail.totalInputPrice)}(
                  {numberToVietnamWords(inputTicketDetail.totalInputPrice)})
                </span>
              </p>
              <p className="ticket__info">
                <b>Chi tiết phiếu nhập: </b>
              </p>
              <TableInputTicketDetailsComponent
                className="ticket__table"
                inputTicketDetails={inputTicketDetail.inputTicketDetails}
              />
            </>
          }
          footerContent={
            <>
              <p className="ticket__customer">
                Ngày {day} tháng {month} năm {year}
                <b>Nhân viên lập phiếu</b>
                (Ký tên, ghi rõ họ tên)
              </p>
              <p className="ticket__customer">
                Ngày {day} tháng {month} năm {year}
                <b>Thủ kho</b>
                (Ký tên, ghi rõ họ tên)
              </p>
              <p className="ticket__customer">
                Ngày {day} tháng {month} năm {year}
                <b>Thủ quỹ</b>
                (Ký tên, ghi rõ họ tên)
              </p>
              <p className="ticket__customer">
                Ngày {day} tháng {month} năm {year}
                <b>Giám đốc</b>
                (Ký tên, ghi rõ họ tên)
              </p>
            </>
          }
          titlePdf="PHNHAPHANG"
          idPdf={inputTicketDetail.id}
          className="input-ticket"
        />
      )}
    </Spin>
  );
};

export default PrintInputTicketModalComponent;
