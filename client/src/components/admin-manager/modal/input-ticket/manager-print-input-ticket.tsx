import { Download, Mail, MapPin, Phone } from "lucide-react";
import type { CrudObjectModalProps } from "../../../../common/props";
import CustomTableNoActions from "../../common/table-no-actions";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../utils/other-events";
import { handlePrintTicket } from "../../../../utils/print-ticket";
import { ImageSourcePath } from "../../../../common/values";

// Manager Print Input Ticket
const ManagerPrintInputTicket: React.FC<CrudObjectModalProps> = ({
  data,
  tableNoActionsFormat,
}) => {
  // Ngày hiện tại
  const today = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString();
  const dateTime = today.replace("T", "__").slice(0, -5);
  const day = today.slice(8, 10);
  const month = today.slice(5, 7);
  const year = today.slice(0, 4);

  return (
    <>
      <div id="content-print" className="ticket__content">
        <header className="ticket__header">
          <div className="ticket__contact">
            <p className="name">Nhà hàng VINAEATERY</p>
            <p className="has-icon">
              <Phone />
              <span>123456789 - 0987654321</span>
            </p>
            <p className="has-icon">
              <Mail />
              <span>vinaeatery@gmail.com.vn</span>
            </p>
            <p className="has-icon">
              <MapPin />
              <span>273 An Đ. Vương, Phường 2, Quận 5, Hồ Chí Minh 700000</span>
            </p>
          </div>
          <img
            src={ImageSourcePath + "brand-image.png"}
            alt="Logo Web"
            className="ticket__logo"
          />
        </header>
        <div className="ticket__line"></div>
        <main className="ticket__body input_ticket">
          <h1 className="ticket__title">PHIẾU NHẬP HÀNG</h1>
          <p className="ticket__date">
            Thời gian lập phiếu:{" "}
            <span className="date-start">{data?.createAt}</span>
          </p>
          <p className="ticket__info">
            <b>Mã phiếu nhập:</b> #{data?.id}
          </p>
          <p className="ticket__info">
            <b>Nhà cung cấp:</b> {data?.supplier!.name} -{" "}
            {data?.supplier!.phone} - {data?.supplier!.email}
          </p>
          <p className="ticket__info">
            <b>Tổng thanh toán (VNĐ):</b>{" "}
            {vietnamMoneyFormat(data?.totalPrice!)}(
            {numberToVietnamWords(data?.totalPrice!)})
          </p>
          <p className="ticket__info">
            <b>Trạng thái phiếu nhập:</b> {data?.status} ({data?.payStatus})
          </p>
          <p className="ticket__info">
            <b>Chi tiết phiếu nhập:</b>
          </p>
          <CustomTableNoActions
            className="ticket__table input_ticket-details"
            columnWidths={tableNoActionsFormat?.widths}
            columnTitles={tableNoActionsFormat?.columns}
            data={data?.inputTicketDetails}
            attributes={tableNoActionsFormat?.attributes}
            format={tableNoActionsFormat?.format}
          />
        </main>
        <footer className="ticket__footer input_ticket">
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
        </footer>
      </div>
      <button
        id="print-ticket-button"
        className="ticket__print-btn"
        onClick={() => {
          handlePrintTicket({
            contentPrint: "content-print",
            dateTime: dateTime,
            title: "PHNHAPHANG",
            id: data?.id,
          });
        }}
      >
        <Download /> &nbsp;&nbsp;<span>Tải xuống phiếu</span>
      </button>
    </>
  );
};

export default ManagerPrintInputTicket;
