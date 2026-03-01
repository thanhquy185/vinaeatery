import { useMemo, useState, type FC } from "react";
import { List } from "antd";
import { Mail, Phone, RotateCcw, Settings, User } from "lucide-react";
import type { ManagerHandleUseTableProps } from "../../../../../common/props";
import {
  CommonStatus,
  ImageSourcePath,
  UseTableStatus,
} from "../../../../../common/values";
import type { CustomerType } from "../../../../../common/types";
import CustomFilterFind from "../../../../common/filter-find";
import { useEntityQuery } from "../../../../../hook/use-entity-query";
import { FindAllCustomer } from "../../../../../requests/customers";
import { openNotification } from "../../../../../utils/show-notification";

// Manager Empty Handle Occupied Has Account
const ManagerEmptyHandleOccupiedHasAccount: FC<ManagerHandleUseTableProps> = ({
  restaurantId,
  useTableId,
  callApiToUpdateUseTable,
  clickBack,
}) => {
  // - Dữ liệu về khách hàng
  const { data: customers } = useEntityQuery<CustomerType[]>({
    keys: ["customers", CommonStatus.active],
    params: {
      statusValue: [CommonStatus.active],
    },
    api: FindAllCustomer,
  });
  // - State xử lý sự kiện chọn một khách hàng
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(
    null,
  );

  // - Các biến để lọc dữ liệu
  const findOptions = [
    { label: "Họ tên", value: "fullname" },
    // { label: "Tài khoản", value: "username" },
    { label: "Điện thoại", value: "phone" },
    { label: "Email", value: "email" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
  // - Lọc dữ liệu
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];

    return customers.filter((customer) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "fullname") {
          matchFind = customer?.fullname?.toLowerCase().includes(value)!;
        }

        if (filterFindType === "username") {
          matchFind = customer?.user?.username?.toLowerCase().includes(value)!;
        }

        if (filterFindType === "phone") {
          matchFind = customer?.phone?.toLowerCase().includes(value)!;
        }

        if (filterFindType === "email") {
          matchFind = customer?.email?.toLowerCase().includes(value)!;
        }
      }

      return matchFind;
    });
  }, [customers, filterFindType, filterFindValue]);

  return (
    <>
      {/* <CustomFilterFind
        placeholder="Nhập thông tin cần tìm kiếm"
        className="filter-find"
        selectItems={findOptions}
        findType={filterFindType}
        findValue={filterFindValue}
        setFilterFindType={setFilterFindType}
        setFilterFindValue={setFilterFindValue}
      /> */}
      <List
        // pagination={{ pageSize: 5 }}
        grid={{
          gutter: 16, // khoảng cách giữa các item
          column: 4, // SỐ ITEM TRÊN 1 HÀNG (đổi 2 / 3 / 4)
        }}
        locale={{
          emptyText: (
            <div className="empty">
              <img
                src={ImageSourcePath + "empty-customer-icon.png"}
                alt="empty-customer"
              />
              <h3>Không có khách hàng</h3>
              <p>
                Hệ thống chưa có khách hàng nào đăng ký tài khoản hoặc không tồn
                tại khách hàng có thông tin như vậy
              </p>
            </div>
          ),
        }}
        dataSource={filteredCustomers}
        renderItem={(item) => {
          return (
            <List.Item
              onClick={() => {
                if (item.id !== selectedCustomer?.id) {
                  setSelectedCustomer(item);
                } else {
                  setSelectedCustomer(null);
                }
              }}
              className={`${selectedCustomer?.id === item.id ? "active" : ""}`}
            >
              <List.Item.Meta
                // title={<>Đơn đặt bàn #{item?.id}</>}
                description={
                  <>
                    <img
                      src={
                        item.image
                          ? (item.image as string)
                          : ImageSourcePath + "no-image.png"
                      }
                      alt={"avatar-customer-" + item.id}
                    />
                    <h5>Thông tin khách hàng</h5>
                    <p>
                      <User />
                      <span>Họ tên:</span>
                      <b>{item?.fullname}</b>
                    </p>
                    {/* <p>
                      <Settings />
                      <span>Tài khoản:</span>
                      <b>{item?.user?.username}</b>
                    </p> */}
                    <p>
                      <Phone />
                      <span>Điện thoại:</span>
                      <b>{item?.phone}</b>
                    </p>
                    <p>
                      <Mail />
                      <span>Email:</span>
                      <b>{item?.email}</b>
                    </p>
                  </>
                }
              />
            </List.Item>
          );
        }}
      />
      <div className="modal__buttons mg-top">
        <button
          type="button"
          className="modal__button secondary btn"
          onClick={(e) => {
            if (!selectedCustomer) {
              openNotification({
                type: "warning",
                message: "Cảnh báo!",
                description:
                  "Bạn chưa chọn khách hàng nào. Hãy chọn một khách hàng!",
              });

              return;
            }

            callApiToUpdateUseTable!({
              id: useTableId!,
              customerId: selectedCustomer?.id,
              customerFullname: selectedCustomer?.fullname,
              customerPhone: selectedCustomer?.phone,
              customerEmail: selectedCustomer?.email,
              button: e.target as HTMLElement,
              value: UseTableStatus.occupied,
            });
          }}
        >
          Xác nhận
        </button>
        <button
          type="button"
          className="modal__button secondary btn"
          onClick={clickBack}
        >
          Quay lại
        </button>
      </div>
    </>
  );
};

export default ManagerEmptyHandleOccupiedHasAccount;
