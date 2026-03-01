import type { Dispatch, FC, SetStateAction } from "react";
import { Table } from "antd";
import type { ShiftType } from "../../../../common/types";
import { getDayOfWeekLabel } from "../../../../utils/timetable";

// Table Shifts Props
interface TableShiftsProps {
  shifts: ShiftType[];
  selectedShiftIds?: number[];
  setSelectedShiftIds?: Dispatch<SetStateAction<number[]>>;
}

// Table Shifts
const TableShifts: FC<TableShiftsProps> = ({
  shifts,
  selectedShiftIds,
  setSelectedShiftIds,
}) => {
  // Các thành phần cho Chi tiết nhân viên
  // - Cột thuộc tính
  const shiftColumns = [
    {
      title: "Danh sách ca làm",
      dataIndex: "shift",
      alignText: "center",
      render: (_: any, shift: ShiftType) => {
        const isSelected = selectedShiftIds?.includes(shift.id!);

        return (
          <div
            className={"shift-item " + (isSelected ? "active" : "")}
            onClick={() =>
              setSelectedShiftIds!((prev) =>
                prev.includes(shift.id!)
                  ? prev.filter((id) => id !== shift.id!)
                  : [...prev, shift.id!],
              )
            }
          >
            <p className="title">{shift.name}</p>
            {shift.shiftDetails?.map((shiftDetail) => (
              <p>
                <b>{getDayOfWeekLabel(shiftDetail.dayOfWeek!)}: </b>
                <span>
                  {shiftDetail.timeStart} - {shiftDetail.timeEnd}
                </span>
              </p>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={shiftColumns}
      dataSource={shifts}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default TableShifts;
