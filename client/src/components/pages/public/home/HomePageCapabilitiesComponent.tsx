import { BarChart3, ClipboardList, MapPin, Utensils } from "lucide-react";

const capabilities = [
  {
    number: "01",
    icon: <MapPin aria-hidden="true" />,
    title: "Khách hàng & đặt bàn",
    description:
      "Khách xem danh sách nhà hàng, tạo lịch đặt bàn và gửi phản hồi sau trải nghiệm.",
    tag: "Khám phá · Đặt bàn · Phản hồi",
  },
  {
    number: "02",
    icon: <Utensils aria-hidden="true" />,
    title: "Phục vụ tại nhà hàng",
    description:
      "Theo dõi tầng, trạng thái bàn, thực đơn, món gọi và hóa đơn trong quy trình phục vụ.",
    tag: "Bàn · Thực đơn · Hóa đơn",
  },
  {
    number: "03",
    icon: <ClipboardList aria-hidden="true" />,
    title: "Nguyên liệu & nhà cung cấp",
    description:
      "Lưu danh mục nguyên liệu, nhà cung cấp và phiếu nhập để theo dõi chi tiêu.",
    tag: "Nguyên liệu · Nhà cung cấp · Phiếu nhập",
  },
  {
    number: "04",
    icon: <BarChart3 aria-hidden="true" />,
    title: "Báo cáo & đội ngũ",
    description:
      "Xem doanh thu, chi phí, lợi nhuận; quản lý nhân viên, vai trò và quyền hạn.",
    tag: "Kinh doanh · Nhân sự · Phân quyền",
  },
];

const HomePageCapabilitiesComponent: React.FC = () => (
  <section className="ve-home__capabilities">
    <div className="ve-home__capabilities-inner">
      <div className="ve-section-heading ve-section-heading--left">
        <div className="ve-eyebrow">
          <span className="ve-eyebrow__dot" />CÔNG CỤ TRONG MỘT NỀN TẢNG
        </div>
        <h2>
          Việc hằng ngày gọn lại.
          <br />
          <span>Bức tranh kinh doanh rõ hơn.</span>
        </h2>
        <p>
          Các nghiệp vụ nhà hàng kết nối với nhau để đội ngũ tập trung vào phục
          vụ khách và vận hành hiệu quả.
        </p>
      </div>
      <div className="ve-capability-grid">
        {capabilities.map((capability) => (
          <article className="ve-capability" key={capability.number}>
            <div className="ve-capability__top">
              <span>{capability.number}</span>
              <i>{capability.icon}</i>
            </div>
            <h3>{capability.title}</h3>
            <p>{capability.description}</p>
            <span className="ve-capability__tag">{capability.tag}</span>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default HomePageCapabilitiesComponent;
