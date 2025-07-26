package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.OrderStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.OrderStatusConverter;
import vn.tuhoc.vinaeatery.repository.converter.PayStatusConverter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderDTO {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeCreate;
    private EmployeeDTO employee;
    private CustomerDTO customer;
    private Long totalPrice;
    @Convert(converter = PayStatusConverter.class)
    private PayStatusEnum payStatus;
    @Convert(converter = OrderStatusConverter.class)
    private OrderStatusEnum status;
    private List<OrderDetailDTO> orderDetails;
}
