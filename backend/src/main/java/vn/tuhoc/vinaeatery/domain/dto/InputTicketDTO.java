package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.Supplier;
import vn.tuhoc.vinaeatery.domain.enumm.InputTicketStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.InputTicketStatusConverter;
import vn.tuhoc.vinaeatery.repository.converter.PayStatusConverter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InputTicketDTO {
    // Properties
    private Integer id;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeCreate;
    private EmployeeDTO employee;
    private Supplier supplier;
    private Long totalPrice;
    @Convert(converter = PayStatusConverter.class)
    private PayStatusEnum payStatus;
    @Convert(converter = InputTicketStatusConverter.class)
    private InputTicketStatusEnum status;
    private List<InputTicketDetailDTO> inputTicketDetails;
}
