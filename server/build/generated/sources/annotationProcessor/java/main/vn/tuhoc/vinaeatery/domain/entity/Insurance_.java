package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(Insurance.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Insurance_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Insurance#note
	 **/
	public static volatile SingularAttribute<Insurance, String> note;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Insurance#month
	 **/
	public static volatile SingularAttribute<Insurance, String> month;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Insurance#name
	 **/
	public static volatile SingularAttribute<Insurance, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Insurance#id
	 **/
	public static volatile SingularAttribute<Insurance, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Insurance#restaurantId
	 **/
	public static volatile SingularAttribute<Insurance, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Insurance
	 **/
	public static volatile EntityType<Insurance> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Insurance#status
	 **/
	public static volatile SingularAttribute<Insurance, CommonStatusEnum> status;

	public static final String NOTE = "note";
	public static final String MONTH = "month";
	public static final String NAME = "name";
	public static final String ID = "id";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String STATUS = "status";

}

