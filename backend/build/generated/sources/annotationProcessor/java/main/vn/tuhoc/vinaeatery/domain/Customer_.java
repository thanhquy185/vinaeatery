package vn.tuhoc.vinaeatery.domain;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(Customer.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Customer_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Customer#birthday
	 **/
	public static volatile SingularAttribute<Customer, String> birthday;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Customer#totalThreshold
	 **/
	public static volatile SingularAttribute<Customer, Long> totalThreshold;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Customer#address
	 **/
	public static volatile SingularAttribute<Customer, String> address;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Customer#gender
	 **/
	public static volatile SingularAttribute<Customer, String> gender;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Customer#timeUpdate
	 **/
	public static volatile SingularAttribute<Customer, LocalDateTime> timeUpdate;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Customer#customerCardId
	 **/
	public static volatile SingularAttribute<Customer, Integer> customerCardId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Customer#description
	 **/
	public static volatile SingularAttribute<Customer, String> description;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Customer#phone
	 **/
	public static volatile SingularAttribute<Customer, String> phone;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Customer#id
	 **/
	public static volatile SingularAttribute<Customer, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Customer#fullname
	 **/
	public static volatile SingularAttribute<Customer, String> fullname;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Customer
	 **/
	public static volatile EntityType<Customer> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Customer#email
	 **/
	public static volatile SingularAttribute<Customer, String> email;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Customer#status
	 **/
	public static volatile SingularAttribute<Customer, CommonStatusEnum> status;

	public static final String BIRTHDAY = "birthday";
	public static final String TOTAL_THRESHOLD = "totalThreshold";
	public static final String ADDRESS = "address";
	public static final String GENDER = "gender";
	public static final String TIME_UPDATE = "timeUpdate";
	public static final String CUSTOMER_CARD_ID = "customerCardId";
	public static final String DESCRIPTION = "description";
	public static final String PHONE = "phone";
	public static final String ID = "id";
	public static final String FULLNAME = "fullname";
	public static final String EMAIL = "email";
	public static final String STATUS = "status";

}

