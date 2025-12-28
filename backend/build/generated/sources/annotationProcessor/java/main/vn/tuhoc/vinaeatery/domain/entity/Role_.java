package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(Role.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Role_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Role#name
	 **/
	public static volatile SingularAttribute<Role, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Role#updateAt
	 **/
	public static volatile SingularAttribute<Role, LocalDateTime> updateAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Role#id
	 **/
	public static volatile SingularAttribute<Role, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Role#restaurantId
	 **/
	public static volatile SingularAttribute<Role, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Role#salary
	 **/
	public static volatile SingularAttribute<Role, Long> salary;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Role
	 **/
	public static volatile EntityType<Role> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Role#status
	 **/
	public static volatile SingularAttribute<Role, CommonStatusEnum> status;

	public static final String NAME = "name";
	public static final String UPDATE_AT = "updateAt";
	public static final String ID = "id";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String SALARY = "salary";
	public static final String STATUS = "status";

}

