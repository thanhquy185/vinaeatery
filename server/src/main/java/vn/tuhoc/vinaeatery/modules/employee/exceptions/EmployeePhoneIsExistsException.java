package vn.tuhoc.vinaeatery.modules.employee.exceptions;

public class EmployeePhoneIsExistsException extends RuntimeException {
    public EmployeePhoneIsExistsException(String phone) {
        super(String.format("Số điện thoại nhân viên %s đã tồn tại!", phone));
    }
}
