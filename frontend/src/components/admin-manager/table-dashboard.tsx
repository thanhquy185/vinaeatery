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
        {columnsWidth && columnsTitle && columnsWidth.length > 0 && columnsTitle.length > 0 && (
          <>
            <colgroup>
              {columnsWidth?.map((columnWidth, index) => (
                <col key={index} width={columnWidth} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {columnsTitle?.map((columnTitle, index) => (
                  <th key={index}>{columnTitle}</th>
                ))}
              </tr>
            </thead>
          </>
        )}
        {tbody && tbody.length > 0 && (
          <tbody>
            {tbody?.map((tr, index) => (
              <tr key={index}>
                {tr?.map((td, index) => (
                  <td
                    key={index}
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
        {tfoot && tfoot.length > 0 && (
          <tfoot> 
            <tr key={0}>
              <td
                key={0}
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
                <td key={index + 1}>
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
