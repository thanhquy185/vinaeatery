package vn.tuhoc.vinaeatery.modules.active.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillDetailIdEntity;

public interface BillDetailRepository
        extends JpaRepository<BillDetailEntity, BillDetailIdEntity>,
        JpaSpecificationExecutor<BillDetailEntity> {

}
