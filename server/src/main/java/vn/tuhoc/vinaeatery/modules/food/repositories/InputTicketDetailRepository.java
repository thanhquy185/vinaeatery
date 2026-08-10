package vn.tuhoc.vinaeatery.modules.food.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketDetailEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketDetailIdEntity;

public interface InputTicketDetailRepository
        extends JpaRepository<InputTicketDetailEntity, InputTicketDetailIdEntity>,
        JpaSpecificationExecutor<InputTicketDetailEntity> {
}
