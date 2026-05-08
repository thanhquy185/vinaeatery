import { type Dispatch, type FC, type SetStateAction, useMemo } from "react";
import { IdCard, UserRoundCog } from "lucide-react";
import { Checkbox, Image, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  CategoryInsuranceType,
  EmployeeType,
  InsuranceDetailType,
} from "../../../../common/types";
import { EmployeeStatus, ImageSourcePath } from "../../../../common/values";

interface TableInsuranceProps {
  isDetail?: boolean;
  employees: EmployeeType[];
  categoryInsurances: CategoryInsuranceType[];
  insuranceDetails?: InsuranceDetailType[];
  newInsuranceDetails: InsuranceDetailType[];
  setNewInsuranceDetails: Dispatch<SetStateAction<InsuranceDetailType[]>>;
}

const TableInsurance: FC<TableInsuranceProps> = ({
  isDetail = false,
  employees,
  categoryInsurances,
  insuranceDetails,
  newInsuranceDetails,
  setNewInsuranceDetails,
}) => {
  const getValue = (employeeId: number, categoryId: number) => {
    return (
      newInsuranceDetails.some(
        (d) =>
          d.employeeId === employeeId && d.categoryInsuranceId === categoryId,
      ) ||
      insuranceDetails?.some(
        (d) =>
          d.employeeId === employeeId && d.categoryInsuranceId === categoryId,
      ) ||
      false
    );
  };
  const handleToggle = (
    employeeId: number,
    categoryId: number,
    value: boolean,
  ) => {
    setNewInsuranceDetails((prev) => {
      const exists = prev.find(
        (d) =>
          d.employeeId === employeeId && d.categoryInsuranceId === categoryId,
      );

      // ✅ check → thêm
      if (value) {
        if (exists) return prev;

        return [
          ...prev,
          {
            employeeId,
            categoryInsuranceId: categoryId,
          },
        ];
      }

      // ❌ uncheck → xoá
      return prev.filter(
        (d) =>
          !(
            d.employeeId === employeeId && d.categoryInsuranceId === categoryId
          ),
      );
    });
  };
  const handleCheckAll = (value: boolean) => {
    if (!value) {
      setNewInsuranceDetails([]);
      return;
    }

    const newData: InsuranceDetailType[] = [];

    employees.forEach((emp) => {
      categoryInsurances.forEach((cat) => {
        newData.push({
          employeeId: emp.id!,
          categoryInsuranceId: cat.id!,
        });
      });
    });

    setNewInsuranceDetails(newData);
  };
  const handleCheckColumn = (categoryId: number, value?: boolean) => {
    setNewInsuranceDetails((prev) => {
      const allChecked = employees.every((emp) =>
        getValue(emp.id!, categoryId),
      );

      const nextValue = value ?? !allChecked;

      let newData = [...prev];

      employees.forEach((emp) => {
        const exists = newData.find(
          (d) =>
            d.employeeId === emp.id && d.categoryInsuranceId === categoryId,
        );

        if (nextValue) {
          if (!exists) {
            newData.push({
              employeeId: emp.id!,
              categoryInsuranceId: categoryId,
            });
          }
        } else {
          newData = newData.filter(
            (d) =>
              !(
                d.employeeId === emp.id && d.categoryInsuranceId === categoryId
              ),
          );
        }
      });

      return newData;
    });
  };
  const handleCheckRow = (employeeId: number) => {
    setNewInsuranceDetails((prev) => {
      const allChecked = categoryInsurances.every((cat) =>
        getValue(employeeId, cat.id!),
      );

      if (allChecked) {
        // ❌ xoá hết
        return prev.filter((d) => d.employeeId !== employeeId);
      }

      // ✅ thêm tất cả
      const newItems = categoryInsurances.map((cat) => ({
        employeeId,
        categoryInsuranceId: cat.id!,
      }));

      const filtered = prev.filter((d) => d.employeeId !== employeeId);

      return [...filtered, ...newItems];
    });
  };

  const isAllChecked = useMemo(() => {
    return employees.every((emp) =>
      categoryInsurances.every((cat) => getValue(emp.id!, cat.id!)),
    );
  }, [employees, categoryInsurances, newInsuranceDetails]);
  const isIndeterminate = useMemo(() => {
    const total = employees.length * categoryInsurances.length;
    let checked = 0;

    employees.forEach((emp) => {
      categoryInsurances.forEach((cat) => {
        if (getValue(emp.id!, cat.id!)) checked++;
      });
    });

    return checked > 0 && checked < total;
  }, [employees, categoryInsurances, newInsuranceDetails]);

  const columns: ColumnsType<any> = useMemo(() => {
    const categoryColumns: ColumnsType<any> =
      categoryInsurances.map((cat) => {
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
                <div style={{ fontSize: 12, color: "#888" }}>
                  CTY: {cat.companyPercent}%
                </div>
                <div style={{ fontSize: 12, color: "#1890ff" }}>
                  NV: {cat.employeePercent}%
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
  }, [categoryInsurances, employees, newInsuranceDetails]);

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

export default TableInsurance;
