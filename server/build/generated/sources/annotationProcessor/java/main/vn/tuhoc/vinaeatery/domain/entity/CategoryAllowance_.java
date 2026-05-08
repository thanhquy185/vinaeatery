package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(CategoryAllowance.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class CategoryAllowance_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryAllowance#money
	 **/
	public static volatile SingularAttribute<CategoryAllowance, Integer> money;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryAllowance#name
	 **/
	public static volatile SingularAttribute<CategoryAllowance, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryAllowance#description
	 **/
	public static volatile SingularAttribute<CategoryAllowance, String> description;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryAllowance#id
	 **/
	public static volatile SingularAttribute<CategoryAllowance, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryAllowance#restaurantId
	 **/
	public static volatile SingularAttribute<CategoryAllowance, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryAllowance
	 **/
	public static volatile EntityType<CategoryAllowance> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryAllowance#status
	 **/
	public static volatile SingularAttribute<CategoryAllowance, CommonStatusEnum> status;

	public static final String MONEY = "money";
	public static final String NAME = "name";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String STATUS = "status";

}

