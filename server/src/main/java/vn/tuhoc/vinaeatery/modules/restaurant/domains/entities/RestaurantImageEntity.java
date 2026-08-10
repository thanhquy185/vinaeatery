package vn.tuhoc.vinaeatery.modules.restaurant.domains.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "restaurant_images")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantImageEntity {
    @EmbeddedId
    private RestaurantImageIdEntity id;

    @MapsId("restaurantId")
    @ManyToOne
    @JsonIgnore
    private RestaurantEntity restaurant;
}
