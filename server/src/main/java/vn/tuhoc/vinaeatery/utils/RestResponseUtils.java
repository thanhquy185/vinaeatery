package vn.tuhoc.vinaeatery.utils;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;

public class RestResponseUtils {
    public static <T> ResponseEntity<RestResponseDTO<T>> ok(String message, T data) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(RestResponseDTO.ok(message, data));
    }

    public static <T> ResponseEntity<RestResponseDTO<T>> okWithCookie(String cookie, String message, T data) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .header(HttpHeaders.SET_COOKIE, cookie)
                .body(RestResponseDTO.ok(message, data));
    }

    public static <T> ResponseEntity<RestResponseDTO<T>> created(String message, T data) {
        return ResponseEntity
                .status(HttpStatus.CREATED

                ).body(RestResponseDTO.created(message, data));
    }

    public static <T> ResponseEntity<RestResponseDTO<T>> badRequest(String error, String message) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(RestResponseDTO.badRequest(error, message));
    }

    public static <T> ResponseEntity<RestResponseDTO<T>> notFound(String error, String message) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(RestResponseDTO.notFound(error, message));
    }
}
