package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(RoleHistory.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class RoleHistory_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RoleHistory#id
	 **/
	public static volatile SingularAttribute<RoleHistory, RoleHistoryId> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RoleHistory#dateEnd
	 **/
	public static volatile SingularAttribute<RoleHistory, String> dateEnd;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RoleHistory
	 **/
	public static volatile EntityType<RoleHistory> class_;

	public static final String ID = "id";
	public static final String DATE_END = "dateEnd";

}

