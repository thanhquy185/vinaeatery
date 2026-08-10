import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import type { AnchorProps } from "../../services/props";
// import { getUserLogin } from "../../services/user-login";
// import { showToast } from "../../utils/showToast";

const ComebackHomeComponent: React.FC<AnchorProps> = ({ className, style }) => {
  const navigate = useNavigate();

  return (
    <Link
      to="/"
      id="comeback-home-btn"
      className={className}
      style={style}
      onClick={() => {
        // showToast("success", `Đến trang chủ thành công!`, 1.2, -75, -63);
        navigate("/");
      }}
    >
      <FontAwesomeIcon icon={faChevronLeft} />
      &nbsp;&nbsp;Quay lại Trang chủ
    </Link>
  );
};

export default ComebackHomeComponent;
