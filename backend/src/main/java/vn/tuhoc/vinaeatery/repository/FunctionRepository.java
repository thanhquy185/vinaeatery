package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.Function;

@Repository
public interface FunctionRepository extends JpaRepository<Function, Integer>, JpaSpecificationExecutor<Function> {
    // Methods
    Function findOneById(Integer id);

    void deleteById(Integer id);
}