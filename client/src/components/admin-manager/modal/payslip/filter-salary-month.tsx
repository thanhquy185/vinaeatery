import { useMemo, type FC } from "react";
import { Download, Mail, MapPin, Phone } from "lucide-react";
import {
  CategoryRewardPunishHandle,
  CommonStatus,
  ImageSourcePath,
  RewardPunishStatus,
  SalaryAdvanceStatus,
} from "../../../../common/values";
import type { ManagerHandlePayslipProps } from "./manager-handle-payslip";
import CustomTableNoActions from "../../common/table-no-actions";
import { handlePrintTicket } from "../../../../utils/print-ticket";
import { vietnamMoneyFormat } from "../../../../utils/other-events";

// Filter Salary Month
const FilterSalaryMonth: FC<ManagerHandlePayslipProps> = ({ data }) => {
  // Ngày hiện tại
  const today = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString();
  const dateTime = today.replace("T", "__").slice(0, -5);
  const day = today.slice(8, 10);
  const month = today.slice(5, 7);
  const year = today.slice(0, 4);

  //
  const filteredSalaryDatas = data?.filteredSalaryDatas || [];
  const filteredAllowances = data?.filteredAllowances || [];
  const filteredInsurances = data?.filteredInsurances || [];
  const filteredRewardPunishes = data?.filteredRewardPunishes || [];
  const filteredSalaryAdvances = data?.filteredSalaryAdvances || [];

  //
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
          total +=
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
        total += rewardPunish?.money!;
    });

    return total;
  }, [filteredRewardPunishes]);
  const totalSalaryAdvanceValue = useMemo(() => {
    let total = 0;
    filteredSalaryAdvances.forEach((salaryAdvance) => {
      if (salaryAdvance?.status === SalaryAdvanceStatus.confirm)
        total += salaryAdvance?.money!;
    });

    return total;
  }, [filteredSalaryAdvances]);

  return (
    <>
      <div id="content-print" className="ticket__content">
        <header className="ticket__header">
          <div className="ticket__contact">
            <p className="name">Nhà hàng VINAEATERY</p>
            <p className="has-icon">
              <Phone />
              <span>123456789 - 0987654321</span>
            </p>
            <p className="has-icon">
              <Mail />
              <span>vinaeatery@gmail.com.vn</span>
            </p>
            <p className="has-icon">
              <MapPin />
              <span>273 An Đ. Vương, Phường 2, Quận 5, Hồ Chí Minh 700000</span>
            </p>
          </div>
          <img
            src={ImageSourcePath + "brand-image.png"}
            alt="Logo Web"
            className="ticket__logo"
          />
        </header>
        <div className="ticket__line"></div>
        <main className="ticket__body payslip">
          <h1 className="ticket__title">PHIẾU LƯƠNG THÁNG</h1>
          <p className="ticket__date">
            Thời gian lập phiếu:{" "}
            <span className="date-start">{dateTime.replace("__", " ")}</span>
          </p>
          <div className="ticket__row">
            <div className="ticket__infos">
              <p className="ticket__info">
                <b>Mã nhân viên:</b> #{data?.employee?.id}
              </p>
              <p className="ticket__info">
                <b>Họ và tên:</b> {data?.employee?.fullname}
              </p>
              <p className="ticket__info split-2">
                <span>
                  <b>Ngày sinh:</b>{" "}
                  {data?.employee?.birthday
                    ? data?.employee?.birthday
                    : "Chưa cung cấp"}
                </span>
                <span>
                  <b>Giới tính:</b>{" "}
                  {data?.employee?.gender
                    ? data?.employee?.gender
                    : "Chưa cung cấp"}
                </span>
              </p>
              <p className="ticket__info split-2">
                <span>
                  <b>Chức vụ:</b> {data?.employee?.currentRole?.name}
                </span>
                <span>
                  <b>Quyền hạn:</b> {data?.employee?.permission?.name}
                </span>
              </p>
              <p className="ticket__info split-2">
                <span>
                  <b>Số điện thoại:</b> {data?.employee?.phone}
                </span>
                <span>
                  <b>Email:</b> {data?.employee?.email}
                </span>
              </p>
              <p className="ticket__info">
                <b>Địa chỉ:</b> {data?.employee?.address}
              </p>
            </div>
            <div className="ticket__image">
              <img
                src={
                  data?.employee?.image
                    ? (data?.employee?.image as string)
                    : ImageSourcePath + "no-image.png"
                }
              />
            </div>
          </div>
          <p className="ticket__info">
            <b>Chi tiết phiếu lương:</b>
          </p>
          <div className="salary-overview">
            <div className="item income">
              <span>Lương ngày</span>
              <b>+{vietnamMoneyFormat(totalSalaryValue)}</b>
            </div>
            <div className="item income">
              <span>Phụ cấp</span>
              <b>+{vietnamMoneyFormat(totalAllowanceValue)}</b>
            </div>
            <div className="item income">
              <span>Thưởng</span>
              <b>+{vietnamMoneyFormat(totalRewardValue)}</b>
            </div>
            <div className="item deduction">
              <span>Bảo hiểm</span>
              <b>-{vietnamMoneyFormat(totalInsuranceValue)}</b>
            </div>
            <div className="item deduction">
              <span>Phạt</span>
              <b>-{vietnamMoneyFormat(totalPunishValue)}</b>
            </div>
            <div className="item deduction">
              <span>Ứng lương</span>
              <b>-{vietnamMoneyFormat(totalSalaryAdvanceValue)}</b>
            </div>
          </div>
          <CustomTableNoActions
            className="ticket__table payslip-attendance-salary"
            columnWidths={["30%", "20%", "20%", "30%"]}
            columnTitles={["Ngày", "Giờ làm", "Giờ ca", "Lương ngày"]}
            data={data?.salaryAttendanceData}
            attributes={[
              "date",
              "attendanceTime",
              "totalTime",
              "attendanceSalary",
            ]}
            format={["", "", "", "price"]}
          />
        </main>
        <footer className="ticket__footer payslip">
          <p className="ticket__customer">
            Ngày {day} tháng {month} năm {year}
            <b>Nhân viên</b>
            (Ký tên, ghi rõ họ tên)
          </p>
          <p className="ticket__customer">
            Ngày {day} tháng {month} năm {year}
            <b>Giám đốc</b>
            (Ký tên, ghi rõ họ tên)
          </p>
        </footer>
      </div>
      <button
        id="print-ticket-button"
        className="ticket__print-btn"
        onClick={() => {
          handlePrintTicket({
            contentPrint: "content-print",
            dateTime: dateTime,
            title: "PHLUONGTHANG",
            id: data?.employee?.id,
          });
        }}
      >
        <Download /> &nbsp;&nbsp;<span>Tải xuống phiếu</span>
      </button>
    </>
  );
};

export default FilterSalaryMonth;
