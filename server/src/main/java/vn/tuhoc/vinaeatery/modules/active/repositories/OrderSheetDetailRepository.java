package vn.tuhoc.vinaeatery.modules.active.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.tuhoc.vinaeatery.modules.active.domains.entities.OrderSheetDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.OrderSheetDetailIdEntity;

public interface OrderSheetDetailRepository
        extends JpaRepository<OrderSheetDetailEntity, OrderSheetDetailIdEntity>,
        JpaSpecificationExecutor<OrderSheetDetailEntity> {

}
