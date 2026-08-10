package vn.tuhoc.vinaeatery.modules.employee.exceptions;

public class RoleHistoryNotFoundByIdException extends RuntimeException {
    public RoleHistoryNotFoundByIdException(Integer employeeId, Integer roleId, String dateStart) {
        super(String.format("Lịch sử chức vụ có mã nhân viên %d, mã chức vụ %d và ngày bắt đầu %s không tìm thấy!",
                employeeId, roleId, dateStart));
    }
}
