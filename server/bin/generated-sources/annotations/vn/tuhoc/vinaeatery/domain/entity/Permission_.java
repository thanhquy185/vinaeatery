package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(Permission.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Permission_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Permission#name
	 **/
	public static volatile SingularAttribute<Permission, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Permission#id
	 **/
	public static volatile SingularAttribute<Permission, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Permission#restaurantId
	 **/
	public static volatile SingularAttribute<Permission, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Permission
	 **/
	public static volatile EntityType<Permission> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Permission#status
	 **/
	public static volatile SingularAttribute<Permission, CommonStatusEnum> status;

	public static final String NAME = "name";
	public static final String ID = "id";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String STATUS = "status";

}

