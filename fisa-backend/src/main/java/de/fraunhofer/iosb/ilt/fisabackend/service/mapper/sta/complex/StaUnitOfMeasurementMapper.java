package de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.complex;

import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.Mapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.StaComplexAttributeMapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.tree.FisaTreeNode;
import de.fraunhofer.iosb.ilt.sta.model.Entity;
import de.fraunhofer.iosb.ilt.sta.model.EntityType;
import de.fraunhofer.iosb.ilt.sta.model.ext.UnitOfMeasurement;

import java.util.function.Function;

public class StaUnitOfMeasurementMapper<T extends Entity<T>> extends StaComplexAttributeMapper<T, UnitOfMeasurement> {

    /**
     * Create a new mapper for UnitOfMeasurement attributes.
     *
     * @param attributeName the name of the attribute.
     * @param getter        the function to access the entity's UnitOfMeasurement attribute.
     * @param entityType    the type of the entity.
     */
    public StaUnitOfMeasurementMapper(String attributeName, Function<T, UnitOfMeasurement> getter,
                                      EntityType entityType) {
        super(attributeName, getter, entityType);
    }

    @Override
    public Mapper resolve(String mapsTo) {
        return new StaUomMapper(mapsTo); // TODO validate mapsTo
    }

    private final class StaUomMapper implements Mapper {
        private final String type;

        private StaUomMapper(String type) {
            this.type = type;
        }

        @Override
        public void apply(FisaTreeNode treeNode, String... arguments) {
            Function<T, UnitOfMeasurement> getter = getGetter();
            Entity<?> entity = treeNode.getContext(Entity.class);
            if (!entityTypeMatches(entity)) {
                return;
            }
            @SuppressWarnings("unchecked")
            UnitOfMeasurement uom = getter.apply((T) entity);
            switch (type) {
                case "name":
                    uom.setName(arguments[0]);
                    break;
                case "definition":
                    uom.setDefinition(arguments[0]);
                    break;
                case "symbol":
                    uom.setSymbol(arguments[0]);
                    break;
                default:
                    throw new UnsupportedOperationException(type);
            }
        }

        @Override
        public Mapper resolve(String mapsTo) {
            return null;
        }
    }
}
