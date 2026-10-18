import React from "react";
import { Segmented } from "antd";
import type { SegmentedLabeledOption } from "antd/es/segmented";

// Kiểu dữ liệu các tham số truyền vào
interface SegmentedComponentProps {
  id?: string;
  className?: string;
  options: (string | SegmentedLabeledOption<string>)[];
  setSelectedValue: (value: string) => void;
}

const SegmentedComponent: React.FC<SegmentedComponentProps> = ({
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

export default SegmentedComponent;
