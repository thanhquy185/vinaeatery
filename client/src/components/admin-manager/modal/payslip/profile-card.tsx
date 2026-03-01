import type { FC } from "react";
import {
  Calculator,
  CalendarArrowDown,
  CalendarArrowUp,
  CalendarDays,
  CircleDollarSign,
  IdCard,
  Mail,
  Phone,
  Pointer,
  Settings,
  Star,
  User,
  VenusAndMars,
} from "lucide-react";
import { Divider, Image } from "antd";
import type { EmployeeType } from "../../../../common/types";
import { ImageSourcePath } from "../../../../common/values";
import { vietnamMoneyFormat } from "../../../../utils/other-events";
import type { ManagerHandlePayslipProps } from "./manager-handle-payslip";

// Profile Card
const ProfileCard: FC<ManagerHandlePayslipProps> = ({ data }) => {
  const employee = data.employee as EmployeeType;
  const totalSalary = data.totalSalary as number;
  const totalReward = data.totalReward as number;
  const totalPunish = data.totalPunish as number;
  const summary = data.summary as number;
  const settlement = data.settlement as number;

  return (
    <div className="profile card">
      <Image
        src={
          employee?.image
            ? (employee?.image as string)
            : ImageSourcePath + "no-image.png"
        }
        alt="avatar"
      />
      <div>
        <Divider />
        <p className="title">Thông tin cá nhân</p>
        <p>
          <User />
          <span className="has-icon">Họ tên:</span>
          <b>{employee?.fullname}</b>
        </p>
        <p>
          <CalendarDays />
          <span className="has-icon">Ngày sinh:</span>
          <b>{employee?.birthday ? employee?.birthday : "Chưa cung cấp"}</b>
        </p>
        <p>
          <VenusAndMars />
          <span className="has-icon">Giới tính:</span>
          <b>{employee?.gender ? employee?.gender : "Chưa cung cấp"}</b>
        </p>
        <p>
          <Phone />
          <span className="has-icon">Điện thoại:</span>
          <b>{employee?.phone}</b>
        </p>
        <p>
          <Mail />
          <span className="has-icon">Email:</span>
          <b>{employee?.email}</b>
        </p>
      </div>
      <div>
        <Divider />
        <p className="title">Thông tin làm việc</p>
        <p>
          <IdCard />
          <span className="has-icon">Mã nhân viên:</span>
          <b>{employee?.id}</b>
        </p>
        <p>
          <Settings />
          <span className="has-icon">Chức vụ:</span>
          <b>{employee?.currentRole?.name}</b>
        </p>
        <p>
          <Pointer />
          <span className="has-icon">Quyền hạn:</span>
          <b>{employee?.permission?.name}</b>
        </p>
        <p>
          <Star />
          <span className="has-icon">Trạng thái:</span>
          <b>{employee?.status}</b>
        </p>
      </div>
      <div>
        <Divider />
        <p className="title">Tổng quan lương</p>
        <p>
          <CircleDollarSign />
          <span className="has-icon">Tổng lương nhận:</span>
          <b>{vietnamMoneyFormat(summary)}</b>
        </p>
        <p className="sub">
          <span className="has-icon">- Tiền lương:</span>
          <b>{vietnamMoneyFormat(totalSalary)}</b>
        </p>
        <p className="sub">
          <span className="has-icon">- Tiền thưởng:</span>
          <b>{vietnamMoneyFormat(totalReward)}</b>
        </p>
        <p className="sub">
          <span className="has-icon">- Tiền phạt:</span>
          <b>{vietnamMoneyFormat(totalPunish)}</b>
        </p>
        <p>
          <Calculator />
          <span className="has-icon">Tổng quyết toán:</span>
          <b>{vietnamMoneyFormat(settlement)}</b>
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
