import ConfigVNComponent from "../../shared/ConfigVNComponent";
import TableRUDActionsComponent from "../../shared/TableRUDActionsComponent";
import MainDataComponent from "../../admin-manager/tables/NewMainDataComponent";
import dayjs from "dayjs";
import { Button, DatePicker, Image, Select, Tag } from "antd";
import { CommonGenderValue, CommonStatusValue, ImageSourcePath, ModalWidthValue } from "../../../constants/values";
import type { ColumnsType } from "antd/es/table";
import type { ModalState } from "../../../hooks/useModal";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { CustomerSummaryResponseType } from "../../../types/CustomerType";
import type { JSX } from "react";

type CustomerTableModals = {
  detail: (data: CustomerSummaryResponseType) => JSX.Element;
  update: (data: CustomerSummaryResponseType) => JSX.Element;
  lock: (id: number, status: string) => JSX.Element;
  lockUser: (id: number, status: string) => JSX.Element;
  changePasswordUser: (id: number) => JSX.Element;
};

type CustomersTableComponentProps = {
  tableKey: number;
  nameEN: string;
  nameVN: string;
  managerModals: CustomerTableModals;
  openModal: (payload: Omit<ModalState, "open">) => void;
  data: PageResponseType<CustomerSummaryResponseType> | undefined;
  isLoading: boolean;
  onPageChange: (page: number, size: number) => void;
};
const CustomersTableComponent: React.FC<CustomersTableComponentProps> = (props) => {
  const { tableKey, nameEN, nameVN, managerModals, openModal, data, isLoading, onPageChange } = props;
  const columns: ColumnsType<CustomerSummaryResponseType> = [
    {
      title: "",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: "8%",
      fixed: "left",
      render: (imageUrl: string) => (
        <Image src={imageUrl ?? ImageSourcePath + "no-image.png"} alt="" />
      ),
    },
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 100,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      width: "24%",
      className: "left",
      sorter: (a, b) => a.fullname.localeCompare(b.fullname),
    },
    {
      title: "Tên tài khoản",
      dataIndex: ["user", "username"],
      key: "username",
      width: "20%",
      sorter: (a, b) => a.user.username.localeCompare(b.user.username),
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthdate",
      key: "birthdate",
      width: "12%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <ConfigVNComponent
            children={
              <DatePicker.RangePicker
                placeholder={["Bắt đầu", "Kết thúc"]}
                format="YYYY-MM-DD"
                style={{ display: "flex" }}
                value={
                  selectedKeys[0]
                    ? (() => {
                        const [start, end] = JSON.parse(
                          selectedKeys[0] as string,
                        ) as [string, string];
                        return [dayjs(start), dayjs(end)];
                      })()
                    : null
                }
                onChange={(dates) =>
                  setSelectedKeys(
                    dates
                      ? [
                          JSON.stringify([
                            dates[0]?.toISOString(),
                            dates[1]?.toISOString(),
                          ]),
                        ]
                      : [],
                  )
                }
              />
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
        const [start, end] = JSON.parse(value as string) as [string, string];
        const date = dayjs(record.birthdate);

        return (
          date.isSame(dayjs(start)) ||
          date.isSame(dayjs(end)) ||
          (date.isAfter(dayjs(start)) && date.isBefore(dayjs(end)))
        );
      },
      sorter: (a, b) =>
        dayjs(a.birthdate).valueOf() - dayjs(b.birthdate).valueOf(),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: "12%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Giới tính"
            style={{ width: "100%" }}
            options={[
              { label: CommonGenderValue.male, value: CommonGenderValue.male },
              {
                label: CommonGenderValue.female,
                value: CommonGenderValue.female,
              },
            ]}
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
      onFilter: (value, record) => record.gender === value,
      sorter: (a, b) => a.gender.localeCompare(b.gender),
      render: (gender: string) => (
        <Tag
          color={gender === CommonGenderValue.male ? "geekblue" : "magenta"}
          bordered={false}
        >
          {gender}
        </Tag>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "12%",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Thông tin",
      dataIndex: "status",
      key: "status",
      width: "8%",
      render: (status: string) => (
        <Tag
          color={status === CommonStatusValue.active ? "green" : "red"}
          bordered={false}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Tài khoản",
      dataIndex: ["user", "status"],
      key: "userStatus",
      width: "8%",
      render: (userStatus: string) => (
        <Tag
          color={userStatus === CommonStatusValue.active ? "green" : "red"}
          bordered={false}
        >
          {userStatus}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      width: 200,
      fixed: "right",
      className: "buttons",
      render: (record: CustomerSummaryResponseType) => (
        <TableRUDActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isAdmin={true}
          hasLockUser={true}
          hasChangePasswordUser={true}
          record={record}
          modalWidth={ModalWidthValue.split3}
          managerModals={managerModals}
          openModal={openModal}
        />
      ),
    },
  ];

  return (
    <MainDataComponent<CustomerSummaryResponseType>
      tableKey={tableKey}
      object={nameEN}
      columns={columns}
      data={data}
      isLoading={isLoading}
      isScroll={true}
      onPageChange={onPageChange}
    />
  );
};

export default CustomersTableComponent;
