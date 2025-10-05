import { Form, Tag, type SelectProps } from "antd";
import { useEffect, useState, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faLock,
  faPenToSquare,
  faPlus,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import type { ShiftsType } from "../../../common/types";
import type { ColumnsType } from "antd/es/table";
import { CustomPaginationProps } from "../../../common/props";
import CustomFindInput from "../../../components/admin/find-input";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomTimeRangePicker from "../../../components/admin/time-ranger-picker";
import CustomTableActions from "../../../components/admin/table-actions";
import CustomTableHasCheckboxes from "../../../components/admin/table-has-checkboxes";
import CustomInput from "../../../components/admin/input";
import CustomSelect from "../../../components/admin/select";
import CustomTimePicker from "../../../components/admin/time-picker";
import CustomModal from "../../../components/admin/modal";

// Các giá trị chung
// - Trạng thái
const active = "Hoạt động";
const inactive = "Tạm dừng";

// Admin Shifts Page
const AdminShiftsPage = () => {
  // Cấu hình cột bảng dữ liệu của Ca làm việc
  const columns: ColumnsType<ShiftsType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: "12%",
    },
    {
      title: "Tên ca làm việc",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: "34%",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "timeStart",
      key: "timeStart",
      sorter: true,
      width: "17%",
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "timeEnd",
      key: "timeEnd",
      sorter: true,
      width: "17%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (status: string) => (
        <Tag color={status === active ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      width: "12%",
      render: (text: any, record: ShiftsType, index: number) => (
        <>
          <button
            className="action info"
            onClick={() =>
              updatePropertiesModal(
                "Chi tiết ca làm việc",
                true,
                "89%",
                "info shifts",
                AdminShiftsModal.detail(record)
              )
            }
          >
            <FontAwesomeIcon icon={faCircleInfo} />
          </button>
          <button
            className="action update margin-lr"
            onClick={() =>
              updatePropertiesModal(
                "Cập nhật ca làm việc",
                true,
                "89%",
                "update shifts",
                AdminShiftsModal.update(record)
              )
            }
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button
            className="action lock"
            onClick={() =>
              updatePropertiesModal(
                (record.status == active ? "Khoá" : "Mở khoá") + " ca làm việc",
                true,
                "30%",
                "lock shifts",
                AdminShiftsModal.lock(record!.id, record!.status)
              )
            }
          >
            <FontAwesomeIcon
              icon={record.status == active ? faLock : faUnlock}
            />
          </button>
        </>
      ),
    },
  ];
  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  const [shifts, setShifts] = useState<ShiftsType[]>([
    {
      id: 1,
      name: "Cả ngày",
      timeStart: "00:00:00",
      timeEnd: "23:59:59",
      status: "Hoạt động",
      shiftDetails: [],
    },
    {
      id: 2,
      name: "Ca sáng 1",
      timeStart: "07:00:00",
      timeEnd: "11:30:00",
      status: "Tạm dừng",
      shiftDetails: [],
    },
  ]);
  const {
    currentItems,
    handleTableChange,
    paginationProps,
    sortField,
    sortOrder,
  } = CustomPaginationProps(shifts, 10, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Tên", value: "name" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  // - Thời gian bắt đầu / Thời gian kết thúc
  const [filterTimeValue, setFilterTimeValue] = useState<[string, string]>();
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: active, value: active },
    { label: inactive, value: inactive },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    []
  );

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const [titleModal, setTitleModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [widthModal, setWidthModal] = useState<string>("");
  const [classNameModal, setClassNameModal] = useState<string>("");
  const [childrenModal, setChildrenModal] = useState<ReactNode>();
  // - Hàm cập nhật
  const updatePropertiesModal = (
    titleModal: string,
    openModal: boolean,
    widthModal: string,
    classNameModal: string,
    childrenModal: ReactNode
  ) => {
    setTitleModal(titleModal);
    setOpenModal(openModal);
    setWidthModal(widthModal);
    setClassNameModal(classNameModal);
    setChildrenModal(childrenModal);
  };
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title1: "Thông tin cơ bản",
    title2: "Nhân viên cố định",
    id: "Mã ca làm việc",
    name: "Tên ca làm việc",
    timeStart: "Thời gian bắt đầu",
    timeEnd: "Thời gian kết thúc",
    status: "Trạng thái",
    shiftDetails: "Chi tiết ca làm việc",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    id: "Được xác định sau khi xác nhận thêm!",
    name: "Nhập Tên ca làm việc",
    timeStart: "Chọn Thời gian bắt đầu",
    timeEnd: "Chọn Thời gian kết thúc",
    status: "Chọn Trạng thái",
    shiftDetails: "",
  };
  // - Các modal tương ứng cho từng chức năng
  const DetailShifts = ({
    id,
    timeStart,
    timeEnd,
    name,
    status,
  }: ShiftsType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{ layout: "vertical" }}
          className="modal__form split-3"
          autoComplete="off"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <CustomInput
                  className="text-center"
                  value={id!}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["name"]}
                className="modal__form-group-item multiple-2"
              >
                <CustomInput value={name!} disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["timeStart"]}
                className="modal__form-group-item"
              >
                <CustomTimePicker value={timeStart!} disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["timeEnd"]}
                className="modal__form-group-item"
              >
                <CustomTimePicker value={timeEnd!} disabled={true} />
              </Form.Item>
              <Form.Item
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <CustomSelect
                  options={[{ label: status!, value: status! }]}
                  value={status!}
                  disabled={true}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["shiftDetails"]}
                htmlFor="create-shiftDetails"
                className="modal__form-group-item multiple-3 margin-bottom-0"
              >
                <CustomTableHasCheckboxes id="create-shiftDetails" />
              </Form.Item>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const CreateShifts = () => {
    const [form] = Form.useForm();
    const [nameValue, setNameValue] = useState<string>();
    const [timeStartValue, setTimeStartValue] = useState<string>();
    const [timeEndValue, setTimeEndValue] = useState<string>();
    const [statusValue, setStatusValue] = useState<string | number>();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{ layout: "vertical" }}
          className="modal__form split-3"
          autoComplete="off"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <CustomInput
                  className="text-center"
                  value={defaultInputs["id"]}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["name"]}
                htmlFor="create-name"
                className="modal__form-group-item multiple-2"
              >
                <CustomInput
                  id="create-name"
                  placeholder={defaultInputs["name"]}
                  setInputValue={setNameValue}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["timeStart"]}
                htmlFor="create-timeStart"
                className="modal__form-group-item"
              >
                <CustomTimePicker
                  id="create-timeStart"
                  placeholder={defaultInputs["timeStart"]}
                  setTimeValue={setTimeStartValue}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["timeEnd"]}
                htmlFor="create-timeEnd"
                className="modal__form-group-item"
              >
                <CustomTimePicker
                  id="create-timeEnd"
                  placeholder={defaultInputs["timeEnd"]}
                  setTimeValue={setTimeEndValue}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["status"]}
                htmlFor="create-status"
                className="modal__form-group-item"
              >
                <CustomSelect
                  id="create-status"
                  placeholder={defaultInputs["status"]}
                  options={[
                    { label: active, value: active },
                    { label: inactive, value: inactive },
                  ]}
                  setSelectValue={setStatusValue}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["shiftDetails"]}
                htmlFor="create-shiftDetails"
                className="modal__form-group-item multiple-3"
              >
                <CustomTableHasCheckboxes id="create-shiftDetails" />
                <div className="buttons">
                  <button className="btn secondary-btn margin-r">
                    Xoá nhân viên
                  </button>
                  <button className="btn secondary-btn">Thêm nhân viên</button>
                </div>
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button className="modal__button btn create">Xác nhận</button>
          </div>
        </Form>
      </>
    );
  };
  const UpdateShifts = ({
    id,
    timeStart,
    timeEnd,
    name,
    status,
  }: ShiftsType) => {
    const [form] = Form.useForm();
    const [nameValue, setNameValue] = useState<string>(name!);
    const [timeStartValue, setTimeStartValue] = useState<string>(timeStart!);
    const [timeEndValue, setTimeEndValue] = useState<string>(timeEnd!);

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{ layout: "vertical" }}
          className="modal__form split-3"
          autoComplete="off"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <CustomInput
                  className="text-center"
                  value={id!}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["name"]}
                htmlFor="update-name"
                className="modal__form-group-item multiple-2"
              >
                <CustomInput
                  id="update-name"
                  placeholder={defaultInputs["name"]}
                  value={nameValue}
                  setInputValue={setNameValue}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["timeStart"]}
                htmlFor="update-timeStart"
                className="modal__form-group-item"
              >
                <CustomTimePicker
                  id="update-timeStart"
                  placeholder={defaultInputs["timeStart"]}
                  value={timeStartValue}
                  setTimeValue={setTimeStartValue}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["timeEnd"]}
                htmlFor="update-timeEnd"
                className="modal__form-group-item"
              >
                <CustomTimePicker
                  id="update-timeEnd"
                  placeholder={defaultInputs["timeEnd"]}
                  value={timeEndValue}
                  setTimeValue={setTimeEndValue}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <CustomSelect
                  options={[{ label: status!, value: status! }]}
                  value={status!}
                  disabled={true}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["shiftDetails"]}
                htmlFor="update-shiftDetails"
                className="modal__form-group-item multiple-3"
              >
                <CustomTableHasCheckboxes id="update-shiftDetails" />
                <div className="buttons">
                  <button className="btn secondary-btn margin-r">
                    Xoá nhân viên
                  </button>
                  <button className="btn secondary-btn">Thêm nhân viên</button>
                </div>
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button className="modal__button btn update">Xác nhận</button>
          </div>
        </Form>
      </>
    );
  };
  const LockShifts = ({
    id,
    status,
  }: {
    id: number;
    status: string | undefined;
  }) => {
    const [form] = Form.useForm();
    const statusValue = status == active ? true : false;

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{ layout: "vertical" }}
          className="modal__form"
        >
          <div className="modal__form-image">
            <img
              src={
                statusValue
                  ? "/src/assets/images/others/lock-icon.png"
                  : "/src/assets/images/others/unlock-icon.png"
              }
              alt=""
            />
          </div>
          <div className="modal__form-content">
            <p>
              Bạn có xác nhận rằng <b>{statusValue ? "khoá" : "mở khoá"}</b> ca
              làm việc có mã đối tượng là <b>{id}</b> ?
            </p>
          </div>
          <div className="modal__buttons">
            <button className="modal__button btn lock">Xác nhận</button>
          </div>
        </Form>
      </>
    );
  };
  const AdminShiftsModal = {
    detail: (shift: ShiftsType) => (
      <DetailShifts
        id={shift!.id}
        timeStart={shift!.timeStart}
        timeEnd={shift!.timeEnd}
        name={shift!.name}
        status={shift!.status}
        shiftDetails={shift!.shiftDetails}
      />
    ),
    create: () => <CreateShifts />,
    update: (shift: ShiftsType) => (
      <UpdateShifts
        id={shift!.id}
        timeStart={shift!.timeStart}
        timeEnd={shift!.timeEnd}
        name={shift!.name}
        status={shift!.status}
        shiftDetails={shift!.shiftDetails}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockShifts id={id} status={status} />
    ),
  };

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h1 className="main__title">Quản lý nhân sự - Ca làm việc</h1>
        </div>
        <div className="main__filter">
          <CustomFindInput
            selectItems={findOptions}
            placeholder="Nhập thông tin cần tìm kiếm"
            defaultValue=""
            className="main__filter-find"
            setFilterFindType={setFilterFindType}
            setFilterFindValue={setFilterFindValue}
          />
          <CustomTimeRangePicker
            showNow={true}
            placeholder={["Bắt đầu", "Kết thúc"]}
            className="main__filter-select filter-time"
            setTimeRangerValue={setFilterTimeValue}
          />
          <CustomFindSelect
            mode="tags"
            placeholder="Chọn Trạng thái"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-status"
            options={statusOptions}
            setFilterSelectValue={setFilterStatusValue}
          />
          <button
            className={
              "main__filter-button btn create" +
              (openModal &&
                String(titleModal).includes("Thêm") &&
                String(classNameModal).includes("create")
                ? " active"
                : "")
            }
            onClick={() =>
              updatePropertiesModal(
                "Thêm ca làm việc",
                true,
                "89%",
                "create shifts",
                AdminShiftsModal.create()
              )
            }
          >
            <FontAwesomeIcon icon={faPlus} className="icon" />
            &nbsp;Thêm
          </button>
        </div>
        <div className="main__table">
          <CustomTableActions
            columns={columns}
            rowKey={(record) => record.id}
            data={currentItems}
            pagination={paginationProps}
            className="table-actions shifts"
            onChange={handleTableChange}
          />
        </div>
      </main>
      {openModal && (
        <CustomModal
          title={titleModal}
          openModal={openModal}
          setOpenModal={() => setOpenModal(false)}
          width={widthModal}
          className={classNameModal}
          children={childrenModal}
        />
      )}
    </>
  );
};

export default AdminShiftsPage;
