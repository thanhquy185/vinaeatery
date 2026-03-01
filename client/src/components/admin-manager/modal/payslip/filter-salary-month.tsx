import type { FC } from "react";
import { Card, Divider, Table } from "antd";

// Filter Salary Month
const FilterSalaryMonth: FC = ({}) => {
  const incomeData = [
    { key: "1", label: "Lương cơ bản", amount: 8000000 },
    { key: "2", label: "Lương làm thêm", amount: 900000 },
    { key: "3", label: "Phụ cấp ăn ca", amount: 400000 },
    { key: "4", label: "Thưởng chuyên cần", amount: 200000 },
  ];

  const deductionData = [
    { key: "1", label: "Đi trễ 3 lần", amount: 150000 },
    { key: "2", label: "Nghỉ không phép", amount: 200000 },
  ];

  const formatMoney = (v: number) => v.toLocaleString("vi-VN") + " đ";

  const totalIncome = incomeData.reduce((s, i) => s + i.amount, 0);
  const totalDeduction = deductionData.reduce((s, i) => s + i.amount, 0);
  const netSalary = totalIncome - totalDeduction;

  return (
    <div className="salary-slip">
      {/* Header */}
      <div className="salary-slip__header">
        <div className="title">PHIẾU LƯƠNG THÁNG 01/2026</div>
        <div className="company">CÔNG TY ABC</div>
      </div>

      <Divider />

      {/* Employee Info */}
      <div className="salary-slip__info">
        <div>
          <span>Nhân viên:</span> Nguyễn Văn A
        </div>
        <div>
          <span>Mã NV:</span> NV001
        </div>
        <div>
          <span>Chức vụ:</span> Thu ngân
        </div>
        <div>
          <span>Bộ phận:</span> Quầy thu ngân
        </div>
      </div>

      <Divider />

      {/* Income */}
      <div className="salary-slip__section">
        <div className="section-title">THU NHẬP</div>
        <Table
          dataSource={incomeData}
          pagination={false}
          size="small"
          columns={[
            {
              title: "Khoản thu",
              dataIndex: "label",
            },
            {
              title: "Số tiền",
              dataIndex: "amount",
              align: "right",
              render: formatMoney,
            },
          ]}
        />
        <div className="section-total positive">
          Tổng thu nhập: {formatMoney(totalIncome)}
        </div>
      </div>

      {/* Deduction */}
      <div className="salary-slip__section">
        <div className="section-title">KHẤU TRỪ</div>
        <Table
          dataSource={deductionData}
          pagination={false}
          size="small"
          columns={[
            {
              title: "Khoản trừ",
              dataIndex: "label",
            },
            {
              title: "Số tiền",
              dataIndex: "amount",
              align: "right",
              render: formatMoney,
            },
          ]}
        />
        <div className="section-total negative">
          Tổng khấu trừ: {formatMoney(totalDeduction)}
        </div>
      </div>

      <Divider />

      {/* Summary */}
      <div className="salary-slip__summary">
        <div className="net-salary">THỰC LĨNH: {formatMoney(netSalary)}</div>
      </div>

      {/* Footer */}
      <div className="salary-slip__footer">Ngày lập phiếu: 31/01/2026</div>
    </div>
  );
};

export default FilterSalaryMonth;
