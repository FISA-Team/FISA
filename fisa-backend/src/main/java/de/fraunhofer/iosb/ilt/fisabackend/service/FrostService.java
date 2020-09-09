package de.fraunhofer.iosb.ilt.fisabackend.service;

import de.fraunhofer.iosb.ilt.fisabackend.model.SensorThingsApiBundle;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaProject;
import de.fraunhofer.iosb.ilt.fisabackend.model.responseData.DatastreamInfo;
import de.fraunhofer.iosb.ilt.fisabackend.service.converter.FisaConverter;
import de.fraunhofer.iosb.ilt.sta.ServiceFailureException;

import java.net.MalformedURLException;
import java.util.List;

public class FrostService {
    private final FrostCourier frostCourier = new FrostCourier();
    private final FisaConverter fisaConverter;

    /**
     * Create a new FrostService.
     *
     * @param fisaConverter the converter used by this service.
     */
    public FrostService(FisaConverter fisaConverter) {
        this.fisaConverter = fisaConverter;
    }

    /**
     * Sends a {@link FisaProject} to the FROST-Server with the given url.
     *
     * @param url     the url of the FROST-server.
     * @param project the project to send to the server.
     * @throws MalformedURLException   if the url is invalid.
     * @throws ServiceFailureException if the FROST-Server fails to accept the data.
     * @return a list of DatastreamIdAndName
     */
    public List<DatastreamInfo> sendToFrost(String url, FisaProject project)
            throws MalformedURLException, ServiceFailureException {
        SensorThingsApiBundle bundle = this.fisaConverter.convertToBundle(project);
        return this.frostCourier.uploadProject(bundle, url);
    }
}
