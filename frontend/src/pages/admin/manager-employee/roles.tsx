import { useEffect, useState, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faLock,
  faPenToSquare,
  faPlus,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { Form, Input, InputNumber, Select, Tag, type SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { RoleDetailsType, RolesFormatType } from "../../../common/types";
import { CustomPaginationProps } from "../../../common/pagination-props";
import CustomFindInput from "../../../components/admin/find-input";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomTableActions from "../../../components/admin/table-actions";
import CustomTableRoleDetails from "../../../components/admin/table-role-details";
import CustomModal from "../../../components/admin/modal";
import { vietnamMoneyFormat } from "../../../utils/otherEvents";
import {
  FindAllRole,
  HandleCreateRole,
  HandleLockRole,
  HandleUpdateRole,
} from "../../../services/api";
import { openNotification } from "../../../utils/showNotification";
import { commonStatus } from "../../../common/values";
import { openConfirmation } from "../../../utils/showConfirmation";
import { ruleRequired } from "../../../common/rules";

// Admin Roles Page
const AdminRolesPage = () => {
  // // Dữ liệu được load ban đầu
  // const admin = useRouteLoaderData("admin");
  // console.log(admin);

  // Cấu hình cột bảng dữ liệu của Chức vụ
  const [loading, setLoading] = useState<boolean>(false);
  const columns: ColumnsType<RolesFormatType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: "16%",
    },
    {
      title: "Tên chức vụ",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: "34%",
    },
    {
      title: "Lương cơ bản (VNĐ)",
      dataIndex: "salary",
      key: "salary",
      sorter: true,
      width: "20%",
      render: (salary: number) => vietnamMoneyFormat(salary),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "16%",
      render: (status: string) => (
        <Tag color={status === commonStatus["active"] ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      width: "14%",
      render: (text: any, record: RolesFormatType, index: number) => (
        <>
          <button
            className="action info"
            onClick={() =>
              updatePropertiesModal(
                "Chi tiết chức vụ",
                true,
                "60%",
                "info roles",
                AdminRolesModal.detail(record)
              )
            }
          >
            <FontAwesomeIcon icon={faCircleInfo} />
          </button>
          <button
            className="action update margin-lr"
            onClick={() =>
              updatePropertiesModal(
                "Cập nhật chức vụ",
                true,
                "60%",
                "update roles",
                AdminRolesModal.update(record)
              )
            }
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button
            className="action lock"
            onClick={() =>
              updatePropertiesModal(
                (record.status == commonStatus["active"] ? "Khoá" : "Mở khoá") +
                  " chức vụ",
                true,
                "30%",
                "lock roles",
                AdminRolesModal.lock(record!.id as number, record!.status)
              )
            }
          >
            <FontAwesomeIcon
              icon={record.status == commonStatus["active"] ? faLock : faUnlock}
            />
          </button>
        </>
      ),
    },
  ];
  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  const [roles, setRoles] = useState<RolesFormatType[]>([]);
  const {
    currentItems,
    handleTableChange,
    paginationProps,
    sortField,
    sortOrder,
  } = CustomPaginationProps(roles, 10, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

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
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: commonStatus["active"], value: commonStatus["active"] },
    { label: commonStatus["inactive"], value: commonStatus["inactive"] },
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
    title1: "Thông tin cơ bản",
    title2: "Thông tin chức năng",
    id: "Mã chức vụ",
    name: "Tên chức vụ",
    salary: "Lương cơ bản (VNĐ)",
    status: "Trạng thái",
    roleDetails: "Chi tiết chức vụ",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    id: "Nhập Mã chức vụ",
    name: "Nhập Tên chức vụ",
    salary: "Nhập Lương cơ bản (VNĐ)",
    status: "Chọn Trạng thái",
    roleDetails: "",
  };
  // - Các modal tương ứng cho từng chức năng
  const DetailRoles = ({
    id,
    name,
    salary,
    status,
    roleDetails,
  }: RolesFormatType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: id!,
            name: name!,
            salary: salary!,
            status: status!,
          }}
          className="modal__form split-2"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled={true} />
              </Form.Item>
              <Form.Item
                name="salary"
                label={defaultLabels["salary"]}
                className="modal__form-group-item"
              >
                <InputNumber disabled={true} />
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
              <Form.Item
                name="name"
                label={defaultLabels["name"]}
                className="modal__form-group-item"
              >
                <Input disabled={true} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["roleDetails"]}
                htmlFor="detail-roleDetails"
                className="modal__form-group-item multiple-2 margin-bottom-0"
              >
                <CustomTableRoleDetails type="detail" data={roleDetails} />
              </Form.Item>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const CreateRoles = ({}) => {
    const [form] = Form.useForm();
    const [roleDetails, setRoleDetails] = useState<RoleDetailsType[]>([]);

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          className="modal__form split-2"
          autoComplete="off"
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
              const res = await HandleCreateRole({
                name: values!.name || undefined,
                salary: values!.salary || 0,
                status: values!.status || undefined,
                roleDetails: roleDetails || [],
              });
              if (res.status === 200) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: "Thêm thành công !",
                  duration: 1.5,
                });

                setTimeout(() => {
                  getAllRole();
                  setOpenModal(false);
                }, 1500);
              } else {
                console.log(res);
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
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <Input
                  className="text-center"
                  placeholder={defaultInputs["id"]}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                name="salary"
                label={defaultLabels["salary"]}
                htmlFor="create-salary"
                className="modal__form-group-item"
                rules={[ruleRequired("Lương cơ bản không được để trống !")]}
              >
                <InputNumber
                  min={0}
                  id="create-salary"
                  placeholder={defaultInputs["salary"]}
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
                      label: commonStatus["active"],
                      value: commonStatus["active"],
                    },
                    {
                      label: commonStatus["inactive"],
                      value: commonStatus["inactive"],
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels["name"]}
                htmlFor="create-name"
                className="modal__form-group-item"
                rules={[ruleRequired("Tên chức vụ không được để trống !")]}
              >
                <Input id="create-name" placeholder={defaultInputs["name"]} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["roleDetails"]}
                htmlFor="create-roleDetails"
                className="modal__form-group-item multiple-2"
              >
                <CustomTableRoleDetails
                  id="create-roleDetails"
                  setRoleDetails={setRoleDetails}
                />
              </Form.Item>
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
  const UpdateRoles = ({
    id,
    name,
    salary,
    status,
    roleDetails,
  }: RolesFormatType) => {
    const [form] = Form.useForm();
    const [roleDetailsUpdate, setRoleDetailsUpdate] = useState<
      RoleDetailsType[]
    >(
      roleDetails?.map((roleDetail) => ({
        functionId: roleDetail.functionId,
        action: roleDetail.action,
      }))!
    );

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          initialValues={{
            id: id!,
            name: name!,
            salary: salary!,
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
              const res = await HandleUpdateRole({
                id: values!.id,
                name: values!.name || undefined,
                salary: values!.salary || 0,
                timeUpdate: new Date().toISOString(),
                roleDetails: roleDetailsUpdate || [],
              });
              if (res.status === 200) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: "Cập nhật thành công !",
                  duration: 1.5,
                });

                setTimeout(() => {
                  getAllRole();
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
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled={true} />
              </Form.Item>
              <Form.Item
                name="salary"
                label={defaultLabels["salary"]}
                htmlFor="update-salary"
                className="modal__form-group-item"
                rules={[ruleRequired("Lương cơ bản không được để trống !")]}
              >
                <InputNumber
                  min={0}
                  id="update-salary"
                  placeholder={defaultInputs["salary"]}
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
              <Form.Item
                name="name"
                label={defaultLabels["name"]}
                htmlFor="update-name"
                className="modal__form-group-item"
                rules={[ruleRequired("Tên chức vụ không được để trống !")]}
              >
                <Input id="update-name" placeholder={defaultInputs["name"]} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["roleDetails"]}
                htmlFor="update-roleDetails"
                className="modal__form-group-item multiple-2"
              >
                <CustomTableRoleDetails
                  id="update-roleDetails"
                  data={roleDetailsUpdate}
                  setRoleDetails={setRoleDetailsUpdate}
                />
              </Form.Item>
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
  const LockRoles = ({
    id,
    status,
  }: {
    id: number;
    status: string | undefined;
  }) => {
    const [form] = Form.useForm();
    const statusValue = status == commonStatus["active"] ? true : false;

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
              const res = await HandleLockRole({
                id: id!,
                status: status!,
                timeUpdate: new Date().toISOString(),
              });
              if (res.status == 200) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: `${
                    statusValue ? "Khoá" : "Mở khoá"
                  } thành công !`,
                  duration: 1.5,
                });

                setTimeout(() => {
                  getAllRole();
                  setOpenModal(false);
                }, 1500);
              } else {
                openNotification({
                  type: "error",
                  message: "Thất bại",
                  description: String(res.data) ?? `${statusValue ? "Khoá" : "Mở khoá"} thất bại !`,
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
              chức vụ có mã đối tượng là <b>{id}</b> ?
            </p>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn lock">Xác nhận</button>
          </div>
        </Form>
      </>
    );
  };
  const AdminRolesModal = {
    detail: (role: RolesFormatType) => (
      <DetailRoles
        id={role!.id}
        name={role!.name}
        salary={role!.salary}
        status={role!.status}
        roleDetails={role!.roleDetails}
      />
    ),
    create: () => <CreateRoles />,
    update: (role: RolesFormatType) => (
      <UpdateRoles
        id={role!.id}
        name={role!.name}
        salary={role!.salary}
        status={role!.status}
        roleDetails={role!.roleDetails}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockRoles id={id} status={status} />
    ),
  };

  // Hàm cập nhật danh sách các chức vụ (gọi API)
  const getAllRole = async () => {
    setLoading(true);
    const res = await FindAllRole({
      findType: filterFindType!,
      findValue: filterFindValue!,
      statusValue: filterStatusValue!,
    });
    if (res!.status === 200) {
      setLoading(false);
      setRoles(res!.data);
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
    getAllRole();
  }, []);
  useEffect(() => {
    getAllRole();
  }, [filterFindType, filterFindValue, filterStatusValue]);

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h1 className="main__title">Quản lý nhân sự - Chức vụ</h1>
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
                "Thêm chức vụ",
                true,
                "60%",
                "create roles",
                AdminRolesModal.create()
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
            className="table-actions roles"
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

export default AdminRolesPage;
