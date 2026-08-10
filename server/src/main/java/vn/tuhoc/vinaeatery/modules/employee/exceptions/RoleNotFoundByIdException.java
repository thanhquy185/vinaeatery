package vn.tuhoc.vinaeatery.modules.employee.exceptions;

public class RoleNotFoundByIdException extends RuntimeException {
    public RoleNotFoundByIdException(Integer id) {
        super(String.format("Chức vụ có mã %s không tìm thấy!", id));
    }
}
