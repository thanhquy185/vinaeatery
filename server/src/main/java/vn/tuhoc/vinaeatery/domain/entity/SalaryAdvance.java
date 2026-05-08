package vn.tuhoc.vinaeatery.domain.entity;

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
import vn.tuhoc.vinaeatery.domain.enumm.SalaryAdvanceStatusEnum;
import vn.tuhoc.vinaeatery.repository.converter.SalaryAdvanceStatusConverter;

@Entity
@Table(name = "salary_advances")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SalaryAdvance {
    // Properties
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "Mã nhà hàng không được để trống!")
    private Integer restaurantId;
    @Column(columnDefinition = "DATETIME")
    @NotNull(message = "Thời gian tạo phiếu không được để trống!")
    private String createAt;
    // @NotNull(message = "Mã nhân viên xử lý không được để trống!")
    private Integer employeeHandleId;
    @NotNull(message = "Mã nhân viên thưởng phạt không được để trống!")
    private Integer employeeMainId;
    @Column(columnDefinition = "DATE")
    @NotNull(message = "Ngày thưởng phạt không được để trống!")
    private String date;
    @NotNull(message = "Số tiền không được để trống!")
    private Long money;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String reason;
    @Column(columnDefinition = "TINYINT(2)")
    @Convert(converter = SalaryAdvanceStatusConverter.class)
    @NotNull(message = "Trạng thái không được để trống!")
    private SalaryAdvanceStatusEnum status;
}
