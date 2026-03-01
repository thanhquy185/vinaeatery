import { useMemo, useState, type FC } from "react";
import { Carousel, Image, Tag } from "antd";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Eye, Lock, PenBox, Unlock } from "lucide-react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faEye,
//   faLock,
//   faPenToSquare,
//   faUnlock,
// } from "@fortawesome/free-solid-svg-icons";
import type {
  RestaurantType,
  ManagerType,
  RestaurantImageType,
} from "../../common/types";
import {
  CommonStatus,
  ModalTitleValue,
  ModalWidthValue,
} from "../../common/values";
import CustomModal from "../../components/common/modal";
import AdminManagerMainHeader from "../../components/admin-manager/common/main-header";
import AdminManagerMainFilterInfo from "../../components/admin-manager/common/main-filter-info";
import AdminManagerMainData from "../../components/admin-manager/common/main-data";
import AdminDetailRestaurant from "../../components/admin-manager/modal/restaurant/admin-detail-restaurant";
import AdminCreateRestaurant from "../../components/admin-manager/modal/restaurant/admin-create-restaurant";
import AdminUpdateRestaurant from "../../components/admin-manager/modal/restaurant/admin-update-restaurant";
import ManagerLock from "../../components/admin-manager/modal/manager-lock";
import { useModal } from "../../hook/use-modal";
import { useEntityQuery } from "../../hook/use-entity-query";
import { ImageSourcePath } from "../../common/values";
import { actionIndexes, getActionNameEn } from "../../utils/default-actions";
import { FindAllManager } from "../../requests/managers";
import { FindAllRestaurant } from "../../requests/restaurants";
import { getFilterSelectValueToShow } from "../../utils/other-events";

// Các giá trị chung
// - Tên đối tượng
const nameVN = "Nhà hàng";
const nameEN = "restaurants";

// Admin Restaurants Page
const AdminRestaurantsPage = () => {
  // // Đối tượng query client để thực thi react-query
  // const queryClient = useQueryClient();

  // Biến giữ dữ liệu về Chủ nhà hàng
  const { data: managers } = useEntityQuery<ManagerType[]>({
    keys: ["managers"],
    params: {},
    api: FindAllManager,
  });

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Truy vấn dữ liệu
  const {
    data: restaurants,
    isLoading,
    isError,
    error,
  } = useEntityQuery<RestaurantType[]>({
    keys: [nameEN],
    params: {},
    api: FindAllRestaurant,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<RestaurantType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "8%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Hình ảnh",
      dataIndex: "restaurantImages",
      key: "restaurantImages",
      width: "18%",
      render: (restaurantImages: RestaurantImageType[]) => {
        const list = restaurantImages?.length
          ? restaurantImages
          : [{ image: ImageSourcePath + "no-image.png" }];

        return (
          <Carousel dots={false} autoplay>
            {list.map((item, i) => (
              <Image key={i} src={item.image} />
            ))}
          </Carousel>
        );
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
        <Tag color={status === CommonStatus.active ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      width: "10%",
      className: "buttons",
      render: (text: any, record: RestaurantType, index: number) => (
        <>
          {
            <button
              className={"action " + getActionNameEn(actionIndexes.detail)}
              onClick={() =>
                openModal({
                  title: ModalTitleValue.detail(nameVN.toLowerCase()),
                  width: ModalWidthValue.split3,
                  className: `${getActionNameEn(
                    actionIndexes.detail,
                  )} ${nameEN}`,
                  children: AdminRestaurantModals.detail(record),
                })
              }
            >
              {/* <FontAwesomeIcon icon={faEye} /> */}
              <Eye />
            </button>
          }
          {
            <button
              className={"action " + getActionNameEn(actionIndexes.update)}
              onClick={() =>
                openModal({
                  title: ModalTitleValue.update(nameVN.toLowerCase()),
                  width: ModalWidthValue.split3,
                  className: `${getActionNameEn(
                    actionIndexes.update,
                  )} ${nameEN}`,
                  children: AdminRestaurantModals.update(record),
                })
              }
            >
              {/* <FontAwesomeIcon icon={faPenToSquare} /> */}
              <PenBox />
            </button>
          }
          {
            <button
              className={"action " + getActionNameEn(actionIndexes.lock)}
              onClick={() =>
                openModal({
                  title:
                    record.status == CommonStatus.active
                      ? ModalTitleValue.lock(nameVN.toLowerCase())
                      : ModalTitleValue.unlock(nameVN.toLowerCase()),
                  width: ModalWidthValue.lock,
                  className: `${getActionNameEn(actionIndexes.lock)} ${nameEN}`,
                  children: AdminRestaurantModals.lock(
                    record?.id as number,
                    record?.status!,
                  ),
                })
              }
            >
              {/* <FontAwesomeIcon
                        icon={record.status == CommonStatus.active ? faLock : faUnlock}
                      /> */}
              {record.status == CommonStatus.active ? <Lock /> : <Unlock />}
            </button>
          }
        </>
      ),
    },
  ];
  // Các biến giữ giá trị từ việc lọc thông tin
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
    { label: CommonStatus.active, value: CommonStatus.active },
    { label: CommonStatus.inactive, value: CommonStatus.inactive },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );
  // - Lọc dữ liệu
  const filteredRestaurants = useMemo(() => {
    if (!restaurants) return [];

    return restaurants.filter((restaurant) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(restaurant.id).includes(value);
        }

        if (filterFindType === "name") {
          matchFind = restaurant.name?.toLowerCase().includes(value)!;
        }

        if (filterFindType === "phone") {
          matchFind = restaurant.phone?.toLowerCase().includes(value)!;
        }

        if (filterFindType === "email") {
          matchFind = restaurant.email?.toLowerCase().includes(value)!;
        }
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        matchStatus = filterStatusValue.includes(restaurant.status!);
      }

      return matchFind && matchStatus;
    });
  }, [restaurants, filterFindType, filterFindValue, filterStatusValue]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định của nhãn
  const defaultLabels = {
    title: "Thông tin cơ bản",
    id: "Mã nhà hàng",
    manager: "Chủ nhà hàng",
    createAt: "Thời gian tạo",
    images: "Hình ảnh",
    name: "Tên nhà hàng",
    phone: "Số điện thoại",
    email: "Email",
    address: "Địa chỉ",
    description: "Mô tả",
    rating: "Đánh giá",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định của nhập liệu
  const defaultInputs = {
    title: "",
    id: "Chưa xác định!",
    manager: "Chọn Chủ nhà hàng",
    createAt: "",
    images: "Hình ảnh",
    name: "Nhập Tên nhà hàng",
    phone: "Nhập Số điện thoại",
    email: "Nhập Email",
    address: "Nhập Địa chỉ",
    description: "Nhập Mô tả",
    rating: "",
    status: "Chọn Trạng thái",
  };
  // - Quản lý các modal
  const AdminRestaurantModals = {
    detail: (restaurant: RestaurantType) => (
      <AdminDetailRestaurant
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={restaurant}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <AdminCreateRestaurant
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
    update: (restaurant: RestaurantType) => (
      <AdminUpdateRestaurant
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={restaurant}
        dataForCrud={{
          managers: managers,
        }}
        closeModal={() => closeModal()}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <ManagerLock
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
        <AdminManagerMainHeader title={nameVN} />
        <AdminManagerMainFilterInfo
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
        <AdminManagerMainData
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={filteredRestaurants || []}
          isLoading={isLoading}
        />
      </main>
      {modal.open && (
        <CustomModal
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
