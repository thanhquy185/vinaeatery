package vn.tuhoc.vinaeatery.modules.active.repositories;

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

import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseFoodEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.graphs.UseFoodEntityGraph;

public interface UseFoodRepository extends JpaRepository<UseFoodEntity, Long>, JpaSpecificationExecutor<UseFoodEntity> {
    @Query("""
                select distinct uf
                from UseFoodEntity uf
                where uf.id = :id
            """)
    Optional<UseFoodEntity> findOneByIdToCrud(@Param("id") Integer id);

    @EntityGraph(value = UseFoodEntityGraph.HALF)
    @Query("""
                select distinct uf
                from UseFoodEntity uf
                left join fetch uf.food f
                left join fetch f.recipes r
                left join fetch r.ingredient i
                left join fetch i.categoryIngredient
                where uf.id = :id
            """)
    Optional<UseFoodEntity> findOneById(@Param("id") Integer id);

    @EntityGraph(value = UseFoodEntityGraph.ONLY_FOOD)
    Page<UseFoodEntity> findAll(Specification<UseFoodEntity> specification, Pageable pageable);

    @Query("""
                select distinct uf
                from UseFoodEntity uf
                where uf.food.id in (:foodIds)
                    and uf.endAt is NULL
            """)
    List<UseFoodEntity> findAllByFoodIds(@Param("foodIds") List<Integer> foodIds);
}
