import { useEffect, useState, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faLock,
  faPenToSquare,
  faPlus,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { Form, Input, InputNumber, Select, Tag } from "antd";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { CategoryTablesType } from "../../../common/types";
import { CustomPaginationProps } from "../../../common/pagination-props";
import CustomFindInput from "../../../components/admin/find-input";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomTableActions from "../../../components/admin/table-actions";
import CustomModal from "../../../components/admin/modal";
import TextArea from "antd/es/input/TextArea";
import { ruleRequired } from "../../../common/rules";
import { openNotification } from "../../../utils/showNotification";
import {
  FindAllCategoryTable,
  HandleCreateCategoryTable,
  HandleLockCategoryTable,
  HandleUpdateCategoryTable,
} from "../../../services/api";
import { openConfirmation } from "../../../utils/showConfirmation";
import { CommonStatus } from "../../../common/values";

// Các giá trị chung
// - Loại phụ thu
const percent = "Phần trăm hoá đơn";
const fixed = "Tiền cố định";

// Admin Category Tables Page
const AdminCategoryTablesPage = () => {
  // Cấu hình cột bảng dữ liệu của Loại bàn ăn
  const [loading, setLoading] = useState<boolean>(false);
  const columns: ColumnsType<CategoryTablesType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: "12%",
    },
    {
      title: "Tên loại bàn ăn",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: "30%",
    },
    {
      title: "Loại phụ thu",
      dataIndex: "surchargeType",
      key: "surchargeType",
      sorter: true,
      width: "17%",
    },
    {
      title: "Giá trị phụ thu",
      dataIndex: "surchargeValue",
      key: "surchargeValue",
      sorter: true,
      width: "17%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (status: string) => (
        <Tag color={status === CommonStatus["active"] ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      width: "12%",
      render: (text: any, record: CategoryTablesType, index: number) => (
        <>
          <button
            className="action info"
            onClick={() =>
              updatePropertiesModal(
                "Chi tiết loại bàn ăn",
                true,
                "60%",
                "info category-tables",
                AdminCategoryTablesModal.detail(record)
              )
            }
          >
            <FontAwesomeIcon icon={faCircleInfo} />
          </button>
          <button
            className="action update margin-lr"
            onClick={() =>
              updatePropertiesModal(
                "Cập nhật loại bàn ăn",
                true,
                "60%",
                "update category-tables",
                AdminCategoryTablesModal.update(record)
              )
            }
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button
            className="action lock"
            onClick={() =>
              updatePropertiesModal(
                (record.status == CommonStatus["active"] ? "Khoá" : "Mở khoá") +
                " loại bàn ăn",
                true,
                "30%",
                "lock category-tables",
                AdminCategoryTablesModal.lock(
                  record!.id as number,
                  record!.status
                )
              )
            }
          >
            <FontAwesomeIcon
              icon={record.status == CommonStatus["active"] ? faLock : faUnlock}
            />
          </button>
        </>
      ),
    },
  ];
  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  const [categoryTables, setCategoryTables] = useState<CategoryTablesType[]>(
    []
  );
  const {
    currentItems,
    handleTableChange,
    paginationProps,
    sortField,
    sortOrder,
  } = CustomPaginationProps(
    categoryTables,
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
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
  // - Loại phụ thu
  const surchargeTypeOptions: SelectProps["options"] = [
    { label: percent, value: percent },
    { label: fixed, value: fixed },
  ];
  const [filterSurchargeTypeValue, setFilterSurchargeTypeValue] = useState<
    string[] | null
  >(null);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: CommonStatus["active"], value: CommonStatus["active"] },
    { label: CommonStatus["inactive"], value: CommonStatus["inactive"] },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null
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
    id: "Mã loại bàn ăn",
    name: "Tên loại bàn ăn",
    surchargeType: "Loại phụ thu",
    surchargeValue: "Giá trị phụ thu",
    description: "Mô tả",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "",
    id: "Được xác định sau khi xác nhận thêm !",
    name: "Nhập Tên loại bàn ăn",
    surchargeType: "Loại phụ thu",
    surchargeValue: "Giá trị phụ thu",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
  };
  // - Các modal tương ứng cho từng chức năng
  const DetailCategoryTables = ({
    id,
    name,
    surchargeType,
    surchargeValue,
    description,
    status,
  }: CategoryTablesType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: id!,
            name: name!,
            surchargeType: surchargeType!,
            surchargeValue: surchargeValue!,
            description: description!,
            status: status!,
          }}
          className="modal__form split-2"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled={true} />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels["name"]}
                className="modal__form-group-item"
              >
                <Input disabled={true} />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels["description"]}
                className="modal__form-group-item multiple-2 margin-bottom-0"
              >
                <TextArea className="multiple-2" disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="status"
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <Select disabled={true} />
              </Form.Item>
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="surchargeType"
                  label={defaultLabels["surchargeType"]}
                  className="modal__form-group-item"
                >
                  <Select disabled={true} />
                </Form.Item>
                <Form.Item
                  name="surchargeValue"
                  label={defaultLabels["surchargeValue"]}
                  className="modal__form-group-item"
                >
                  <InputNumber disabled={true} />
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const CreateCategoryTables = ({ }) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          className="modal__form split-2"
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']"
            );

            // Thêm class 'active' thể hiện nút đang được nhấn
            submitButton?.classList.add("active");

            // Hỏi trước khi xử khi xử lý ?
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn thêm ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Danh sách dữ liệu
              const values = form.getFieldsValue();

              // Gọi api xử lý
              const res = await HandleCreateCategoryTable({
                name: values!.name || undefined,
                surchargeType: values!.surchargeType || undefined,
                surchargeValue: values!.surchargeValue || undefined,
                description: values!.description || undefined,
                status: values!.status || undefined,
              });
              if (res.status === 200) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: "Thêm thành công !",
                  duration: 1.5,
                });

                setTimeout(() => {
                  getAllCategoryTable();
                  setOpenModal(false);
                }, 1500);
              } else {
                openNotification({
                  type: "error",
                  message: "Thất bại",
                  description: "Thêm thất bại !",
                  duration: 1.5,
                });

                setTimeout(() => {
                  // Xoá class 'active' thể hiện nút không còn được nhấn
                  submitButton?.classList.remove("active");
                }, 1500);
              }
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <Input
                  placeholder={defaultInputs["id"]}
                  className="text-center"
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels["name"]}
                htmlFor="create-name"
                className="modal__form-group-item"
                rules={[ruleRequired("Tên loại bàn không được để trống !")]}
              >
                <Input id="create-name" placeholder={defaultInputs["name"]} />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels["description"]}
                htmlFor="create-description"
                className="modal__form-group-item multiple-2"
              >
                <TextArea
                  id="create-description"
                  className="multiple-2"
                  placeholder={defaultInputs["description"]}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="status"
                label={defaultLabels["status"]}
                htmlFor="create-status"
                className="modal__form-group-item"
                rules={[ruleRequired("Trạng thái không được để trống !")]}
              >
                <Select
                  allowClear={true}
                  id="create-status"
                  placeholder={defaultInputs["status"]}
                  options={[
                    {
                      label: CommonStatus["active"],
                      value: CommonStatus["active"],
                    },
                    {
                      label: CommonStatus["inactive"],
                      value: CommonStatus["inactive"],
                    },
                  ]}
                />
              </Form.Item>
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="surchargeType"
                  label={defaultLabels["surchargeType"]}
                  htmlFor="create-surchargeType"
                  className="modal__form-group-item"
                >
                  <Select
                    allowClear={true}
                    id="create-surchargeType"
                    placeholder={defaultInputs["surchargeType"]}
                    options={[
                      { label: percent, value: percent },
                      { label: fixed, value: fixed },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="surchargeValue"
                  label={defaultLabels["surchargeValue"]}
                  htmlFor="create-surchargeValue"
                  className="modal__form-group-item"
                >
                  <InputNumber
                    min={0}
                    id="create-surchargeValue"
                    placeholder={defaultInputs["surchargeValue"]}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn create">
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const UpdateCategoryTables = ({
    id,
    name,
    surchargeType,
    surchargeValue,
    description,
    status,
  }: CategoryTablesType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: id!,
            name: name!,
            surchargeType: surchargeType!,
            surchargeValue: surchargeValue!,
            description: description!,
            status: status!,
          }}
          className="modal__form split-2"
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']"
            );

            // Thêm class 'active' thể hiện nút đang được nhấn
            submitButton?.classList.add("active");

            // Hỏi trước khi xử khi xử lý ?
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn cập nhật ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Danh sách dữ liệu
              const values = form.getFieldsValue();

              // Gọi api xử lý
              const res = await HandleUpdateCategoryTable({
                id: values!.id,
                name: values!.name || undefined,
                surchargeType: values!.surchargeType || undefined,
                surchargeValue: values!.surchargeValue || undefined,
                description: values!.description || undefined,
                timeUpdate: new Date().toISOString(),
              });
              if (res.status === 200) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: "Cập nhật thành công !",
                  duration: 1.5,
                });

                setTimeout(() => {
                  getAllCategoryTable();
                  setOpenModal(false);
                }, 1500);
              } else {
                openNotification({
                  type: "error",
                  message: "Thất bại",
                  description: "Cập nhật thất bại !",
                  duration: 1.5,
                });

                setTimeout(() => {
                  // Xoá class 'active' thể hiện nút không còn được nhấn
                  submitButton?.classList.remove("active");
                }, 1500);
              }
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled={true} />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels["name"]}
                htmlFor="update-name"
                className="modal__form-group-item"
                rules={[ruleRequired("Tên loại bàn không được để trống !")]}
              >
                <Input id="update-name" placeholder={defaultInputs["name"]} />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels["description"]}
                htmlFor="update-description"
                className="modal__form-group-item multiple-2"
              >
                <TextArea
                  id="update-description"
                  className="multiple-2"
                  placeholder={defaultInputs["description"]}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="status"
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <Select disabled={true} />
              </Form.Item>
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="surchargeType"
                  label={defaultLabels["surchargeType"]}
                  htmlFor="update-surchargeType"
                  className="modal__form-group-item"
                >
                  <Select
                    allowClear={true}
                    id="update-surchargeType"
                    placeholder={defaultInputs["surchargeType"]}
                    options={[
                      { label: percent, value: percent },
                      { label: fixed, value: fixed },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="surchargeValue"
                  label={defaultLabels["surchargeValue"]}
                  htmlFor="update-surchargeValue"
                  className="modal__form-group-item"
                >
                  <InputNumber
                    min={0}
                    id="update-surchargeValue"
                    placeholder={defaultInputs["surchargeValue"]}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn update">
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const LockCategoryTables = ({
    id,
    status,
  }: {
    id: number;
    status: string | undefined;
  }) => {
    const [form] = Form.useForm();
    const statusValue = status == CommonStatus["active"] ? true : false;

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          className="modal__form"
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']"
            );

            // Thêm class 'active' thể hiện nút đang được nhấn
            submitButton?.classList.add("active");

            // Hỏi trước khi xử khi xử lý ?
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn ${statusValue ? "khoá" : "mở khoá"} ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Gọi api xử lý
              const res = await HandleLockCategoryTable({
                id: id!,
                status: status! || undefined,
                timeUpdate: new Date().toISOString(),
              });
              if (res.status == 200) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: `${statusValue ? "Khoá" : "Mở khoá"
                    } thành công !`,
                  duration: 1.5,
                });

                setTimeout(() => {
                  getAllCategoryTable();
                  setOpenModal(false);
                }, 1500);
              } else {
                openNotification({
                  type: "error",
                  message: "Thất bại",
                  description: String(res.data),
                  duration: 1.5,
                });

                setTimeout(() => {
                  // Xoá class 'active' thể hiện nút không còn được nhấn
                  submitButton?.classList.remove("active");
                }, 1500);
              }
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
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
              loại bàn ăn có mã đối tượng là <b>{id}</b> ?
            </p>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn lock">
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const AdminCategoryTablesModal = {
    detail: (categoryTables: CategoryTablesType) => (
      <DetailCategoryTables
        id={categoryTables!.id}
        name={categoryTables!.name}
        surchargeType={categoryTables!.surchargeType}
        surchargeValue={categoryTables!.surchargeValue}
        description={categoryTables!.description}
        status={categoryTables!.status}
      />
    ),
    create: () => <CreateCategoryTables />,
    update: (categoryTables: CategoryTablesType) => (
      <UpdateCategoryTables
        id={categoryTables!.id}
        name={categoryTables!.name}
        surchargeType={categoryTables!.surchargeType}
        surchargeValue={categoryTables!.surchargeValue}
        description={categoryTables!.description}
        status={categoryTables!.status}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockCategoryTables id={id} status={status} />
    ),
  };

  // Hàm cập nhật danh sách các loại nguyên liệu (gọi API)
  const getAllCategoryTable = async () => {
    setLoading(true);
    const res = await FindAllCategoryTable({
      findType: filterFindType!,
      findValue: filterFindValue!,
      surchargeTypeValue: filterSurchargeTypeValue!,
      statusValue: filterStatusValue!,
    });
    if (res!.status === 200) {
      setLoading(false);
      setCategoryTables(res!.data);
    } else {
      openNotification({
        type: "error",
        message: "Truy vấn dữ liệu thất bại",
        description: "Lỗi phát sinh khi truy vấn dữ liệu",
        duration: 2,
      });
    }
  };

  //
  useEffect(() => {
    getAllCategoryTable();
  }, []);
  useEffect(() => {
    getAllCategoryTable();
  }, [
    filterFindType,
    filterFindValue,
    filterSurchargeTypeValue,
    filterStatusValue,
  ]);

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h1 className="main__title">Quản lý chỗ ngồi - Loại bàn ăn</h1>
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
            mode={undefined}
            placeholder="Chọn Loại phụ thu"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-surchargeType"
            options={surchargeTypeOptions}
            setFilterSelectValue={setFilterSurchargeTypeValue}
          />
          <CustomFindSelect
            mode={undefined}
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
                "Thêm loại bàn ăn",
                true,
                "60%",
                "create category-tables",
                AdminCategoryTablesModal.create()
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
            rowKey={(record) => record!.id as number}
            data={currentItems}
            loading={loading}
            pagination={paginationProps}
            className="table-actions category-tables"
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

export default AdminCategoryTablesPage;
