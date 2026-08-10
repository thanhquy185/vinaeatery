package vn.tuhoc.vinaeatery.modules.employee.exceptions;

public class PermissionIsUsingException extends RuntimeException {
    public PermissionIsUsingException(Integer id) {
        super(String.format("Quyền hạn có mã %s đang được sử dụng!", id));
    }
}
