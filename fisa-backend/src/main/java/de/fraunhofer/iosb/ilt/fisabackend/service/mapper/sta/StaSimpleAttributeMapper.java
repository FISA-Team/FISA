package de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta;

import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.Mapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.tree.FisaTreeNode;
import de.fraunhofer.iosb.ilt.sta.model.Entity;
import de.fraunhofer.iosb.ilt.sta.model.EntityType;

import java.util.Objects;
import java.util.function.BiConsumer;

public class StaSimpleAttributeMapper<T extends Entity<T>> extends StaAttributeMapper<T> {
    private final BiConsumer<T, String> setter;

    /**
     * Create a new simple attribute mapper.
     *  @param attributeName the name of the attribute.
     * @param setter        the setter to apply a value to the attribute on an entity.
     * @param entityType the type of the entity.
     */
    public StaSimpleAttributeMapper(String attributeName, BiConsumer<T, String> setter, EntityType entityType) {
        super(entityType, attributeName);
        this.setter = setter;
    }

    @Override
    public Mapper resolve(String mapsTo) {
        if (mapsTo != null && !mapsTo.isEmpty()) {
            throw new IllegalArgumentException(mapsTo + " cannot be mapped on a simple attribute.");
        }
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StaSimpleAttributeMapper)) return false;
        StaSimpleAttributeMapper<?> that = (StaSimpleAttributeMapper<?>) o;
        return getAttributeName().equals(that.getAttributeName());
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.getAttributeName()) + super.hashCode();
    }

    @Override
    public void apply(FisaTreeNode treeNode, String... arguments) {
        if (arguments.length == 1) {
            apply(treeNode, arguments[0]);
        } else {
            throw new UnsupportedOperationException("Only one argument expected");
        }
    }

    private void apply(FisaTreeNode treeNode, String value) {
        Entity<?> entity = treeNode.getContext(Entity.class);
        if (!entityTypeMatches(entity)) {
            return;
        }
        @SuppressWarnings("unchecked") // isInstance already covers that
                T typed = (T) entity;
        setter.accept(typed, value);
    }
}
