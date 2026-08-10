package vn.tuhoc.vinaeatery.modules.auth.exceptions;

public class UserPasswordIsNotMatchException extends RuntimeException {
    public UserPasswordIsNotMatchException(String newPassword, String newPassword2) {
        super(String.format("%s và %s không giống nhau!", newPassword, newPassword2));
    }
}
