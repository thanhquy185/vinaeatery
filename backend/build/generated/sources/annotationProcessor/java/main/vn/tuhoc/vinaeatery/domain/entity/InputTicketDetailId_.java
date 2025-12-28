package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EmbeddableType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(InputTicketDetailId.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class InputTicketDetailId_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.InputTicketDetailId#ingredientId
	 **/
	public static volatile SingularAttribute<InputTicketDetailId, Integer> ingredientId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.InputTicketDetailId#inputTicketId
	 **/
	public static volatile SingularAttribute<InputTicketDetailId, Integer> inputTicketId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.InputTicketDetailId
	 **/
	public static volatile EmbeddableType<InputTicketDetailId> class_;

	public static final String INGREDIENT_ID = "ingredientId";
	public static final String INPUT_TICKET_ID = "inputTicketId";

}

