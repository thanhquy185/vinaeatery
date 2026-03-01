package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import vn.tuhoc.vinaeatery.domain.enumm.CategoryTableSurchargeTypeEnum;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(CategoryTable.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class CategoryTable_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryTable#surchargeValue
	 **/
	public static volatile SingularAttribute<CategoryTable, Long> surchargeValue;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryTable#surchargeType
	 **/
	public static volatile SingularAttribute<CategoryTable, CategoryTableSurchargeTypeEnum> surchargeType;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryTable#name
	 **/
	public static volatile SingularAttribute<CategoryTable, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryTable#description
	 **/
	public static volatile SingularAttribute<CategoryTable, String> description;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryTable#updateAt
	 **/
	public static volatile SingularAttribute<CategoryTable, LocalDateTime> updateAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryTable#id
	 **/
	public static volatile SingularAttribute<CategoryTable, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryTable#restaurantId
	 **/
	public static volatile SingularAttribute<CategoryTable, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryTable
	 **/
	public static volatile EntityType<CategoryTable> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryTable#status
	 **/
	public static volatile SingularAttribute<CategoryTable, CommonStatusEnum> status;

	public static final String SURCHARGE_VALUE = "surchargeValue";
	public static final String SURCHARGE_TYPE = "surchargeType";
	public static final String NAME = "name";
	public static final String DESCRIPTION = "description";
	public static final String UPDATE_AT = "updateAt";
	public static final String ID = "id";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String STATUS = "status";

}

