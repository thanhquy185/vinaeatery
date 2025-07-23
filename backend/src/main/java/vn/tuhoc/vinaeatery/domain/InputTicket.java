package vn.tuhoc.vinaeatery.domain;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.InputTicketStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.InputTicketStatusConverter;
import vn.tuhoc.vinaeatery.repository.converter.PayStatusConverter;

@Entity
@Table(name = "input_tickets")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class InputTicket {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(columnDefinition = "DATETIME")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeCreate;
    private Integer employeeId;
    private Integer supplierId;
    private Long totalPrice;
    @Convert(converter = PayStatusConverter.class)
    private PayStatusEnum payStatus;
    @Column(columnDefinition = "TINYINT(3)")
    @Convert(converter = InputTicketStatusConverter.class)
    private InputTicketStatusEnum status;
}
