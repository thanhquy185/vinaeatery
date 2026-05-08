import { useMemo, type FC } from "react";
import { Col, Divider, List, Row, Tag } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { PermissionTicketStatus } from "../../../../common/values";
import CustomCardStatic from "../../common/card-static";
import { type ManagerHandlePayslipProps } from "./manager-handle-payslip";

// Permission Ticket Card
const PermissionTicketCard: FC<ManagerHandlePayslipProps> = ({ data }) => {
  const filteredPermissionTickets = data?.filteredPermissionTickets || [];

  const totalTicketValue = useMemo(() => {
    return filteredPermissionTickets.length;
  }, [filteredPermissionTickets]);
  const totalConfirmValue = useMemo(() => {
    let total = 0;
    filteredPermissionTickets.forEach((permissionTicket) => {
      if (permissionTicket?.status === PermissionTicketStatus.confirm)
        total += 1;
    });

    return total;
  }, [filteredPermissionTickets]);
  const totalCanceledValue = useMemo(() => {
    let total = 0;
    filteredPermissionTickets.forEach((permissionTicket) => {
      if (permissionTicket?.status === PermissionTicketStatus.canceled)
        total += 1;
    });

    return total;
  }, [filteredPermissionTickets]);
  const totalPendingValue = useMemo(() => {
    let total = 0;
    filteredPermissionTickets.forEach((permissionTicket) => {
      if (permissionTicket?.status === PermissionTicketStatus.pending)
        total += 1;
    });

    return total;
  }, [filteredPermissionTickets]);

  return (
    <div className="permission-ticket card">
      <p className="title">Đơn xin phép</p>
      <Divider />
      <Row gutter={10}>
        <Col span={6}>
          <CustomCardStatic
            title={"Tổng đơn"}
            value={totalTicketValue}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: "#1677ff" }}
            className="payslip-statistic"
          />
        </Col>
        <Col span={6}>
          <CustomCardStatic
            title={PermissionTicketStatus.confirm}
            value={totalConfirmValue}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: "#1aa251" }}
            separator="."
            className="payslip-statistic"
          />
        </Col>
        <Col span={6}>
          <CustomCardStatic
            title={PermissionTicketStatus.canceled}
            value={totalCanceledValue}
            prefix={<CloseCircleOutlined />}
            valueStyle={{ color: "#d9363e" }}
            separator="."
            className="payslip-statistic"
          />
        </Col>
        <Col span={6}>
          <CustomCardStatic
            title={PermissionTicketStatus.pending}
            value={totalPendingValue}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: "#777" }}
            separator="."
            className="payslip-statistic"
          />
        </Col>
      </Row>
      <List
        pagination={
          filteredPermissionTickets.length > 5 ? { pageSize: 5 } : undefined
        }
        dataSource={filteredPermissionTickets}
        renderItem={(permissionTicket) => {
          return (
            <List.Item className="payslip-item">
              <List.Item.Meta
                title={
                  <div className="title">
                    <span>
                      {permissionTicket?.categoryPermissionTicket?.name}
                    </span>
                  </div>
                }
                description={
                  <p className="description">
                    <span>{permissionTicket?.date}</span>
                    <span className="dot"></span>
                    <span>{permissionTicket?.reason}</span>
                  </p>
                }
              />
              <Tag
                color={
                  permissionTicket?.status === PermissionTicketStatus.confirm
                    ? "green"
                    : permissionTicket?.status ===
                        PermissionTicketStatus.canceled
                      ? "red"
                      : "default"
                }
              >
                {permissionTicket?.status}
              </Tag>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default PermissionTicketCard;
