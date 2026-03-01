import type { FC } from "react";
import { Table } from "antd";

// Filter Salary Year
const FilterSalaryYear: FC = ({}) => {
  const data = [
    { key: "1", month: "01/2026", amount: 9150000 },
    { key: "2", month: "02/2026", amount: 8900000 },
    { key: "3", month: "03/2026", amount: 9300000 },
  ];

  const formatMoney = (v: number) => v.toLocaleString("vi-VN") + " đ";

  const total = data.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="salary-slip">
      <div className="salary-slip__header">
        <div className="title">TỔNG HỢP LƯƠNG NĂM 2026</div>
        <div className="company">Nguyễn Văn A - NV001</div>
      </div>
      <Table
        dataSource={data}
        pagination={false}
        size="small"
        style={{ marginTop: 16 }}
        columns={[
          {
            title: "Tháng",
            dataIndex: "month",
          },
          {
            title: "Thực lĩnh",
            dataIndex: "amount",
            align: "right",
            render: formatMoney,
          },
        ]}
        footer={() => (
          <div style={{ textAlign: "right", fontWeight: 700 }}>
            Tổng thực lĩnh năm: {formatMoney(total)}
          </div>
        )}
      />
    </div>
  );
};

export default FilterSalaryYear;
