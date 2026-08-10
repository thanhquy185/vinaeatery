package vn.tuhoc.vinaeatery.modules.active.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.tuhoc.vinaeatery.modules.active.domains.entities.MenuDetailEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MenuDetailIdEntity;

public interface MenuDetailRepository
        extends JpaRepository<MenuDetailEntity, MenuDetailIdEntity>,
        JpaSpecificationExecutor<MenuDetailEntity> {

}
