package vn.tuhoc.vinaeatery.domain.entity;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RestaurantImageForCrud {
    private Integer restaurantId;
    private MultipartFile image;
}
