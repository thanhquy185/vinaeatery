package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CommonGenderEnum;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(Customer.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Customer_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Customer#birthday
	 **/
	public static volatile SingularAttribute<Customer, String> birthday;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Customer#image
	 **/
	public static volatile SingularAttribute<Customer, String> image;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Customer#address
	 **/
	public static volatile SingularAttribute<Customer, String> address;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Customer#gender
	 **/
	public static volatile SingularAttribute<Customer, CommonGenderEnum> gender;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Customer#description
	 **/
	public static volatile SingularAttribute<Customer, String> description;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Customer#userId
	 **/
	public static volatile SingularAttribute<Customer, Integer> userId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Customer#createAt
	 **/
	public static volatile SingularAttribute<Customer, String> createAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Customer#phone
	 **/
	public static volatile SingularAttribute<Customer, String> phone;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Customer#id
	 **/
	public static volatile SingularAttribute<Customer, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Customer#fullname
	 **/
	public static volatile SingularAttribute<Customer, String> fullname;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Customer
	 **/
	public static volatile EntityType<Customer> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Customer#email
	 **/
	public static volatile SingularAttribute<Customer, String> email;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Customer#status
	 **/
	public static volatile SingularAttribute<Customer, CommonStatusEnum> status;

	public static final String BIRTHDAY = "birthday";
	public static final String IMAGE = "image";
	public static final String ADDRESS = "address";
	public static final String GENDER = "gender";
	public static final String DESCRIPTION = "description";
	public static final String USER_ID = "userId";
	public static final String CREATE_AT = "createAt";
	public static final String PHONE = "phone";
	public static final String ID = "id";
	public static final String FULLNAME = "fullname";
	public static final String EMAIL = "email";
	public static final String STATUS = "status";

}

