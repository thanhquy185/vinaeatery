import TextArea from "antd/es/input/TextArea";
import { useEffect, useMemo, useState } from "react";
import { InputNumber, Select, Table } from "antd";
import {
  inputNumberFormatter,
  inputNumberParse,
  vietnamMoneyFormat,
} from "../../utils/otherEvents";
import type { ColumnsType } from "antd/es/table";

export interface TableInputComponentRowData {
  key: string;
  baseId?: number;
  values: Record<string, any>;
}

interface TableInputComponentProps {
  object?: string;
  type?: string;
  columnTitles: string[];
  attributes: string[];
  base: any[];
  data?: TableInputComponentRowData[];
  onChange?: (rows: TableInputComponentRowData[]) => void;
}

const TableInputComponent: React.FC<TableInputComponentProps> = ({
  object,
  type,
  columnTitles,
  attributes,
  base,
  data = [],
  onChange,
}) => {
  const [rows, setRows] = useState<TableInputComponentRowData[]>(
    data.length
      ? data
      : [
          {
            key: crypto.randomUUID(),
            baseId: undefined,
            values: {},
          },
        ],
  );

  const columns: ColumnsType<TableInputComponentRowData> = useMemo(() => {
    const result: ColumnsType<TableInputComponentRowData> = [];

    result.push({
      title: columnTitles[0],
      dataIndex: "baseId",
      width: 250,
      render: (_, record) => (
        <Select
          value={record.baseId}
          style={{ width: "100%" }}
          placeholder="-- Chọn --"
          allowClear
          disabled={type === "detail" || type === "update"}
          onChange={(value) => {
            const selectedBase = base.find((item) => item.id === value);

            setRows((prev) =>
              prev.map((row) =>
                row.key === record.key
                  ? {
                      ...row,
                      baseId: value,
                      base: selectedBase,
                    }
                  : row,
              ),
            );
          }}
        >
          {base.map((item) => (
            <Select.Option
              key={item.id}
              value={item.id}
              disabled={rows.some(
                (r) => r.key !== record.key && r.baseId === item.id,
              )}
            >
              {item.name}
              {object === "bill" || object === "input-ticket"
                ? " (" +
                  vietnamMoneyFormat(
                    object === "bill" ? item.price : item.inputPrice,
                  ) +
                  (object === "input-ticket"
                    ? ", " + item.inventory
                    : "") +
                  ")"
                : ""}
            </Select.Option>
          ))}
        </Select>
      ),
    });

    attributes.forEach((attr, index) => {
      result.push({
        title: columnTitles[index + 1],
        dataIndex: attr,
        width: 180,
        render: (_, record) => {
          if (attr === "totalInputPriceDetail") {
            const inputPrice = record.values["inputPrice"];
            const quantity = record.values["quantity"];

            return (
              <span>{vietnamMoneyFormat(inputPrice * quantity || 0)}</span>
            );
          }
          if (attr === "totalPriceDetail") {
            const price = record.values["price"];
            const quantity = record.values["quantity"];

            return <span>{vietnamMoneyFormat(price * quantity || 0)}</span>;
          }

          return attr === "quantity" ||
            attr === "price" ||
            attr === "inputPrice" ? (
            <InputNumber
              min={0}
              value={record.values[attr]}
              formatter={(value) => inputNumberFormatter(value)}
              parser={(value) => inputNumberParse(value)}
              disabled={!record.baseId || type === "detail"}
              required
              onChange={(value) => {
                setRows((prev) =>
                  prev.map((row) =>
                    row.key === record.key
                      ? {
                          ...row,
                          values: {
                            ...row.values,
                            [attr]: value,
                          },
                        }
                      : row,
                  ),
                );
              }}
            />
          ) : (
            <TextArea
              value={record.values[attr]}
              disabled={!record.baseId || type === "detail"}
              onChange={(e) => {
                setRows((prev) =>
                  prev.map((row) =>
                    row.key === record.key
                      ? {
                          ...row,
                          values: {
                            ...row.values,
                            [attr]: e.target.value,
                          },
                        }
                      : row,
                  ),
                );
              }}
              required
            />
          );
        },
      });
    });

    return result;
  }, [rows, attributes, base, columnTitles, type]);

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        key: crypto.randomUUID(),
        baseId: undefined,
        values: {},
      },
    ]);
  };
  const handleRemoveRow = () => {
    setRows((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    if (data.length > 0) {
      setRows(data);
    }
  }, []);
  useEffect(() => {
    onChange?.(rows);
  }, [rows]);

  return (
    <>
      {type !== "detail" && (
        <div className="buttons">
          <button
            type="button"
            className="btn secondary-btn margin-r"
            onClick={handleAddRow}
          >
            Thêm dòng
          </button>
          <button
            type="button"
            className="btn secondary-btn"
            onClick={handleRemoveRow}
          >
            Xoá dòng
          </button>
        </div>
      )}
      <Table<TableInputComponentRowData>
        rowKey="key"
        pagination={false}
        columns={columns}
        dataSource={rows}
        className="table-actions"
      />
    </>
  );
};

export default TableInputComponent;
