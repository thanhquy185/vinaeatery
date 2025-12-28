package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.entity.Floor;
import vn.tuhoc.vinaeatery.domain.entity.TableE;

@Repository
public interface FloorRepository extends JpaRepository<Floor, Integer>, JpaSpecificationExecutor<Floor> {
    // Methods
    Floor findOneById(Integer id);

    @Transactional
    @Query(value = "SELECT t.* FROM vinaeatery.tables AS t JOIN vinaeatery.floors AS f ON f.id = t.floor_id WHERE f.id = :floor_id", nativeQuery = true)
    List<TableE> findAllTableUsing(@Param("floor_id") Integer floorId);
    
    void deleteById(Integer id);
}
