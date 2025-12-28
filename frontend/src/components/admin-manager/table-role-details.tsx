import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { Checkbox } from "antd";
import type { FunctionsType, RoleDetailsType } from "../../common/types";
import isEqual from "lodash/isEqual";

interface CustomTableRoleDetailsProps {
  id?: string;
  className?: string;
  type?: string;
  columnWidths?: string[];
  columnTitles?: string[];
  data?: RoleDetailsType[];
  setRoleDetails?: Dispatch<SetStateAction<RoleDetailsType[]>>;
}

const actions: RoleDetailsType["action"][] = [
  "Xem",
  "Thêm",
  "Cập nhật",
  "Khóa",
];

const CustomTableRoleDetails: React.FC<CustomTableRoleDetailsProps> = ({
  id,
  className,
  type,
  columnWidths = ["40%", "15%", "15%", "15%", "15%"],
  columnTitles = ["Tên chức năng", "Xem", "Thêm", "Cập nhật", "Khóa"],
  data = [],
  setRoleDetails,
}) => {
  const functions = useRouteLoaderData("manager-info-login").functions as FunctionsType[];

  const [checkedMap, setCheckedMap] = useState<
    Record<string, Record<string, boolean>>
  >(() => {
    const initial: Record<string, Record<string, boolean>> = {};
    functions?.forEach((func) => {
      initial[func.id!] = {};
      actions.forEach((action) => {
        const isChecked = data.some(
          (perm) => perm.functionId === func.id && perm.action === action
        );
        initial[func.id!][action!] = isChecked;
      });
    });
    return initial;
  });

  const handleChange = (funcId: number, action: string, checked: boolean) => {
    setCheckedMap((prev) => ({
      ...prev,
      [funcId]: {
        ...prev[funcId],
        [action]: checked,
      },
    }));
  };

  // Toggle cả hàng
  const toggleRow = (funcId: number) => {
    if (type !== "detail") {
      setCheckedMap((prev) => {
        const updated = { ...prev[funcId] };
        actions.forEach((action) => {
          if (
            functions.find((f) => f.id === funcId)?.actions?.includes(action!)
          ) {
            updated[action!] = !prev[funcId][action!];
          }
        });
        return {
          ...prev,
          [funcId]: updated,
        };
      });
    }
  };

  // Toggle cả cột
  const toggleColumn = (action: string) => {
    if (type !== "detail") {
      setCheckedMap((prev) => {
        const updated: Record<string, Record<string, boolean>> = {};
        functions.forEach((func) => {
          const row = { ...prev[func.id!] };
          if (func.actions?.includes(action)) {
            row[action] = !prev[func.id!][action];
          }
          updated[func.id!] = row;
        });

        return updated;
      });
    }
  };

  // Toggle tất cả
  const toggleAll = (checked: boolean) => {
    if (type !== "detail") {
      setCheckedMap((prev) => {
        const updated: Record<string, Record<string, boolean>> = {};
        functions.forEach((func) => {
          const row = { ...prev[func.id!] };
          actions.forEach((action) => {
            if (func.actions?.includes(action!)) row[action!] = checked;
          });
          updated[func.id!] = row;
        });

        return updated;
      });
    }
  };

  // Cập nhật mỗi khi thay đổi
  useEffect(() => {
    if (type !== "detail" && !isEqual(data, checkedMap)) {
      let newRoleDetails: RoleDetailsType[] = [];
      functions.forEach((func) => {
        actions.forEach((action) => {
          if (checkedMap[func.id!][action!]) {
            newRoleDetails.push({
              functionId: func.id!,
              action: action!,
            });
          }
        });
      });

      setRoleDetails!(newRoleDetails);
    }
  }, [checkedMap]);

  return (
    <>
      {type !== "detail" && (
        <div className="buttons">
          <button
            type="button"
            className="btn secondary-btn margin-r"
            onClick={() => toggleAll(false)}
          >
            Xoá tất cả
          </button>
          <button
            type="button"
            className="btn secondary-btn"
            onClick={() => toggleAll(true)}
          >
            Chọn tất cả
          </button>
        </div>
      )}
      <table id={id} className={"table-role-details " + (className || "")}>
        <colgroup>
          {columnWidths.map((width, index) => (
            <col key={index} style={{ width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columnTitles.map((title, index) => (
              <th
                key={index}
                onClick={() => index > 0 && toggleColumn(actions[index - 1]!)}
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {functions?.map((func) => (
            <tr key={func.id} onClick={() => toggleRow(func.id!)}>
              <td>{func.nameVN}</td>
              {actions.map((action) => (
                <td key={action} onClick={(e) => e.stopPropagation()}>
                  {func.actions?.includes(action!) && (
                    <Checkbox
                      disabled={
                        type === "detail" || !func.actions?.includes(action!)
                      }
                      checked={checkedMap[func.id!]?.[action!]}
                      onChange={(e) =>
                        handleChange(func.id!, action!, e.target.checked)
                      }
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default CustomTableRoleDetails;
