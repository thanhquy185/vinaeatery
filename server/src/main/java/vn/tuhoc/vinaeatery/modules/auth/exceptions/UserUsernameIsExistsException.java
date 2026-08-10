package vn.tuhoc.vinaeatery.modules.auth.exceptions;

public class UserUsernameIsExistsException extends RuntimeException {
    public UserUsernameIsExistsException(String username) {
        super(String.format("Tên tài khoản %s đã tồn tại!", username));
    }
}
