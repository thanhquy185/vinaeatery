import { type Dispatch, type SetStateAction } from "react";
import { type SelectProps } from "antd";
import { Plus, RotateCcw } from "lucide-react";
import FilterFindComponent from "../FilterFindComponent";
import FilterSelectComponent from "../FilterSelectComponent";
import { actionIndexes, getActionNameEn } from "../../utils/defaultActionsUtil";

type MainFilterInfoComponentProps = {
  objectName: string;
  findOptions: {
    label: string;
    value: string;
  }[];
  filterFindType: string | null;
  filterFindValue: string | null;
  setFilterFindType: Dispatch<SetStateAction<string | null>>;
  setFilterFindValue: Dispatch<SetStateAction<string | null>>;
  statusOptions: SelectProps["options"];
  filterStatusValue?:
    | { label: string; value: string }
    | { label: string; value: string }[]
    | null
    | undefined;
  isShowFilterStatus?: boolean;
  setFilterStatusValue: Dispatch<SetStateAction<string[] | null>>;
  onClickFilterReset: () => void;
  isShowFilterCreate: boolean;
  onClickFilterCreate: () => void;
};

const MainFilterInfoComponent: React.FC<MainFilterInfoComponentProps> = ({
  objectName,
  findOptions,
  filterFindType,
  filterFindValue,
  setFilterFindType,
  setFilterFindValue,
  statusOptions,
  filterStatusValue,
  isShowFilterStatus = true,
  setFilterStatusValue,
  onClickFilterReset,
  isShowFilterCreate,
  onClickFilterCreate,
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
      {isShowFilterStatus && (
        <FilterSelectComponent
          mode={undefined}
          placeholder="Chọn Trạng thái"
          optionFilterProp="label"
          maxTagCount="responsive"
          className="filter-select status"
          options={statusOptions}
          filterSelectValue={filterStatusValue}
          setFilterSelectValue={setFilterStatusValue}
        />
      )}
      <button className="filter-reset btn" onClick={onClickFilterReset}>
        <RotateCcw />
        <span>Đặt&nbsp;lại</span>
      </button>
      {isShowFilterCreate && (
        <button
          className={
            "filter-create btn " + getActionNameEn(actionIndexes.create)
          }
          onClick={onClickFilterCreate}
        >
          <Plus />
          <span>Thêm&nbsp;{objectName.toLowerCase()}</span>
        </button>
      )}
    </div>
  );
};

export default MainFilterInfoComponent;
