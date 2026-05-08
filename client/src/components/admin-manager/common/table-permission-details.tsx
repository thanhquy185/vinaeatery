import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useRouteLoaderData } from "react-router-dom";
import { Table, Checkbox } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { FunctionType, PermissionDetailType } from "../../../common/types";
import isEqual from "lodash/isEqual";

// Custom Table Permission Details Props
interface CustomTablePermissionDetailsProps {
  id?: string;
  type?: string;
  data?: PermissionDetailType[];
  setPermissionDetails?: Dispatch<SetStateAction<PermissionDetailType[]>>;
}

interface TableRow {
  key: number;
  id: number;
  nameVN?: string;
  actions?: string;
}

const actions: PermissionDetailType["action"][] = [
  "Xem",
  "Thêm",
  "Cập nhật",
  "Khóa",
];

// Custom Table Permission Details
const CustomTablePermissionDetails: React.FC<
  CustomTablePermissionDetailsProps
> = ({ id, type, data = [], setPermissionDetails }) => {
  const functions = useRouteLoaderData("manager-info-login")
    .functions as FunctionType[];

  const [checkedMap, setCheckedMap] = useState<
    Record<number, Record<string, boolean>>
  >(() => {
    const initial: Record<number, Record<string, boolean>> = {};
    functions.forEach((func) => {
      initial[func.id!] = {};
      actions.forEach((action) => {
        initial[func.id!][action!] = data.some(
          (p) => p.functionId === func.id && p.action === action,
        );
      });
    });
    return initial;
  });
  const isAllChecked = useMemo(() => {
    return functions.every((func) =>
      actions.every((action) =>
        func.actions?.includes(action!)
          ? checkedMap[func.id!]?.[action!]
          : true,
      ),
    );
  }, [checkedMap, functions]);
  const isIndeterminate = useMemo(() => {
    let total = 0;
    let checked = 0;

    functions.forEach((func) => {
      actions.forEach((action) => {
        if (func.actions?.includes(action!)) {
          total++;
          if (checkedMap[func.id!]?.[action!]) checked++;
        }
      });
    });

    return checked > 0 && checked < total;
  }, [checkedMap, functions]);

  const columns: ColumnsType<TableRow> = [
    {
      title: (
        <Checkbox
          disabled={type === "detail"}
          checked={isAllChecked}
          indeterminate={isIndeterminate}
          onChange={(e) => toggleAll(e.target.checked)}
        >
          Chức năng
        </Checkbox>
      ),
      dataIndex: "nameVN",
      align: "center",
      width: "40%",
    },
    ...actions.map((action) => ({
      title: () => {
        const available = functions.filter((f) => f.actions?.includes(action!));
        const checkedCount = available.filter(
          (f) => checkedMap[f.id!]?.[action!],
        ).length;

        return (
          <Checkbox
            disabled={type === "detail"}
            indeterminate={checkedCount > 0 && checkedCount < available.length}
            checked={available.length > 0 && checkedCount === available.length}
            onChange={(e) => toggleColumn(action!, e.target.checked)}
          >
            {action}
          </Checkbox>
        );
      },
      align: "center" as const,
      width: "15%",
      render: (_: any, record: TableRow) => {
        if (!record.actions?.includes(action!)) return null;

        return (
          <Checkbox
            disabled={type === "detail"}
            checked={checkedMap[record.id]?.[action!]}
            onChange={(e) => handleChange(record.id, action!, e.target.checked)}
          />
        );
      },
    })),
  ];
  const dataSource: TableRow[] = useMemo(
    () =>
      functions.map((f) => ({
        key: f.id!,
        id: f.id!,
        nameVN: f.nameVN,
        actions: f.actions,
      })),
    [functions],
  );

  const handleChange = (funcId: number, action: string, checked: boolean) => {
    setCheckedMap((prev) => ({
      ...prev,
      [funcId]: {
        ...prev[funcId],
        [action]: checked,
      },
    }));
  };
  const toggleRow = (func: FunctionType) => {
    if (type === "detail") return;

    setCheckedMap((prev) => {
      const updated = { ...prev[func.id!] };
      actions.forEach((action) => {
        if (func.actions?.includes(action!)) {
          updated[action!] = !prev[func.id!][action!];
        }
      });
      return { ...prev, [func.id!]: updated };
    });
  };
  const toggleColumn = (action: string, checked: boolean) => {
    if (type === "detail") return;

    setCheckedMap((prev) => {
      const updated: typeof prev = {};
      functions.forEach((func) => {
        const row = { ...prev[func.id!] };
        if (func.actions?.includes(action)) {
          row[action] = checked;
        }
        updated[func.id!] = row;
      });
      return updated;
    });
  };
  const toggleAll = (checked: boolean) => {
    if (type === "detail") return;

    setCheckedMap((prev) => {
      const updated: typeof prev = {};
      functions.forEach((func) => {
        const row = { ...prev[func.id!] };
        actions.forEach((action) => {
          if (func.actions?.includes(action!)) {
            row[action!] = checked;
          }
        });
        updated[func.id!] = row;
      });
      return updated;
    });
  };

  useEffect(() => {
    if (type === "detail") return;

    const newPermissionDetails: PermissionDetailType[] = [];
    functions.forEach((func) => {
      actions.forEach((action) => {
        if (checkedMap[func.id!]?.[action!]) {
          newPermissionDetails.push({
            functionId: func.id!,
            action,
          });
        }
      });
    });

    if (!isEqual(data, newPermissionDetails)) {
      setPermissionDetails?.(newPermissionDetails);
    }
  }, [checkedMap]);

  return (
    <Table
      id={id}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      onRow={(record) => ({
        onClick: () => {
          const func = functions.find((f) => f.id === record.id);
          if (func) toggleRow(func);
        },
      })}
      className="table-permission-details"
    />
  );
};

export default CustomTablePermissionDetails;
