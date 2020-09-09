package de.fraunhofer.iosb.ilt.fisabackend.controller;

import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaProject;
import de.fraunhofer.iosb.ilt.fisabackend.service.FrostService;
import de.fraunhofer.iosb.ilt.fisabackend.service.ProjectService;
import de.fraunhofer.iosb.ilt.fisabackend.service.converter.FisaConverter;
import de.fraunhofer.iosb.ilt.fisabackend.service.exception.ClientRequestException;
import de.fraunhofer.iosb.ilt.fisabackend.service.exception.EntityTransferException;
import de.fraunhofer.iosb.ilt.sta.ServiceFailureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * The controller managing frontend requests related to FisaProjects.
 */
@RestController
public class ProjectController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ProjectController.class);

    private ProjectService projectService;
    private FrostService frostService;

    /**
     * Instantiates a new Document controller.
     *
     * @param fisaFilesDirectory path to repository
     * @param fisaConverter converter for FisaProject -> OGCSensorThingsApi conversion
     * @throws IOException if creating new DocumentService instance fails
     */
    public ProjectController(
            @Value("${app.filesDirectory}") String fisaFilesDirectory,
            FisaConverter fisaConverter) throws IOException {
        this.projectService = new ProjectService(fisaFilesDirectory);
        this.frostService = new FrostService(fisaConverter);
    }

    /**
     * Takes uuid from frontend and retrieves the matching FisaProject from backend.
     *
     * @param uuidString uuid matching the requested FisaProject
     * @return the requested FisaProject
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/projects/{projectUuid}")
    public ResponseEntity getProject(@PathVariable(value = "projectUuid")String uuidString) {
        try {
            FisaProject project = projectService.getProject(UUID.fromString(uuidString));
            return ResponseEntity.ok(project);
        } catch (ClientRequestException e) {
            LOGGER.error("Failed to fulfill request", e);
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(e.getMessage());
        } catch (Exception e) {
            LOGGER.error("Failed to fulfill request", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Failed to fulfill request: " + e.getMessage());
        }
    }


    /**
     * Creates a map of pairs of uuid and project names lying in the backend repository.
     *
     * @return the pairs of uuid and project name
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/projects")
    public ResponseEntity listFisaProjects() {

        List<MapNameListElement> documents = new ArrayList<>();

        try {
            projectService.listProjects().forEach((uuid, name) -> documents.add(new MapNameListElement(name, uuid)));
        } catch (IOException e) {
            LOGGER.error("Failed to fulfill request", e);
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
        return ResponseEntity.ok(documents);
    }

    /**
     * Takes FisaProject from Frontend and stores it onto backend.
     *
     * @return Response to backend operation
     * @param project The FisaProject that will be stored in repository
     */
    @CrossOrigin(origins = "*")
    @PostMapping("/projects")
    public ResponseEntity createProject(@RequestBody FisaProject project) {
        try {
            projectService.createProject(project);
            return ResponseEntity.ok("stored successfully");
        } catch (IOException e) {
            LOGGER.error("Failed to fulfill request", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        } catch (ClientRequestException e) {
            LOGGER.error("Failed to fulfill request", e);
            return ResponseEntity.status((HttpStatus.BAD_REQUEST)).body(e.getMessage());
        }
    }

    /**
     * Takes a newer version of a FisaProject from frontend and updates the stored one on the backend.
     *
     * @return Response of backend operation
     * @param project the project that has to be updated
     */
    @CrossOrigin(origins = "*")
    @PutMapping("/projects")
    public ResponseEntity updateProject(@RequestBody FisaProject project) {
        try {
            projectService.updateProject(project);
            return ResponseEntity.ok("updated successfully");
        } catch (IOException e) {
            LOGGER.error("Failed to fulfill request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        } catch (ClientRequestException e) {
            LOGGER.error("Failed to fulfill request", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }


    /**
     * Deletes FisaProject from backend.
     *
     * @return Response of backend operation
     * @param uuid the uuid of the FisaProject that has to be deleted
     */
    @CrossOrigin(origins = "*")
    @DeleteMapping("/projects/{projectUuid}")
    public ResponseEntity deleteFisaDocument(@PathVariable(value = "projectUuid") UUID uuid) {
        try {
            projectService.deleteProject(uuid);
            return ResponseEntity.ok("deleted successfully");
        } catch (IOException e) {
            LOGGER.error("Failed to fulfill request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        } catch (ClientRequestException e) {
            LOGGER.error("Failed to fulfill request", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Sends FisaProject to Frost Server
     *
     * @param url     the url of the target server
     * @param project the project that has to be converted and uploaded
     * @return Response of the backend operation
     */
    @CrossOrigin(origins = "*")
    @PostMapping("/frostServer/upload")
    public ResponseEntity sendToFrost(@RequestParam("url") String url, @RequestBody FisaProject project) {
        LOGGER.info("Received project, uploading...");
        try {
            return ResponseEntity.ok(this.frostService.sendToFrost(url, project));
        } catch (EntityTransferException e) {
            LOGGER.error("Communication with SensorThingsApi-Server failed", e);
            return ResponseEntity.status(e.getStatusCode())
                    .body(e.getReturnedContent());
        } catch (ServiceFailureException e) {
            LOGGER.error("Communication with SensorThingsApi-Server failed", e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("Communication with SensorThingsApi-Server failed: " + e.getMessage());
        } catch (Exception e) {
            LOGGER.error("Failed to fulfill request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fulfill request: " + e.getMessage());
        }
    }

    /**
     * Offers the project as a File
     *
     * @param uuidString The uuid of the project
     *
     * @return The project
     *
     * @throws IOException
     * @throws ClientRequestException
     */
    @CrossOrigin(origins = "*")
    @GetMapping("projects/{uuid}/download")
    public ResponseEntity<Resource> download(
            @PathVariable(value = "uuid")String uuidString
    ) throws IOException, ClientRequestException {
        File file = projectService.getProjectAsFile(UUID.fromString(uuidString));
        FisaProject project = projectService.getProject(UUID.fromString(uuidString));
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.add(
                "Content-Disposition",
                "attachment; filename=\"" + project.getName() + ".json\""
        );

        return ResponseEntity.ok()
                .headers(responseHeaders)
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    /* TODO
    @GetMapping()
    Map<String,UUID> getFrostProjectList(String url) {return null;}

    @GetMapping()
    FisaProject loadFrostProject(String url, UUID uuid) {return null;}
    */


}
