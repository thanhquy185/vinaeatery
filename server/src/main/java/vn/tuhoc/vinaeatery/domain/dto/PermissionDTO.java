package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Convert;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.CommonStatusConverter;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PermissionDTO {
    // Properties
    private Integer id;
    private Integer restaurantId;
    private String name;
    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;
    private String updateAt;
    private List<PermissionDetailDTO> permissionDetails;
}
