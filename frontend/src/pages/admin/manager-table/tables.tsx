import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faLock,
  faPenToSquare,
  faPlus,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { Form, Input, InputNumber, Select, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  ReactQueryMutationProps,
  TablesFormatType,
  TablesType,
} from "../../../common/types";
import { ruleRequired } from "../../../common/rules";
import { CustomPaginationProps } from "../../../common/props";
import { CommonStatus, ReactQueryGetData, TitleModalCommon } from "../../../common/values";
import CustomFindInput from "../../../components/admin/find-input";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomTableActions from "../../../components/admin/table-actions";
import CustomModal from "../../../components/admin/modal";
import {
  FindAllCategoryTable,
  FindAllFloor,
  FindAllTable,
  HandleCreateTable,
  HandleLockTable,
  HandleUpdateTable,
} from "../../../services/api";
import { openNotification } from "../../../utils/showNotification";
import { openConfirmation } from "../../../utils/showConfirmation";

// Các giá trị chung
// - Tên đối tượng
const objectName = "Bàn ăn"
// - Tiêu đề modal
const titleModalDetail = TitleModalCommon.detail(objectName.toLowerCase());
const titleModalCreate = TitleModalCommon.create(objectName.toLowerCase());
const titleModalUpdate = TitleModalCommon.update(objectName.toLowerCase());
const titleModalLock = TitleModalCommon.lock(objectName.toLowerCase());
const titleModalUnlock = TitleModalCommon.unlock(objectName.toLowerCase());

