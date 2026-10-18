import { BarChart3, ClipboardCheck, MapPin, Utensils } from "lucide-react";

const PartnerPageCapabilitiesComponent: React.FC = () => (
  <section
    className="ve-partner__capabilities"
    aria-labelledby="ve-partner-capabilities-title"
  >
    <div className="ve-partner__section-heading">
      <div className="ve-eyebrow">
        <span className="ve-eyebrow__dot" />MỘT HỆ THỐNG, NHIỀU NGHIỆP VỤ
      </div>
      <h2 id="ve-partner-capabilities-title">
        Nhìn hoạt động nhà hàng
        <br />
        <span>trong một bức tranh chung.</span>
      </h2>
      <p>
        Tìm hiểu VinaEatery từ những công việc diễn ra mỗi ngày tại nhà hàng đến
        báo cáo cho người quản lý.
      </p>
    </div>
    <div className="ve-partner__capability-grid">
      <article className="ve-partner__capability">
        <span className="ve-partner__capability-icon">
          <MapPin size={20} aria-hidden="true" />
        </span>
        <span className="ve-partner__capability-index">01 / KHÁCH HÀNG</span>
        <h3>Đặt bàn & phản hồi</h3>
        <p>
          Khách xem danh sách nhà hàng, gửi yêu cầu đặt bàn và phản hồi sau trải
          nghiệm.
        </p>
        <span className="ve-partner__capability-tags">
          Khám phá <i>·</i> Đặt bàn <i>·</i> Đánh giá
        </span>
      </article>
      <article className="ve-partner__capability">
        <span className="ve-partner__capability-icon">
          <Utensils size={20} aria-hidden="true" />
        </span>
        <span className="ve-partner__capability-index">02 / PHỤC VỤ</span>
        <h3>Bàn, món & hóa đơn</h3>
        <p>
          Theo dõi tầng, trạng thái bàn, thực đơn, món gọi và hóa đơn trong quy
          trình phục vụ.
        </p>
        <span className="ve-partner__capability-tags">
          Tầng <i>·</i> Bàn <i>·</i> Đơn gọi món
        </span>
      </article>
      <article className="ve-partner__capability">
        <span className="ve-partner__capability-icon">
          <ClipboardCheck size={20} aria-hidden="true" />
        </span>
        <span className="ve-partner__capability-index">03 / NGUYÊN LIỆU</span>
        <h3>Nhà cung cấp & phiếu nhập</h3>
        <p>
          Quản lý danh mục nguyên liệu, nhà cung cấp và phiếu nhập phục vụ theo
          dõi chi tiêu.
        </p>
        <span className="ve-partner__capability-tags">
          Nguyên liệu <i>·</i> Nhà cung cấp
        </span>
      </article>
      <article className="ve-partner__capability">
        <span className="ve-partner__capability-icon">
          <BarChart3 size={20} aria-hidden="true" />
        </span>
        <span className="ve-partner__capability-index">04 / QUẢN TRỊ</span>
        <h3>Báo cáo & đội ngũ</h3>
        <p>
          Xem doanh thu, chi phí, lợi nhuận; quản lý nhân viên, vai trò và quyền
          hạn.
        </p>
        <span className="ve-partner__capability-tags">
          Kết quả <i>·</i> Nhân sự <i>·</i> Phân quyền
        </span>
      </article>
    </div>
  </section>
);

export default PartnerPageCapabilitiesComponent;
