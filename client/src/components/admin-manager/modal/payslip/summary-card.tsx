import { useMemo, type FC } from "react";
import { Divider } from "antd";
import {
  CategoryRewardPunishHandle,
  CommonStatus,
  RewardPunishStatus,
  SalaryAdvanceStatus,
} from "../../../../common/values";
import { type ManagerHandlePayslipProps } from "./manager-handle-payslip";
import { vietnamMoneyFormat } from "../../../../utils/other-events";

// Summary Card
const SummaryCard: FC<ManagerHandlePayslipProps> = ({ data }) => {
  const filteredSalaryDatas = data?.filteredSalaryDatas || [];
  const filteredAllowances = data?.filteredAllowances || [];
  const filteredInsurances = data?.filteredInsurances || [];
  const filteredRewardPunishes = data?.filteredRewardPunishes || [];
  const filteredSalaryAdvances = data?.filteredSalaryAdvances || [];

  const totalSalaryValue = useMemo(() => {
    return (
      filteredSalaryDatas.reduce(
        (total, salaryData) => total + salaryData.attendanceSalary,
        0,
      ) || 0
    );
  }, [filteredSalaryDatas]);
  const totalAllowanceValue = useMemo(() => {
    let total = 0;
    filteredAllowances?.forEach((allowance) => {
      if (allowance?.status === CommonStatus.active)
        allowance.allowanceDetails?.forEach((allowanceDetail) => {
          total += allowanceDetail.categoryAllowance?.money || 0;
        });
    });

    return total;
  }, [filteredAllowances]);
  const totalInsuranceValue = useMemo(() => {
    let total = 0;
    filteredInsurances.forEach((insurance) => {
      if (insurance?.status === CommonStatus.active)
        insurance.insuranceDetails?.forEach((insuranceDetail) => {
          total -=
            ((insurance.insuranceSalary || 0) *
              (insuranceDetail.categoryInsurance?.employeePercent || 0)) /
              100 || 0;
        });
    });

    return total;
  }, [filteredInsurances]);
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
        total -= rewardPunish?.money!;
    });

    return total;
  }, [filteredRewardPunishes]);
  const totalSalaryAdvanceValue = useMemo(() => {
    let total = 0;
    filteredSalaryAdvances.forEach((salaryAdvance) => {
      if (salaryAdvance?.status === SalaryAdvanceStatus.confirm)
        total -= salaryAdvance?.money!;
    });

    return total;
  }, [filteredSalaryAdvances]);

  return (
    <div className="summary card">
      <p className="title">Tổng kết</p>
      <Divider />
      <p>
        <span>Tiền lương làm:</span>
        <b>{vietnamMoneyFormat(totalSalaryValue)}</b>
      </p>
      <p className="green">
        <span>Tiền phụ cấp (+):</span>
        <b>{vietnamMoneyFormat(totalAllowanceValue)}</b>
      </p>
      <p className="green">
        <span>Tiền thưởng (+):</span>
        <b>{vietnamMoneyFormat(totalRewardValue)}</b>
      </p>
      <p className="red">
        <span>Tiền bảo hiểm (-):</span>
        <b>{vietnamMoneyFormat(totalInsuranceValue)}</b>
      </p>
      <p className="red">
        <span>Tiền phạt (-):</span>
        <b>{vietnamMoneyFormat(totalPunishValue)}</b>
      </p>
      <p className="red">
        <span>Tiền ứng lương (-):</span>
        <b>{vietnamMoneyFormat(totalSalaryAdvanceValue)}</b>
      </p>
      <Divider className="primary" />
      <p className="total">
        <span>TỔNG NHẬN:</span>
        <b>
          {vietnamMoneyFormat(
            totalSalaryValue +
              totalAllowanceValue +
              totalInsuranceValue +
              totalRewardValue +
              totalPunishValue +
              totalSalaryAdvanceValue,
          )}
        </b>
      </p>
    </div>
  );
};

export default SummaryCard;
