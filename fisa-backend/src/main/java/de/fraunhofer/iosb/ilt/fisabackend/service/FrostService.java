package de.fraunhofer.iosb.ilt.fisabackend.service;

import de.fraunhofer.iosb.ilt.fisabackend.model.SensorThingsApiBundle;
import de.fraunhofer.iosb.ilt.fisabackend.model.UploadToFrostResponse;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaProject;
import de.fraunhofer.iosb.ilt.fisabackend.service.converter.FisaConverter;
import de.fraunhofer.iosb.ilt.sta.ServiceFailureException;

import java.net.MalformedURLException;

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
    public UploadToFrostResponse sendToFrost(String url, FisaProject project)
            throws MalformedURLException, ServiceFailureException {
        SensorThingsApiBundle bundle = this.fisaConverter.convertToBundle(project);
        return this.frostCourier.uploadProject(bundle, url);
    }

    /**
     * Updates the given {@link FisaProject} on the FROST-Server with the given url.
     *
     * @param project the project to send to the server.
     * @throws MalformedURLException   if the url is invalid.
     * @throws ServiceFailureException if the FROST-Server fails to accept the data.
     * @return a list of DatastreamIdAndName
     */
    public UploadToFrostResponse updateFrostServer(FisaProject project)
            throws MalformedURLException, ServiceFailureException {
        // Fist add the entities
        SensorThingsApiBundle bundle = this.fisaConverter.convertToBundle(project);
        UploadToFrostResponse responseData = this.frostCourier.uploadProject(bundle, project.getConnectedFrostServer());

        // remove removed objects from FROST-Server
        if (!project.getRemovedFisaObjects().isEmpty()) {
            SensorThingsApiBundle toRemove = this.fisaConverter.convertRemovedObjectsToBundle(project);
            this.frostCourier.removeObjects(toRemove, project.getConnectedFrostServer());
        }
        return responseData;
    }

    /**
     * Rempves the given Project from the FROST-Server
     *
     * @param project the Project to remove
     * @throws MalformedURLException   if the url is invalid.
     */
    public void removeProjectFromFrostServer(FisaProject project) throws MalformedURLException {
        SensorThingsApiBundle bundle = this.fisaConverter.convertToBundle(project);
        this.frostCourier.removeObjects(bundle, project.getConnectedFrostServer());
    }
}
