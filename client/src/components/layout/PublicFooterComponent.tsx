import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { ImageSourcePath } from "../../constants/values";

type PublicFooterComponentProps = {};

const PublicFooterComponent: React.FC<PublicFooterComponentProps> = ({}) => {
  const socialLinksFooter = [
    { icon: faFacebook, name: "Facebook", url: "#" },
    { icon: faInstagram, name: "Instagram", url: "#" },
    { icon: faTwitter, name: "Twitter", url: "#" },
  ];
  const quickLinks = [
    { name: "Trang chủ", href: "#home" },
    { name: "Giới thiệu", href: "#about" },
    { name: "Thực đơn", href: "#menu" },
    { name: "Đội ngũ", href: "#team" },
    { name: "Thành tựu", href: "#achievements" },
    { name: "Liên hệ", href: "#contact" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto !py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <img
                src={ImageSourcePath + "brand-image.png"}
                alt="brand-logo"
                className="size-25"
              />
              <strong className="text-white text-5xl font-bold">
                VINAEATERY
              </strong>
            </div>
            <p className="!mt-6 text-gray-400 text-2xl leading-relaxed">
              Mang đến những trải nghiệm ẩm thực tuyệt vời với hương vị đặc sắc
              từ khắp ba miền đất nước.
            </p>
            <div className="flex align-center gap-4">
              {socialLinksFooter.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center justify-center size-15 bg-gray-600 !mt-6 rounded-full hover:bg-[#b91c1c] transition-all"
                >
                  <FontAwesomeIcon icon={social.icon} className="text-2xl" />
                </motion.a>
              ))}
            </div>
          </motion.div>
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold">Liên kết nhanh</h3>
            <ul className="!mt-10">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="flex items-center !mt-4 text-2xl text-gray-400 transition-colors group hover:text-[#b91c1c]"
                  >
                    {/* <span className="size-3 bg-[#b91c1c] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span> */}
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold">Thông tin liên hệ</h3>
            <ul className="!mt-10">
              <li className="flex items-start gap-3 !mt-4">
                <FontAwesomeIcon
                  icon={faClock}
                  className="mt-1 text-2xl text-[#b91c1c] flex-shrink-0"
                />
                <div>
                  <p className="text-2xl text-gray-300">06:00 - 23:00</p>
                  <p className="text-gray-400 text-lg">Tất cả các ngày</p>
                </div>
              </li>
              <li className="flex items-center gap-3 !mt-4">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="text-2xl text-[#b91c1c] flex-shrink-0"
                />
                <p className="text-2xl text-gray-300">0123 456 789</p>
              </li>
              <li className="flex items-center gap-3 !mt-4">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-2xl text-[#b91c1c] flex-shrink-0"
                />
                <p className="text-2xl text-gray-300">info@delicious.vn</p>
              </li>
              <li className="flex items-start gap-3 !mt-4">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="mt-1 text-2xl text-[#b91c1c] flex-shrink-0"
                />
                <div>
                  <p className="text-2xl text-gray-300">123 Đường Nguyễn Huệ</p>
                  <p className="text-gray-400 text-lg">Quận 1, TP.HCM</p>
                </div>
              </li>
            </ul>
          </motion.div>
          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold">Nhận thông tin mới</h3>
            <p className="text-gray-400 !mt-10 text-2xl">
              Đăng ký để nhận thông tin về các món ăn mới và ưu đãi đặc biệt.
            </p>
            <div className="space-y-4 !mt-6">
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full bg-gray-700 !py-5 !px-4 !border !border-gray-500 !border-2 rounded-lg text-2xl focus:outline-none focus:!border-[#b91c1c] transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full !bg-[#b91c1c] !py-5 !px-4 rounded-lg text-2xl text-white font-semibold transition-all"
              >
                Đăng ký
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="!border-t !border-gray-500">
        <div className="container mx-auto !px-4 !py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-2xl">
              © 2025 Hệ thống nhà Hàng Vinaeatery. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex !space-x-6 text-2xl">
              <a
                href="#"
                className="text-gray-400 hover:text-[#d32f2f] transition-colors"
              >
                Chính sách bảo mật
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#d32f2f] transition-colors"
              >
                Điều khoản sử dụng
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooterComponent;
