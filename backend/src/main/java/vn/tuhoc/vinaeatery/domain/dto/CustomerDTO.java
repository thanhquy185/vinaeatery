package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.CustomerCard;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.CommonStatusConverter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CustomerDTO {
    // Properties
    private Integer id;
    private CustomerCard customerCard;
    private Long totalThreshold;
    private String fullname;
    private String birthday;
    private String gender;
    private String phone;
    private String email;
    private String address;
    private String description;
    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeUpdate;

}
