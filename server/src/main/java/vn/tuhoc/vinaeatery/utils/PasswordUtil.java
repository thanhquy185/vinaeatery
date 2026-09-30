package vn.tuhoc.vinaeatery.utils;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserPasswordIsNotMatchException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserPasswordIsUsingException;

@Service
@RequiredArgsConstructor
@Transactional
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PasswordUtil {
    PasswordEncoder passwordEncoder;

    public void handlePasswordIsNotMatch(String newPassword, String confirmPassword) {
        if (!newPassword.equalsIgnoreCase(confirmPassword)) {
            throw new UserPasswordIsNotMatchException(newPassword, confirmPassword);
        }
    }

    public void handlePasswordIsUsing(String currentPassword, String newPassword) {
        if (this.passwordEncoder.matches(newPassword, currentPassword)) {
            throw new UserPasswordIsUsingException(newPassword);
        }
    }
}
