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

import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.graphs.MessageEntityGraph;

public interface MessageRepository
        extends JpaRepository<MessageEntity, Integer>, JpaSpecificationExecutor<MessageEntity> {
    @Query("""
                select distinct m
                from MessageEntity m
                where m.id = :id
            """)
    Optional<MessageEntity> findOneByIdToCrud(@Param("id") Integer id);

    @EntityGraph(value = MessageEntityGraph.HALF)
    @Query("""
                select distinct m
                from MessageEntity m
                left join fetch m.messageDetails
                where m.id = :id
            """)
    Optional<MessageEntity> findOneById(@Param("id") Integer id);

    @EntityGraph(value = MessageEntityGraph.HALF)
    @Query("""
                select distinct m
                from MessageEntity m
                left join fetch m.messageDetails
                where m.useTable.id = :useTableId
            """)
    Optional<MessageEntity> findOneByUseTableId(@Param("useTableId") Long useTableId);

    // Vì Message -> Use Table -> Table -> Floor and Category Table (4 cấp)
    // Nên không thể dùng cách @EntityGraph, @Quey hay @NameEntityGraph
    // Mà dùng join fetch trong Specification
    Page<MessageEntity> findAll(Specification<MessageEntity> specification, Pageable pageable);

}
