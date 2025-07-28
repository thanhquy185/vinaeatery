import { useEffect, useState, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faLock,
  faPenToSquare,
  faPlus,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { Form, Tag, type SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { RewardPunishesType } from "../../../common/types";
import { CustomPaginationProps } from "../../../common/props";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomFindInput from "../../../components/admin/find-input";
import CustomDateRangePicker from "../../../components/admin/date-ranger-picker";
import CustomTableActions from "../../../components/admin/table-actions";
import CustomInput from "../../../components/admin/input";
import CustomModal from "../../../components/admin/modal";
import { vietnamMoneyFormat } from "../../../utils/otherEvents";
import CustomSelect from "../../../components/admin/select";
import CustomInputNumber from "../../../components/admin/input-number";
import CustomDatePicker from "../../../components/admin/date-picker";
import CustomTextArea from "../../../components/admin/text-area";

// Các giá trị chung
// - Trạng thái
const confirm = "Xác nhận";
const cancel = "Huỷ bỏ";

// Admin Reward Punishes Page
const AdminRewardPunishesPage = () => {
  // Cấu hình cột bảng dữ liệu của thưởng phạt
  const columns: ColumnsType<RewardPunishesType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: "10%",
    },
    {
      title: "Nhân viên nhận",
      key: "employeeMain",
      sorter: true,
      width: "20%",
      render: (record) =>
        `#${record.employeeMain?.id} - ${record.employeeMain?.fullname}`,
    },
    {
      title: "Loại thưởng phạt",
      key: "categoryRewardPunishes",
      sorter: true,
      width: "20%",
      render: (record) =>
        `#${record.categoryRewardPunishes?.id} - ${record.categoryRewardPunishes?.name}`,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      sorter: true,
      width: "10%",
    },
    {
      title: "Số tiền (VNĐ)",
      dataIndex: "money",
      key: "money",
      sorter: true,
      width: "20%",
      render: (money: number) => vietnamMoneyFormat(money),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: string) => (
        <Tag color={status === confirm ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      width: "10%",
      render: (text: any, record: RewardPunishesType, index: number) => (
        <>
          <button
            className="action info"
            onClick={() =>
              updatePropertiesModal(
                "Chi tiết thưởng phạt",
                true,
                "60%",
                "info rewardPunishesTypes",
                AdminRewardPunishesModal.detail(record)
              )
            }
          >
            <FontAwesomeIcon icon={faCircleInfo} />
          </button>
          <button
            className="action update margin-lr"
            onClick={() =>
              updatePropertiesModal(
                "Cập nhật thưởng phạt",
                true,
                "60%",
                "update rewardPunishesTypes",
                AdminRewardPunishesModal.update(record)
              )
            }
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button
            className="action lock"
            onClick={() =>
              updatePropertiesModal(
                (record.status == confirm ? "Khoá" : "Mở khoá") +
                " thưởng phạt",
                true,
                "30%",
                "lock rewardPunishes",
                AdminRewardPunishesModal.lock(record!.id, record!.status)
              )
            }
          >
            <FontAwesomeIcon
              icon={record.status == confirm ? faLock : faUnlock}
            />
          </button>
        </>
      ),
    },
  ];

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  const [shifts, setShifts] = useState<RewardPunishesType[]>([
    {
      id: 1,
      employeeMain: {
        id: 1,
        fullname: "Thanh Quy",
      },
      categoryRewardPunishes: {
        id: 2,
        name: "Đi trễ",
        handle: "Phạt",
        description: "Đi trễ trừ 50.000đ",
      },
      date: "2025-06-16",
      money: 2500000,
      reason: "Đi trễ 2 phút vào ca sáng thứ 2",
      employeeCheck: {
        id: 2,
        fullname: "Thanh Huy",
      },
      status: "Xác nhận",
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
    { label: "Nhân viên", value: "employeeId" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  // - Trạng thái
  const categoryRewardPunishesOptions: SelectProps["options"] = [
    { label: "Đi làm trễ", value: 1 },
    { label: "Đi làm đủ tháng", value: 2 },
  ];
  const [
    filterCategoryRewardPunishesValue,
    setFilterCategoryRewardPunishesValue,
  ] = useState<string[] | null>([]);
  // - Ngày bắt đầu / Ngày kết thúc
  const [filterDateValue, setFilterDateValue] = useState<[string, string]>();

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
    title: "Thông tin cơ bản",
    id: "Mã thưởng phạt",
    employeeMain: "Nhân viên nhận",
    categoryRewardPunishes: "Loại thưởng phạt",
    date: "Ngày",
    money: "Số tiền (VNĐ)",
    reason: "Lí do",
    employeeCheck: "Nhân viên duyệt",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "",
    id: "Được xác định sau khi xác nhận thêm !",
    employeeMain: "Chọn Nhân viên nhận",
    categoryRewardPunishes: "Chọn Loại thưởng phạt",
    date: "Chọn Ngày",
    money: "Nhập Số tiền (VNĐ)",
    reason: "Nhập Lí do",
    employeeCheck: "Chọn Nhân viên duyệt",
    status: "Chọn Trạng thái",
  };
  // - Các modal tương ứng cho từng chức năng
  const DetailRewardPunishes = ({
    id,
    employeeMain,
    categoryRewardPunishes,
    date,
    money,
    reason,
    employeeCheck,
    status,
  }: RewardPunishesType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{ layout: "vertical" }}
          className="modal__form split-2"
          autoComplete="off"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title"]}</p>
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
                label={defaultLabels["categoryRewardPunishes"]}
                className="modal__form-group-item"
              >
                <CustomSelect
                  options={[
                    {
                      label: categoryRewardPunishes!.name,
                      value: categoryRewardPunishes!.id,
                    },
                  ]}
                  className="rewardPunishes"
                  value={categoryRewardPunishes!.id}
                  disabled={true}
                />
              </Form.Item>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  label={defaultLabels["date"]}
                  className="modal__form-group-item"
                >
                  <CustomDatePicker value={date!} disabled={true} />
                </Form.Item>
                <Form.Item
                  label={defaultLabels["money"]}
                  className="modal__form-group-item"
                >
                  <CustomInputNumber value={money!} disabled={true} />
                </Form.Item>
              </div>
              <Form.Item
                label={defaultLabels["status"]}
                className="modal__form-group-item margin-bottom-0"
              >
                <CustomSelect
                  options={[
                    {
                      label: status!,
                      value: status!,
                    },
                  ]}
                  value={status!}
                  disabled={true}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["employeeMain"]}
                className="modal__form-group-item"
              >
                <CustomSelect
                  options={[
                    {
                      label: employeeMain!.fullname,
                      value: employeeMain!.id,
                    },
                  ]}
                  className="employees"
                  value={employeeMain!.id}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["employeeCheck"]}
                className="modal__form-group-item"
              >
                <CustomSelect
                  options={[
                    {
                      label: employeeCheck!.fullname,
                      value: employeeCheck!.id,
                    },
                  ]}
                  className="employees"
                  value={employeeCheck!.id}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["reason"]}
                className="modal__form-group-item margin-bottom-0"
              >
                <CustomTextArea
                  className="multiple-2"
                  value={reason!}
                  disabled={true}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const CreateRewardPunishes = () => {
    const [form] = Form.useForm();
    const [employeeMainValue, setEmployeeMainValue] = useState<
      string | number
    >();
    const [categoryRewardPunishesValue, setCategoryRewardPunishesValue] =
      useState<string | number>();
    const [dateValue, setDateValue] = useState<string | string[]>();
    const [moneyValue, setMoneyValue] = useState<number>();
    const [reasonValue, setReasonValue] = useState<string>();
    const [employeeCheckValue, setEmployeeCheckValue] = useState<
      string | number
    >(0);
    const [statusValue, setStatusValue] = useState<string | number>();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{ layout: "vertical" }}
          className="modal__form split-2"
          autoComplete="off"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title"]}</p>
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
                label={defaultLabels["categoryRewardPunishes"]}
                htmlFor="create-categoryRewardPunishes"
                className="modal__form-group-item"
              >
                <CustomSelect
                  id="create-categoryRewardPunishes"
                  placeholder={defaultInputs["categoryRewardPunishes"]}
                  options={[
                    { label: "Đi trễ", value: 1 },
                    { label: "Đi làm đủ cả tháng", value: 2 },
                  ]}
                  className="rewardPunishes"
                  setSelectValue={setCategoryRewardPunishesValue}
                />
              </Form.Item>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  label={defaultLabels["date"]}
                  htmlFor="create-date"
                  className="modal__form-group-item"
                >
                  <CustomDatePicker
                    id="create-date"
                    placeholder={defaultInputs["date"]}
                    setDatePickerValue={setDateValue}
                  />
                </Form.Item>
                <Form.Item
                  label={defaultLabels["money"]}
                  htmlFor="create-money"
                  className="modal__form-group-item"
                >
                  <CustomInputNumber
                    id="create-money"
                    placeholder={defaultInputs["money"]}
                    setInputValue={setMoneyValue}
                  />
                </Form.Item>
              </div>
              <Form.Item
                label={defaultLabels["status"]}
                htmlFor="create-status"
                className="modal__form-group-item"
              >
                <CustomSelect
                  id="create-status"
                  placeholder={defaultInputs["status"]}
                  options={[
                    { label: confirm, value: confirm },
                    { label: cancel, value: cancel },
                  ]}
                  setSelectValue={setStatusValue}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["employeeMain"]}
                htmlFor="create-employeeMain"
                className="modal__form-group-item"
              >
                <CustomSelect
                  id="create-employeeMain"
                  placeholder={defaultInputs["employeeMain"]}
                  options={[
                    { label: "Thanh Quy", value: 1 },
                    { label: "Thanh Huy", value: 2 },
                  ]}
                  className="employees"
                  setSelectValue={setEmployeeMainValue}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["employeeCheck"]}
                htmlFor="create-employeeCheck"
                className="modal__form-group-item"
              >
                <CustomSelect
                  id="create-employeeCheck"
                  placeholder={defaultInputs["employeeCheck"]}
                  value={0}
                  options={[
                    { label: "Xử lý khi đăng nhập tài khoản", value: 0 },
                  ]}
                  className="employees"
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["reason"]}
                htmlFor="create-reason"
                className="modal__form-group-item"
              >
                <CustomTextArea
                  id="create-reason"
                  placeholder={defaultInputs["reason"]}
                  className="multiple-2"
                  setTextAreaValue={setReasonValue}
                />
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
  const UpdateRewardPunishes = ({
    id,
    employeeMain,
    categoryRewardPunishes,
    date,
    money,
    reason,
    employeeCheck,
    status,
  }: RewardPunishesType) => {
    const [form] = Form.useForm();
    const [dateValue, setDateValue] = useState<string | string[]>(date!);
    const [moneyValue, setMoneyValue] = useState<number>(money!);
    const [reasonValue, setReasonValue] = useState<string>(reason!);

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{ layout: "vertical" }}
          className="modal__form split-2"
          autoComplete="off"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title"]}</p>
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
                label={defaultLabels["categoryRewardPunishes"]}
                className="modal__form-group-item"
              >
                <CustomSelect
                  options={[
                    {
                      label: categoryRewardPunishes!.name,
                      value: categoryRewardPunishes!.id,
                    },
                  ]}
                  className="rewardPunishes"
                  value={categoryRewardPunishes!.id}
                  disabled={true}
                />
              </Form.Item>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  label={defaultLabels["date"]}
                  htmlFor="create-date"
                  className="modal__form-group-item"
                >
                  <CustomDatePicker
                    id="create-date"
                    placeholder={defaultInputs["date"]}
                    value={dateValue as string}
                    setDatePickerValue={setDateValue}
                  />
                </Form.Item>
                <Form.Item
                  label={defaultLabels["money"]}
                  htmlFor="create-money"
                  className="modal__form-group-item"
                >
                  <CustomInputNumber
                    id="create-money"
                    placeholder={defaultInputs["money"]}
                    value={moneyValue}
                    setInputValue={setMoneyValue}
                  />
                </Form.Item>
              </div>
              <Form.Item
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <CustomSelect
                  options={[
                    {
                      label: status!,
                      value: status!,
                    },
                  ]}
                  value={status!}
                  disabled={true}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["employeeMain"]}
                className="modal__form-group-item"
              >
                <CustomSelect
                  options={[
                    { label: employeeMain!.fullname, value: employeeMain!.id },
                  ]}
                  className="employees"
                  value={employeeMain!.id}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["employeeCheck"]}
                className="modal__form-group-item"
              >
                <CustomSelect
                  options={[
                    {
                      label: employeeCheck!.fullname,
                      value: employeeCheck!.id,
                    },
                  ]}
                  className="employees"
                  value={employeeCheck!.id}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["reason"]}
                htmlFor="create-reason"
                className="modal__form-group-item"
              >
                <CustomTextArea
                  id="create-reason"
                  placeholder={defaultInputs["reason"]}
                  className="multiple-2"
                  value={reasonValue}
                  setTextAreaValue={setReasonValue}
                />
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
    const statusValue = status == confirm ? true : false;

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
              Bạn có xác nhận rằng <b>{statusValue ? "khoá" : "mở khoá"}</b>{" "}
              thưởng phạt có mã đối tượng là <b>{id}</b> ?
            </p>
          </div>
          <div className="modal__buttons">
            <button className="modal__button btn lock">Xác nhận</button>
          </div>
        </Form>
      </>
    );
  };
  const AdminRewardPunishesModal = {
    detail: (rewardPunish: RewardPunishesType) => (
      <DetailRewardPunishes
        id={rewardPunish!.id}
        employeeMain={rewardPunish!.employeeMain}
        categoryRewardPunishes={rewardPunish!.categoryRewardPunishes}
        date={rewardPunish!.date}
        money={rewardPunish!.money}
        reason={rewardPunish!.reason}
        employeeCheck={rewardPunish!.employeeCheck}
        status={rewardPunish!.status}
      />
    ),
    create: () => <CreateRewardPunishes />,
    update: (rewardPunish: RewardPunishesType) => (
      <UpdateRewardPunishes
        id={rewardPunish!.id}
        employeeMain={rewardPunish!.employeeMain}
        categoryRewardPunishes={rewardPunish!.categoryRewardPunishes}
        date={rewardPunish!.date}
        money={rewardPunish!.money}
        reason={rewardPunish!.reason}
        employeeCheck={rewardPunish!.employeeCheck}
        status={rewardPunish!.status}
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
          <h1 className="main__title">Quản lý nhân sự - Thưởng phạt</h1>
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

          <CustomFindSelect
            mode="tags"
            placeholder="Chọn Loại thưởng phạt"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-categoryRewardPunishes"
            options={categoryRewardPunishesOptions}
            setFilterSelectValue={setFilterCategoryRewardPunishesValue}
          />
          <CustomDateRangePicker
            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            className="main__filter-select filter-date"
            setDateRangeValue={setFilterDateValue}
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
                "Thêm thưởng phạt",
                true,
                "60%",
                "create RewardPunishesTypes",
                AdminRewardPunishesModal.create()
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
            className="table-actions rewardPunishes"
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

export default AdminRewardPunishesPage;
