package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.entity.MessageDetail;
import vn.tuhoc.vinaeatery.domain.entity.MessageDetailId;

@Repository
public interface MessageDetailRepository
        extends JpaRepository<MessageDetail, MessageDetailId>, JpaSpecificationExecutor<MessageDetail> {
    // Methods
    MessageDetail findOneById(MessageDetailId id);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.message_details WHERE message_id = :message_id ORDER BY send_at ASC", nativeQuery = true)
    List<MessageDetail> findAllByMessageId(@Param("message_id") Integer messageId);

    void deleteById(MessageDetailId id);
}
