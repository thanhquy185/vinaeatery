// Mặc định các hành động theo thứ tự (xây dựng dựa theo giá trị lưu trong csdl)
// + [0] - Xem - detail
// + [1] - Thêm - create
// + [2] - Cập nhật - update
// + [3] - Khoá - lock
// + [4] - Xem - print

// Mảng thông tin vị trí của các hành động trong mảng tên
export const actionIndexes = {
  detail: 0,
  create: 1,
  update: 2,
  lock: 3,
  print: 4,
};

// Mảng thông tin tên của các hành động
const getActionNames = () => {
  const actionNames = [
    {
      nameVn: "Xem",
      nameEn: "info",
    },
    {
      nameVn: "Thêm",
      nameEn: "create",
    },
    {
      nameVn: "Cập nhật",
      nameEn: "update",
    },
    {
      nameVn: "Khóa",
      nameEn: "lock",
    },
    {
      nameVn: "Xem",
      nameEn: "print",
    },
  ];

  return actionNames;
};

// Hàm lấy ra tên các hành động phiên âm tiếng Việt
export const getActionNameVn = (index: number) =>
  getActionNames()?.[index]?.nameVn;

// Hàm lấy ra tên các hành động phiên âm tiếng Anh
export const getActionNameEn = (index: number) =>
  getActionNames()?.[index]?.nameEn;
