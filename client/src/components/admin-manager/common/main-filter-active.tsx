import { type Dispatch, type SetStateAction } from "react";
import { type SelectProps } from "antd";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomFilterFind from "../../common/filter-find";
import CustomFilterSelect from "../../common/filter-select";
import { RotateCcw } from "lucide-react";

// Admin - Manager Main Filter Active Props
type AdminManagerMainFilterActiveProps = {
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

// Admin - Manager Main Filter Active
const AdminManagerMainFilterActive: React.FC<
  AdminManagerMainFilterActiveProps
> = ({
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
      <CustomFilterFind
        placeholder="Nhập thông tin cần tìm kiếm"
        className="filter-find"
        selectItems={findOptions}
        findType={filterFindType}
        findValue={filterFindValue}
        setFilterFindType={setFilterFindType}
        setFilterFindValue={setFilterFindValue}
      />
      <CustomFilterSelect
        mode={undefined}
        placeholder={isUseFood ? "Chọn Loại món ăn" : "Chọn Tầng"}
        optionFilterProp="label"
        maxTagCount="responsive"
        className="filter-select filter-floor"
        options={floorOptions}
        filterSelectValue={filterFloorValue}
        setFilterSelectValue={setFilterFloorValue}
      />
      <CustomFilterSelect
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

export default AdminManagerMainFilterActive;
