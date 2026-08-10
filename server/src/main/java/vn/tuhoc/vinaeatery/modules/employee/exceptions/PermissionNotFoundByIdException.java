package vn.tuhoc.vinaeatery.modules.employee.exceptions;

public class PermissionNotFoundByIdException extends RuntimeException {
    public PermissionNotFoundByIdException(Integer id) {
        super(String.format("Quyền hạn có mã %s không tìm thấy!", id));
    }
}
