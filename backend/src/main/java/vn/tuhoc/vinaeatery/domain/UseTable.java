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
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.domain.enumm.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.UseTableStatusConverter;

@Entity
@Table(name = "use_tables")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UseTable {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "Bàn không được để trống !")
    private Integer tableId;
    private Integer orderId;
    private Integer orderTableId;
    @Column(columnDefinition = "DATETIME")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @NotNull(message = "Thời gian bắt đầu không được để trống !")
    private LocalDateTime timeStart;
    @Column(columnDefinition = "DATETIME")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timeEnd;
    @Convert(converter = UseTableStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống !")
    private UseTableStatusEnum status;
}
