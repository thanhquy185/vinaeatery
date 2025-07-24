import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { openNotification } from "./showNotification";

type PrintTicketProps = {
  contentPrint?: string;
  dateTime?: string;
  title?: string;
  id?: string | number;
};

export const handlePrintTicket = ({
  contentPrint,
  dateTime,
  title,
  id,
}: PrintTicketProps) => {
  // In phiếu
  const element = document.getElementById(contentPrint!);
  html2canvas(element!, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    const margin = 4;

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "JPEG", margin, margin, pdfWidth, pdfHeight);
    pdf.save(`${dateTime!}_${title!}${id! ? "#" + id : ""}.pdf`);
  });

  // Thông báo thành công
  openNotification({
    type: "success",
    message: "Thành công",
    description: "In phiếu thành công !",
    duration: 1.5,
  });
};
