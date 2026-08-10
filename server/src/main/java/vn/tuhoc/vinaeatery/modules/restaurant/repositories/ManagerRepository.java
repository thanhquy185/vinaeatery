package vn.tuhoc.vinaeatery.modules.restaurant.repositories;

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

import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.ManagerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.graphs.ManagerEntityGraph;

public interface ManagerRepository
                extends JpaRepository<ManagerEntity, Integer>, JpaSpecificationExecutor<ManagerEntity> {
        @Query("""
                                select distinct m
                                from ManagerEntity m
                                where m.id = :id
                        """)
        Optional<ManagerEntity> findOneByIdToCrud(@Param("id") Integer id);

        @EntityGraph(value = ManagerEntityGraph.FULL)
        @Query("""
                                select distinct m
                                from ManagerEntity m
                                where m.id = :id
                        """)
        Optional<ManagerEntity> findOneById(@Param("id") Integer id);

        @EntityGraph(value = ManagerEntityGraph.FULL)
        @Query("""
                                select distinct m
                                from ManagerEntity m
                                where m.user.id = :userId
                        """)
        Optional<ManagerEntity> findOneByUserId(@Param("userId") Integer userId);

        @EntityGraph(value = ManagerEntityGraph.FULL)
        @Query("""
                                select distinct m
                                from ManagerEntity m
                                where m.email = :email
                        """)
        Optional<ManagerEntity> findOneByEmail(@Param("email") String email);

        @EntityGraph(value = ManagerEntityGraph.FULL)
        Page<ManagerEntity> findAll(Specification<ManagerEntity> specification, Pageable pageable);

        @EntityGraph(value = ManagerEntityGraph.FULL)
        @Query("""
                            select m
                            from ManagerEntity m
                            where m.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
                        """)
        List<ManagerEntity> findAllCrud();

        Boolean existsByPhone(String phone);

        Boolean existsByEmail(String email);
}