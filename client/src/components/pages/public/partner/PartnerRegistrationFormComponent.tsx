import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  MapPin,
  ShieldCheck,
} from "lucide-react";

const PartnerRegistrationFormComponent: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="ve-partner__form-card" aria-labelledby="ve-partner-title">
      <div className="ve-partner__form-heading">
        <span className="ve-partner__form-kicker">
          <MapPin size={14} aria-hidden="true" /> KẾT NỐI NHÀ HÀNG
        </span>
        <h2 id="ve-partner-title">Thông tin đăng ký</h2>
        <p>
          Các trường có dấu <b>*</b> là bắt buộc.
        </p>
      </div>
      {submitted ? (
        <div className="ve-partner__notice" role="status">
          <span className="ve-partner__notice-icon">
            <Check size={19} aria-hidden="true" />
          </span>
          <div>
            <strong>Biểu mẫu đã được kiểm tra</strong>
            <p>
              Đây là bản giao diện xem trước và chưa kết nối máy chủ, nên thông
              tin chưa được gửi đi.
            </p>
          </div>
        </div>
      ) : (
        <form className="ve-partner__form" onSubmit={handleSubmit}>
          <div className="ve-field-row">
            <label className="ve-field">
              <span>
                Tên nhà hàng / thương hiệu <b>*</b>
              </span>
              <input
                name="restaurantName"
                type="text"
                autoComplete="organization"
                placeholder="Ví dụ: Nhà hàng của bạn"
                required
              />
            </label>
            <label className="ve-field">
              <span>
                Email <b>*</b>
              </span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="ban@nhahang.vn"
                required
              />
            </label>
          </div>
          <div className="ve-field-row">
            <label className="ve-field">
              <span>
                Số lượng địa điểm <b>*</b>
              </span>
              <select name="locationCount" defaultValue="" required>
                <option value="" disabled>
                  Chọn quy mô
                </option>
                <option value="1">1 địa điểm</option>
                <option value="2-5">2–5 địa điểm</option>
                <option value="6-10">6–10 địa điểm</option>
                <option value="10+">Trên 10 địa điểm</option>
              </select>
            </label>
            <label className="ve-field">
              <span>
                Loại hình nhà hàng <b>*</b>
              </span>
              <select name="restaurantType" defaultValue="" required>
                <option value="" disabled>
                  Chọn loại hình
                </option>
                <option value="restaurant">Nhà hàng</option>
                <option value="cafe">Quán cà phê / đồ uống</option>
                <option value="other">Khác</option>
              </select>
            </label>
          </div>
          <div className="ve-field-row">
            <label className="ve-field">
              <span>
                Người liên hệ <b>*</b>
              </span>
              <input
                name="contactName"
                type="text"
                autoComplete="name"
                placeholder="Họ và tên"
                required
              />
            </label>
            <label className="ve-field">
              <span>
                Số điện thoại <b>*</b>
              </span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                minLength={8}
                maxLength={15}
                placeholder="Số điện thoại liên hệ"
                required
              />
            </label>
          </div>
          <fieldset className="ve-partner__interest ve-field--full">
            <legend>Nghiệp vụ bạn muốn tìm hiểu</legend>
            <p>Có thể chọn nhiều mục.</p>
            <div className="ve-partner__interest-options">
              <label>
                <input
                  type="checkbox"
                  name="interestAreas"
                  value="tables-reservations"
                />
                <span>Bàn và đặt bàn</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="interestAreas"
                  value="menu-orders-bills"
                />
                <span>Thực đơn, gọi món, hóa đơn</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="interestAreas"
                  value="ingredients-suppliers"
                />
                <span>Nguyên liệu, nhà cung cấp, phiếu nhập</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="interestAreas"
                  value="business-reports"
                />
                <span>Doanh thu, chi phí, lợi nhuận</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="interestAreas"
                  value="staff-permissions"
                />
                <span>Nhân viên và phân quyền</span>
              </label>
            </div>
          </fieldset>
          <label className="ve-field ve-field--full">
            <span>Ưu tiên hoặc khó khăn hiện tại</span>
            <textarea
              name="message"
              rows={2}
              placeholder="Ví dụ: theo dõi trạng thái bàn, nguyên liệu hoặc kết quả giữa nhiều cơ sở…"
            />
          </label>
          <button
            type="submit"
            className="ve-button ve-button--primary ve-partner__submit"
          >
            Kiểm tra thông tin đăng ký <ArrowRight size={17} aria-hidden="true" />
          </button>
          <p className="ve-partner__form-note">
            Biểu mẫu đang ở bản xem trước và chưa kết nối hệ thống tiếp nhận
            thông tin.
          </p>
        </form>
      )}
      <div className="ve-partner__card-footer">
        <span>
          <ShieldCheck size={14} aria-hidden="true" /> Chưa kết nối hệ thống tiếp
          nhận
        </span>
        <span>
          VINAEATERY <i>·</i> PARTNER
        </span>
      </div>
    </section>
  );
};

export default PartnerRegistrationFormComponent;
