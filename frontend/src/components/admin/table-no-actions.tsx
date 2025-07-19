import { vietnamMoneyFormat } from "../../utils/otherEvents";

interface CustomTableNoActionsProps {
  id?: string;
  className?: string;
  columnWidths?: string[];
  columnTitles?: string[];
  data?: any[];
  attributes?: string[];
  format?: string[];
}

const handleAttribute = (item: any, attribute: string) => {
  if (attribute.includes(".")) {
    const attributes = attribute.split(".");
    if (attributes.length == 2) return item[attributes[0]][attributes[1]];
    if (attributes.length == 3)
      return item[attributes[0]][attributes[1]][attributes[2]];
    if (attributes.length == 4)
      return item[attributes[0]][attributes[1]][attributes[2]][attributes[3]];
  } else if (attribute.includes("*")) {
    const attributes = attribute.split("*");
    return item[attributes[0]] * item[attributes[1]];
  }

  return item[attribute] as string | number;
};

const CustomTableNoActions: React.FC<CustomTableNoActionsProps> = ({
  id,
  className,
  columnWidths,
  columnTitles,
  data,
  attributes,
  format,
}) => {
  return (
    <>
      <table id={id} className={"table-no-actions " + className}>
        <colgroup>
          {columnWidths!.map((columnWidth) => (
            <col style={{ width: columnWidth }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columnTitles!.map((columnTitle) => (
              <th>{columnTitle}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index}>
              {attributes?.map((attribute, index) => (
                <td
                  key={index}
                  className={format?.[index] !== "price" ? format?.[index] : ""}
                >
                  {format?.[index] === "price"
                    ? vietnamMoneyFormat(handleAttribute(item, attribute))
                    : handleAttribute(item, attribute)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default CustomTableNoActions;
