package vn.tuhoc.vinaeatery.domain;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(Floor.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Floor_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Floor#timeUpdate
	 **/
	public static volatile SingularAttribute<Floor, LocalDateTime> timeUpdate;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Floor#name
	 **/
	public static volatile SingularAttribute<Floor, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Floor#description
	 **/
	public static volatile SingularAttribute<Floor, String> description;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Floor#id
	 **/
	public static volatile SingularAttribute<Floor, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Floor
	 **/
	public static volatile EntityType<Floor> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.Floor#status
	 **/
	public static volatile SingularAttribute<Floor, CommonStatusEnum> status;

	public static final String TIME_UPDATE = "timeUpdate";
	public static final String NAME = "name";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";
	public static final String STATUS = "status";

}

