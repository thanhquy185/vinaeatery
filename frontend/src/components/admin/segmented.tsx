import React from "react";
import { Segmented } from "antd";
import type { SegmentedLabeledOption } from "antd/es/segmented";

// Kiểu dữ liệu các tham số truyền vào
interface CustomSegmentedProps {
  id?: string;
  className?: string;
  options: (string | SegmentedLabeledOption<string>)[];
  setSelectedValue: (value: string) => void;
}

const CustomSegmented: React.FC<CustomSegmentedProps> = ({
  id,
  className,
  options,
  setSelectedValue,
}) => (
  <Segmented
    id={id}
    className={className}
    options={options}
    onChange={(value) => {
      setSelectedValue(value);
    }}
  />
);

export default CustomSegmented;