// Admin Tables Page
const AdminTablesPage = () => {
  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Các biến giữ dữ liệu về tầng và loại bàn ăn
  // - Tầng
  const {
    data: floors,
  } = useQuery({
    queryKey: [
      'floors',
    ],
    queryFn: async () => {
      const res = await FindAllFloor({ statusValue: [CommonStatus.active] });
      if (res.status === 200) {
        return res.data;
      } else {
        openNotification({
          type: "error",
          message: "Truy vấn dữ liệu thất bại",
          description: String(res.data) || "Lỗi phát sinh khi truy vấn dữ liệu",
          duration: 2,
        });

        throw res;
      }
    },
  });
  // - Loại bàn ăn
  const {
    data: categoryTables,
  } = useQuery({
    queryKey: [
      'category-tables',
    ],
    queryFn: async () => {
      const res = await FindAllCategoryTable({ statusValue: [CommonStatus.active] });
      if (res.status === 200) {
        return res.data;
      } else {
        openNotification({
          type: "error",
          message: "Truy vấn dữ liệu thất bại",
          description: String(res.data) || "Lỗi phát sinh khi truy vấn dữ liệu",
          duration: 2,
        });

        throw res;
      }
    },
  });

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
  // - Loại bàn ăn
  const categoryOptions: SelectProps["options"] = categoryTables?.map(
    (categoryTable) => ({
      label: `#${categoryTable.id} - ${categoryTable.name}`,
      value: categoryTable.id,
    })
  );
  const [filterCategoryValue, setFilterCategoryValue] = useState<
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

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const {
    data: tables,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      'tables',
      filterFindType,
      filterFindValue,
      filterCategoryValue,
      filterStatusValue,
    ],
    queryFn: async () => {
      const res = await FindAllTable({
        findType: filterFindType!,
        findValue: filterFindValue!,
        categoryValue: filterCategoryValue!,
        statusValue: filterStatusValue!,
      });
      if (res.status === 200) {
        return res.data;
      } else {
        openNotification({
          type: "error",
          message: "Truy vấn dữ liệu thất bại",
          description: String(res.data) || "Lỗi phát sinh khi truy vấn dữ liệu",
          duration: 2,
        });

        throw res;
      }
    },
    enabled: !!filterFindType,  //
    retry: ReactQueryGetData.retry,
    staleTime: ReactQueryGetData.staleTime,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<TablesFormatType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: "10%",
    },
    {
      title: "Tên loại bàn ăn",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: "24%",
      className: "left",
    },
    {
      title: "Số chỗ ngồi",
      dataIndex: "seats",
      key: "seats",
      sorter: true,
      width: "12%",
    },
    {
      title: "Loại bàn ăn",
      key: "categoryTable",
      // sorter: true,
      width: "17%",
      render: (record) =>
        `#${record.categoryTable?.id} - ${record.categoryTable?.name}`,
    },

    {
      title: "Tầng",
      key: "floor",
      // sorter: true,
      width: "17%",
      render: (record) => `#${record.floor?.id} - ${record.floor?.name}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
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
      width: "10%",
      render: (text: any, record: TablesFormatType, index: number) => (
        <>
          <button
            className="action info"
            onClick={() =>
              updatePropertiesModal(
                titleModalDetail,
                true,
                "60%",
                "info tables",
                AdminTablesModal.detail(record)
              )
            }
          >
            <FontAwesomeIcon icon={faCircleInfo} />
          </button>
          <button
            className="action update margin-lr"
            onClick={() =>
              updatePropertiesModal(
                titleModalUpdate,
                true,
                "60%",
                "update tables",
                AdminTablesModal.update(record)
              )
            }
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button
            className="action lock"
            onClick={() =>
              updatePropertiesModal(
                (record.status == CommonStatus["active"] ? titleModalLock : titleModalUnlock),
                true,
                "30%",
                "lock tables",
                AdminTablesModal.lock(record!.id as number, record!.status)
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
  // - Các thành phần
  const {
    currentItems,
    handleTableChange,
    paginationProps,
    sortField,
    sortOrder,
  } = CustomPaginationProps(tables || [], 10, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

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
    categoryTable: "Loại bàn ăn",
    floor: "Tầng",
    seats: "Số chỗ ngồi",
    description: "Mô tả",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "",
    id: "Được xác định sau khi xác nhận thêm !",
    name: "Nhập Tên loại bàn ăn",
    categoryTable: "Chọn Loại bàn ăn",
    floor: "Chọn Tầng",
    seats: "Nhập Số chỗ ngồi",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
  };
  // - Mutation cho việc thêm, cập nhật và khoá dữ liệu
  const handleSubmitMutation = useMutation({
    mutationFn: async ({ type, values, objectId }: ReactQueryMutationProps<TablesType>) => {
      if (openModal) {
        if (type === "create" && titleModal === titleModalCreate) {
          return await HandleCreateTable({
            name: values!.name || undefined,
            categoryTableId: values!.categoryTableId || undefined,
            floorId: values!.floorId || undefined,
            seats: values!.seats || undefined,
            description: values!.description || undefined,
            status: values!.status || undefined,
          })
        } else if (type === "update" && titleModal === titleModalUpdate) {
          return await HandleUpdateTable({
            id: values!.id,
            name: values!.name || undefined,
            categoryTableId: values!.categoryTableId || undefined,
            floorId: values!.floorId || undefined,
            seats: values!.seats || undefined,
            description: values!.description || undefined,
            timeUpdate: new Date().toISOString(),
          });
        } else if ((type === "lock" && titleModal === titleModalLock)
          || (type === "unlock" && titleModal === titleModalUnlock)) {
          const res = await HandleLockTable({
            id: objectId! as number,
            status: (type === "lock" ? CommonStatus.active : CommonStatus.inactive) || undefined,
            timeUpdate: new Date().toISOString(),
          })

          if (res.status === 200) {
            return res.data;
          } {
            throw new Error(String(res.data));
          }
        }
      }
    },
    onSuccess: () => {
      openNotification({
        type: "success",
        message: "Thành công",
        description: (openModal ? (titleModal === titleModalCreate ? "Thêm" : titleModal === titleModalUpdate ? "Cập nhật" : titleModal === titleModalLock ? "Khoá" : "Mở khoá") : "") + " thành công!",
        duration: 1.5,
      });

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['tables'] });
        setOpenModal(false);
      }, 1500);
    },
    onError: (error) => {
      openNotification({
        type: "error",
        message: "Thất bại",
        description: (error ? error.message : (openModal ? (titleModal === titleModalCreate ? "Thêm" : titleModal === titleModalUpdate ? "Cập nhật" : titleModal === titleModalLock ? "Khoá" : "Mở khoá") : "") + " thất bại!"),
        duration: 1.5,
      });

      setTimeout(() => {
      }, 1500);
    },
  });
  // - Các modal tương ứng cho từng chức năng
  const DetailTables = ({
    id,
    name,
    categoryTable,
    floor,
    seats,
    description,
    status,
  }: TablesFormatType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: id!,
            name: name!,
            categoryTable:
              "#" + categoryTable!.id + " - " + categoryTable!.name,
            floor: "#" + floor!.id + " - " + floor!.name,
            seats: seats!,
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
                name="categoryTable"
                label={defaultLabels["categoryTable"]}
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
              <Form.Item
                name="floor"
                label={defaultLabels["floor"]}
                className="modal__form-group-item"
              >
                <Select disabled={true} />
              </Form.Item>
              <Form.Item
                name="seats"
                label={defaultLabels["seats"]}
                className="modal__form-group-item"
              >
                <InputNumber disabled={true} />
              </Form.Item>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const CreateTables = ({ }) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
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

              // Thực thi mutation
              handleSubmitMutation.mutate({ type: "create", values: values });

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
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
                  className="text-center"
                  placeholder={defaultInputs["id"]}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                name="categoryTableId"
                label={defaultLabels["categoryTable"]}
                htmlFor="create-categoryTable"
                className="modal__form-group-item"
                rules={[ruleRequired("Loại bàn không được để trống !")]}
              >
                <Select
                  showSearch={true}
                  allowClear={true}
                  id="create-categoryTable"
                  placeholder={defaultInputs["categoryTable"]}
                  options={categoryTables?.map((categoryTable) => ({
                    label: "#" + categoryTable.id + " - " + categoryTable.name,
                    value: categoryTable.id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels["name"]}
                htmlFor="create-name"
                className="modal__form-group-item"
                rules={[ruleRequired("Tên bàn không được để trống !")]}
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
              <Form.Item
                name="floorId"
                label={defaultLabels["floor"]}
                htmlFor="create-floor"
                className="modal__form-group-item"
                rules={[ruleRequired("Tầng không được để trống !")]}
              >
                <Select
                  showSearch={true}
                  allowClear={true}
                  id="create-floor"
                  className="floors"
                  placeholder={defaultInputs["floor"]}
                  options={floors?.map((floor) => ({
                    label: "#" + floor.id + " - " + floor.name,
                    value: floor.id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                name="seats"
                label={defaultLabels["seats"]}
                htmlFor="create-seats"
                className="modal__form-group-item"
                rules={[ruleRequired("Số chỗ ngồi không được để trống !")]}
              >
                <InputNumber
                  min={1}
                  id="create-seats"
                  placeholder={defaultInputs["seats"]}
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
  const UpdateTables = ({
    id,
    name,
    categoryTable,
    floor,
    seats,
    description,
    status,
  }: TablesFormatType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          initialValues={{
            id: id!,
            name: name!,
            categoryTableId: categoryTable!.id,
            floorId: floor!.id,
            seats: seats!,
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
              title: `Bạn có chắc chắn thêm ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Danh sách dữ liệu
              const values = form.getFieldsValue();

              // Thực thi mutation
              handleSubmitMutation.mutate({ type: "update", values: values });

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
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
                name="categoryTableId"
                label={defaultLabels["categoryTable"]}
                htmlFor="update-categoryTable"
                className="modal__form-group-item"
                rules={[ruleRequired("Loại bàn không được để trống !")]}
              >
                <Select
                  showSearch={true}
                  allowClear={true}
                  id="update-categoryTable"
                  placeholder={defaultInputs["categoryTable"]}
                  options={categoryTables?.map((categoryTable) => ({
                    label: "#" + categoryTable.id + " - " + categoryTable.name,
                    value: categoryTable.id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels["name"]}
                htmlFor="update-name"
                className="modal__form-group-item"
                rules={[ruleRequired("Tên bàn không được để trống !")]}
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
              <Form.Item
                name="floorId"
                label={defaultLabels["floor"]}
                htmlFor="update-floor"
                className="modal__form-group-item"
                rules={[ruleRequired("Tầng không được để trống !")]}
              >
                <Select
                  id="update-floor"
                  placeholder={defaultInputs["floor"]}
                  options={floors?.map((floor) => ({
                    label: "#" + floor.id + " - " + floor.name,
                    value: floor.id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                name="seats"
                label={defaultLabels["seats"]}
                htmlFor="update-seats"
                className="modal__form-group-item"
                rules={[ruleRequired("Số chỗ ngồi không được để trống !")]}
              >
                <InputNumber
                  min={1}
                  id="update-seats"
                  placeholder={defaultInputs["seats"]}
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
  const LockTables = ({
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
              // Thực thi mutation
              handleSubmitMutation.mutate({ type: (statusValue ? "lock" : "unlock"), objectId: id! });

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
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
              Bạn có xác nhận rằng <b>{statusValue ? "khoá" : "mở khoá"}</b> bàn
              ăn có mã đối tượng là <b>{id}</b> ?
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
  const AdminTablesModal = {
    detail: (table: TablesFormatType) => (
      <DetailTables
        id={table!.id}
        name={table!.name}
        categoryTable={table!.categoryTable}
        floor={table!.floor}
        seats={table!.seats}
        description={table!.description}
        status={table!.status}
      />
    ),
    create: () => <CreateTables />,
    update: (table: TablesFormatType) => (
      <UpdateTables
        id={table!.id}
        name={table!.name}
        categoryTable={table!.categoryTable}
        floor={table!.floor}
        seats={table!.seats}
        description={table!.description}
        status={table!.status}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockTables id={id} status={status} />
    ),
  };

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">Quản lý chỗ ngồi - {objectName}</h2>
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
            placeholder="Chọn Loại bàn ăn"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-category"
            options={categoryOptions}
            setFilterSelectValue={setFilterCategoryValue}
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
              (openModal && titleModal === titleModalCreate
                ? " active"
                : "")
            }
            onClick={() =>
              updatePropertiesModal(
                titleModalCreate,
                true,
                "60%",
                "create tables",
                AdminTablesModal.create()
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
            loading={isLoading}
            pagination={paginationProps}
            className="table-actions tables"
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

export default AdminTablesPage;
