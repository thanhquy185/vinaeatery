package vn.tuhoc.vinaeatery.modules.food.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.graphs.InputTicketEntityGraph;

public interface InputTicketRepository
    extends JpaRepository<InputTicketEntity, Integer>, JpaSpecificationExecutor<InputTicketEntity> {
  @Query("""
          select distinct ip
          from InputTicketEntity ip
          where ip.id = :id
      """)
  Optional<InputTicketEntity> findOneByIdToCrud(@Param("id") Integer id);

  @EntityGraph(value = InputTicketEntityGraph.HALF)
  @Query("""
          select distinct ip
          from InputTicketEntity ip
          left join fetch ip.inputTicketDetails ipd
          left join fetch ipd.ingredient i
          left join fetch i.categoryIngredient ci
          where ip.id = :id
      """)
  Optional<InputTicketEntity> findOneById(@Param("id") Integer id);

  @EntityGraph(value = InputTicketEntityGraph.ONLY_EMPLOYEE_AND_SUPPLIER)
  Page<InputTicketEntity> findAll(Specification<InputTicketEntity> specification, Pageable pageable);

  @Query("""
          select distinct ip
          from InputTicketEntity ip
          left join fetch ip.supplier s
          where ip.restaurant.id = :restaurantId
            and ip.status = vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketStatusEnum.CONFIRMED
            and ip.paymentStatus = vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketPaymentStatusEnum.PAID
            and ip.createAt between :createAtStart and :createAtEnd
          order by ip.createAt asc
      """)
  List<InputTicketEntity> findAllInTimeRange(
      @Param("restaurantId") Integer restaurantId,
      @Param("createAtStart") String createAtStart,
      @Param("createAtEnd") String createAtEnd);

  @Query("""
          select distinct ip
          from InputTicketEntity ip
          left join fetch ip.supplier s
          left join fetch ip.inputTicketDetails ids
          left join fetch ids.ingredient i
          left join fetch i.categoryIngredient
          where ip.restaurant.id = :restaurantId
            and ip.status = vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketStatusEnum.CONFIRMED
            and ip.paymentStatus = vn.tuhoc.vinaeatery.modules.food.domains.enums.InputTicketPaymentStatusEnum.PAID
            and ip.createAt between :createAtStart and :createAtEnd
          order by ip.createAt asc
      """)
  List<InputTicketEntity> findAllWithDetailsInTimeRange(
      @Param("restaurantId") Integer restaurantId,
      @Param("createAtStart") String createAtStart,
      @Param("createAtEnd") String createAtEnd);
}
