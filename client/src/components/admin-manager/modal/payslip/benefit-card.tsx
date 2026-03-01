import type { FC } from "react";
import { Divider, List } from "antd";
import type { BenefitPlanType } from "../../../../common/types";
import { ImageSourcePath } from "../../../../common/values";
import type { ManagerHandlePayslipProps } from "./manager-handle-payslip";
import { vietnamMoneyFormat } from "../../../../utils/other-events";

// Benefit Card
const BenefitCard: FC<ManagerHandlePayslipProps> = ({}) => {
  // Dữ liệu mẫu về Kế hoạc phúc lợi
  const benefitPlans: BenefitPlanType[] = [
    {
      id: 1,
      name: "Phúc lợi cơ bản",
      dateStart: "2026-02-01",
      dateEnd: "2026-02-28",
      note: "Áp dụng cho toàn bộ nhân viên chính thức",
      benefitPlanBenefits: [
        {
          benefit: {
            name: "Ăn ca",
            icon: undefined,
          },
          value: 30000,
        },
        {
          benefit: {
            name: "Gửi xe",
            icon: undefined,
          },
        },
      ],
    },
    {
      id: 2,
      name: "Phúc lợi cơ bản",
      dateStart: "2026-02-01",
      dateEnd: "2026-02-28",
      note: "Áp dụng cho toàn bộ nhân viên chính thức",
      benefitPlanBenefits: [
        {
          benefit: {
            name: "Ăn ca",
            icon: undefined,
          },
          value: 30000,
        },
        {
          benefit: {
            name: "Gửi xe",
            icon: undefined,
          },
        },
      ],
    },
  ];

  return (
    <div className="benefit card">
      <p className="title">Phúc lợi</p>
      <Divider />
      <List
        dataSource={benefitPlans}
        pagination={benefitPlans.length > 5 ? { pageSize: 5 } : undefined}
        renderItem={(benefitPlan) => {
          //   const isReward =
          //     rewardPunish?.categoryRewardPunish?.handle ===
          //     CategoryRewardPunishHandle.reward;

          return (
            <List.Item className="payslip-item">
              <List.Item.Meta
                title={
                  <div className="title">
                    <div className="left">
                      <h3>{benefitPlan?.name}</h3>
                      {benefitPlan?.note && <p>{benefitPlan?.note}</p>}
                    </div>
                    <span>
                      {benefitPlan?.dateStart} → {benefitPlan?.dateEnd}
                    </span>
                  </div>
                }
                description={
                  <div className="grid">
                    {benefitPlan.benefitPlanBenefits?.map(
                      (benefitPlanBenefit, index) => (
                        <div className="item" key={index}>
                          <img
                            src={
                              benefitPlanBenefit?.benefit?.icon
                                ? benefitPlanBenefit?.benefit?.icon
                                : ImageSourcePath + "no-image.png"
                            }
                            alt={benefitPlanBenefit?.benefit?.name}
                          />
                          <h3>{benefitPlanBenefit?.benefit?.name}</h3>
                          <p
                            className={
                              benefitPlanBenefit?.value
                                ? benefitPlanBenefit.value > 0
                                  ? "green"
                                  : "red"
                                : "blue"
                            }
                          >
                            {benefitPlanBenefit?.value &&
                            benefitPlanBenefit?.value !== 0
                              ? vietnamMoneyFormat(benefitPlanBenefit.value)
                              : "Miễn phí"}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default BenefitCard;
