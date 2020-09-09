package de.fraunhofer.iosb.ilt.fisabackend.service.mapper;

import java.util.HashMap;
import java.util.Map;

public class DynamicMappingResolver implements MappingResolver {

    private final Map<String, Mapper> rootKeys;

    /**
     * Create a new dynamic mapping resolver.
     */
    public DynamicMappingResolver() {
        this.rootKeys = new HashMap<>();
    }

    /**
     * Registers a new mapper for a specific key.
     *
     * @param key    The key to register the mapper for.
     * @param mapper The mapper to register.
     */
    public void registerRootMapper(String key, Mapper mapper) {
        this.rootKeys.put(key, mapper);
    }

    @Override
    public Mapper resolve(String mapsTo) {
        int delimiterIndex = mapsTo.indexOf(MappingResolver.DELIMITER);
        if (delimiterIndex == -1) throw new IllegalArgumentException("Invalid mapping key: " + mapsTo);
        String rootKey = mapsTo.substring(0, delimiterIndex);
        Mapper root = rootKeys.get(rootKey);
        if (root == null) {
            throw new IllegalArgumentException("Invalid mapping key (not found):" + rootKey);
        }
        // may be empty string but won't throw IOOBE
        return root.resolve(mapsTo.substring(delimiterIndex + 1));
    }
}
