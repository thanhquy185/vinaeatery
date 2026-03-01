package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(Shift.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Shift_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Shift#name
	 **/
	public static volatile SingularAttribute<Shift, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Shift#updateAt
	 **/
	public static volatile SingularAttribute<Shift, String> updateAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Shift#id
	 **/
	public static volatile SingularAttribute<Shift, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Shift#restaurantId
	 **/
	public static volatile SingularAttribute<Shift, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Shift
	 **/
	public static volatile EntityType<Shift> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Shift#status
	 **/
	public static volatile SingularAttribute<Shift, CommonStatusEnum> status;

	public static final String NAME = "name";
	public static final String UPDATE_AT = "updateAt";
	public static final String ID = "id";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String STATUS = "status";

}

