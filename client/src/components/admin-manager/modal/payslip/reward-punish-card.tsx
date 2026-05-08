import { useMemo, type FC } from "react";
import { Col, Divider, List, Row, Tag } from "antd";
import {
  DollarOutlined,
  FileTextOutlined,
  FrownOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import {
  CategoryRewardPunishHandle,
  RewardPunishStatus,
} from "../../../../common/values";
import CustomCardStatic from "../../common/card-static";
import { type ManagerHandlePayslipProps } from "./manager-handle-payslip";
import { vietnamMoneyFormat } from "../../../../utils/other-events";

// Reward Punish Card
const RewardPunishCard: FC<ManagerHandlePayslipProps> = ({ data }) => {
  const filteredRewardPunishes = data?.filteredRewardPunishes || [];

  const totalRowValue = useMemo(() => {
    return filteredRewardPunishes.length;
  }, [filteredRewardPunishes]);
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
  const totalResultValue = useMemo(() => {
    return totalRewardValue + totalPunishValue;
  }, [filteredRewardPunishes, totalRewardValue, totalPunishValue]);

  return (
    <div className="reward-punish card">
      <p className="title">Thưởng – Phạt</p>
      <Divider />
      <Row gutter={10}>
        <Col span={6}>
          <CustomCardStatic
            title={"Tổng phiếu"}
            value={totalRowValue}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: "#1677ff" }}
            className="payslip-statistic"
          />
        </Col>
        <Col span={6}>
          <CustomCardStatic
            title={"Tổng nhận"}
            value={totalResultValue}
            prefix={<DollarOutlined />}
            valueStyle={{ color: "#faad14" }}
            separator="."
            className="payslip-statistic"
          />
        </Col>
        <Col span={6}>
          <CustomCardStatic
            title={"Tổng thưởng"}
            value={totalRewardValue}
            prefix={<SmileOutlined />}
            valueStyle={{ color: "#1aa251" }}
            separator="."
            className="payslip-statistic"
          />
        </Col>
        <Col span={6}>
          <CustomCardStatic
            title={"Tổng phạt"}
            value={totalPunishValue}
            prefix={<FrownOutlined />}
            valueStyle={{ color: "#d9363e" }}
            separator="."
            className="payslip-statistic"
          />
        </Col>
      </Row>
      <List
        pagination={
          filteredRewardPunishes.length > 5 ? { pageSize: 5 } : undefined
        }
        dataSource={filteredRewardPunishes || []}
        renderItem={(rewardPunish) => {
          return (
            <List.Item className="payslip-item">
              <List.Item.Meta
                title={
                  <div className="title">
                    <span>{rewardPunish?.categoryRewardPunish?.name}</span>
                    <Tag
                      color={
                        rewardPunish?.status === RewardPunishStatus.confirm
                          ? "green"
                          : rewardPunish?.status === RewardPunishStatus.canceled
                            ? "red"
                            : "default"
                      }
                    >
                      {rewardPunish?.status}
                    </Tag>
                  </div>
                }
                description={
                  <p className="description">
                    <span>{rewardPunish?.date}</span>
                    <span className="dot"></span>
                    <span>
                      {rewardPunish?.reason
                        ? rewardPunish?.reason
                        : "không lí do"}
                    </span>
                  </p>
                }
              />
              <span
                className={
                  "money " +
                  (rewardPunish?.categoryRewardPunish?.handle ===
                  CategoryRewardPunishHandle.reward
                    ? "green"
                    : "red")
                }
              >
                {rewardPunish?.categoryRewardPunish?.handle ===
                CategoryRewardPunishHandle.reward
                  ? "+"
                  : "-"}
                {vietnamMoneyFormat(rewardPunish?.money!)}
              </span>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default RewardPunishCard;
