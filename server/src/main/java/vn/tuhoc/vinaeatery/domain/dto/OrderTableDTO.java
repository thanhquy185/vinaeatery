package vn.tuhoc.vinaeatery.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.OrderStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.OrderStatusConverter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderTableDTO {
    private Integer id;
    private Integer restaurantId;
    private RestaurantDTO restaurant;
    private EmployeeDTO employee;
    private CustomerDTO customer;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private String createAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private String arriveAt;
    private String customerFullname;
    private String customerPhone;
    private String customerEmail;
    private String customerNote;
    private Integer guests;
    @Convert(converter = OrderStatusConverter.class)
    private OrderStatusEnum status;
}
