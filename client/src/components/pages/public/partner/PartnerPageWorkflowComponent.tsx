import {
  BarChart3,
  ClipboardCheck,
  MapPin,
  Utensils,
} from "lucide-react";

const workflowSteps = [
  {
    number: "01",
    label: "CHUẨN BỊ",
    icon: <ClipboardCheck size={19} aria-hidden="true" />,
    title: "Thiết lập thông tin nhà hàng",
    description:
      "Tổ chức dữ liệu theo từng cơ sở: khu vực, tầng, bàn, nhóm món và thực đơn.",
    details: ["Cơ sở", "Tầng & bàn", "Món & thực đơn"],
  },
  {
    number: "02",
    label: "ĐÓN KHÁCH",
    icon: <MapPin size={19} aria-hidden="true" />,
    title: "Theo dõi đặt bàn và trạng thái bàn",
    description:
      "Nhìn lịch đặt bàn cùng trạng thái phục vụ để biết bàn nào đang trống, đã đặt hoặc có khách.",
    details: ["Đặt bàn", "Bàn trống", "Bàn đang phục vụ"],
  },
  {
    number: "03",
    label: "PHỤC VỤ",
    icon: <Utensils size={19} aria-hidden="true" />,
    title: "Nhận món và cập nhật hóa đơn",
    description:
      "Khách có thể mở thực đơn qua mã QR; nhân viên theo dõi món gọi, bàn và hóa đơn.",
    details: ["Mã QR", "Phiếu gọi món", "Hóa đơn"],
  },
  {
    number: "04",
    label: "TỔNG HỢP",
    icon: <BarChart3 size={19} aria-hidden="true" />,
    title: "Theo dõi chi phí và kết quả",
    description:
      "Ghi nhận phiếu nhập, sau đó xem báo cáo doanh thu, chi phí, lợi nhuận và phản hồi theo kỳ.",
    details: ["Phiếu nhập", "Báo cáo", "Phản hồi"],
  },
];

const PartnerPageWorkflowComponent: React.FC = () => (
  <section
    className="ve-partner__workflow"
    aria-labelledby="ve-partner-workflow-title"
  >
    <div className="ve-partner__workflow-heading">
      <div className="ve-eyebrow">
        <span className="ve-eyebrow__dot" />TỪ CHUẨN BỊ ĐẾN TỔNG HỢP
      </div>
      <h2 id="ve-partner-workflow-title">
        Theo sát một ngày vận hành
        <br />
        <span>trong cùng một hệ thống.</span>
      </h2>
      <p>
        Các nghiệp vụ dưới đây tương ứng với những màn hình đang có trong
        VinaEatery, từ khu vực phục vụ đến báo cáo quản lý.
      </p>
    </div>
    <div className="ve-partner__workflow-grid">
      {workflowSteps.map((step) => (
        <article className="ve-partner__workflow-step" key={step.number}>
          <div className="ve-partner__workflow-icon">{step.icon}</div>
          <div className="ve-partner__workflow-copy">
            <span className="ve-partner__workflow-label">
              {step.number} / {step.label}
            </span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <div className="ve-partner__workflow-details">
              {step.details.map((detail) => (
                <span key={detail}>{detail}</span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default PartnerPageWorkflowComponent;
