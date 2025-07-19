import type { ReactNode } from "react";
import { vietnamMoneyFormat } from "../../utils/otherEvents";

// Kiểu dữ liệu các tham số truyền vào
interface CustomTableDashboardProps {
  id?: string;
  className?: string;
  columnsWidth?: string[];
  columnsTitle?: string[];
  tbody?: (string | number)[][];
  format?: string[];
  tfoot?: (string | number)[];
}

const CustomTableDashboard: React.FC<CustomTableDashboardProps> = ({
  id,
  className,
  columnsWidth,
  columnsTitle,
  tbody,
  format,
  tfoot,
}) => {
  return (
    <>
      <table id={id} className={"table-dashboard " + className}>
        {columnsWidth && columnsTitle && (
          <>
            <colgroup>
              {columnsWidth?.map((columnWidth) => (
                <col width={columnWidth} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {columnsTitle?.map((columnTitle) => (
                  <th>{columnTitle}</th>
                ))}
              </tr>
            </thead>
          </>
        )}
        {tbody && (
          <tbody>
            {tbody?.map((tr) => (
              <tr>
                {tr?.map((td, index) => (
                  <td
                    className={format && format[index] == "info" ? "left" : ""}
                  >
                    {format && format[index] == "price"
                      ? vietnamMoneyFormat(td as number)
                      : td}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
        {tfoot && (
          <tfoot>
            <tr>
              <td
                colSpan={
                  columnsTitle &&
                  columnsWidth &&
                  tfoot &&
                  columnsTitle.length === columnsWidth.length
                    ? columnsTitle.length - tfoot.length
                    : 1
                }
              >
                Tổng:
              </td>
              {tfoot?.map((td, index) => (
                <td>
                  {format &&
                  format[index + (columnsTitle!.length - tfoot.length)] ==
                    "price"
                    ? vietnamMoneyFormat(td as number)
                    : td}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </>
  );
};

export default CustomTableDashboard;
