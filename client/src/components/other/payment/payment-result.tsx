import type { FC } from "react";
import type { PaymentProps } from "../../../pages/other/payment";
import { ImageSourcePath } from "../../../common/values";
import { Rate } from "antd";

// Các giá trị chung
// - Icon
const billCheckedIcon = "bill-checked-icon.png";
// const billUncheckedIcon = "bill-unchecked-icon.png";
// const rateIcon = "rate-icon.png";
const terribleEmotion = "terrible-emotion.png";
const poorEmotion = "poor-emotion.png";
const okayEmotion = "okay-emotion.png";
const goodEmotion = "good-emotion.png";
const perfectEmotion = "perfect-emotion.png";

// Payment Result
const PaymentResult: FC<PaymentProps> = ({
  score01Value,
  score02Value,
  score03Value,
  score04Value,
  score05Value,
  commentValue,
  setScore01Value,
  setScore02Value,
  setScore03Value,
  setScore04Value,
  setScore05Value,
  setCommentValue,
  handleClickExperienceButtons,
}) => {
  return (
    <div className="public__main-result">
      <div className="public__main-result-inform">
        <img src={ImageSourcePath + billCheckedIcon} alt="bill-checked-icon" />
        <div className="message-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Thanh toán hoá đơn thành công !</span>
        </div>
      </div>
      <div className="public__main-result-rate">
        <div className="public__main-result-group-warper">
          <div className="public__main-result-group">
            <h3 className="sub-title">Trải nghiệm</h3>
            <div className="emotions">
              <button
                className="emotion"
                onClick={(e) => handleClickExperienceButtons!(e)}
              >
                <img
                  src={ImageSourcePath + terribleEmotion}
                  alt="terrible-emotion"
                />
                <p>Dở tệ</p>
              </button>
              <button
                className="emotion"
                onClick={(e) => handleClickExperienceButtons!(e)}
              >
                <img src={ImageSourcePath + poorEmotion} alt="poor-emotion" />
                <p>Không hài lòng</p>
              </button>
              <button
                className="emotion"
                onClick={(e) => handleClickExperienceButtons!(e)}
              >
                <img src={ImageSourcePath + okayEmotion} alt="okay-emotion" />
                <p>Bình thường</p>
              </button>
              <button
                className="emotion"
                onClick={(e) => handleClickExperienceButtons!(e)}
              >
                <img src={ImageSourcePath + goodEmotion} alt="good-emotion" />
                <p>Hài lòng</p>
              </button>
              <button
                className="emotion"
                onClick={(e) => handleClickExperienceButtons!(e)}
              >
                <img
                  src={ImageSourcePath + perfectEmotion}
                  alt="perfect-emotion"
                />
                <p>Tuyệt vời</p>
              </button>
            </div>
          </div>
          <div className="public__main-result-group stars">
            <h3 className="sub-title">Chất lượng món ăn</h3>
            <Rate
              value={score01Value}
              onChange={(val) => setScore01Value!(val)}
            />
          </div>
          <div className="public__main-result-group stars">
            <h3 className="sub-title">Tốc độ phục vụ</h3>
            <Rate
              value={score02Value}
              onChange={(val) => setScore02Value!(val)}
            />
          </div>
          <div className="public__main-result-group stars">
            <h3 className="sub-title">Thái độ nhân viên</h3>
            <Rate
              value={score03Value}
              onChange={(val) => setScore03Value!(val)}
            />
          </div>
          <div className="public__main-result-group stars">
            <h3 className="sub-title">Dịch vụ mang lại</h3>
            <Rate
              value={score04Value}
              onChange={(val) => setScore04Value!(val)}
            />
          </div>
          <div className="public__main-result-group stars">
            <h3 className="sub-title">Không gian và vệ sinh</h3>
            <Rate
              value={score05Value}
              onChange={(val) => setScore05Value!(val)}
            />
          </div>
          <div className="public__main-result-group">
            <h3 className="sub-title">Góp ý</h3>
            <textarea
              placeholder="Khách hàng hãy góp ý để giúp nhà hàng khắc phục và hoàn thiện hơn"
              value={commentValue}
              onChange={(e) => setCommentValue!(e.currentTarget.value)}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
