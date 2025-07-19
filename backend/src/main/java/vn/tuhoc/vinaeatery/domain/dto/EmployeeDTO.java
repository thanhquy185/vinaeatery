package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Convert;
import vn.tuhoc.vinaeatery.domain.Role;
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
public class EmployeeDTO {
    // Properties
    private Integer id;
    private String image;
    private String fullname;
    private String birthday;
    private String gender;
    private String phone;
    private String email;
    private String address;
    private String dateBegin;
    private String dateEnd;
    private Role currentRole;
    private List<RoleHistoryDTO> roleHistories;
    private String username;
    @Convert(converter = CommonStatusConverter.class)
    private CommonStatusEnum status;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeUpdate;
}
