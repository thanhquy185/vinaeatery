package vn.tuhoc.vinaeatery.modules.employee.exceptions;

public class RoleHistoryCanNotUpdateOnDayException extends RuntimeException {
    public RoleHistoryCanNotUpdateOnDayException() {
        super("Hôm sau mới được thay đổi chức vụ!");
    }
}
