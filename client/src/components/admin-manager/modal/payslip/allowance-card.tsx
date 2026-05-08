import type { FC } from "react";
import { Divider, List } from "antd";
import type { ManagerHandlePayslipProps } from "./manager-handle-payslip";
import { vietnamMoneyFormat } from "../../../../utils/other-events";

// Allowance Card
const AllowanceCard: FC<ManagerHandlePayslipProps> = ({ data }) => {
  const filteredAllowances = data?.filteredAllowances || [];

  return (
    <div className="allowance card">
      <p className="title">Phụ cấp</p>
      <Divider />
      <List
        dataSource={filteredAllowances}
        pagination={filteredAllowances.length > 5 ? { pageSize: 5 } : undefined}
        renderItem={(allowance) => {
          return (
            <List.Item className="payslip-item">
              <List.Item.Meta
                title={
                  <div className="title">
                    <div className="left">
                      <h3>{allowance?.name}</h3>
                      {allowance?.note && <p>{allowance?.note}</p>}
                    </div>
                    <span>{allowance?.month}</span>
                  </div>
                }
                description={
                  <div className="grid">
                    {allowance.allowanceDetails?.map(
                      (allowanceDetail, index) => (
                        <div className="item" key={index}>
                          <h3>{allowanceDetail?.categoryAllowance?.name}</h3>
                          <p
                            className={
                              allowanceDetail?.categoryAllowance?.money &&
                              allowanceDetail?.categoryAllowance?.money > 0
                                ? "green"
                                : "blue"
                            }
                          >
                            {allowanceDetail?.categoryAllowance?.money &&
                            allowanceDetail?.categoryAllowance?.money !== 0
                              ? "+" +
                                vietnamMoneyFormat(
                                  allowanceDetail.categoryAllowance?.money,
                                )
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

export default AllowanceCard;
