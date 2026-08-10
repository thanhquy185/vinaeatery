// Điều kiện kiểm tra trường phải được nhập
export const ruleRequired = (message?: string) => {
  return {
    required: true,
    message: message! ? message : "Trường nhập dữ liệu không được để trống!",
  };
};

// Điều kiện kiểm tra email
export const ruleEmail = (message?: string) => {
  return {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: message! ? message : "Email không hợp lệ!",
  };
};

// Điều kiện kiểm tra số điện thoại
export const rulePhone = (message?: string) => {
  return {
    pattern: /^\d{10,11}$/,
    message: message! ? message : "Số điện thoại phải có 10 hoặc 11 chữ số!",
  };
};

// Điều kiện kiểm tra mật khẩu mạnh
export const rulePasswordStrong = (password: string) => {
  const value = password ?? "";

  const length = value.length >= 8;
  const upper = /[A-Z]/.test(value);
  const lower = /[a-z]/.test(value);
  const number = /\d/.test(value);
  const special = /[@$!%*?&]/.test(value);

  return {
    length,
    upper,
    lower,
    number,
    special,
    summary: length && upper && lower && number && special,
  };
};
