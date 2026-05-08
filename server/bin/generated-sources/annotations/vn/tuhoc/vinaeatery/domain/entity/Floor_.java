package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(Floor.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Floor_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Floor#name
	 **/
	public static volatile SingularAttribute<Floor, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Floor#description
	 **/
	public static volatile SingularAttribute<Floor, String> description;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Floor#id
	 **/
	public static volatile SingularAttribute<Floor, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Floor#restaurantId
	 **/
	public static volatile SingularAttribute<Floor, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Floor
	 **/
	public static volatile EntityType<Floor> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Floor#status
	 **/
	public static volatile SingularAttribute<Floor, CommonStatusEnum> status;

	public static final String NAME = "name";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String STATUS = "status";

}

