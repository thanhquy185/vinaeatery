import { BarChart3, ClipboardList, MapPin, Utensils } from "lucide-react";

const journeySteps = [
  {
    number: "01",
    icon: <MapPin aria-hidden="true" />,
    actor: "KHÁCH HÀNG",
    title: "Khám phá & đặt bàn",
    description:
      "Khách xem thông tin nhà hàng và gửi yêu cầu đặt bàn từ danh sách địa điểm.",
  },
  {
    number: "02",
    icon: <Utensils aria-hidden="true" />,
    actor: "TẠI NHÀ HÀNG",
    title: "Gọi món qua QR",
    description:
      "Thực đơn và món gọi được gắn với bàn để nhân viên tiếp nhận và phục vụ.",
  },
  {
    number: "03",
    icon: <ClipboardList aria-hidden="true" />,
    actor: "ĐỘI NGŨ",
    title: "Theo dõi bàn & hóa đơn",
    description:
      "Nhân viên nắm trạng thái bàn, món đã gọi và thông tin hóa đơn trong ca.",
  },
  {
    number: "04",
    icon: <BarChart3 aria-hidden="true" />,
    actor: "CHỦ NHÀ HÀNG",
    title: "Đọc kết quả kinh doanh",
    description:
      "Chủ nhà hàng xem doanh thu, chi phí, lợi nhuận và phản hồi theo kỳ.",
  },
];

const HomePageJourneyComponent: React.FC = () => (
  <section className="ve-home__journey" aria-labelledby="ve-home-journey-title">
    <div className="ve-home__journey-inner">
      <div className="ve-section-heading">
        <div className="ve-eyebrow">
          <span className="ve-eyebrow__dot" />TỪ TRẢI NGHIỆM KHÁCH ĐẾN VẬN HÀNH
        </div>
        <h2 id="ve-home-journey-title">
          Một quy trình được nối liền,
          <br />
          <span>từ bàn ăn đến báo cáo.</span>
        </h2>
        <p>
          Những thao tác của khách, nhân viên và chủ nhà hàng cùng tạo nên bức
          tranh hoạt động rõ ràng hơn.
        </p>
      </div>
      <div className="ve-home__journey-grid">
        {journeySteps.map((step) => (
          <article className="ve-journey-card" key={step.number}>
            <div className="ve-journey-card__top">
              <span>{step.number}</span>
              <i>{step.icon}</i>
            </div>
            <span className="ve-journey-card__actor">{step.actor}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
      <p className="ve-home__journey-note">
        Các số liệu và địa điểm ở phần minh họa chỉ là dữ liệu mẫu.
      </p>
    </div>
  </section>
);

export default HomePageJourneyComponent;
