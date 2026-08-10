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

import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.CustomerEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.graphs.CustomerEntityGraph;

public interface CustomerRepository
                extends JpaRepository<CustomerEntity, Integer>, JpaSpecificationExecutor<CustomerEntity> {
        @Query("""
                                select distinct c
                                from CustomerEntity c
                                where c.id = :id
                        """)
        Optional<CustomerEntity> findOneByIdToCrud(@Param("id") Integer id);

        @EntityGraph(value = CustomerEntityGraph.FULL)
        @Query("""
                                select distinct c
                                from CustomerEntity c
                                where c.id = :id
                        """)
        Optional<CustomerEntity> findOneById(@Param("id") Integer id);

        @EntityGraph(value = CustomerEntityGraph.FULL)
        @Query("""
                                select distinct c
                                from CustomerEntity c
                                where c.user.id = :userId
                        """)
        Optional<CustomerEntity> findOneByUserId(@Param("userId") Integer userId);

        @EntityGraph(value = CustomerEntityGraph.FULL)
        @Query("""
                                select distinct c
                                from CustomerEntity c
                                where c.email = :email
                        """)
        Optional<CustomerEntity> findOneByEmail(@Param("email") String email);

        @EntityGraph(value = CustomerEntityGraph.FULL)
        Page<CustomerEntity> findAll(Specification<CustomerEntity> specification, Pageable pageable);

        @EntityGraph(value = CustomerEntityGraph.FULL)
        @Query("""
                            select c
                            from CustomerEntity c
                            where c.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
                        """)
        List<CustomerEntity> findAllCrud();

        Boolean existsByPhone(String phone);

        Boolean existsByEmail(String email);
}