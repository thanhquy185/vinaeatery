import type { FC } from "react";
import { Divider, List } from "antd";
import type { ManagerHandlePayslipProps } from "./manager-handle-payslip";
import { vietnamMoneyFormat } from "../../../../utils/other-events";

// Insurance Card
const InsuranceCard: FC<ManagerHandlePayslipProps> = ({ data }) => {
  const filteredInsurances = data?.filteredInsurances || [];

  return (
    <div className="insurance card">
      <p className="title">Bảo hiểm</p>
      <Divider />
      <List
        dataSource={filteredInsurances}
        pagination={filteredInsurances.length > 5 ? { pageSize: 5 } : undefined}
        renderItem={(insurance) => {
          return (
            <List.Item className="payslip-item">
              <List.Item.Meta
                title={
                  <div className="title">
                    <div className="left">
                      <h3>{insurance?.name}</h3>
                      {insurance?.note && <p>{insurance?.note}</p>}
                    </div>
                    <span>{insurance?.month}</span>
                  </div>
                }
                description={
                  <div className="grid">
                    {insurance.insuranceDetails?.map(
                      (insuranceDetail, index) => {
                        const insuranceCost =
                          ((insurance.insuranceSalary || 0) *
                            1.0 *
                            (insuranceDetail.categoryInsurance
                              ?.employeePercent || 0)) /
                          100;

                        return (
                          <div className="item" key={index}>
                            <h3>{insuranceDetail?.categoryInsurance?.name}</h3>
                            <p
                              className={
                                insuranceCost && insuranceCost > 0
                                  ? "red"
                                  : "blue"
                              }
                            >
                              {insuranceCost && insuranceCost !== 0
                                ? "-" + vietnamMoneyFormat(insuranceCost)
                                : "Miễn phí"}
                            </p>
                          </div>
                        );
                      },
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

export default InsuranceCard;
