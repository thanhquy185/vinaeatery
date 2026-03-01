import type { FC } from "react";
import { Button, DatePicker, Form, Select, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { ColumnsType } from "antd/es/table";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type {
  CategoryPermissionTicketType,
  PermissionTicketType,
} from "../../../../common/types";
import {
  CommonStatus,
  ModalAutoComplete,
  ModalLayout,
  OrderStatus,
  PermissionTicketStatus,
} from "../../../../common/values";
import CustomTableActions from "../../../common/table-actions";
import { useEntityQuery } from "../../../../hook/use-entity-query";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import {
  FindAllPermissionTicket,
  HandleCreatePermissionTicket,
} from "../../../../requests/permission-tickets";
import { FindAllCategoryPermissionTicket } from "../../../../requests/category-permission-tickets";
import { openConfirmation } from "../../../../utils/show-confirmation";
import dayjs from "dayjs";

// Manager Permission Ticket
const ManagerPermissionTicket: FC<CrudObjectModalProps> = ({
  objectEN,
  objectVN,
  data,
  closeModal,
}) => {
  const [form] = Form.useForm<PermissionTicketType>();
  const createMutation = useEntityMutation<PermissionTicketType>({
    messages: {
      success: `Tạo ${objectVN?.toLowerCase()} thành công!`,
      error: `Tạo ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleCreatePermissionTicket,
  });

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const { data: categoryPermissionTickets } = useEntityQuery<
    CategoryPermissionTicketType[]
  >({
    keys: [
      "categoryPermissionTickets",
      data.restaurantId,
      [CommonStatus.active],
    ],
    params: {
      restaurantId: data.restaurantId,
      statusValue: [CommonStatus.active],
    },
    api: FindAllCategoryPermissionTicket,
  });
  const { data: permissionTickets } = useEntityQuery<PermissionTicketType[]>({
    keys: [objectEN, data.restaurantId],
    params: {
      restaurantId: data.restaurantId,
      findType: "employeeMainId",
      findValue: data.id,
    },
    api: FindAllPermissionTicket,
  });
  // - Các thuộc tính
  const columns: ColumnsType<PermissionTicketType> = [
    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      key: "createAt",
      width: "18%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <DatePicker.RangePicker
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
            value={
              selectedKeys[0]
                ? (() => {
                    const [start, end] = JSON.parse(selectedKeys[0] as string);
                    return [dayjs(start), dayjs(end)];
                  })()
                : null
            }
            onChange={(dates) =>
              setSelectedKeys(
                dates
                  ? [
                      JSON.stringify([
                        dates[0]?.format("YYYY-MM-DD"),
                        dates[1]?.format("YYYY-MM-DD"),
                      ]),
                    ]
                  : [],
              )
            }
          />
          <Button
            type="primary"
            size="small"
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => confirm()}
          >
            Lọc
          </Button>
        </div>
      ),
      onFilter: (value, record) => {
        if (!value) return true;

        const [start, end] = JSON.parse(value as string);

        const date = dayjs(record.createAt);
        const startDate = dayjs(start);
        const endDate = dayjs(end);

        return (
          date.isSame(startDate, "day") ||
          date.isSame(endDate, "day") ||
          (date.isAfter(startDate, "day") && date.isBefore(endDate, "day"))
        );
      },
      sorter: (a, b) =>
        dayjs(a.createAt).valueOf() - dayjs(b.createAt).valueOf(),
      render: (val) => (val ? dayjs(val).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Loại đơn",
      key: "categoryPermissionTicket",
      width: "18%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Loại đơn xin phép"
            options={categoryPermissionTickets?.map(
              (categoryPermissionTicket) => ({
                label: `#${categoryPermissionTicket?.id} - ${categoryPermissionTicket?.name}`,
                value: categoryPermissionTicket?.id,
              }),
            )}
            style={{ width: "100%" }}
            onChange={(val) => setSelectedKeys(val ? [val] : [])}
          ></Select>
          <Button
            type="primary"
            size="small"
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => confirm()}
          >
            Lọc
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        record.categoryPermissionTicket?.id === value,
      sorter: (a, b) =>
        a.categoryPermissionTicket?.id! - b.categoryPermissionTicket?.id!,
      render: (record) => `${record.categoryPermissionTicket?.name}`,
    },
    {
      title: "Ngày xin phép",
      dataIndex: "date",
      key: "date",
      width: "18%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <DatePicker.RangePicker
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
            value={
              selectedKeys[0]
                ? (() => {
                    const [start, end] = JSON.parse(selectedKeys[0] as string);
                    return [dayjs(start), dayjs(end)];
                  })()
                : null
            }
            onChange={(dates) =>
              setSelectedKeys(
                dates
                  ? [
                      JSON.stringify([
                        dates[0]?.format("YYYY-MM-DD"),
                        dates[1]?.format("YYYY-MM-DD"),
                      ]),
                    ]
                  : [],
              )
            }
          />
          <Button
            type="primary"
            size="small"
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => confirm()}
          >
            Lọc
          </Button>
        </div>
      ),
      onFilter: (value, record) => {
        if (!value) return true;

        const [start, end] = JSON.parse(value as string);

        const date = dayjs(record.date);
        const startDate = dayjs(start);
        const endDate = dayjs(end);

        return (
          date.isSame(startDate, "day") ||
          date.isSame(endDate, "day") ||
          (date.isAfter(startDate, "day") && date.isBefore(endDate, "day"))
        );
      },
      sorter: (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
      render: (val) => (val ? dayjs(val).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      width: "28%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "18%",
      render: (status: string) => (
        <Tag
          color={
            status === OrderStatus.confirm
              ? "green"
              : status === OrderStatus.canceled
                ? "red"
                : "default"
          }
        >
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <>
      <div className="row">
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          className="modal__form"
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']",
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
              const response = await createMutation.mutateAsync({
                values: {
                  ...values,
                  restaurantId: data.restaurantId,
                  createAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                  employeeMainId: data.id,
                  date:
                    values?.date && dayjs(values?.date).isValid()
                      ? dayjs(values?.date).format("YYYY-MM-DD")
                      : undefined,
                  status: PermissionTicketStatus.pending,
                },
              });

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <div className="modal__form-group">
              <Form.Item
                name="categoryPermissionTicketId"
                label="Loại đơn xin phép"
                htmlFor="create-categoryPermissionTicket"
                className="modal__form-group-item"
                rules={[ruleRequired("Loại đơn xin phép không được để trống!")]}
              >
                <Select
                  allowClear
                  showSearch
                  id="create-categoryPermissionTicket"
                  placeholder="Chọn Loại đơn xin phép"
                  options={categoryPermissionTickets?.map(
                    (categoryPermissionTicket) => ({
                      label: categoryPermissionTicket!.name,
                      value: categoryPermissionTicket!.id,
                    }),
                  )}
                />
              </Form.Item>
              <Form.Item
                name="date"
                label="Ngày xin phép"
                htmlFor="create-date"
                className="modal__form-group-item"
                rules={[ruleRequired("Ngày xin phép không được để trống!")]}
              >
                <DatePicker id="create-date" placeholder="Chọn Ngày xin phép" />
              </Form.Item>
              <Form.Item
                name="reason"
                label="Lý do"
                htmlFor="create-reason"
                className="modal__form-group-item"
                rules={[ruleRequired("Lý do không được để trống!")]}
              >
                <TextArea
                  id="create-reason"
                  className="multiple-2"
                  placeholder="Nhập Lý do"
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn">
              Xác nhận
            </button>
          </div>
        </Form>
        <CustomTableActions
          columns={columns}
          data={permissionTickets || []}
          rowKey={(record) => String(record?.id)}
          loading={false}
          defaultPageSize={10}
          className="table-actions"
        />
      </div>
    </>
  );
};

export default ManagerPermissionTicket;
