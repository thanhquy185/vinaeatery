package vn.tuhoc.vinaeatery.modules.employee.exceptions;

public class PermissionDetailNotFoundByIdException extends RuntimeException {
    public PermissionDetailNotFoundByIdException(Integer permissionId, Integer functionId, String action) {
        super(String.format("Chi tiết quyền hạn có mã quyền hạn %d, mã chức năng %d và hành động %s không tìm thấy!",
                permissionId, functionId, action));
    }
}
