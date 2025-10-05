import { Form, Tag, type SelectProps } from "antd";
import { useState, type ReactNode } from "react";
import CustomFindInput from "../../../components/admin/find-input";
import CustomFindSelect from "../../../components/admin/find-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faLock,
  faPenToSquare,
  faPlus,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import CustomTableActions from "../../../components/admin/table-actions";
import type { CategoryRewardPunishesType } from "../../../common/types";
import { CustomPaginationProps } from "../../../common/props";
import type { ColumnsType } from "antd/es/table";
import CustomModal from "../../../components/admin/modal";
import CustomInput from "../../../components/admin/input";
import CustomSelect from "../../../components/admin/select";
import CustomTextArea from "../../../components/admin/text-area";

// Các giá trị chung
// - Xử lý
const reward = "Thưởng";
const punish = "Phạt";
// - Trạng thái
const active = "Hoạt động";
const inactive = "Tạm dừng";

// Admin Category Reward Punishes Page
const AdminCategoryRewardPunishesPage = () => {
  // Cấu hình cột bảng dữ liệu của loại thưởng phạt
  const columns: ColumnsType<CategoryRewardPunishesType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: "15%",
    },
    {
      title: "Tên loại thưởng phạt",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: "35%",
    },
    {
      title: "Xử lý",
      dataIndex: "handle",
      key: "handle",
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "20%",
      render: (status: string) => (
        <Tag color={status === active ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      width: "10%",
      render: (
        text: any,
        record: CategoryRewardPunishesType,
        index: number
      ) => (
        <>
          <button
            className="action info"
            onClick={() =>
              updatePropertiesModal(
                "Chi tiết loại thưởng phạt",
                true,
                "60%",
                "info categoryRewardPunishes",
                AdminCategoryRewardPunishesModal.detail(record)
              )
            }
          >
            <FontAwesomeIcon icon={faCircleInfo} />
          </button>
          <button
            className="action update margin-lr"
            onClick={() =>
              updatePropertiesModal(
                "Cập nhật loại thưởng phạt",
                true,
                "60%",
                "update categoryRewardPunishes",
                AdminCategoryRewardPunishesModal.update(record)
              )
            }
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button
            className="action lock"
            onClick={() =>
              updatePropertiesModal(
                (record.status == active ? "Khoá" : "Mở khoá") +
                " loại thưởng phạt",
                true,
                "30%",
                "lock categoryRewardPunishes",
                AdminCategoryRewardPunishesModal.lock(
                  record!.id,
                  record!.status
                )
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
  const [categoryRewardPunishes, setCategoryRewardPunishes] = useState<
    CategoryRewardPunishesType[]
  >([
    {
      id: 1,
      name: "Đi trễ",
      handle: "Phạt",
      description: "Phạt tiền 50.000đ - 200.000đ tuỳ mức độ vi phạm",
      status: "Hoạt động",
    },
  ]);
  const {
    currentItems,
    handleTableChange,
    paginationProps,
    sortField,
    sortOrder,
  } = CustomPaginationProps(
    categoryRewardPunishes,
    10,
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  );

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
  // - Xử lý
  const handleOptions: SelectProps["options"] = [
    { label: reward, value: reward },
    { label: punish, value: punish },
  ];
  const [filterHandleValue, setFilterHandleValue] = useState<string[] | null>(
    []
  );
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
    title: "Thông tin cơ bản",
    id: "Mã loại thưởng phạt",
    name: "Tên loại thưởng phạt",
    handle: "Xử lý",
    description: "Mô tả",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "",
    id: "Được xác định sau khi xác nhận thêm!",
    name: "Nhập Tên loại thưởng phạt",
    handle: "Chọn Xử lý",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
  };
  // - Các modal tương ứng cho từng chức năng
  const DetailCategoryRewardPunishes = ({
    id,
    name,
    handle,
    description,
    status,
  }: CategoryRewardPunishesType) => {
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
                label={defaultLabels["handle"]}
                className="modal__form-group-item"
              >
                <CustomSelect
                  options={[{ label: handle!, value: handle! }]}
                  value={handle!}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["status"]}
                className="modal__form-group-item margin-bottom-0"
              >
                <CustomSelect
                  options={[{ label: status!, value: status! }]}
                  value={status!}
                  disabled={true}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["name"]}
                className="modal__form-group-item"
              >
                <CustomInput value={name!} disabled={true} />
              </Form.Item>
              <Form.Item
                label={defaultLabels["description"]}
                className="modal__form-group-item margin-bottom-0"
              >
                <CustomTextArea
                  className="multiple-2"
                  value={description!}
                  disabled={true}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const CreateCategoryRewardPunishes = () => {
    const [form] = Form.useForm();
    const [nameValue, setNameValue] = useState<string>();
    const [handleValue, setHandleValue] = useState<string | number>();
    const [descriptionValue, setDescriptionValue] = useState<string>();
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
                label={defaultLabels["handle"]}
                htmlFor="create-handle"
                className="modal__form-group-item"
              >
                <CustomSelect
                  id="create-handle"
                  placeholder={defaultInputs["handle"]}
                  options={[
                    { label: reward, value: reward },
                    { label: punish, value: punish },
                  ]}
                  setSelectValue={setHandleValue}
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
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["name"]}
                htmlFor="create-name"
                className="modal__form-group-item"
              >
                <CustomInput
                  id="create-name"
                  placeholder={defaultInputs["name"]}
                  setInputValue={setNameValue}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["description"]}
                htmlFor="create-description"
                className="modal__form-group-item"
              >
                <CustomTextArea
                  id="create-description"
                  className="multiple-2"
                  placeholder={defaultInputs["description"]}
                  setTextAreaValue={setDescriptionValue}
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
  const UpdateCategoryRewardPunishes = ({
    id,
    name,
    handle,
    description,
    status,
  }: CategoryRewardPunishesType) => {
    const [form] = Form.useForm();
    const [nameValue, setNameValue] = useState<string>(name!);
    const [handleValue, setHandleValue] = useState<string | number>(handle!);
    const [descriptionValue, setDescriptionValue] = useState<string>(
      description!
    );

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
                  value={id}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["handle"]}
                htmlFor="create-handle"
                className="modal__form-group-item"
              >
                <CustomSelect
                  id="create-handle"
                  placeholder={defaultInputs["handle"]}
                  options={[
                    { label: reward, value: reward },
                    { label: punish, value: punish },
                  ]}
                  value={handleValue}
                  setSelectValue={setHandleValue}
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
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["name"]}
                htmlFor="create-name"
                className="modal__form-group-item"
              >
                <CustomInput
                  id="create-name"
                  placeholder={defaultInputs["name"]}
                  value={nameValue}
                  setInputValue={setNameValue}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["description"]}
                htmlFor="create-description"
                className="modal__form-group-item"
              >
                <CustomTextArea
                  id="create-description"
                  placeholder={defaultInputs["description"]}
                  className="multiple-2"
                  value={descriptionValue}
                  setTextAreaValue={setDescriptionValue}
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
  const LockCategoryRewardPunishes = ({
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
              Bạn có xác nhận rằng <b>{statusValue ? "khoá" : "mở khoá"}</b>{" "}
              loại thưởng phạt có mã đối tượng là <b>{id}</b> ?
            </p>
          </div>
          <div className="modal__buttons">
            <button className="modal__button btn lock">Xác nhận</button>
          </div>
        </Form>
      </>
    );
  };
  const AdminCategoryRewardPunishesModal = {
    detail: (categoryRewardPunish: CategoryRewardPunishesType) => (
      <DetailCategoryRewardPunishes
        id={categoryRewardPunish!.id}
        name={categoryRewardPunish!.name}
        handle={categoryRewardPunish!.handle}
        description={categoryRewardPunish!.description}
        status={categoryRewardPunish!.status}
      />
    ),
    create: () => <CreateCategoryRewardPunishes />,
    update: (categoryRewardPunish: CategoryRewardPunishesType) => (
      <UpdateCategoryRewardPunishes
        id={categoryRewardPunish!.id}
        name={categoryRewardPunish!.name}
        handle={categoryRewardPunish!.handle}
        description={categoryRewardPunish!.description}
        status={categoryRewardPunish!.status}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockCategoryRewardPunishes id={id} status={status} />
    ),
  };

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">Quản lý nhân sự - Loại thưởng phạt</h2>
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
            placeholder="Chọn Xử lý"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-handle"
            options={handleOptions}
            setFilterSelectValue={setFilterHandleValue}
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
                "Thêm loại thưởng phạt",
                true,
                "60%",
                "create categoryRewardPunishes",
                AdminCategoryRewardPunishesModal.create()
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
            className="table-actions categoryRewardPunishes"
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

export default AdminCategoryRewardPunishesPage;
