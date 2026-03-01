import { useMemo, type FC } from "react";
import { Divider } from "antd";
import type { PayslipDate, RewardPunishType } from "../../../../common/types";
import {
  CategoryRewardPunishHandle,
  RewardPunishStatus,
} from "../../../../common/values";
import { type ManagerHandlePayslipProps } from "./manager-handle-payslip";
import { vietnamMoneyFormat } from "../../../../utils/other-events";

// Summary Card
const SummaryCard: FC<ManagerHandlePayslipProps> = ({ data }) => {
  const filteredSalaryDatas =
    (data?.filteredSalaryDatas as PayslipDate[]) || [];
  const filteredRewardPunishes =
    (data?.filteredRewardPunishes as RewardPunishType[]) || [];

  const totalSalaryValue = useMemo(() => {
    return filteredSalaryDatas.reduce(
      (total, salaryData) => total + salaryData.attendanceSalary,
      0,
    );
  }, [filteredSalaryDatas]);
  const totalRewardValue = useMemo(() => {
    let total = 0;
    filteredRewardPunishes.forEach((rewardPunish) => {
      if (
        rewardPunish?.categoryRewardPunish?.handle ===
          CategoryRewardPunishHandle.reward &&
        rewardPunish?.status === RewardPunishStatus.confirm
      )
        total += rewardPunish?.money!;
    });

    return total;
  }, [filteredRewardPunishes]);
  const totalPunishValue = useMemo(() => {
    let total = 0;
    filteredRewardPunishes.forEach((rewardPunish) => {
      if (
        rewardPunish?.categoryRewardPunish?.handle ===
          CategoryRewardPunishHandle.punish &&
        rewardPunish?.status === RewardPunishStatus.confirm
      )
        total += rewardPunish?.money!;
    });

    return total;
  }, [filteredRewardPunishes]);

  return (
    <div className="summary card">
      <p className="title">Tổng kết</p>
      <Divider />
      <div>
        <p>
          <span>Tiền lương:</span>
          <b>{vietnamMoneyFormat(totalSalaryValue)}</b>
        </p>
      </div>
      <div>
        <p className="green">
          <span>Tiền thưởng (+):</span>
          <b>{vietnamMoneyFormat(totalRewardValue)}</b>
        </p>
      </div>
      <div>
        <p className="red">
          <span>Tiền phạt (-):</span>
          <b>{vietnamMoneyFormat(totalPunishValue)}</b>
        </p>
      </div>
      <Divider className="primary" />
      <p className="total">
        <span>TỔNG NHẬN:</span>
        <b>
          {vietnamMoneyFormat(
            totalSalaryValue + totalRewardValue - totalPunishValue,
          )}
        </b>
      </p>
    </div>
  );
};

export default SummaryCard;
