package vn.tuhoc.vinaeatery.modules.employee.exceptions;

public class EmployeeEmailIsExistsException extends RuntimeException {
    public EmployeeEmailIsExistsException(String email) {
        super(String.format("Email nhân viên %s đã tồn tại!", email));
    }
}
