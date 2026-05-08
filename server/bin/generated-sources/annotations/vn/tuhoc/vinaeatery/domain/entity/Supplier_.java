package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(Supplier.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Supplier_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Supplier#address
	 **/
	public static volatile SingularAttribute<Supplier, String> address;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Supplier#phone
	 **/
	public static volatile SingularAttribute<Supplier, String> phone;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Supplier#name
	 **/
	public static volatile SingularAttribute<Supplier, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Supplier#id
	 **/
	public static volatile SingularAttribute<Supplier, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Supplier#restaurantId
	 **/
	public static volatile SingularAttribute<Supplier, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Supplier
	 **/
	public static volatile EntityType<Supplier> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Supplier#email
	 **/
	public static volatile SingularAttribute<Supplier, String> email;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Supplier#status
	 **/
	public static volatile SingularAttribute<Supplier, CommonStatusEnum> status;

	public static final String ADDRESS = "address";
	public static final String PHONE = "phone";
	public static final String NAME = "name";
	public static final String ID = "id";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String EMAIL = "email";
	public static final String STATUS = "status";

}

