package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(Restaurant.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Restaurant_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Restaurant#address
	 **/
	public static volatile SingularAttribute<Restaurant, String> address;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Restaurant#phone
	 **/
	public static volatile SingularAttribute<Restaurant, String> phone;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Restaurant#name
	 **/
	public static volatile SingularAttribute<Restaurant, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Restaurant#rating
	 **/
	public static volatile SingularAttribute<Restaurant, Float> rating;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Restaurant#description
	 **/
	public static volatile SingularAttribute<Restaurant, String> description;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Restaurant#id
	 **/
	public static volatile SingularAttribute<Restaurant, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Restaurant#managerId
	 **/
	public static volatile SingularAttribute<Restaurant, Integer> managerId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Restaurant
	 **/
	public static volatile EntityType<Restaurant> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Restaurant#createAt
	 **/
	public static volatile SingularAttribute<Restaurant, String> createAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Restaurant#email
	 **/
	public static volatile SingularAttribute<Restaurant, String> email;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Restaurant#status
	 **/
	public static volatile SingularAttribute<Restaurant, CommonStatusEnum> status;

	public static final String ADDRESS = "address";
	public static final String PHONE = "phone";
	public static final String NAME = "name";
	public static final String RATING = "rating";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";
	public static final String MANAGER_ID = "managerId";
	public static final String CREATE_AT = "createAt";
	public static final String EMAIL = "email";
	public static final String STATUS = "status";

}

