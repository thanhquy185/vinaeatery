package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(CategoryPermissionTicket.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class CategoryPermissionTicket_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryPermissionTicket#name
	 **/
	public static volatile SingularAttribute<CategoryPermissionTicket, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryPermissionTicket#description
	 **/
	public static volatile SingularAttribute<CategoryPermissionTicket, String> description;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryPermissionTicket#updateAt
	 **/
	public static volatile SingularAttribute<CategoryPermissionTicket, String> updateAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryPermissionTicket#id
	 **/
	public static volatile SingularAttribute<CategoryPermissionTicket, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryPermissionTicket#restaurantId
	 **/
	public static volatile SingularAttribute<CategoryPermissionTicket, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryPermissionTicket
	 **/
	public static volatile EntityType<CategoryPermissionTicket> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryPermissionTicket#status
	 **/
	public static volatile SingularAttribute<CategoryPermissionTicket, CommonStatusEnum> status;

	public static final String NAME = "name";
	public static final String DESCRIPTION = "description";
	public static final String UPDATE_AT = "updateAt";
	public static final String ID = "id";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String STATUS = "status";

}

