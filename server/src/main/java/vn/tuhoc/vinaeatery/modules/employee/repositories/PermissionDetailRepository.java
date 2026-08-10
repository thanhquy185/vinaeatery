package vn.tuhoc.vinaeatery.modules.employee.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.tuhoc.vinaeatery.modules.employee.domains.entities.PermissionDetailEntity;
import vn.tuhoc.vinaeatery.modules.employee.domains.entities.PermissionDetailIdEntity;

public interface PermissionDetailRepository
                extends JpaRepository<PermissionDetailEntity, PermissionDetailIdEntity>,
                JpaSpecificationExecutor<PermissionDetailEntity> {

}