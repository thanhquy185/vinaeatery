import { LayoutDashboard, MapPin } from "lucide-react";
import { homeLocations } from "./homePageData";

const HomePageNetworkComponent: React.FC = () => (
  <section className="ve-home__network" id="van-hanh">
    <div className="ve-section-heading">
      <div className="ve-eyebrow">
        <span className="ve-eyebrow__dot" />QUẢN LÝ TẬP TRUNG
      </div>
      <h2>
        Từ một nhà hàng đến cả hệ thống,
        <br />
        <span>mọi thứ đều trong tầm mắt.</span>
      </h2>
      <p>
        Mỗi địa điểm có hoạt động riêng. VinaEatery đưa các nghiệp vụ về chung
        một không gian quản lý để bạn dễ theo dõi và phối hợp.
      </p>
    </div>
    <div className="ve-network-map">
      <div className="ve-network-map__center">
        <div className="ve-network-map__logo">
          <LayoutDashboard size={23} aria-hidden="true" />
        </div>
        <strong>VinaEatery</strong>
        <span>Một hệ thống quản lý</span>
        <div className="ve-network-map__connector" />
      </div>
      <div className="ve-network-map__branches">
        {homeLocations.map((location, index) => (
          <article className="ve-branch-card" key={location.name}>
            <div className={`ve-branch-card__pin ve-branch-card__pin--${index + 1}`}>
              <MapPin size={18} aria-hidden="true" />
            </div>
            <span className="ve-branch-card__label">
              {index === 0 ? "CƠ SỞ CHÍNH" : `CHI NHÁNH 0${index + 1}`}
            </span>
            <h3>{location.name}</h3>
            <p>Thông tin vận hành được quản lý trong cùng hệ thống.</p>
            <span className="ve-branch-card__status">
              <i /> Sẵn sàng quản lý
            </span>
          </article>
        ))}
      </div>
      <div className="ve-network-map__caption">
        Sơ đồ khái niệm — các địa điểm là ví dụ minh họa
      </div>
    </div>
  </section>
);

export default HomePageNetworkComponent;
