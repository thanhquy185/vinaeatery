package vn.tuhoc.vinaeatery.util;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;

import vn.tuhoc.vinaeatery.domain.RestResponse;

public class ValidationUtil {
    public record ValidationError(String field, String message) {
    }

    public static RestResponse<?> buildRestResponseWithBR(BindingResult bindingResult) {
        List<ValidationError> errorList = bindingResult.getFieldErrors().stream()
                .map(fieldError -> new ValidationError(fieldError.getField(), fieldError.getDefaultMessage()))
                .collect(Collectors.toList());

        RestResponse<List<ValidationUtil.ValidationError>> restResponse = new RestResponse<>();
        restResponse.setStatus(HttpStatus.BAD_REQUEST.value());
        restResponse.setError("VALIDATION_ERROR");
        restResponse.setMessage("Dữ liệu không hợp lệ");
        restResponse.setData(errorList);

        return restResponse;
    }

    public static RestResponse<?> buildRestResponseWithStr(String error) {
        RestResponse<String> restResponse = new RestResponse<>();
        restResponse.setStatus(HttpStatus.BAD_REQUEST.value());
        restResponse.setError("VALIDATION_ERROR");
        restResponse.setMessage("Thao tác không thể thực hiện");
        restResponse.setData(error);

        return restResponse;
    }
}
