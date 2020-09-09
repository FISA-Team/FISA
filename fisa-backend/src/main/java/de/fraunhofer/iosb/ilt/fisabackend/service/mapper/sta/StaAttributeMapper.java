package de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta;

import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.Mapper;
import de.fraunhofer.iosb.ilt.sta.model.Entity;
import de.fraunhofer.iosb.ilt.sta.model.EntityType;

import java.util.Objects;

public abstract class StaAttributeMapper<T extends Entity<T>> implements Mapper {
    private final EntityType entityType;
    private final String attributeName;

    protected StaAttributeMapper(EntityType entityType, String attributeName) {
        this.entityType = entityType;
        this.attributeName = attributeName;
    }

    /**
     * @return The name of the attribute mapped by this mapper.
     */
    public String getAttributeName() {
        return attributeName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StaAttributeMapper)) return false;
        StaAttributeMapper<?> that = (StaAttributeMapper<?>) o;
        return Objects.equals(attributeName, that.attributeName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(attributeName);
    }

    /**
     * @param entity the entity to check.
     * @return {@code true} if the given entity matches the entity type kept by this mapper.
     */
    public boolean entityTypeMatches(Entity<?> entity) {
        return this.entityType == entity.getType();
    }

    @Override
    public String toString() {
        return "StaAttributeMapper{" + "attributeName='" + attributeName + '\'' + '}';
    }
}
