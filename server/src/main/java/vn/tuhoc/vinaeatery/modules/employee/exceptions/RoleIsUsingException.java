package vn.tuhoc.vinaeatery.modules.employee.exceptions;

public class RoleIsUsingException extends RuntimeException {
    public RoleIsUsingException(Integer id) {
        super(String.format("Chức vụ có mã %s đang được sử dụng!", id));
    }
}
