package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.entity.PayMethod;
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
    private Integer restaurantId;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createAt;
    private EmployeeDTO employee;
    private CustomerDTO customer;
    private String customerFullname;
    private String customerPhone;
    private String customerEmail;
    private Long totalPrice;
    @Convert(converter = OrderStatusConverter.class)
    private OrderStatusEnum status;
    private List<OrderDetailDTO> orderDetails;
    private String payId;
    private PayMethod payMethod;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime payTime;
    private Long payTotalPrice;
    @Convert(converter = PayStatusConverter.class)
    private PayStatusEnum payStatus;
}
