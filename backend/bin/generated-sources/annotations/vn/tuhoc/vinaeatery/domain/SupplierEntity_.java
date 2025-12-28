package vn.tuhoc.vinaeatery.domain;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(Supplier.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class SupplierEntity_ {

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Supplier#address
	 **/
	public static volatile SingularAttribute<Supplier, String> address;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Supplier#phone
	 **/
	public static volatile SingularAttribute<Supplier, String> phone;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Supplier#updateAt
	 **/
	public static volatile SingularAttribute<Supplier, LocalDateTime> updateAt;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Supplier#name
	 **/
	public static volatile SingularAttribute<Supplier, String> name;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Supplier#id
	 **/
	public static volatile SingularAttribute<Supplier, Long> id;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Supplier
	 **/
	public static volatile EntityType<Supplier> class_;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Supplier#email
	 **/
	public static volatile SingularAttribute<Supplier, String> email;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Supplier#status
	 **/
	public static volatile SingularAttribute<Supplier, CommonStatusEnum> status;

	public static final String ADDRESS = "address";
	public static final String PHONE = "phone";
	public static final String TIME_UPDATE = "updateAt";
	public static final String NAME = "name";
	public static final String ID = "id";
	public static final String EMAIL = "email";
	public static final String STATUS = "status";

}
