import FilterFindComponent from "../FilterFindComponent";
import FilterSelectComponent from "../FilterSelectComponent";
import { RotateCcw } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { SelectProps } from "antd";

type MainFilterActiveComponentProps = {
  isUseFood?: boolean;
  findOptions: {
    label: string;
    value: string;
  }[];
  filterFindType: string | null;
  filterFindValue: string | null;
  setFilterFindType: Dispatch<SetStateAction<string | null>>;
  setFilterFindValue: Dispatch<SetStateAction<string | null>>;
  floorOptions: SelectProps["options"];
  filterFloorValue?:
    | { label: string; value: string }
    | { label: string; value: string }[]
    | null
    | undefined;
  setFilterFloorValue: Dispatch<SetStateAction<string[] | null>>;
  statusOptions: SelectProps["options"];
  filterStatusValue?:
    | { label: string; value: string }
    | { label: string; value: string }[]
    | null
    | undefined;
  setFilterStatusValue: Dispatch<SetStateAction<string[] | null>>;
  onClickFilterReset: () => void;
};

const MainFilterActiveComponent: React.FC<MainFilterActiveComponentProps> = ({
  isUseFood = false,
  findOptions,
  filterFindType,
  filterFindValue,
  setFilterFindType,
  setFilterFindValue,
  floorOptions,
  filterFloorValue,
  setFilterFloorValue,
  statusOptions,
  filterStatusValue,
  setFilterStatusValue,
  onClickFilterReset,
}) => {
  return (
    <div className="admin-manager-main__filter">
      <FilterFindComponent
        placeholder="Nhập thông tin cần tìm kiếm"
        className="filter-find"
        selectItems={findOptions}
        findType={filterFindType}
        findValue={filterFindValue}
        setFilterFindType={setFilterFindType}
        setFilterFindValue={setFilterFindValue}
      />
      <FilterSelectComponent
        mode={undefined}
        placeholder={isUseFood ? "Chọn Loại món ăn" : "Chọn Tầng"}
        optionFilterProp="label"
        maxTagCount="responsive"
        className="filter-select filter-floor"
        options={floorOptions}
        filterSelectValue={filterFloorValue}
        setFilterSelectValue={setFilterFloorValue}
      />
      <FilterSelectComponent
        mode={undefined}
        placeholder="Chọn Trạng thái"
        optionFilterProp="label"
        maxTagCount="responsive"
        className="filter-select filter-status"
        options={statusOptions}
        filterSelectValue={filterStatusValue}
        setFilterSelectValue={setFilterStatusValue}
      />
      <button className="filter-reset btn" onClick={onClickFilterReset}>
        <RotateCcw />
        <span>Đặt&nbsp;lại</span>
      </button>
    </div>
  );
};

export default MainFilterActiveComponent;
