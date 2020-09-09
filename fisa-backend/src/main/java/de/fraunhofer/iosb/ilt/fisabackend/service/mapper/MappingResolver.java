package de.fraunhofer.iosb.ilt.fisabackend.service.mapper;

/**
 * Resolves mappings defined by the
 * {@link de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaDocument}
 * specification.
 */
public interface MappingResolver {
    /**
     * The delimiter used by the specification.
     */
    char DELIMITER = '.';
    /**
     * The delimiter used to indicate the beginning of a complex attribute.
     */
    char COLLECTION_OPEN = '[';
    /**
     * The delimiter used to indicate the end of a complex attribute.
     */
    char COLLECTION_CLOSE = ']';

    /**
     * Returns a {@link Mapper} implementation matching the given string.
     *
     * @param mapsTo The {@code mapsTo} key in the format of the
     *               {@link de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaDocument}
     *               specification.
     * @return The mapper matching the {@code mapsTo} string.
     */
    Mapper resolve(String mapsTo);
}
