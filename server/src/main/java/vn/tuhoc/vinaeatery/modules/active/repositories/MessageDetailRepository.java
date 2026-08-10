package vn.tuhoc.vinaeatery.modules.active.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageDetailIdEntity;

public interface MessageDetailRepository
        extends JpaRepository<MessageDetailEntity, MessageDetailIdEntity>,
        JpaSpecificationExecutor<MessageDetailEntity> {
    // Methods
    MessageDetailEntity findOneById(MessageDetailIdEntity id);

    @Transactional
    @Query(value = "SELECT * FROM vinaeatery.message_details WHERE message_id = :message_id ORDER BY send_at ASC", nativeQuery = true)
    List<MessageDetailEntity> findAllByMessageId(@Param("message_id") Integer messageId);

    void deleteById(MessageDetailIdEntity id);
}
