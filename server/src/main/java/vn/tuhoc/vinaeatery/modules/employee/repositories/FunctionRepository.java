package vn.tuhoc.vinaeatery.modules.employee.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.tuhoc.vinaeatery.modules.employee.domains.entities.FunctionEntity;

public interface FunctionRepository
        extends JpaRepository<FunctionEntity, Integer>, JpaSpecificationExecutor<FunctionEntity> {

}