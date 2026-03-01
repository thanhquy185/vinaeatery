package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.Manager;

@Repository
public interface ManagerRepository
        extends JpaRepository<Manager, Integer>, JpaSpecificationExecutor<Manager> {
    // Methods
    Manager findOneById(Integer id);

    Manager findOneByUserId(Integer userId);

    

    void deleteById(Integer id);
}