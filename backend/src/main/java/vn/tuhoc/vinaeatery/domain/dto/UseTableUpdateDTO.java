package vn.tuhoc.vinaeatery.domain.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.validation.constraints.NotNull;
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
public class UseTableUpdateDTO {
    private LocalDateTime timeEnd;
    private Integer employeeId;
    private Integer customerId;
    private Integer orderId;
    private Integer orderTableId;
    @Convert(converter = UseTableStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống !")
    private UseTableStatusEnum status;
}
