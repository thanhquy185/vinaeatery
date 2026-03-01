package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Integer>, JpaSpecificationExecutor<Permission> {
    // Methods
    Permission findOneById(Integer id);

    void deleteById(Integer id);
}