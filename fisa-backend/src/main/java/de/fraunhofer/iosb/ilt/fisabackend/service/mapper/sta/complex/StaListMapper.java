package de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.complex;

import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.Mapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.StaComplexAttributeMapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.tree.FisaTreeNode;
import de.fraunhofer.iosb.ilt.sta.model.Entity;
import de.fraunhofer.iosb.ilt.sta.model.EntityType;

import java.util.List;
import java.util.Objects;
import java.util.function.Function;

public class StaListMapper<T extends Entity<T>> extends StaComplexAttributeMapper<T, List<String>> {

    /**
     * Create a new complex mapper for lists.
     *  @param attributeName the name of the attribute holding the list.
     * @param getter        the function to access the list.
     * @param entityType
     */
    public StaListMapper(String attributeName, Function<T, List<String>> getter, EntityType entityType) {
        super(attributeName, getter, entityType);
    }

    @Override
    public Mapper resolve(String mapsTo) {
        try {
            int index = Integer.parseInt(mapsTo);
            return new IndexMapper(index);
        } catch (NumberFormatException e) {
            throw e; // TODO error handling
        }
    }

    final class IndexMapper implements Mapper {
        private final int index;

        private IndexMapper(int index) {
            this.index = index;
        }

        private void apply(FisaTreeNode treeNode, String value) {
            Entity<?> entity = treeNode.getContext(Entity.class);
            if (!entityTypeMatches(entity)) {
                return;
            }
            @SuppressWarnings("unchecked") // isInstance already covers that
                    T typed = (T) entity;
            getGetter().apply(typed).add(value);
        }

        @Override
        public void apply(FisaTreeNode treeNode, String... arguments) {
            if (arguments.length == 1) {
                apply(treeNode, arguments[0]);
            } else {
                throw new UnsupportedOperationException("Cannot accept more than one argument");
            }
        }

        @Override
        public Mapper resolve(String mapsTo) {
            return null;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof StaListMapper.IndexMapper)) return false;
            IndexMapper that = (IndexMapper) o;
            return index == that.index;
        }

        @Override
        public int hashCode() {
            return Objects.hash(index);
        }
    }
}
