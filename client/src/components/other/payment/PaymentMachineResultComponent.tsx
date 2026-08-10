import useEntityQuery from "../../../hooks/useEntityQuery2";
import TextArea from "antd/es/input/TextArea";
import FeedbackExperienceApiService from "../../../services/api/v1/FeedbackExperienceApiService";
import FeedbackScoreApiService from "../../../services/api/v1/FeedbackScoreApiService";
import { Rate } from "antd";
import {
  ImageSourcePath,
  PaymentMachineIconValue,
  PaymentMachineIdValue,
} from "../../../constants/values";
import type { PaymentMachinePageProps } from "../../../constants/props";
import type { FeedbackExperienceCrudResponseType } from "../../../types/FeedbackExperienceType";
import type { FeedbackScoreCrudResponseType } from "../../../types/FeedbackScoreType";

const PaymentMachineResultComponent: React.FC<PaymentMachinePageProps> = ({
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
  // Các biến giữ dữ liệu
  // - Trải nghiệm
  const { data: feedbackExperiences } = useEntityQuery<
    FeedbackExperienceCrudResponseType[]
  >({
    keys: ["feedback-experiences-crud"],
    params: {},
    api: FeedbackExperienceApiService.handleGetCrud,
  });
  // - Điểm
  const { data: feedbackScores } = useEntityQuery<
    FeedbackScoreCrudResponseType[]
  >({
    keys: ["feedback-scores-crud"],
    params: {},
    api: FeedbackScoreApiService.handleGetCrud,
  });

  return (
    <div className="payment-machine__main-result">
      <div className="payment-machine__main-result-inform">
        <img
          src={ImageSourcePath + PaymentMachineIconValue.billChecked}
          alt={PaymentMachineIconValue.billChecked}
        />
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
      <div className="payment-machine__main-result-rate">
        <div className="payment-machine__main-result-group-warper">
          <div className="payment-machine__main-result-group">
            <h3 className="sub-title">Trải nghiệm</h3>
            <div className="emotions">
              {feedbackExperiences?.map((feedbackExperience) => (
                <button
                  key={feedbackExperience.id}
                  className="emotion"
                  onClick={(e) => handleClickExperienceButtons!(e)}
                >
                  <img
                    src={ImageSourcePath + feedbackExperience.image}
                    alt={feedbackExperience.image}
                  />
                  <p>{feedbackExperience.name}</p>
                </button>
              ))}
            </div>
          </div>
          {feedbackScores?.map((feedbackScore) => (
            <div className="payment-machine__main-result-group stars">
              <h3 className="sub-title">{feedbackScore.name}</h3>
              <Rate
                value={
                  feedbackScore.id === PaymentMachineIdValue.foodScore
                    ? score01Value
                    : feedbackScore.id === PaymentMachineIdValue.speedScore
                      ? score02Value
                      : feedbackScore.id === PaymentMachineIdValue.employeeScore
                        ? score03Value
                        : feedbackScore.id ===
                            PaymentMachineIdValue.serviceScore
                          ? score04Value
                          : score05Value
                }
                onChange={(val) => {
                  const id = feedbackScore.id;

                  if (id === PaymentMachineIdValue.foodScore) {
                    setScore01Value!(val);
                  } else if (id === PaymentMachineIdValue.speedScore) {
                    setScore02Value!(val);
                  } else if (id === PaymentMachineIdValue.employeeScore) {
                    setScore03Value!(val);
                  } else if (id === PaymentMachineIdValue.serviceScore) {
                    setScore04Value!(val);
                  } else if (id === PaymentMachineIdValue.placeScore) {
                    setScore05Value!(val);
                  }
                }}
              />
            </div>
          ))}
          <div className="payment-machine__main-result-group">
            <h3 className="sub-title">Góp ý</h3>
            <TextArea
              placeholder="Khách hàng hãy góp ý để giúp nhà hàng khắc phục và hoàn thiện hơn"
              value={commentValue}
              onChange={(e) => setCommentValue!(e.currentTarget.value)}
            ></TextArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMachineResultComponent;
