package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.UseTableStatusConverter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UseTableDTO {
    // Properties
    private Long id;
    private Integer restaurantId;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeStart;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeEnd;
    private TableDTO table;
    private EmployeeDTO employee;
    private CustomerDTO customer;
    private String customerFullname;
    private String customerPhone;
    private String customerEmail;
    private OrderDTO order;
    private OrderTableDTO orderTable;
    @Convert(converter = UseTableStatusConverter.class)
    private UseTableStatusEnum status;
    List<OrderSheetDTO> orderSheets;
    MessageDTO message;
}
