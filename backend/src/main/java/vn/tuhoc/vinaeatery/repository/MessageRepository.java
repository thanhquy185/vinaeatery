package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.Message;

@Repository
public interface MessageRepository
        extends JpaRepository<Message, Integer>, JpaSpecificationExecutor<Message> {
    // Methods
    Message findOneById(Integer id);
    
    Message findOneByUseTableId(Long useTableId);

    void deleteById(Integer id);
}
