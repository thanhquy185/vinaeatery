import {
  ArrowRight,
  Check,
  ClipboardList,
  LayoutDashboard,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { homeLocations } from "./homePageData";

const HomePageHeroComponent: React.FC = () => (
  <section className="ve-home__hero">
    <div className="ve-home__hero-inner">
      <div className="ve-home__hero-copy">
        <div className="ve-eyebrow">
          <span className="ve-eyebrow__dot" />
          NỀN TẢNG QUẢN LÝ NHÀ HÀNG ĐA CHI NHÁNH
        </div>
        <h1>
          Nhiều nhà hàng.
          <br />
          <span>Một tầm nhìn.</span>
        </h1>
        <p className="ve-home__lead">
          VinaEatery giúp bạn quản lý hoạt động của nhiều nhà hàng trên cùng
          một hệ thống — từ bàn ăn, thực đơn đến đơn hàng và kết quả kinh
          doanh.
        </p>
        <div className="ve-home__actions">
          <Link className="ve-button ve-button--primary" to="/public/partner">
            Đăng ký làm đối tác <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a className="ve-button ve-button--quiet" href="#van-hanh">
            Khám phá hệ thống
          </a>
        </div>
        <div className="ve-home__promise">
          <span>
            <Check size={15} aria-hidden="true" />
            Từng nhà hàng, một nơi quản lý
          </span>
          <span>
            <Check size={15} aria-hidden="true" />
            Tổng quan hoạt động dễ theo dõi
          </span>
        </div>
      </div>

      <div
        className="ve-dashboard"
        aria-label="Minh họa giao diện quản lý nhiều nhà hàng"
      >
        <div className="ve-dashboard__topbar">
          <div className="ve-dashboard__brandmark">
            <LayoutDashboard size={17} aria-hidden="true" />
          </div>
          <div>
            <strong>Không gian quản lý</strong>
            <span>Minh họa giao diện</span>
          </div>
          <button
            className="ve-dashboard__period"
            type="button"
            aria-label="Khoảng thời gian minh họa"
          >
            Hôm nay <span>⌄</span>
          </button>
        </div>
        <div className="ve-dashboard__body">
          <div className="ve-dashboard__heading">
            <div>
              <span className="ve-dashboard__overline">
                TỔNG QUAN HỆ THỐNG
              </span>
              <h2>Mạng lưới nhà hàng</h2>
            </div>
            <span className="ve-dashboard__live">
              <i /> Đang hoạt động
            </span>
          </div>
          <div className="ve-dashboard__summary">
            <div className="ve-dashboard__summary-icon">
              <MapPin size={17} aria-hidden="true" />
            </div>
            <div>
              <strong>Toàn bộ địa điểm</strong>
              <span>Quản lý tập trung</span>
            </div>
            <b>
              03 <small>cơ sở</small>
            </b>
          </div>
          <div className="ve-dashboard__locations">
            {homeLocations.map((location, index) => (
              <div className="ve-location" key={location.name}>
                <span
                  className={`ve-location__number ve-location__number--${index + 1}`}
                >
                  0{index + 1}
                </span>
                <div className="ve-location__info">
                  <strong>{location.name}</strong>
                  <span>{location.area}</span>
                </div>
                <span className="ve-location__status">
                  <i />
                  {location.status}
                </span>
              </div>
            ))}
          </div>
          <div className="ve-dashboard__bottom">
            <div className="ve-dashboard__chart-card">
              <div className="ve-dashboard__card-heading">
                <span>Hoạt động theo ngày</span>
                <span className="ve-dashboard__demo-label">
                  SỐ LIỆU MINH HỌA
                </span>
              </div>
              <div className="ve-chart" aria-hidden="true">
                <div className="ve-chart__guide ve-chart__guide--one" />
                <div className="ve-chart__guide ve-chart__guide--two" />
                <div className="ve-chart__bars">
                  {[34, 52, 43, 72, 59, 88, 66, 78, 48, 91, 71, 84].map(
                    (height, index) => (
                      <i
                        className={index === 9 ? "is-highlighted" : ""}
                        style={{ height: `${height}%` }}
                        key={index}
                      />
                    ),
                  )}
                </div>
                <div className="ve-chart__labels">
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                </div>
              </div>
            </div>
            <div className="ve-dashboard__tasks">
              <span className="ve-dashboard__tasks-icon">
                <ClipboardList size={17} aria-hidden="true" />
              </span>
              <strong>Vận hành</strong>
              <span>Bàn · Thực đơn · Đơn hàng</span>
              <ArrowRight size={15} aria-hidden="true" />
            </div>
          </div>
          <p className="ve-dashboard__disclaimer">
            Giao diện và dữ liệu trong hình chỉ mang tính minh họa.
          </p>
        </div>
      </div>
    </div>
    <a
      href="#van-hanh"
      className="ve-home__scroll"
      aria-label="Cuộn xuống để tìm hiểu thêm"
    >
      <span />
    </a>
  </section>
);

export default HomePageHeroComponent;
