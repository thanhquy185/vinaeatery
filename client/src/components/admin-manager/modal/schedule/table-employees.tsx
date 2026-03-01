import {
  useMemo,
  useState,
  type Dispatch,
  type FC,
  type Key,
  type SetStateAction,
} from "react";
import { Table, Image, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IdCard, UserRoundCog } from "lucide-react";
import type { EmployeeType } from "../../../../common/types";
import { ImageSourcePath } from "../../../../common/values";

export interface EmployeeConflictType {
  employeeId: number;
  conflicts: {
    scheduleName: string;
    scheduleDateStart: string;
    scheduleDateEnd: string;
    shiftName: string;
    shiftDayOfWeek: number;
    shiftTimeStart: string;
    shiftTimeEnd: string;
  }[];
}

// Table Employees Props
interface TableEmployeesProps {
  hideSelectAll?: boolean;
  employees: EmployeeType[];
  selectedEmployeeIds?: number[];
  setSelectedEmployeeIds?: Dispatch<SetStateAction<number[]>>;
  conflicts?: EmployeeConflictType[];
}

// Table Employees
const TableEmployees: FC<TableEmployeesProps> = ({
  hideSelectAll = false,
  employees,
  selectedEmployeeIds,
  setSelectedEmployeeIds,
  conflicts = [],
}) => {
  const getEmployeeConflict = (employeeId?: number) => {
    return conflicts.find((c) => c.employeeId === employeeId);
  };
  const ConflictCell = ({
    conflict,
  }: {
    conflict: {
      conflicts: {
        scheduleName: string;
        scheduleDateStart: string;
        scheduleDateEnd: string;
        shiftName: string;
        shiftDayOfWeek: number;
        shiftTimeStart: string;
        shiftTimeEnd: string;
      }[];
    };
  }) => {
    const MAX_VISIBLE = 2;
    const [showFull, setShowFull] = useState(false);

    const visibleConflicts = useMemo(() => {
      return showFull
        ? conflict.conflicts
        : conflict.conflicts.slice(0, MAX_VISIBLE);
    }, [showFull]);

    const remaining = conflict.conflicts.length - MAX_VISIBLE;

    return (
      <>
        {visibleConflicts.map((c, i) => (
          <div key={i} className="schedule-conflict-info">
            <p className="schedule">
              {c.scheduleName} ({c.scheduleDateStart} - {c.scheduleDateEnd})
            </p>

            <p className="shift">
              {c.shiftName}
              <span className="dot"></span>
              {c.shiftDayOfWeek === 7
                ? "Chủ nhật"
                : "Thứ " + (c.shiftDayOfWeek + 1)}
              <span className="dot"></span>
              {c.shiftTimeStart} - {c.shiftTimeEnd}
            </p>
          </div>
        ))}
        {remaining > 0 && (
          <a onClick={() => setShowFull(!showFull)}>
            {showFull ? "Thu gọn" : `+${remaining} xung đột nữa`}
          </a>
        )}
      </>
    );
  };

  const employeeColumns: ColumnsType<EmployeeType> = [
    {
      title: "Nhân viên",
      key: "employeeInfo",
      width: "30%",
      render: (_, record) => (
        <div className="employee-info">
          <Image
            src={
              record.image
                ? (record.image as string)
                : ImageSourcePath + "no-image.png"
            }
          />
          <div>
            <p className="name">{record.fullname}</p>
            <p className="has-icon">
              <IdCard />
              <span>{record.id}</span>
            </p>
            <p className="has-icon">
              <UserRoundCog />
              <span>{record.currentRole?.name}</span>
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "scheduleStatus",
      width: "20%",
      render: (_, record) => {
        const isConflict = getEmployeeConflict(record.id);

        if (!isConflict) {
          return <Tag color="green">Có thể chọn</Tag>;
        }

        return <Tag color="red">Không thể chọn</Tag>;
      },
    },
    {
      title: "Lý do",
      key: "reason",
      width: "40%",
      render: (_, record) => {
        const conflict = getEmployeeConflict(record.id);

        if (!conflict) return <span style={{ color: "#aaa" }}>—</span>;

        return <ConflictCell conflict={conflict} />;
      },
    },
  ];

  const employeeRowSelection = {
    selectedRowKeys: selectedEmployeeIds,
    onChange: (keys: Key[]) => {
      // Lọc bỏ những employee bị conflict
      const validKeys = (keys as number[]).filter(
        (id) => !getEmployeeConflict(id),
      );

      setSelectedEmployeeIds?.(validKeys);
    },
    hideSelectAll: hideSelectAll,
    getCheckboxProps: (record: EmployeeType) => {
      const isConflict = getEmployeeConflict(record.id);

      return {
        disabled: !!isConflict,
      };
    },
  };

  return (
    <Table
      rowKey="id"
      columns={employeeColumns}
      dataSource={employees}
      rowSelection={employeeRowSelection}
      pagination={{ pageSize: 5 }}
      className="table-actions employees"
    />
  );
};

export default TableEmployees;
