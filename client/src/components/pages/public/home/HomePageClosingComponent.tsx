import { ArrowRight, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

const HomePageClosingComponent: React.FC = () => (
  <section className="ve-home__closing-stage">
    <div className="ve-home__closing">
      <div className="ve-home__closing-mark">
        <Utensils size={22} aria-hidden="true" />
      </div>
      <div className="ve-home__closing-copy">
        <span className="ve-eyebrow ve-eyebrow--light">
          DÀNH CHO CHỦ NHÀ HÀNG
        </span>
        <h2>
          Sẵn sàng quản lý nhà hàng
          <br />
          trên cùng một nền tảng?
        </h2>
        <p>
          Chia sẻ thông tin nhà hàng của bạn để bắt đầu trao đổi cùng VinaEatery.
        </p>
      </div>
      <Link className="ve-button ve-button--light" to="/public/partner">
        Đăng ký trở thành đối tác <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </div>
    <div className="ve-home__guest-link">
      Bạn đang tìm nơi dùng bữa?{" "}
      <Link to="/public/restaurant">
        Khám phá danh sách nhà hàng <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </div>
  </section>
);

export default HomePageClosingComponent;
