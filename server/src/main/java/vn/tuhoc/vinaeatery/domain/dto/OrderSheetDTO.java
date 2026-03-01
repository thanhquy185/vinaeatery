package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Convert;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.OrderSheetStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.OrderSheetStatusConverter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderSheetDTO {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer restaurantId;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime serviceAt;
    private EmployeeDTO employee;
    private TableDTO table;
    private Long totalPrice;
    private String note;
    private String message;
    @Convert(converter = OrderSheetStatusConverter.class)
    private OrderSheetStatusEnum status;
    private List<OrderSheetDetailDTO> orderSheetDetails;
}
