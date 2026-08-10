package vn.tuhoc.vinaeatery.modules.food.domains.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "input_ticket_details")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InputTicketDetailEntity {
    @EmbeddedId
    private InputTicketDetailIdEntity id;

    @MapsId("inputTicketId")
    @ManyToOne
    @JsonIgnore
    private InputTicketEntity inputTicket;

    @MapsId("ingredientId")
    @ManyToOne(fetch = FetchType.LAZY)
    private IngredientEntity ingredient;

    @Column(nullable = false)
    private Long quantity;

    @Column(nullable = false)
    private Long inputPrice;

    @Column(nullable = false)
    private String ingredientNameSnapshot;

    @Column(nullable = false)
    private Long ingredientInputPriceSnapshot;

    @Column(nullable = false)
    private Long totalInputPriceDetail;
}
