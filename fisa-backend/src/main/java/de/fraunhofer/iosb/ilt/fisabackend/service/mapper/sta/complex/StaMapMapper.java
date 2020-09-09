package de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.complex;

import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.Mapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.StaComplexAttributeMapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.tree.FisaTreeNode;
import de.fraunhofer.iosb.ilt.sta.model.Entity;
import de.fraunhofer.iosb.ilt.sta.model.EntityType;

import java.util.Map;
import java.util.Objects;
import java.util.function.Function;

public class StaMapMapper<T extends Entity<T>> extends StaComplexAttributeMapper<T, Map<String, Object>> {

    /**
     * Create a new complex mapper for maps.
     *
     * @param attributeName the name of the attribute holding the map.
     * @param mapGetter     the function to access the map.
     * @param entityType    the entity type.
     */
    public StaMapMapper(String attributeName, Function<T, Map<String, Object>> mapGetter, EntityType entityType) {
        super(attributeName, mapGetter, entityType);
    }

    @Override
    public Mapper resolve(String mapsTo) {
        return new MapMapper(mapsTo);
    }


    public final class MapMapper implements Mapper {
        private final String key;

        private MapMapper(String key) {
            this.key = key;
        }

        private void apply(FisaTreeNode treeNode, String value) {
            Entity<?> entity = treeNode.getContext(Entity.class);
            if (!entityTypeMatches(entity)) {
                return;
            }
            @SuppressWarnings("unchecked") // isInstance already covers that
                    T typed = (T) entity;
            getGetter().apply(typed).put(key, value);
        }

        @Override
        public Mapper resolve(String mapsTo) {
            return null;
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
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof StaMapMapper.MapMapper)) return false;
            MapMapper mapMapper = (MapMapper) o;
            return Objects.equals(key, mapMapper.key);
        }

        @Override
        public int hashCode() {
            return Objects.hash(key);
        }
    }
}
