import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageSourcePath } from "../../../constants/values";
import "./PublicFooterComponent.css";

const PublicFooterComponent = () => (
  <footer className="ve-footer">
    <div className="ve-footer__main">
      <div className="ve-footer__brand">
        <Link to="/public" className="ve-footer__logo">
          <img src={ImageSourcePath + "brand-image.png"} alt="" />
          <strong>VINAEATERY</strong>
        </Link>
        <p>Nền tảng giúp nhà hàng quản lý vận hành và theo dõi hoạt động trên cùng một hệ thống.</p>
      </div>
      <div className="ve-footer__links">
        <strong>Khám phá</strong>
        <Link to="/public">Trang chủ</Link>
        <Link to="/public/restaurant">Danh sách nhà hàng</Link>
      </div>
      <div className="ve-footer__links">
        <strong>Dành cho nhà hàng</strong>
        <Link to="/public/partner">Đăng ký đối tác</Link>
        <a href="/public/partner">Tìm hiểu hệ thống <ArrowUpRight size={13} aria-hidden="true" /></a>
      </div>
    </div>
    <div className="ve-footer__bottom">
      <span>© {new Date().getFullYear()} VinaEatery</span>
      <span>Quản lý nhiều nhà hàng trong một tầm nhìn.</span>
    </div>
  </footer>
);

export default PublicFooterComponent;
