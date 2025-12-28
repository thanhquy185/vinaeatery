import { Checkbox } from "antd";

interface CustomTableHasCheckboxesProps {
  id?: string;
  className?: string;
  columnWidths?: string[];
  columnTitles?: string[];
}

const CustomTableHasCheckboxes: React.FC<CustomTableHasCheckboxesProps> = ({
  id,
  className,
  columnWidths = ["30%", "10%", "10%", "10%", "10%", "10%", "10%", "10%"],
  columnTitles = [
    "Tên nhân viên",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ],
}) => {
  return (
    <>
      <table id={id} className={"table-has-checkboxes " + className}>
        <colgroup>
          {columnWidths.map((columnWidth) => (
            <col style={{ width: columnWidth }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columnTitles.map((columnTitle) => (
              <th>{columnTitle}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Nhân viên 1</td>
            <td>
              <Checkbox></Checkbox>
            </td>
            <td>
              <Checkbox></Checkbox>
            </td>
            <td>
              <Checkbox></Checkbox>
            </td>
            <td>
              <Checkbox></Checkbox>
            </td>
            <td>
              <Checkbox></Checkbox>
            </td>
            <td>
              <Checkbox></Checkbox>
            </td>
            <td>
              <Checkbox></Checkbox>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default CustomTableHasCheckboxes;
