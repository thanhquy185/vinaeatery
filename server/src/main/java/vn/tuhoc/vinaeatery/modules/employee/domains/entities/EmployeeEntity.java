package vn.tuhoc.vinaeatery.modules.employee.domains.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedAttributeNode;
import jakarta.persistence.NamedEntityGraph;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.OrderSheetEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.ReservationEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseFoodEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseTableEntity;
import vn.tuhoc.vinaeatery.modules.auth.domains.entities.UserEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.converters.EmployeeStatusConverter;
import vn.tuhoc.vinaeatery.modules.employee.domains.enums.EmployeeStatusEnum;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketEntity;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonGenderConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonGenderEnum;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;

@Entity
@Table(name = "employees")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@NamedEntityGraph(name = "EmployeeEntity.half", attributeNodes = {
        @NamedAttributeNode("restaurant"),
        @NamedAttributeNode("user"),
        @NamedAttributeNode("role"),
        @NamedAttributeNode("permission"),
})
@NamedEntityGraph(name = "EmployeeEntity.onlyUserAndRoleAndPermission", attributeNodes = {
        @NamedAttributeNode("user"),
        @NamedAttributeNode("role"),
        @NamedAttributeNode("permission"),
})
public class EmployeeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(nullable = true)
    String imageUrl;

    @Column(nullable = true)
    String imagePublicId;

    @Column(nullable = false)
    String fullname;

    @Column(columnDefinition = "DATE", nullable = false)
    String birthdate;

    @Column(columnDefinition = "VARCHAR(6)", nullable = false)
    @Convert(converter = CommonGenderConverter.class)
    CommonGenderEnum gender;

    @Column(columnDefinition = "VARCHAR(11)", unique = true, nullable = false)
    String phone;

    @Column(unique = true, nullable = false)
    String email;

    @Column(columnDefinition = "VARCHAR(25)", nullable = false)
    String houseNumber;

    @Column(columnDefinition = "VARCHAR(100)", nullable = false)
    String streetName;

    @Column(columnDefinition = "VARCHAR(30)", nullable = false)
    String ward;

    @Column(columnDefinition = "VARCHAR(25)", nullable = false)
    String province;

    @Column(columnDefinition = "MEDIUMTEXT", nullable = true)
    String description;

    @Column(columnDefinition = "VARCHAR(8)", nullable = false)
    @Convert(converter = EmployeeStatusConverter.class)
    EmployeeStatusEnum status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    RestaurantEntity restaurant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    RoleEntity role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permission_id", nullable = false)
    PermissionEntity permission;

    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    List<PaymentMachineEntity> paymentMachines;

    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    List<UseTableEntity> useTables;

    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    List<UseFoodEntity> useFoods;

    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    List<OrderSheetEntity> orderSheets;

    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    List<BillEntity> bills;

    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    List<ReservationEntity> reservations;

    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    List<InputTicketEntity> inputTickets;

    @OneToMany(mappedBy = "employee", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    List<RoleHistoryEntity> roleHistories = new ArrayList<>();

    public void addRoleHistory(RoleHistoryEntity roleHistoryEntity) {
        this.roleHistories.add(roleHistoryEntity);
        roleHistoryEntity.setEmployee(this);
    }

    public void removeRoleHistory(RoleHistoryEntity roleHistoryEntity) {
        this.roleHistories.remove(roleHistoryEntity);
        roleHistoryEntity.setEmployee(null);
    }
}
