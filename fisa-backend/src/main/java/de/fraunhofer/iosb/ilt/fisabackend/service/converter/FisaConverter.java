package de.fraunhofer.iosb.ilt.fisabackend.service.converter;

import de.fraunhofer.iosb.ilt.fisabackend.model.SensorThingsApiBundle;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaProject;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.MappingResolver;
import org.springframework.beans.factory.annotation.Autowired;

public class FisaConverter {
    private final MappingResolver resolver;

    /**
     * Creates a new FisaConverter which handles conversions between fisa projects and the SensorThingsAPI.
     *
     * @param resolver the resolver used for conversions.
     */
    @Autowired
    public FisaConverter(MappingResolver resolver) {
        this.resolver = resolver;
    }

    /**
     * Converts a {@link FisaProject} into a {@link SensorThingsApiBundle}.
     *
     * @param project the project to convert.
     * @return the converted bundle.
     */
    public SensorThingsApiBundle convertToBundle(FisaProject project) {
        FisaProjectToBundleConverter converter = new FisaProjectToBundleConverter(project, this.resolver);
        return converter.convertToBundle();
    }
}
