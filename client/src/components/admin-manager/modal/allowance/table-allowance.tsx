import { type Dispatch, type FC, type SetStateAction, useMemo } from "react";
import { IdCard, UserRoundCog } from "lucide-react";
import { Checkbox, Image, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  CategoryAllowanceType,
  EmployeeType,
  AllowanceDetailType,
} from "../../../../common/types";
import { EmployeeStatus, ImageSourcePath } from "../../../../common/values";
import { vietnamMoneyFormat } from "../../../../utils/other-events";

interface TableAllowanceProps {
  isDetail?: boolean;
  employees: EmployeeType[];
  categoryAllowances: CategoryAllowanceType[];
  allowanceDetails?: AllowanceDetailType[];
  newAllowanceDetails: AllowanceDetailType[];
  setNewAllowanceDetails: Dispatch<SetStateAction<AllowanceDetailType[]>>;
}

const TableAllowance: FC<TableAllowanceProps> = ({
  isDetail = false,
  employees,
  categoryAllowances,
  allowanceDetails,
  newAllowanceDetails,
  setNewAllowanceDetails,
}) => {
  const getValue = (employeeId: number, categoryId: number) => {
    return (
      newAllowanceDetails?.some(
        (d) =>
          d.employeeId === employeeId && d.categoryAllowanceId === categoryId,
      ) ||
      allowanceDetails?.some(
        (d) =>
          d.employeeId === employeeId && d.categoryAllowanceId === categoryId,
      ) ||
      false
    );
  };
  const handleToggle = (
    employeeId: number,
    categoryId: number,
    value: boolean,
  ) => {
    setNewAllowanceDetails((prev) => {
      const exists = prev.find(
        (d) =>
          d.employeeId === employeeId && d.categoryAllowanceId === categoryId,
      );

      // ✅ check → thêm
      if (value) {
        if (exists) return prev;

        return [
          ...prev,
          {
            employeeId,
            categoryAllowanceId: categoryId,
          },
        ];
      }

      // ❌ uncheck → xoá
      return prev.filter(
        (d) =>
          !(
            d.employeeId === employeeId && d.categoryAllowanceId === categoryId
          ),
      );
    });
  };
  const handleCheckAll = (value: boolean) => {
    if (!value) {
      setNewAllowanceDetails([]);
      return;
    }

    const newData: AllowanceDetailType[] = [];

    employees.forEach((emp) => {
      categoryAllowances.forEach((cat) => {
        newData.push({
          employeeId: emp.id!,
          categoryAllowanceId: cat.id!,
        });
      });
    });

    setNewAllowanceDetails(newData);
  };
  const handleCheckColumn = (categoryId: number, value?: boolean) => {
    setNewAllowanceDetails((prev) => {
      const allChecked = employees.every((emp) =>
        getValue(emp.id!, categoryId),
      );

      const nextValue = value ?? !allChecked;

      let newData = [...prev];

      employees.forEach((emp) => {
        const exists = newData.find(
          (d) =>
            d.employeeId === emp.id && d.categoryAllowanceId === categoryId,
        );

        if (nextValue) {
          if (!exists) {
            newData.push({
              employeeId: emp.id!,
              categoryAllowanceId: categoryId,
            });
          }
        } else {
          newData = newData.filter(
            (d) =>
              !(
                d.employeeId === emp.id && d.categoryAllowanceId === categoryId
              ),
          );
        }
      });

      return newData;
    });
  };
  const handleCheckRow = (employeeId: number) => {
    setNewAllowanceDetails((prev) => {
      const allChecked = categoryAllowances.every((cat) =>
        getValue(employeeId, cat.id!),
      );

      if (allChecked) {
        // ❌ xoá hết
        return prev.filter((d) => d.employeeId !== employeeId);
      }

      // ✅ thêm tất cả
      const newItems = categoryAllowances.map((cat) => ({
        employeeId,
        categoryAllowanceId: cat.id!,
      }));

      const filtered = prev.filter((d) => d.employeeId !== employeeId);

      return [...filtered, ...newItems];
    });
  };

  const isAllChecked = useMemo(() => {
    return employees.every((emp) =>
      categoryAllowances.every((cat) => getValue(emp.id!, cat.id!)),
    );
  }, [employees, categoryAllowances, newAllowanceDetails]);
  const isIndeterminate = useMemo(() => {
    const total = employees.length * categoryAllowances.length;
    let checked = 0;

    employees.forEach((emp) => {
      categoryAllowances.forEach((cat) => {
        if (getValue(emp.id!, cat.id!)) checked++;
      });
    });

    return checked > 0 && checked < total;
  }, [employees, categoryAllowances, newAllowanceDetails]);

  const columns: ColumnsType<any> = useMemo(() => {
    const categoryColumns: ColumnsType<any> =
      categoryAllowances.map((cat) => {
        const columnChecked = employees.every((emp) =>
          getValue(emp.id!, cat.id!),
        );

        const columnIndeterminate =
          employees.some((emp) => getValue(emp.id!, cat.id!)) && !columnChecked;

        return {
          title: (
            <div style={{ textAlign: "center" }}>
              <Checkbox
                checked={columnChecked}
                indeterminate={columnIndeterminate}
                onChange={(e) => handleCheckColumn(cat.id!, e.target.checked)}
              >
                <div style={{ fontWeight: 600 }}>{cat.name}</div>
                <div style={{ fontSize: 12, marginTop: 2 }}>
                  {cat.money === 0 ? (
                    <span style={{ color: "#1890ff" }}>Miễn phí</span>
                  ) : (
                    <span style={{ color: "#52c41a" }}>
                      +{vietnamMoneyFormat(cat.money || 0)}
                    </span>
                  )}
                </div>
              </Checkbox>
            </div>
          ),
          width: 150,
          render: (_: any, record: any) => {
            const checked = getValue(record.id, cat.id!);

            return (
              <Checkbox
                checked={checked}
                disabled={isDetail || record.status !== EmployeeStatus.active}
                onChange={(e) =>
                  handleToggle(record.id, cat.id!, e.target.checked)
                }
              />
            );
          },
        };
      }) || [];

    return [
      {
        title: (
          <Checkbox
            checked={isAllChecked}
            indeterminate={isIndeterminate}
            onChange={(e) => handleCheckAll(e.target.checked)}
          >
            Nhân viên
          </Checkbox>
        ),
        key: "employee",
        fixed: "left",
        width: 200,
        render: (_, record: EmployeeType) => (
          <div
            className="employee-info"
            style={{ cursor: "pointer" }}
            onClick={() => handleCheckRow(record.id!)}
          >
            <Image
              src={(record.image as string) || ImageSourcePath + "no-image.png"}
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
      ...categoryColumns,
    ];
  }, [categoryAllowances, employees, newAllowanceDetails]);

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={employees}
      pagination={employees.length > 5 ? { pageSize: 5 } : false}
      scroll={{ x: "max-content" }}
      className="table-actions employees"
    />
  );
};

export default TableAllowance;
