import useModal from "../../hooks/useModal";
import useEntityQuery from "../../hooks/useEntityQuery2";
import ModalComponent from "../../components/ModalComponent";
import TableRUDActionsComponent from "../../components/TableRUDActionsComponent";
import MainHeaderComponent from "../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../components/admin-manager/MainFilterInfoComponent";
import MainDataComponent from "../../components/admin-manager/NewMainDataComponent";
import DetailRestaurantModalComponent from "../../components/admin-manager/modal/restaurant/DetailRestaurantModalComponent";
import CreateRestaurantModalComponent from "../../components/admin-manager/modal/restaurant/CreateRestaurantModalComponent";
import UpdateRestaurantModalComponent from "../../components/admin-manager/modal/restaurant/UpdateRestaurantModalComponent";
import LockModalComponent from "../../components/admin-manager/modal/LockModalComponent";
import RestaurantApiService from "../../services/api/v1/RestaurantApiService";
import ManagerApiService from "../../services/api/v1/ManagerApiService";
import { useState } from "react";
import { Button, Image, Select, Tag } from "antd";
import {
  CommonStatusValue,
  ModalTitleValue,
  ModalWidthValue,
} from "../../constants/values";
import { ImageSourcePath } from "../../constants/values";
import { actionIndexes, getActionNameEn } from "../../utils/defaultActionsUtil";
import { getFilterSelectValueToShow } from "../../utils/otherEvents";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ManagerCrudResponseType } from "../../types/ManagerType";
import type { AdminManagerPageProps } from "../../constants/props";
import type { PageResponseType } from "../../types/PageResponseType";
import type { RestaurantImageDetailResponseType } from "../../types/RestaurantImageType";
import type { RestaurantSummaryResponseType } from "../../types/RestaurantType";

