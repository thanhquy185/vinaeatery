import { type FC } from "react";
import { FileDown, LucideCircleQuestionMark, RotateCcw } from "lucide-react";
import { DatePicker, Select } from "antd";
import type {
  DataProps,
  ManagerHandlePayslipProps,
} from "./manager-handle-payslip";
import ConfigVN from "../../../common/config-vn";
import CustomModal from "../../../common/modal";
import FilterExplain from "./filter-explain";
import { useSecondModal } from "../../../../hook/use-second-modal";
import FilterSalaryMonth from "./filter-salary-month";
import FilterSalaryYear from "./filter-salary-year";

// Filter Card
const FilterCard: FC<ManagerHandlePayslipProps> = ({
  objectEN,
  timeline,
  setTimeline,
  timeDetail,
  setTimeDetail,
  data,
}) => {
  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { secondModal, openSecondModal, closeSecondModal } = useSecondModal();
  // - Quản lý các modal
  const ManagerFilterCardModals = {
    explain: (data: any) => <FilterExplain />,
    salaryMonth: (data: DataProps) => <FilterSalaryMonth data={data} />,
    salaryYear: (data: DataProps) => <FilterSalaryYear data={data} />,
  };

  return (
    <>
      <div className="filter">
        <Select
          allowClear
          placeholder="Chọn Mốc thời gian"
          options={[
            {
              label: "Theo năm",
              value: "year",
            },
            {
              label: "Theo tháng",
              value: "month",
            },
          ]}
          value={timeline}
          onChange={(val) => setTimeline!(val)}
          onClear={() => setTimeDetail!(undefined)}
        />
        <ConfigVN
          children={
            <DatePicker
              picker={timeline}
              placeholder="Chọn Thời gian cụ thể"
              value={timeDetail}
              onChange={(val) => setTimeDetail!(val)}
              disabled={!timeline}
            />
          }
        />
        <button
          className="btn"
          onClick={() => {
            setTimeline!(undefined);
            setTimeDetail!(undefined);
          }}
        >
          <RotateCcw />
        </button>
        <button
          className="btn"
          onClick={() =>
            openSecondModal({
              title: "Cách tính lương",
              width: "50%",
              className: "default",
              children: ManagerFilterCardModals.explain(data),
            })
          }
        >
          <LucideCircleQuestionMark />
          <span>Cách tính</span>
        </button>
        <button
          className="btn"
          onClick={() =>
            openSecondModal({
              title: `In phiếu lương ${timeline === "year" ? "năm" : "tháng"}`,
              width: "80%",
              className: `default ${objectEN} ticket`,
              children:
                timeline === "year"
                  ? ManagerFilterCardModals.salaryYear(data!)
                  : ManagerFilterCardModals.salaryMonth(data!),
            })
          }
        >
          <FileDown />
          <span>In phiếu</span>
        </button>
      </div>
      {secondModal.open && (
        <CustomModal
          title={secondModal.title}
          open={secondModal.open}
          width={secondModal.width}
          className={secondModal.className}
          children={secondModal.children}
          setCloseModal={() => closeSecondModal()}
        />
      )}
    </>
  );
};

export default FilterCard;
