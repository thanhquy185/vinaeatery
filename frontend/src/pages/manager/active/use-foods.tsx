import { useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Image, List, Tag, type SelectProps } from "antd";
import CustomFindInput from "../../../components/common/find-input";
import CustomFindSelect from "../../../components/common/find-select";
import CustomModal from "../../../components/common/modal";
import {
  CommonStatus,
  FoodStatus,
  ReactQueryGetData,
  UseFoodStatus,
  UserRoleValue,
} from "../../../common/values";
import type {
  EmployeesFormatType,
  UseFoodsFormatType,
} from "../../../common/types";
import {
  FindAllCategoryFood,
  FindAllUseFoodTimeEndIsNull,
  HandleUpdateUseFood,
} from "../../../services/api";
import { vietnamMoneyFormat } from "../../../utils/otherEvents";
import { openConfirmation } from "../../../utils/showConfirmation";
import { openNotification } from "../../../utils/showNotification";
import { CloseOutlined, CheckOutlined, InfoOutlined } from "@ant-design/icons";
import type { ManagerPageProps } from "../../../common/props";
import { getActionsString } from "../../../services/employee-login";

const { Meta } = Card;

// Các giá trị chung
// - Tên đối tượng
const objectName = "Sử dụng món ăn";

// Manager Use Foods Page
const ManagerUseFoodsPage = ({ infoLogin, functionId }: ManagerPageProps) => {
  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Có là chủ nhà hàng đăng nhập
  const isManager = infoLogin?.user?.role === UserRoleValue.manager;
  // Mã nhà hàng được chọn (dành cho chủ nhà hàng)
  const selectedRestaurantId = Number(
    sessionStorage.getItem("selected-restaurant-id")
  );
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["category-foods"] });
    queryClient.invalidateQueries({ queryKey: ["use-foods"] });
  }, [selectedRestaurantId]);
  // Danh sách tác vụ mà nhân viên có thể thực hiện theo mã chức năng
  const validActions = getActionsString({ currentFunctionId: functionId });

  // Truy vấn dữ liệu Tầng
  const { data: categoryFoods } = useQuery({
    queryKey: ["category-foods"],
    queryFn: async () => {
      const res = await FindAllCategoryFood({
        statusValue: [CommonStatus.active],
        restaurantId: isManager
          ? selectedRestaurantId
          : infoLogin?.restaurantId,
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
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [{ label: "Món ăn", value: "food" }];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  // - Loại món ăn
  const categoryFoodsOptions: SelectProps["options"] = categoryFoods?.map(
    (categoryFood) => ({
      label: categoryFood.name,
      value: categoryFood.id,
    })
  );
  const [filterCategoryFoodValue, setFilterCategoryFoodValue] = useState<
    string[] | null
  >([]);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: UseFoodStatus.canOrder, value: UseFoodStatus.canOrder },
    { label: UseFoodStatus.canNotOrder, value: UseFoodStatus.canNotOrder },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    []
  );

  // Truy vấn dữ liệu sử dụng món ăn (mới nhất)
  const { data: useFoods } = useQuery({
    queryKey: [
      "use-foods",
      filterFindType!,
      filterFindValue!,
      filterCategoryFoodValue!,
      filterStatusValue!,
    ],
    queryFn: async () => {
      const res = await FindAllUseFoodTimeEndIsNull({
        findType: filterFindType!,
        findValue: filterFindValue!,
        categoryValue: filterCategoryFoodValue!,
        statusValue: filterStatusValue!,
        restaurantId: isManager
          ? selectedRestaurantId
          : infoLogin?.restaurantId,
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
    retry: ReactQueryGetData.retry,
    staleTime: ReactQueryGetData.staleTime,
  });

  // Hàm gọi API để cập nhật trạng thái sử dụng món ăn
  const callApiToUpdateUseFood = async ({
    id,
    foodId,
    newStatus,
  }: {
    id: number;
    foodId: number;
    newStatus: string;
  }) => {
    // Hỏi trước khi xử khi xử lý ?
    const answer = await openConfirmation({
      title: `Bạn có chắc chắn món ăn này ${newStatus!.toLowerCase()} ?`,
      content: "Hành động này không thể hoàn tác.",
    });
    if (answer) {
      const res = await HandleUpdateUseFood({
        id: id!,
        timeEnd: new Date().toISOString(),
        employeeId: infoLogin?.id,
        status: newStatus,
      });
      if (res.status === 200) {
        openNotification({
          type: "success",
          message: "Thành công",
          description: "Cập nhật thành công!",
          duration: 1.5,
        });
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["use-foods"] });
        }, 1500);
      } else {
        openNotification({
          type: "error",
          message: "Thất bại",
          description: res.data ? String(res.data) : "Cập nhật thất bại!",
          duration: 1.5,
        });
      }
    }
  };

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
    SecondModal: ReactNode
  ) => {
    setTitleModal(titleModal);
    setOpenModal(openModal);
    setWidthModal(widthModal);
    setClassNameModal(classNameModal);
    setChildrenModal(SecondModal);
  };
  // - Các modal tương ứng cho từng chức năng
  const HandleInfo = ({ useFood }: { useFood: UseFoodsFormatType }) => {
    return (
      <>
        <Image
          src={
            useFood?.food?.image!
              ? (useFood?.food?.image as string)
              : "/src/assets/images/others/no-image.png"
          }
          alt=""
        />
        <div className="info">
          <b>Mã món ăn:</b> #{useFood?.food?.id}
        </div>
        <div className="info">
          <b>Tên món ăn:</b> {useFood?.food?.name}
        </div>
        <div className="info">
          <b>Loại món ăn:</b> {useFood?.food?.categoryFood?.name}
        </div>
        <div className="info">
          <b>Đơn vị:</b> {useFood?.food?.unit}
        </div>
        <div className="info">
          <b>Giá bán:</b> {vietnamMoneyFormat(useFood?.food?.price || 0)}
          <u>đ</u>
        </div>
        <div className="info">
          <b>Mô tả:</b> {useFood?.food?.description}
        </div>
        <div className="info">
          <b>Công thức món ăn:</b>
          <table>
            <colgroup>
              <col width="10%" />
              <col width="25%" />
              <col width="15%" />
              <col width="35%" />
              <col width="15%" />
            </colgroup>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên nguyên liệu</th>
                <th>Số lượng</th>
                <th>Ghi chú</th>
                <th>Tồn kho</th>
              </tr>
            </thead>
            <tbody>
              {useFood?.food?.recipe?.map((recipeDetail) => (
                <tr key={recipeDetail?.ingredientId}>
                  <td>{recipeDetail?.ingredientId}</td>
                  <td>{recipeDetail?.ingredientName}</td>
                  <td>{recipeDetail?.quantity}</td>
                  <td>{recipeDetail?.note}</td>
                  <td>{recipeDetail?.ingredientInventory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };
  const HandleDiscount = () => {
    return <>Khuyến mãi</>;
  };
  const ManagerUseFoodsModal = {
    info: ({ useFood }: { useFood: UseFoodsFormatType }) => (
      <HandleInfo useFood={useFood} />
    ),
    discount: () => <HandleDiscount />,
  };

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">{objectName}</h2>
        </div>
        <div className="main__filter use-foods">
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
            placeholder="Chọn Loại món ăn"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-category-food"
            options={categoryFoodsOptions}
            setFilterSelectValue={setFilterCategoryFoodValue}
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
        </div>
        <List
          className="main__use-foods"
          dataSource={useFoods}
          renderItem={(useFood) => {
            if(useFood?.food?.status !== FoodStatus.active) return;

            return (
            <List.Item>
              <Card
                cover={
                  <img
                    alt={"food-image-" + useFood?.food?.id}
                    src={
                      useFood?.food?.image
                        ? (useFood?.food?.image as string)
                        : "/src/assets/images/others/no-image.png"
                    }
                  />
                }
                actions={[
                  <Button
                    variant="text"
                    color="blue"
                    onClick={() =>
                      updatePropertiesModal(
                        "Thông tin món ăn",
                        true,
                        "80%",
                        "use-foods",
                        ManagerUseFoodsModal.info({ useFood })
                      )
                    }
                  >
                    <InfoOutlined key="info" />
                  </Button>,
                  //   <Button variant="text" color="orange" disabled>
                  //     <PercentageOutlined key="discount" />
                  //   </Button>,
                  <Button
                    variant="text"
                    color="green"
                    disabled={useFood?.status === UseFoodStatus.canOrder}
                    onClick={() =>
                      callApiToUpdateUseFood({
                        id: useFood?.id!,
                        foodId: useFood?.food?.id!,
                        newStatus: UseFoodStatus.canOrder,
                      })
                    }
                  >
                    <CheckOutlined key="can-order" />
                  </Button>,
                  <Button
                    variant="text"
                    color="red"
                    disabled={useFood?.status === UseFoodStatus.canNotOrder}
                    onClick={() =>
                      callApiToUpdateUseFood({
                        id: useFood?.id!,
                        foodId: useFood?.food?.id!,
                        newStatus: UseFoodStatus.canNotOrder,
                      })
                    }
                  >
                    <CloseOutlined key="can-not-order" />
                  </Button>,
                ]}
              >
                <Meta
                  avatar={null}
                  title={useFood?.food?.name}
                  description={
                    <>
                      <p>
                        Loại món ăn: <b>{useFood?.food?.categoryFood?.name}</b>
                      </p>
                      <p>
                        Giá bán:{" "}
                        <b className="price">
                          {vietnamMoneyFormat(useFood?.food?.price || 0)}
                          <u>đ</u>
                        </b>
                      </p>
                      {/* <p>
                        Số lượng: <b>{useFood?.quantity}</b>
                      </p> */}
                      <p>
                        Trạng thái:{" "}
                        <Tag
                          color={
                            useFood?.status === UseFoodStatus.canOrder
                              ? "green"
                              : "red"
                          }
                        >
                          {useFood?.status}
                        </Tag>
                      </p>
                    </>
                  }
                />
              </Card>
            </List.Item>
          )}}
        />
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

export default ManagerUseFoodsPage;
