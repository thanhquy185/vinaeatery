package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.TableE;

@Repository
public interface TableRepository
        extends JpaRepository<TableE, Integer>, JpaSpecificationExecutor<TableE> {
    // Methods
    TableE findOneById(Integer id);

    List<TableE> findAllByCategoryTableId(Integer categoryTableId);

    void deleteById(Integer id);
}