import { ChevronDown } from "lucide-react";

const PartnerPageFaqComponent: React.FC = () => (
  <section className="ve-partner__faq" aria-labelledby="ve-partner-faq-title">
    <div className="ve-partner__faq-intro">
      <div className="ve-eyebrow">
        <span className="ve-eyebrow__dot" />TRƯỚC KHI ĐĂNG KÝ
      </div>
      <h2 id="ve-partner-faq-title">Một vài điều cần biết</h2>
      <p>
        Thông tin rõ ràng để bạn hiểu VinaEatery và trạng thái hiện tại của biểu
        mẫu.
      </p>
    </div>
    <div className="ve-partner__questions">
      <details>
        <summary>
          <span>VinaEatery hỗ trợ quản lý những nghiệp vụ nào?</span>
          <ChevronDown size={18} aria-hidden="true" />
        </summary>
        <p>
          Hệ thống hiện có các nghiệp vụ quản lý nhà hàng, bàn và đặt bàn, thực
          đơn, món ăn, đơn gọi món, hóa đơn, nhân sự, cùng báo cáo doanh thu, chi
          phí và lợi nhuận.
        </p>
      </details>
      <details>
        <summary>
          <span>Tôi có thể đăng ký với một địa điểm không?</span>
          <ChevronDown size={18} aria-hidden="true" />
        </summary>
        <p>
          Có. Biểu mẫu có lựa chọn một địa điểm để mô tả đúng quy mô hiện tại
          của nhà hàng.
        </p>
      </details>
      <details>
        <summary>
          <span>Tôi nên cung cấp những thông tin nào?</span>
          <ChevronDown size={18} aria-hidden="true" />
        </summary>
        <p>
          Biểu mẫu hỏi tên thương hiệu, loại hình, số lượng địa điểm, thông tin
          liên hệ và nghiệp vụ bạn quan tâm. Phần ghi chú có thể mô tả cách vận
          hành hoặc vấn đề bạn muốn theo dõi rõ hơn.
        </p>
      </details>
      <details>
        <summary>
          <span>Thông tin trong biểu mẫu đã được gửi đi chưa?</span>
          <ChevronDown size={18} aria-hidden="true" />
        </summary>
        <p>
          Chưa. Đây là giao diện phía client để xem trước; biểu mẫu chưa kết nối
          API nên dữ liệu không được gửi hoặc lưu lại.
        </p>
      </details>
    </div>
  </section>
);

export default PartnerPageFaqComponent;
