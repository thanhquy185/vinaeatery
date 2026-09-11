package vn.tuhoc.vinaeatery.modules.auth.services.interfaces;

import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.AuthLoginRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.requests.AuthRegisterRequestDTO;
import vn.tuhoc.vinaeatery.modules.auth.dtos.responses.AuthLoginResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerDetailResponseDTO;

public interface AuthService {
    CustomerDetailResponseDTO handleCustomerRegister(AuthRegisterRequestDTO authRegisterRequestDTO);

    Object handleGetInfo();

    AuthLoginResponseDTO handleLogin(AuthLoginRequestDTO authLoginRequestDTO);

    AuthLoginResponseDTO handleRefreshToken(String refreshToken);

    AuthLoginResponseDTO handleLogout(String refreshToken);
}
