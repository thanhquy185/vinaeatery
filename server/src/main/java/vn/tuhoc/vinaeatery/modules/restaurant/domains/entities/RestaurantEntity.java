package vn.tuhoc.vinaeatery.modules.restaurant.domains.entities;

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
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MenuEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.OrderSheetEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.ReservationEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseFoodEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseTableEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.EmployeeEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.PermissionEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.RoleEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.CategoryFoodEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.CategoryIngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.FoodEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.IngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.SupplierEntity;
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineEntity;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.CategoryTableEntity;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.FloorEntity;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.TableEntity;

@Entity
@Table(name = "restaurants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@NamedEntityGraph(name = "RestaurantEntity.half", attributeNodes = {
                @NamedAttributeNode("manager")
})
public class RestaurantEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        Integer id;

        @Column(columnDefinition = "TIME", nullable = false)
        String openAt;

        @Column(columnDefinition = "TIME", nullable = false)
        String closeAt;

        @Column(nullable = false)
        String name;

        @Column(columnDefinition = "VARCHAR(11)", unique = true, nullable = false)
        String phone;

        @Column(unique = true, nullable = false)
        String email;

        @Column(nullable = false)
        Double latitude;

        @Column(nullable = false)
        Double longitude;

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
        @Convert(converter = CommonStatusConverter.class)
        CommonStatusEnum status;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "manager_id", nullable = false)
        ManagerEntity manager;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<UseTableEntity> useTables;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<PaymentMachineEntity> paymentMachines;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<FeedbackEntity> feedbacks;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<UseFoodEntity> useFoods;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<MenuEntity> menus;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<OrderSheetEntity> orderSheets;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<MessageEntity> messages;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<BillEntity> bills;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<ReservationEntity> reservations;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<FloorEntity> floors;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<CategoryTableEntity> categoryTables;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<TableEntity> tables;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<InputTicketEntity> inputTickets;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<SupplierEntity> suppliers;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<CategoryIngredientEntity> categoryIngredients;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<IngredientEntity> ingredients;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<CategoryFoodEntity> categoryFoods;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<RoleEntity> roles;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<PermissionEntity> permissions;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<EmployeeEntity> employees;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        List<FoodEntity> foods;

        @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @Builder.Default
        List<RestaurantImageEntity> restaurantImages = new ArrayList<>();

        public void addRestaurantImage(RestaurantImageEntity restaurantImageEntity) {
                this.restaurantImages.add(restaurantImageEntity);
                restaurantImageEntity.setRestaurant(this);
        }

        public void removeRestaurantImage(RestaurantImageEntity restaurantImageEntity) {
                this.restaurantImages.remove(restaurantImageEntity);
                restaurantImageEntity.setRestaurant(null);
        }
}
