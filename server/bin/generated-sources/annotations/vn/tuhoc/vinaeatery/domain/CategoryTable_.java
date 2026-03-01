package vn.tuhoc.vinaeatery.domain;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(CategoryTable.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class CategoryTable_ {

	/**
	 * @see vn.tuhoc.vinaeatery.domain.CategoryTable#surchargeValue
	 **/
	public static volatile SingularAttribute<CategoryTable, Long> surchargeValue;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.CategoryTable#surchargeType
	 **/
	public static volatile SingularAttribute<CategoryTable, String> surchargeType;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.CategoryTable#updateAt
	 **/
	public static volatile SingularAttribute<CategoryTable, LocalDateTime> updateAt;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.CategoryTable#name
	 **/
	public static volatile SingularAttribute<CategoryTable, String> name;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.CategoryTable#description
	 **/
	public static volatile SingularAttribute<CategoryTable, String> description;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.CategoryTable#id
	 **/
	public static volatile SingularAttribute<CategoryTable, Integer> id;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.CategoryTable
	 **/
	public static volatile EntityType<CategoryTable> class_;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.CategoryTable#status
	 **/
	public static volatile SingularAttribute<CategoryTable, CommonStatusEnum> status;

	public static final String SURCHARGE_VALUE = "surchargeValue";
	public static final String SURCHARGE_TYPE = "surchargeType";
	public static final String TIME_UPDATE = "updateAt";
	public static final String NAME = "name";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";
	public static final String STATUS = "status";

}
