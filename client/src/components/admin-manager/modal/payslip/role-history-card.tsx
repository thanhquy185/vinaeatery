import { type FC } from "react";
import { Divider, List, Tag } from "antd";
import type { RoleHistoryType } from "../../../../common/types";
import { RoleSalaryType } from "../../../../common/values";
import { type ManagerHandlePayslipProps } from "./manager-handle-payslip";
import { vietnamMoneyFormat } from "../../../../utils/other-events";

// Role History Card
const RoleHistoryCard: FC<ManagerHandlePayslipProps> = ({ data }) => {
  const filteredRoleHistories = data?.filteredRoleHistories || [];

  return (
    <div className="role-history card">
      <p className="title">Lịch sử chức vụ</p>
      <Divider />
      <List
        itemLayout="vertical"
        pagination={
          filteredRoleHistories.length > 5 ? { pageSize: 5 } : undefined
        }
        dataSource={filteredRoleHistories || []}
        renderItem={(role: RoleHistoryType) => (
          <List.Item>
            <div className="role-history-item">
              <div className="role-history-item__header">
                <p className="left">
                  <span className="position">{role?.roleName}</span>
                  <Tag color={role?.dateEnd ? "default" : "blue"}>
                    {role?.dateEnd ? "Đã kết thúc" : "Đang áp dụng"}
                  </Tag>
                </p>
                <p className="time">
                  {role?.dateStart} → {role?.dateEnd ?? "nay"}
                </p>
              </div>
              <div className="role-history-item__main">
                <span className="formula">
                  {role?.roleSalaryType === RoleSalaryType.fixed
                    ? "Lương cố định"
                    : "Lương theo giờ"}
                  :
                </span>
                <span className="amount">
                  {vietnamMoneyFormat(role?.roleSalaryValue!)}
                </span>
                <span className="unit">
                  /{" "}
                  {role?.roleSalaryType === RoleSalaryType.fixed
                    ? "tháng"
                    : "giờ"}
                </span>
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default RoleHistoryCard;
