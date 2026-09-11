package vn.tuhoc.vinaeatery.modules.active.domains.entities;

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
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.converters.ReservationStatusConverter;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.ReservationStatusEnum;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.EmployeeEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.CustomerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;

@Entity
@Table(name = "reservations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@NamedEntityGraph(name = "ReservationEntity.full", attributeNodes = {
                @NamedAttributeNode("restaurant"),
                @NamedAttributeNode("employee"),
                @NamedAttributeNode("customer"),
})
@NamedEntityGraph(name = "ReservationEntity.onlyRestaurant", attributeNodes = {
                @NamedAttributeNode("restaurant"),
})
public class ReservationEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        Integer id;

        @Column(columnDefinition = "DATETIME", nullable = false)
        String createAt;

        @Column(columnDefinition = "DATETIME", nullable = false)
        String arriveAt;

        @Column(nullable = false)
        String customerFullname;

        @Column(columnDefinition = "VARCHAR(11)", nullable = false)
        String customerPhone;

        @Column(nullable = false)
        String customerEmail;

        @Column(nullable = false)
        Integer customerGuests;

        @Column(columnDefinition = "MEDIUMTEXT", nullable = true)
        String customerNote;

        @Column(columnDefinition = "VARCHAR(9)", nullable = false)
        @Convert(converter = ReservationStatusConverter.class)
        ReservationStatusEnum status;

        @OneToMany(mappedBy = "reservation", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<UseTableEntity> useTables;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "restaurant_id", nullable = false)
        RestaurantEntity restaurant;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "employee_id", nullable = true)
        EmployeeEntity employee;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "customer_id", nullable = false)
        CustomerEntity customer;

}
