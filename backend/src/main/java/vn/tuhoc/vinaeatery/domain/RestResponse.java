package vn.tuhoc.vinaeatery.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RestResponse<T> {
    // Properties
    private int status;
    private String error;
    private Object message;
    private T data;
}