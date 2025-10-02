import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faAward,
  faBars,
  faCalendar,
  faClock,
  faComputerMouse,
  faEnvelope,
  faHeart,
  faLocationDot,
  faMedal,
  faPhone,
  faStar,
  faTrophy,
  faUser,
  faUsers,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Button, Card } from "antd";

const LangdingPage = () => {
  // ...
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  // Header
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const links = [
    { name: "Trang chủ", href: "#home" },
    { name: "Giới thiệu", href: "#about" },
    { name: "Thực đơn", href: "#menu" },
    { name: "Đội ngũ", href: "#team" },
    { name: "Thành tựu", href: "#achievements" },
    { name: "Liên hệ", href: "#contact" },
  ];

  // Main
  // - About
  const statsAbout = [
    {
      icon: faUsers,
      number: "50,000+",
      label: "Khách hàng",
    },
    {
      icon: faAward,
      number: "15+",
      label: "Năm kinh nghiệm",
    },
    {
      icon: faClock,
      number: "6AM-11PM",
      label: "Giờ phục vụ",
    },
    {
      icon: faHeart,
      number: "100%",
      label: "Nguyên liệu sạch",
    },
  ];
  // Menu
  const [activeCategory, setActiveCategory] = useState("pho");
  const categories = [
    { id: "pho", name: "Phở & Bún" },
    { id: "rice", name: "Cơm" },
    { id: "banh-mi", name: "Bánh Mì" },
    { id: "drinks", name: "Đồ Uống" },
  ];
  const menuItems = {
    pho: [
      {
        name: "Phở Bò Tái",
        price: "75.000đ",
        description: "Phở bò với thịt tái mềm ngon",
        rating: 4.8,
        time_cook: "12 phút",
        image:
          "https://images.unsplash.com/photo-1585238342029-4c993d706c43?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Phở Bò Chín",
        price: "75.000đ",
        description: "Phở bò với thịt chín thơm ngon",
        rating: 4.7,
        time_cook: "14 phút",
        image:
          "https://images.unsplash.com/photo-1585238342078-8e06d2a2c1dc?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Phở Đặc Biệt",
        price: "85.000đ",
        description: "Phở bò đầy đủ tái, chín, gầu, gân",
        rating: 4.9,
        time_cook: "15 phút",
        image:
          "https://images.unsplash.com/photo-1604908177073-074f2b9c4f2a?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Bún Bò Huế",
        price: "75.000đ",
        description: "Bún bò Huế cay nồng đặc trưng",
        rating: 4.6,
        time_cook: "18 phút",
        image:
          "https://images.unsplash.com/photo-1625941187784-1a6d95c0f12e?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Bún Riêu Cua",
        price: "70.000đ",
        description: "Bún riêu cua đồng thơm ngon",
        rating: 4.5,
        time_cook: "16 phút",
        image:
          "https://images.unsplash.com/photo-1631515243304-df30c0f1e9c4?auto=format&fit=crop&w=800&q=80",
      },
    ],
    rice: [
      {
        name: "Cơm Tấm Sườn Nướng",
        price: "65.000đ",
        description: "Cơm tấm với sườn nướng mật ong",
        rating: 4.8,
        time_cook: "15 phút",
        image:
          "https://images.unsplash.com/photo-1625938144307-83ab0e862599?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Cơm Gà Nướng",
        price: "60.000đ",
        description: "Cơm với gà nướng ngũ vị hương",
        rating: 4.7,
        time_cook: "17 phút",
        image:
          "https://images.unsplash.com/photo-1625939645153-8025956574a1?auto=format&fit=crop&w=800&q=80",
      },
    ],
    // banh-mi & drinks có thể thêm tương tự
  };
  // - Team
  const teamMembers = [
    {
      name: "Chef Nguyễn Minh Tuấn",
      position: "Bếp trưởng",
      experience: "15 năm kinh nghiệm",
      specialty: "Chuyên gia ẩm thực Việt Nam",
      image:
        "https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      achievements: ["Giải Nhất Cuộc thi Đầu bếp 2023", "Chứng chỉ Quốc tế"],
    },
    {
      name: "Chef Trần Thị Hương",
      position: "Phó bếp trưởng",
      experience: "12 năm kinh nghiệm",
      specialty: "Chuyên gia món Miền Nam",
      image:
        "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      achievements: ["Giải Bạc Ẩm thực Việt", "Top 10 Chef trẻ"],
    },
    {
      name: "Lê Văn Đức",
      position: "Quản lý nhà hàng",
      experience: "10 năm kinh nghiệm",
      specialty: "Chuyên gia dịch vụ khách hàng",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      achievements: ["Chứng chỉ Quản lý F&B", "Giải thưởng Dịch vụ xuất sắc"],
    },
    {
      name: "Phạm Thị Mai",
      position: "Đầu bếp bánh ngọt",
      experience: "8 năm kinh nghiệm",
      specialty: "Chuyên gia bánh ngọt truyền thống",
      image:
        "https://images.unsplash.com/photo-1559941707-71e7bb8c6b99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      achievements: ["Chứng chỉ Pastry Chef", "Giải Nhì Bánh ngọt sáng tạo"],
    },
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };
  // - Achievement
  const achievements = [
    {
      icon: faTrophy,
      title: "Nhà hàng xuất sắc 2023",
      description: "Giải thưởng Ẩm thực Việt Nam",
      year: "2023",
      organization: "Hiệp hội Ẩm thực VN",
    },
    {
      icon: faAward,
      title: "Top 10 Nhà hàng tốt nhất",
      description: "Bình chọn của khách hàng",
      year: "2022-2023",
      organization: "Vietnam Restaurant Awards",
    },
    {
      icon: faMedal,
      title: "Chứng nhận HACCP",
      description: "An toàn thực phẩm quốc tế",
      year: "2022",
      organization: "Tổ chức HACCP Quốc tế",
    },
    {
      icon: faStar,
      title: "5 sao TripAdvisor",
      description: "Đánh giá xuất sắc từ du khách",
      year: "2021-2023",
      organization: "TripAdvisor",
    },
  ];
  const statsAchievement = [
    {
      icon: faUser,
      number: "50,000+",
      label: "Khách hàng phục vụ",
      description: "Mỗi năm",
    },
    {
      icon: faCalendar,
      number: "15+",
      label: "Năm hoạt động",
      description: "Kinh nghiệm",
    },
    {
      icon: faAward,
      number: "25+",
      label: "Giải thưởng",
      description: "Đã nhận được",
    },
    {
      icon: faStar,
      number: "4.9/5",
      label: "Đánh giá trung bình",
      description: "Từ khách hàng",
    },
  ];
  // - Contact
  const contactInfo = [
    {
      icon: faLocationDot,
      title: "Địa chỉ",
      content: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
      subContent: "Gần chợ Bến Thành",
    },
    {
      icon: faPhone,
      title: "Điện thoại",
      content: "0123 456 789",
      subContent: "Hotline đặt bàn 24/7",
    },
    {
      icon: faClock,
      title: "Giờ mở cửa",
      content: "06:00 - 23:00",
      subContent: "Tất cả các ngày trong tuần",
    },
    {
      icon: faEnvelope,
      title: "Email",
      content: "info@delicious.vn",
      subContent: "Liên hệ hợp tác",
    },
  ];
  const socialLinksContact = [
    { icon: faFacebook, name: "Facebook", url: "#", color: "text-blue-600" },
    { icon: faInstagram, name: "Instagram", url: "#", color: "text-pink-600" },
  ];

  // Footer
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

  //
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hero ra khỏi viewport => scrolled = true
        setScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (heroRef.current) observer.observe(heroRef.current);

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);
  useEffect(() => {
    import("../../assets/styles/tailwind.css");
  }, []);
  useEffect(() => {
    // Nếu URL không có #home thì coi như đã scroll
    if (!window.location.href.includes("#home")) {
      setScrolled(true);
      return; // không cần observe heroRef nữa
    }
  }, [window.location.href]);

  return (
    <div className="relative min-h-screen bg-white">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        // className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg"
        className={`fixed top-0 left-0 right-0 z-50 w-full !py-4 ${
          scrolled
            ? "!bg-white/60 !backdrop-blur-sm !shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center !py-2">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-6 cursor-pointer"
            >
              <img
                src="/src/assets/images/others/brand-image.png"
                alt="brand-logo"
                className="size-25"
              />
              <strong
                className={
                  "text-5xl font-bold " +
                  (scrolled ? "text-[#b91c1c]" : "text-white")
                }
              >
                VINAEATERY
              </strong>
            </motion.div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-x-10">
              {links.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{
                    scale: 1.05,
                    color: "#d32f2f",
                    transition: { duration: 0.2 },
                  }}
                  className={
                    "text-3xl font-medium transition-colors " +
                    (scrolled ? "text-black" : "text-gray-300")
                  }
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
            {/* Contact Info */}
            <div className="hidden lg:!flex flex-col gap-y-2 text-gray-100 text-2xl">
              <div
                className={
                  "!py-2 !px-4 rounded-sm " + (scrolled ? "bg-[#b91c1c]" : "")
                }
              >
                <FontAwesomeIcon className="size-5 mr-3" icon={faPhone} />
                <span>0123 456 789</span>
              </div>
              <div
                className={
                  "!py-2 !px-4 rounded-sm " + (scrolled ? "bg-[#b91c1c]" : "")
                }
              >
                <FontAwesomeIcon className="size-5 mr-3" icon={faLocationDot} />
                <span>123 Đường ABC, TP.HCM</span>
              </div>
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:!hidden p-2"
            >
              {isMenuOpen ? (
                <FontAwesomeIcon icon={faX} />
              ) : (
                <FontAwesomeIcon icon={faBars} />
              )}
            </button>
          </div>
          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <nav className="py-4 space-y-2">
                {links.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:text-[#d32f2f] hover:bg-red-50 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </div>
      </motion.header>
      {/* Main */}
      <main className="relative z-10">
        {/* Hero */}
        <section
          ref={heroRef}
          id="home"
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-gradient-to-r from-black/60 to-black/40 absolute z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Restaurant Interior"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Content */}
          <div className="relative z-20 container mx-auto px-4 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mx-auto"
            >
              {/* Rating */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex items-center justify-center"
              >
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className="size-10 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="!ml-4 text-4xl font-medium">
                  4.9/5 từ 1000+ đánh giá
                </span>
              </motion.div>
              {/* Sub Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="!mt-4 text-7xl md:text-9xl font-bold leading-tight"
              >
                Hương Vị
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d32f2f] to-red-700">
                  {" "}
                  Đặc Biệt
                </span>
              </motion.h1>
              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="!mt-6 text-4xl md:text-5xl text-gray-200 !mx-20"
              >
                Khám phá những món ăn tinh tế được chế biến từ nguyên liệu tươi
                ngon nhất, mang đến trải nghiệm ẩm thực không thể quên cùng đội
                ngũ đầu bếp tài năng.
              </motion.p>
              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="flex flex-col sm:flex-row justify-center items-center gap-8 !mt-14 text-3xl"
              >
                <button className="!py-6 !px-10 !bg-[#d32f2f] rounded-lg text-white font-semibold group cursor-pointer hover:!bg-[#b91c1c]">
                  Khám Phá Nhà Hàng
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="ml-2 size-5 group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <motion.button
                  className="!py-6 !px-10 !bg-[#fff] rounded-lg text-black font-semibold cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  Đặt Bàn Ngay
                </motion.button>
              </motion.div>
            </motion.div>
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/4 left-10 w-20 h-20 bg-[#d32f2f]/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute bottom-1/4 right-10 w-32 h-32 bg-red-700/20 rounded-full blur-xl"
            />
          </div>
          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-14 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              // className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
            >
              <FontAwesomeIcon
                icon={faComputerMouse}
                className="text-5xl text-white"
              />
            </motion.div>
          </motion.div>
        </section>
        {/* About */}
        <section
          id="about"
          className="flex justify-center items-center min-h-screen"
        >
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Image Left */}
              <motion.div
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
                  alt="Delicious Food"
                  className="rounded-2xl shadow-xl w-full h-[500px] object-cover"
                />
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  viewport={{ once: true }}
                  className="absolute bottom-6 left-6 bg-white !px-6 !py-4 rounded-xl shadow-lg"
                >
                  <p className="text-2xl font-bold text-gray-800">
                    #1 Nhà hàng Việt
                  </p>
                  <p className="text-lg text-gray-500">Khách hàng tin tưởng</p>
                </motion.div>
              </motion.div>
              {/* Content Right */}
              <motion.div
                initial={{ opacity: 0, x: 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-6xl font-bold text-gray-800">
                  Về{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b91c1c] to-red-700">
                    Chúng Tôi
                  </span>
                </h2>
                <p className="!mt-10 text-3xl text-gray-600 leading-relaxed">
                  Từ năm 2008, nhà hàng Vinaeatery đã mang đến trải nghiệm ẩm
                  thực Việt Nam tinh túy cho hàng ngàn thực khách. Với sự kết
                  hợp giữa công thức gia truyền và sự sáng tạo hiện đại, chúng
                  tôi tự hào giữ trọn hương vị truyền thống.
                </p>
                <p className="!mt-2 text-3xl text-gray-600 leading-relaxed">
                  Chúng tôi cam kết mang đến món ăn chất lượng, nguyên liệu tươi
                  ngon và dịch vụ tận tâm, để mỗi bữa ăn là một trải nghiệm khó
                  quên.
                </p>
                {/* <p className="!mt-10 text-3xl text-gray-600 leading-relaxed">
                  Được thành lập từ năm 2008, nhà hàng Vinaeatery đã trở thành
                  điểm đến quen thuộc của những người yêu thích ẩm thực Việt Nam
                  truyền thống.
                </p>
                <p className="!mt-4 text-3xl text-gray-600 leading-relaxed">
                  Chúng tôi tự hào mang đến những món ăn được chế biến từ công
                  thức gia truyền, kết hợp với nguyên liệu tươi ngon được tuyển
                  chọn kỹ lưỡng từ các vùng miền khắp cả nước.
                </p>
                <p className="!mt-4 text-3xl text-gray-600 leading-relaxed">
                  Với đội ngũ đầu bếp giàu kinh nghiệm và tâm huyết, chúng tôi
                  không ngừng cải tiến để mang đến cho thực khách những trải
                  nghiệm ẩm thực tuyệt vời nhất.
                </p>
                <p className="!mt-4 text-3xl text-gray-600 leading-relaxed">
                  Sứ mệnh của chúng tôi là bảo tồn và phát huy những giá trị ẩm
                  thực truyền thống Việt Nam, đồng thời tạo ra một không gian ấm
                  cúng để mọi người có thể thưởng thức những bữa ăn ngon cùng
                  gia đình và bạn bè.
                </p> */}
                {/* Stats */}
                <div className="grid grid-cols-4 sm:grid-cols-2 gap-10 !mt-14">
                  {statsAbout.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="!py-10 rounded-lg bg-red-50 text-center shadow-md transition-all duration-300"
                    >
                      <div className="flex justify-center">
                        <div className="size-20 bg-[#b91c1c] rounded-full flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={stat.icon}
                            className="text-3xl text-white"
                          />
                        </div>
                      </div>
                      <div className="!mt-6 text-4xl font-bold text-gray-800">
                        {stat.number}
                      </div>
                      <div className="!mt-2 text-2xl text-gray-500">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        {/* Menu */}
        <section
          id="menu"
          className="flex justify-center items-center min-h-screen bg-gray-50"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-gray-800">
                Thực Đơn
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b91c1c] to-red-700">
                  {" "}
                  Đa Dạng
                </span>
              </h2>
              <p className="!mt-5 text-4xl text-gray-600">
                Khám phá thực đơn phong phú với những món ăn đặc sắc từ khắp ba
                miền
              </p>
            </motion.div>
            {/* Category Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 !mt-14"
            >
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "text" : "outlined"}
                  size="large"
                  color="default"
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-8 py-3 font-semibold transition-all duration-300 ${
                    activeCategory === category.id
                      ? "!bg-[#d32f2f] hover:!bg-red-700 !text-white shadow-lg"
                      : "!border-gray-300 !text-gray-700 hover:!border-[#d32f2f] hover:!text-[#d32f2f]"
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </motion.div>
            {/* Menu Items */}
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 !mt-10"
            >
              {menuItems[activeCategory as keyof typeof menuItems]?.map(
                (item, index) => (
                  <motion.div
                    key={`${activeCategory}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative rounded-xl overflow-hidden shadow-lg group">
                      {/* Ảnh món ăn */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Overlay mờ */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Thông tin chi tiết */}
                      <div
                        className="absolute bottom-0 left-0 right-0 !p-6 text-white 
      opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 
      transition-all duration-500 ease-in-out bg-black/40 backdrop-blur-sm"
                      >
                        {/* Tên + Rating */}
                        <div className="flex justify-between items-center">
                          <h3 className="text-2xl font-bold">{item.name}</h3>
                          <div className="flex items-center gap-x-2">
                            <FontAwesomeIcon
                              icon={faStar}
                              className="size-5 text-yellow-400"
                            />
                            <span className="text-xl">{item.rating}</span>
                          </div>
                        </div>
                        {/* Mô tả */}
                        <p className="!mt-2 text-xl text-gray-200">
                          {item.description}
                        </p>
                        {/* Extra info */}
                        <div className="flex justify-between items-center !mt-4 text-xl">
                          <span className="flex items-center gap-2">
                            <FontAwesomeIcon
                              icon={faClock}
                              className="size-5"
                            />
                            <span>{item.time_cook}</span>
                          </span>
                          <span className="text-3xl font-bold text-[#d32f2f]">
                            {item.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          </div>
        </section>
        {/* Team */}
        <section
          id="team"
          className="flex justify-center items-center min-h-screen bg-white"
        >
          <div className="container mx-auto px-4">
            {/* Sub Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-gray-800">
                Đội Ngũ
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b91c1c] to-red-700">
                  {" "}
                  Chuyên Nghiệp
                </span>
              </h2>
              <p className="!mt-5 text-4xl text-gray-600">
                Gặp gỡ những con người tài năng đằng sau những món ăn tuyệt vời
                của chúng tôi
              </p>
            </motion.div>
            {/* Card */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 !mt-24"
            >
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="group cursor-pointer"
                >
                  <Card className="shadow-lg rounded-lg hover:shadow-2xl transition-all duration-300 border-0">
                    <div className="relative">
                      <figure className="overflow-hidden rounded-lg">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-120 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </figure>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center space-x-1 mb-2">
                          <FontAwesomeIcon
                            icon={faStar}
                            className="size-10 fill-yellow-400 text-yellow-400"
                          />
                          <span className="text-xl font-medium">
                            {member.experience}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="!p-8">
                      <h3 className="text-3xl font-bold text-gray-800 group-hover:text-[#b91c1c] transition-colors">
                        {member.name}
                      </h3>
                      <p className="!mt-1 text-2xl text-[#b91c1c] font-semibold">
                        {member.position}
                      </p>
                      <p className="!mt-3 text-xl text-gray-600">
                        {member.specialty}
                      </p>
                      <div className="!mt-6 !space-y-2">
                        {member.achievements.map((achievement, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-2"
                          >
                            <FontAwesomeIcon
                              icon={faAward}
                              className="size-5 text-xl text-[#b91c1c]"
                            />
                            <span className="text-xl text-gray-600">
                              {achievement}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        {/* Achievement */}
        <section
          id="achievements"
          className="flex justify-center items-center min-h-screen bg-gray-50 !py-40"
        >
          <div className="container mx-auto px-4">
            {/* Suv Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-gray-800">
                Thành Tựu
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b91c1c] to-red-700">
                  {" "}
                  Đáng Tự Hào
                </span>
              </h2>
              <p className="!mt-5 text-4xl text-gray-600">
                Những giải thưởng và thành tích mà chúng tôi đã đạt được trong
                suốt hành trình phát triển
              </p>
            </motion.div>
            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 !mt-24"
            >
              {statsAchievement.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5 }}
                  className="bg-white !p-10 rounded-lg text-center shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex justify-center">
                    <div className="flex items-center justify-center size-25 bg-gradient-to-r from-[#b91c1c] to-red-700 rounded-full">
                      <FontAwesomeIcon
                        icon={stat.icon}
                        className="text-4xl text-white"
                      />
                    </div>
                  </div>
                  <div className="!mt-6 text-5xl text-gray-800 font-bold">
                    {stat.number}
                  </div>
                  <div className="!mt-4 text-3xl text-gray-800 font-semibold">
                    {stat.label}
                  </div>
                  <div className="!mt-1 text-xl text-gray-600">
                    {stat.description}
                  </div>
                </motion.div>
              ))}
            </motion.div>
            {/* Awards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 !mt-20"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <Card className="h-full shadow-lg hover:shadow-2xl transition-all border-0 bg-white">
                    <div className="text-center">
                      <div className="flex justify-center">
                        <div className="flex items-center justify-center size-25 bg-gradient-to-r from-[#b91c1c] to-red-700 rounded-full shadow-lg">
                          <FontAwesomeIcon
                            icon={achievement.icon}
                            className="text-4xl text-white"
                          />
                        </div>
                      </div>
                      <h3 className="!mt-6 text-3xl font-bold text-gray-800">
                        {achievement.title}
                      </h3>
                      <p className="!mt-4 text-2xl text-gray-600 leading-relaxed">
                        {achievement.description}
                      </p>
                      <div className="!w-full !mt-10 !border-t">
                        <div className="!mt-6 text-[#b91c1c] font-bold text-xl">
                          {achievement.year}
                        </div>
                        <div className="!mt-2 text-gray-500 text-xl">
                          {achievement.organization}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            {/* Certificate Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="!mt-20 text-center"
            >
              <h3 className="text-4xl font-bold text-gray-800">
                Chứng nhận & Bằng khen
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 !mt-6">
                {[1, 2, 3, 4].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="relative group cursor-pointer"
                  >
                    <img
                      src={`https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                      alt={`Certificate ${item}`}
                      className="w-full !h-60 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-[#d32f2f]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                      <span className="text-2xl text-white font-semibold">
                        Chứng nhận {item}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        {/* Contact */}
        <section
          id="contact"
          className="flex justify-center items-center min-h-screen bg-white"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-gray-800">
                Liên Hệ
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b91c1c] to-red-700">
                  {" "}
                  Với Chúng Tôi
                </span>
              </h2>
              <p className="!mt-5 text-4xl text-gray-600">
                Hãy đến và trải nghiệm không gian ẩm thực tuyệt vời tại nhà hàng
                của chúng tôi
              </p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 !mt-24">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                    >
                      <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                        <div className="!p-4 text-center">
                          <div className="flex justify-center">
                            <div className="size-20 bg-[#b91c1c] rounded-full flex items-center justify-center">
                              <FontAwesomeIcon
                                icon={info.icon}
                                className="text-3xl text-white"
                              />
                            </div>
                          </div>
                          <h3 className="!mt-6 text-3xl font-bold text-gray-800">
                            {info.title}
                          </h3>
                          <p className="!mt-4 text-2xl text-gray-800 font-medium">
                            {info.content}
                          </p>
                          <p className="!mt-1 text-xl text-gray-600">
                            {info.subContent}
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-center"
                >
                  <h3 className="!mt-14 text-3xl font-bold text-gray-800">
                    Theo dõi chúng tôi
                  </h3>
                  <div className="flex justify-center gap-x-8 !mt-6">
                    {socialLinksContact.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.url}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`size-20 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors ${social.color}`}
                      >
                        <FontAwesomeIcon
                          icon={social.icon}
                          className="text-4xl"
                        />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
              {/* Map & Reservation */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="!space-y-10"
              >
                {/* Map Placeholder */}
                <Card className="shadow-lg border-0 overflow-hidden">
                  <div className="p-0">
                    <div className="relative h-100 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Restaurant Location"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="text-white text-center">
                          <FontAwesomeIcon
                            icon={faLocationDot}
                            className="text-4xl mx-auto"
                          />
                          <p className="!mt-3 text-3xl font-semibold">
                            123 Đường Nguyễn Huệ, Q1, TP.HCM
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                {/* Reservation CTA */}
                <Card className="shadow-lg border-0 !bg-[#b91c1c] !p-6 text-white">
                  <div className="text-center">
                    <h3 className="text-4xl text-white font-bold">
                      Đặt Bàn Ngay
                    </h3>
                    <p className="!mt-6 text-2xl text-red-100">
                      Gọi ngay để đặt bàn và thưởng thức những món ăn tuyệt vời
                    </p>
                    <div className="!mt-10 !space-y-6">
                      <Button
                        variant="text"
                        size="large"
                        className="w-full bg-white !text-[#b91c1c] hover:bg-gray-100 font-semibold"
                      >
                        <FontAwesomeIcon
                          icon={faPhone}
                          className="size-5 mr-2"
                        />
                        <span className="text-2xl">Gọi: 0123 456 789</span>
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        className="w-full border-white !text-[#b91c1c] hover:bg-white hover:text-[#d32f2f] font-semibold"
                      >
                        <span className="text-2xl">Đặt bàn trực tuyến</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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
                  src="/src/assets/images/others/brand-image.png"
                  alt="brand-logo"
                  className="size-25"
                />
                <strong className="text-white text-5xl font-bold">
                  VINAEATERY
                </strong>
              </div>
              <p className="!mt-6 text-gray-400 text-2xl leading-relaxed">
                Mang đến những trải nghiệm ẩm thực tuyệt vời với hương vị đặc
                sắc từ khắp ba miền đất nước.
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
                    icon={faLocationDot}
                    className="mt-1 text-2xl text-[#b91c1c] flex-shrink-0"
                  />
                  <div>
                    <p className="text-2xl text-gray-300">
                      123 Đường Nguyễn Huệ
                    </p>
                    <p className="text-gray-400 text-lg">Quận 1, TP.HCM</p>
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
                    icon={faClock}
                    className="mt-1 text-2xl text-[#b91c1c] flex-shrink-0"
                  />
                  <div>
                    <p className="text-2xl text-gray-300">06:00 - 23:00</p>
                    <p className="text-gray-400 text-lg">Tất cả các ngày</p>
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
                © 2024 Nhà Hàng Vinaeatery. Tất cả quyền được bảo lưu.
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
    </div>
  );
};

export default LangdingPage;
