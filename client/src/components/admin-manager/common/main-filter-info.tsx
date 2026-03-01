import { type Dispatch, type SetStateAction } from "react";
import { type SelectProps } from "antd";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomFilterFind from "../../common/filter-find";
import CustomFilterSelect from "../../common/filter-select";
import { actionIndexes, getActionNameEn } from "../../../utils/default-actions";
import { Plus, RotateCcw } from "lucide-react";

// Admin - Manager Main Filter Info Props
type AdminManagerMainFilterInfoProps = {
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

// Admin - Manager Main Filter Info
const AdminManagerMainFilterInfo: React.FC<AdminManagerMainFilterInfoProps> = ({
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
      <CustomFilterFind
        placeholder="Nhập thông tin cần tìm kiếm"
        className="filter-find"
        selectItems={findOptions}
        findType={filterFindType}
        findValue={filterFindValue}
        setFilterFindType={setFilterFindType}
        setFilterFindValue={setFilterFindValue}
      />
      {isShowFilterStatus && (
        <CustomFilterSelect
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

export default AdminManagerMainFilterInfo;
