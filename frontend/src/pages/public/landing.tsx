import {
  faEnvelope,
  faPhone,
  faVoicemail,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";

const LangdingPage = () => {
  return (
    <div className="public-landing">
      <header className="public-landing__header">
        <div className="public-landing__brand">
          <img
            src="/src/assets/images/others/brand-image.png"
            alt="logo-image"
            className="public-landing__brand-image"
          />
          <h1 className="public-landing__brand-text">VINAEATERY</h1>
        </div>
        <nav className="public-landing__navbar">
          <a href="#" className="public-landing__navbar-item">
            Trang chủ
          </a>
          <a href="#about" className="public-landing__navbar-item">
            Giới thiệu
          </a>
          <a href="#foods" className="public-landing__navbar-item">
            Món ăn
          </a>
          <a href="#feedback" className="public-landing__navbar-item">
            Đánh giá
          </a>
        </nav>
        <div className="public-landing__buttons">
          <button className="btn public-landing__button order">Đặt bàn</button>
          <button className="btn public-landing__button">
            <FontAwesomeIcon icon={faPhone} />
          </button>
          <button className="btn public-landing__button">
            <FontAwesomeIcon icon={faEnvelope} />
          </button>
        </div>
      </header>
      <main className="public-landing__main">
        <div className="public-landing__hero">
          <div className="public-landing-hero__info"></div>
          <div className="public-landing-hero__media">
            <img src="/src/assets/images/others/momo-logo.png" alt="" />
          </div>
        </div>
        <div id="about" style={{ height: 1000, background: "blue" }}>
          123
        </div>
        <div id="foods" style={{ height: 500, background: "yellow" }}>
          123
        </div>
        <div id="feedback" style={{ height: 1000, background: "gray" }}>
          123
        </div>
      </main>
    </div>
  );
};

export default LangdingPage;
