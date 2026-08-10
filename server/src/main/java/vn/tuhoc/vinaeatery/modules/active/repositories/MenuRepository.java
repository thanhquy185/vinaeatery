package vn.tuhoc.vinaeatery.modules.active.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vn.tuhoc.vinaeatery.modules.active.domains.entities.MenuEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.graphs.MenuEntityGraph;

public interface MenuRepository
                extends JpaRepository<MenuEntity, Integer>, JpaSpecificationExecutor<MenuEntity> {
        @Query("""
                            select distinct m
                            from MenuEntity m
                            where m.id = :id
                        """)
        Optional<MenuEntity> findOneByIdToCrud(@Param("id") Integer id);

        @EntityGraph(value = MenuEntityGraph.HALF)
        @Query("""
                            select distinct m
                            from MenuEntity m
                            left join fetch m.menuDetails md
                            left join fetch md.food f
                            left join fetch f.categoryFood cf
                            where m.id = :id
                        """)
        Optional<MenuEntity> findOneById(@Param("id") Integer id);

        @EntityGraph(value = MenuEntityGraph.HALF)
        Page<MenuEntity> findAll(Specification<MenuEntity> specification, Pageable pageable);
}
