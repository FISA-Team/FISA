package de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta;

import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.complex.StaListMapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.complex.StaMapMapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.tree.FisaTreeNode;
import de.fraunhofer.iosb.ilt.sta.model.Entity;
import de.fraunhofer.iosb.ilt.sta.model.EntityType;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

public abstract class StaComplexAttributeMapper<T extends Entity<T>, V> extends StaAttributeMapper<T> {
    private final Function<T, V> getter;

    protected StaComplexAttributeMapper(String attributeName, Function<T, V> getter, EntityType entityType) {
        super(entityType, attributeName);
        this.getter = getter;
    }


    /**
     * Create a new complex attribute mapper for maps.
     *
     * @param <T>           the entity type the attribute belongs to.
     * @param attributeName the name of the attribute.
     * @param mapGetter     the function to access the map.
     * @param entityType    the entity type.
     * @return a new complex attribute mapper.
     */
    public static <T extends Entity<T>> StaComplexAttributeMapper<T, Map<String, Object>>
    mapped(String attributeName, Function<T, Map<String, Object>> mapGetter, EntityType entityType) {
        return new StaMapMapper<>(attributeName, mapGetter, entityType);
    }

    /**
     * Create a new complex attribute mapper for lists.
     *
     * @param <T>           the entity type the attribute belongs to.
     * @param attributeName the name of the attribute.
     * @param listGetter    the function to access the list.
     * @param entityType
     * @return a new complex attribute mapper.
     */
    public static <T extends Entity<T>> StaComplexAttributeMapper<T, List<String>>
    indexed(String attributeName, Function<T, List<String>> listGetter, EntityType entityType) {
        return new StaListMapper<>(attributeName, listGetter, entityType);
    }

    @Override
    public void apply(FisaTreeNode treeNode, String... arguments) {
        throw new UnsupportedOperationException();
    }

    /**
     * @return the function used to access the complex attribute.
     */
    public Function<T, V> getGetter() {
        return getter;
    }
}
