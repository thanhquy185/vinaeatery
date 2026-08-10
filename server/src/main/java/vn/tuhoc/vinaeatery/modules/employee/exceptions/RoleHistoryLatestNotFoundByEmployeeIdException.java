package vn.tuhoc.vinaeatery.modules.employee.exceptions;

public class RoleHistoryLatestNotFoundByEmployeeIdException extends RuntimeException {
    public RoleHistoryLatestNotFoundByEmployeeIdException(Integer employeeId) {
        super(String.format("Lịch sử chức vụ mới nhất có mã nhân viên %d không tìm thấy!", employeeId));
    }
}
