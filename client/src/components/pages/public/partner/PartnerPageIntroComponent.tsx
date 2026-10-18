import { ShieldCheck } from "lucide-react";

const PartnerPageIntroComponent: React.FC = () => (
  <section className="ve-partner__intro">
    <div className="ve-eyebrow">
      <span className="ve-eyebrow__dot" />ĐĂNG KÝ ĐỐI TÁC
    </div>
    <h1>
      Quản lý nhiều
      <br />
      <span>nhà hàng cùng lúc.</span>
    </h1>
    <p className="ve-partner__lead">
      Chia sẻ mô hình, quy mô và những nghiệp vụ bạn muốn quản lý. VinaEatery hỗ
      trợ theo dõi hoạt động từ từng nhà hàng đến bức tranh chung của hệ thống.
    </p>
    <div className="ve-partner__privacy">
      <ShieldCheck size={16} aria-hidden="true" />
      Bản xem trước: thông tin chưa được lưu hoặc gửi đi.
    </div>
  </section>
);

export default PartnerPageIntroComponent;
