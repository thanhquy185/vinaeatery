import { useMemo, type FC } from "react";
import { Col, Divider, List, Row, Tag } from "antd";
import { DollarOutlined, FileTextOutlined } from "@ant-design/icons";
import { SalaryAdvanceStatus } from "../../../../common/values";
import CustomCardStatic from "../../common/card-static";
import { type ManagerHandlePayslipProps } from "./manager-handle-payslip";
import { vietnamMoneyFormat } from "../../../../utils/other-events";

// Salary Advance Card
const SalaryAdvanceCard: FC<ManagerHandlePayslipProps> = ({ data }) => {
  const filteredSalaryAdvances = data?.filteredSalaryAdvances || [];

  const totalRowValue = useMemo(() => {
    return filteredSalaryAdvances.length;
  }, [filteredSalaryAdvances]);
  const totalResultValue = useMemo(() => {
    return filteredSalaryAdvances.reduce(
      (total, salaryAdvance) =>
        salaryAdvance.status === SalaryAdvanceStatus.confirm
          ? total - (salaryAdvance.money || 0)
          : 0,
      0,
    );
  }, [filteredSalaryAdvances]);

  return (
    <div className="salary-advance card">
      <p className="title">Ứng lương</p>
      <Divider />
      <Row gutter={10}>
        <Col span={12}>
          <CustomCardStatic
            title={"Tổng phiếu"}
            value={totalRowValue}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: "#1677ff" }}
            className="payslip-statistic"
          />
        </Col>
        <Col span={12}>
          <CustomCardStatic
            title={"Tổng tiền"}
            value={totalResultValue}
            prefix={<DollarOutlined />}
            valueStyle={{ color: "#faad14" }}
            separator="."
            className="payslip-statistic"
          />
        </Col>
      </Row>
      <List
        pagination={
          filteredSalaryAdvances.length > 5 ? { pageSize: 5 } : undefined
        }
        dataSource={filteredSalaryAdvances || []}
        renderItem={(salaryAdvance) => {
          return (
            <List.Item className="payslip-item">
              <List.Item.Meta
                title={
                  <div className="title">
                    <span>{salaryAdvance?.reason}</span>
                    <Tag
                      color={
                        salaryAdvance?.status === SalaryAdvanceStatus.confirm
                          ? "green"
                          : salaryAdvance?.status ===
                              SalaryAdvanceStatus.canceled
                            ? "red"
                            : "default"
                      }
                    >
                      {salaryAdvance?.status}
                    </Tag>
                  </div>
                }
                description={
                  <p className="description">
                    <span>{salaryAdvance?.date}</span>
                  </p>
                }
              />
              <span className="money red">
                -{vietnamMoneyFormat(salaryAdvance?.money!)}
              </span>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default SalaryAdvanceCard;
