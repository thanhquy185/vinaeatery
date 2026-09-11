package vn.tuhoc.vinaeatery.modules.restaurant.domains.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "restaurant_images")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RestaurantImageEntity {
    @EmbeddedId
    RestaurantImageIdEntity id;

    @MapsId("restaurantId")
    @ManyToOne
    @JsonIgnore
    RestaurantEntity restaurant;
}
