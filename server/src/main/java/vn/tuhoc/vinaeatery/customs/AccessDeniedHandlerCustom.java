package vn.tuhoc.vinaeatery.customs;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;

@Component
@RequiredArgsConstructor
public class AccessDeniedHandlerCustom implements AccessDeniedHandler {
    private final ObjectMapper objectMapper;

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException) throws IOException {
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType("application/json;charset=UTF-8");

        RestResponseDTO<Object> restResponseDTO = RestResponseDTO.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .error(accessDeniedException.getMessage())
                .message("Bạn không có quyền truy cập tài nguyên này!")
                .build();

        this.objectMapper.writeValue(response.getWriter(), restResponseDTO);
    }
}