const AdminRestaurantsPage: React.FC<AdminManagerPageProps> = ({
  nameVN,
  nameEN,
}) => {
  // Biến giữ dữ liệu về Chủ nhà hàng
  const { data: managers } = useEntityQuery<ManagerCrudResponseType[]>({
    keys: ["managers-crud"],
    params: {},
    api: ManagerApiService.handleGetCrud,
  });

  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Tên", value: "name" },
    { label: "SĐT", value: "phone" },
    { label: "Email", value: "email" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: CommonStatusValue.active, value: CommonStatusValue.active },
    { label: CommonStatusValue.inactive, value: CommonStatusValue.inactive },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const { data: restaurantData, isLoading } = useEntityQuery<
    PageResponseType<RestaurantSummaryResponseType>
  >({
    keys: [
      nameEN,
      page,
      size,
      filterFindType,
      filterFindValue,
      filterStatusValue,
    ],
    params: {
      page: page,
      size: size,
      findType: filterFindType!,
      findValue: filterFindValue!,
      statusValue: filterStatusValue!,
    },
    api: RestaurantApiService.handleGetSummary,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<RestaurantSummaryResponseType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Hình ảnh",
      dataIndex: "restaurantImages",
      key: "restaurantImages",
      width: "50%",
      render: (restaurantImages: RestaurantImageDetailResponseType[]) => {
        const list =
          restaurantImages && restaurantImages.length > 0
            ? restaurantImages
            : [{ image: ImageSourcePath + "no-image.png" }];

        return <Image src={list[0].image} alt="" />;
      },
    },
    {
      title: "Tên nhà hàng",
      dataIndex: "name",
      key: "name",
      width: "24%",
      className: "left",
      sorter: (a, b) => a?.name!.localeCompare(b?.name!),
    },
    {
      title: "Chủ nhà hàng",
      key: "manager",
      width: "24%",
      className: "left",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 400, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Chủ nhà hàng"
            style={{ width: "100%" }}
            options={managers?.map((manager) => ({
              label: `#${manager.id} - ${manager.fullname}`,
              value: manager.id,
            }))}
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
      onFilter: (value, record) => record.manager.id === value,
      sorter: (a, b) => a.manager.id - b.manager.id,
      render: (record) => `#${record.manager.id} - ${record.manager.fullname}`,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "12%",
      sorter: (a, b) => a?.phone!.localeCompare(b?.phone!),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "18%",
      sorter: (a, b) => a?.email!.localeCompare(b?.email!),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
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
      title: "",
      dataIndex: "",
      key: "actions",
      width: 100,
      fixed: "right",
      className: "buttons",
      render: (record: RestaurantSummaryResponseType) => (
        <TableRUDActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isAdmin={true}
          record={record}
          modalWidth={ModalWidthValue.split3}
          managerModals={AdminRestaurantModals}
          openModal={openModal}
        />
      ),
    },
  ];

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định của nhãn
  const defaultLabels = {
    title1: "Thông tin cơ bản",
    title2: "Thông tin quản lý",
    title3: "Thông tin địa chỉ",
    id: "Mã nhà hàng",
    manager: "Chủ nhà hàng",
    images: "Hình ảnh",
    name: "Tên nhà hàng",
    phone: "Số điện thoại",
    email: "Email",
    latitude: "Vĩ độ",
    longitude: "Kinh độ",
    houseNumber: "Số nhà",
    streetName: "Tên đường",
    ward: "Phường / Xã",
    province: "Tỉnh / Thành phố",
    description: "Mô tả",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định của nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    title3: "",
    id: "Chưa xác định!",
    manager: "Chọn Chủ nhà hàng",
    images: "Hình ảnh",
    name: "Nhập Tên nhà hàng",
    phone: "Nhập Số điện thoại",
    email: "Nhập Email",
    latitude: "Nhập Vĩ độ",
    longitude: "Nhập Kinh độ",
    houseNumber: "Nhập Số nhà",
    streetName: "Nhập Tên đường",
    ward: "Chọn Phường / Xã",
    province: "Chọn Tỉnh / Thành phố",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
  };
  // - Quản lý các modal
  const AdminRestaurantModals = {
    detail: (restaurantSummary: RestaurantSummaryResponseType) => (
      <DetailRestaurantModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={restaurantSummary}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateRestaurantModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        dataForCrud={{
          managers: managers,
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (restaurantSummary: RestaurantSummaryResponseType) => (
      <UpdateRestaurantModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={restaurantSummary}
        dataForCrud={{
          managers: managers,
        }}
        closeModal={() => closeModal()}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        fieldId={id}
        fieldStatus={status}
        closeModal={() => closeModal()}
      />
    ),
  };

  return (
    <>
      <main className="admin-manager-main">
        <MainHeaderComponent title={nameVN} />
        <MainFilterInfoComponent
          objectName={nameVN}
          findOptions={findOptions}
          filterFindType={filterFindType}
          filterFindValue={filterFindValue}
          setFilterFindType={setFilterFindType}
          setFilterFindValue={setFilterFindValue}
          statusOptions={statusOptions}
          filterStatusValue={getFilterSelectValueToShow({
            options: statusOptions,
            filterSelectValue: filterStatusValue,
          })}
          setFilterStatusValue={setFilterStatusValue}
          onClickFilterReset={() => {
            setFilterFindType(findOptions[0].value);
            setFilterFindValue(null);
            setFilterStatusValue(null);
            setTableKey((prev) => prev + 1);
          }}
          isShowFilterCreate={true}
          onClickFilterCreate={() =>
            openModal({
              title: ModalTitleValue.create(nameVN.toLowerCase()),
              width: ModalWidthValue.split3,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: AdminRestaurantModals.create(),
            })
          }
        />
        <MainDataComponent<RestaurantSummaryResponseType>
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={restaurantData}
          isLoading={isLoading}
          isScroll={true}
          onPageChange={(page, size) => {
            setPage(page);
            setSize(size);
          }}
        />
      </main>
      {modal.open && (
        <ModalComponent
          title={modal.title}
          open={modal.open}
          width={modal.width}
          className={modal.className}
          children={modal.children}
          setCloseModal={() => closeModal()}
        />
      )}
    </>
  );
};

export default AdminRestaurantsPage;
