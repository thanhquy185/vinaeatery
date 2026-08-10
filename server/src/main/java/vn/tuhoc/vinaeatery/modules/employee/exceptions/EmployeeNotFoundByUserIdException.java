package vn.tuhoc.vinaeatery.modules.employee.exceptions;

public class EmployeeNotFoundByUserIdException extends RuntimeException {
    public EmployeeNotFoundByUserIdException(Integer userId) {
        super(String.format("Nhân viên có mã tài khoản %s không tìm thấy!", userId));
    }
}
