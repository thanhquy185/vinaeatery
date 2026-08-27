import { Download, Mail, MapPin, Phone } from "lucide-react";
import { ImageSourcePath } from "../../constants/values";
import { handlePrintTicket } from "../../utils/printTicketUtil";
import type { RestaurantSubInfoResponseType } from "../../types/RestaurantType";

type PrintTicketModalComponentProps = {
  restaurant: RestaurantSubInfoResponseType;
  mainContent: React.ReactNode;
  footerContent: React.ReactNode;
  titlePdf: string;
  idPdf: number | string;
  className: string;
};

const PrintTicketModalComponent: React.FC<PrintTicketModalComponentProps> = ({
  restaurant,
  mainContent,
  footerContent,
  titlePdf,
  idPdf,
  className,
}) => {
  // Ngày hiện tại
  const today = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString();
  const dateTime = today.replace("T", "__").slice(0, -5);

  return (
    <>
      <div id="content-print" className="ticket__content">
        <header className="ticket__header">
          <div className="ticket__contact">
            <p className="name">{restaurant.name}</p>
            <p className="has-icon">
              <Phone />
              <span>{restaurant.phone}</span>
            </p>
            <p className="has-icon">
              <Mail />
              <span>{restaurant.email}</span>
            </p>
            <p className="has-icon">
              <MapPin />
              <span>
                {restaurant.houseNumber} {restaurant.streetName},{" "}
                {restaurant.ward}, {restaurant.province}
              </span>
            </p>
          </div>
          <img
            src={ImageSourcePath + "brand-image.png"}
            alt="Logo Web"
            className="ticket__logo"
          />
        </header>
        <div className="ticket__line"></div>
        <main className={"ticket__body " + className}>{mainContent}</main>
        <footer className={"ticket__footer " + className}>
          {footerContent}
        </footer>
      </div>
      <button
        id="print-ticket-button"
        className="ticket__print-btn"
        onClick={() => {
          handlePrintTicket({
            contentPrint: "content-print",
            dateTime: dateTime,
            title: titlePdf,
            id: idPdf,
          });
        }}
      >
        <Download />
        &nbsp;&nbsp;<span>Tải xuống phiếu</span>
      </button>
    </>
  );
};

export default PrintTicketModalComponent;
