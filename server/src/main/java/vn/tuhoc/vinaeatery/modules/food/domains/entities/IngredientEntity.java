package vn.tuhoc.vinaeatery.modules.food.domains.entities;

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
import vn.tuhoc.vinaeatery.modules.global.domains.converters.CommonStatusConverter;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;

@Entity
@Table(name = "ingredients")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@NamedEntityGraph(name = "IngredientEntity.full", attributeNodes = {
                @NamedAttributeNode("restaurant"),
                @NamedAttributeNode("categoryIngredient"),
})
@NamedEntityGraph(name = "IngredientEntity.onlyCategoryIngredient", attributeNodes = {
                @NamedAttributeNode("categoryIngredient"),
})
public class IngredientEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        Integer id;

        @Column(nullable = false)
        String name;

        @Column(nullable = false)
        String unit;

        @Column(nullable = false)
        Long capacity;

        @Column(columnDefinition = "DATE", nullable = true)
        String dateCreate;

        @Column(columnDefinition = "DATE", nullable = true)
        String dateRemove;

        @Column(nullable = true)
        Long inputPrice;

        @Column(nullable = false)
        Long inventory;

        @Column(columnDefinition = "MEDIUMTEXT", nullable = true)
        String note;

        @Column(nullable = false)
        @Convert(converter = CommonStatusConverter.class)
        CommonStatusEnum status;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "restaurant_id", nullable = false)
        RestaurantEntity restaurant;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "category_ingredient_id", nullable = false)
        CategoryIngredientEntity categoryIngredient;

        @OneToMany(mappedBy = "ingredient", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<InputTicketDetailEntity> inputTicketDetails;

        @OneToMany(mappedBy = "ingredient", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        List<RecipeEntity> recipes;
}
