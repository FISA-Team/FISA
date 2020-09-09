package de.fraunhofer.iosb.ilt.fisabackend.service.exception;

import de.fraunhofer.iosb.ilt.sta.StatusCodeException;
import de.fraunhofer.iosb.ilt.sta.model.Entity;

/**
 * Wraps a {@link StatusCodeException} and the involved entity causing the exception.
 */
public class EntityTransferException extends StatusCodeException {
    private final Entity<?> entity;

    /**
     * Create a new exception wrapping an entity and a {@link de.fraunhofer.iosb.ilt.sta.ServiceFailureException}.
     *
     * @param entity the entity involved.
     * @param cause  the causing exception.
     */
    public EntityTransferException(Entity<?> entity, StatusCodeException cause) {
        super(cause.getUrl(), cause.getStatusCode(), cause.getStatusMessage(), cause.getReturnedContent());
        this.entity = entity;
    }

    /**
     * @return the involved entity.
     */
    public Entity<?> getEntity() {
        return entity;
    }
}
