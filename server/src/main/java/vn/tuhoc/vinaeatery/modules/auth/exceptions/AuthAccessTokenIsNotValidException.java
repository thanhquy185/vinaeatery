package vn.tuhoc.vinaeatery.modules.auth.exceptions;

public class AuthAccessTokenIsNotValidException extends RuntimeException {
    public AuthAccessTokenIsNotValidException() {
        super("Access token không hợp lệ!");
    }
}
