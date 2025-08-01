import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { openNotification } from "./showNotification";

type PrintTicketProps = {
  contentPrint?: string;
  dateTime?: string;
  title?: string;
  id?: string | number;
};

export const handlePrintTicket = ({ contentPrint, dateTime, title, id }: PrintTicketProps) => {
  const element = document.getElementById(contentPrint!);
  if (!element) return;

  html2canvas(element, { scale: 2 }).then((canvas) => {
    // const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 4;

    // const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - margin * 2;
    // const imgRatio = imgProps.width / imgProps.height;
    // const pdfImgHeightPerPage = pdfWidth / imgRatio;

    // Tính chiều cao của 1 trang PDF tương ứng với đơn vị pixel của canvas
    const pageHeightPx = (canvas.width * (pageHeight - margin * 2)) / pdfWidth;

    let remainingHeight = canvas.height;
    let positionY = 0;
    let pageIndex = 0;

    while (remainingHeight > 0) {
      const canvasPage = document.createElement("canvas");
      canvasPage.width = canvas.width;
      canvasPage.height = Math.min(pageHeightPx, remainingHeight);

      const ctx = canvasPage.getContext("2d")!;
      ctx.drawImage(
        canvas,
        0,
        positionY,
        canvas.width,
        canvasPage.height,
        0,
        0,
        canvas.width,
        canvasPage.height
      );

      const pageData = canvasPage.toDataURL("image/jpeg", 1.0);
      if (pageIndex > 0) pdf.addPage();
      const pdfPageHeight = (canvasPage.height * pdfWidth) / canvas.width;
      pdf.addImage(pageData, "JPEG", margin, margin, pdfWidth, pdfPageHeight);

      remainingHeight -= canvasPage.height;
      positionY += canvasPage.height;
      pageIndex++;
    }

    pdf.save(`${dateTime!}_${title!}${id ? "#" + id : ""}.pdf`);
  });

  // Thông báo thành công
  openNotification({
    type: "success",
    message: "Thành công",
    description: "In phiếu thành công!",
    duration: 1.5,
  });
};


