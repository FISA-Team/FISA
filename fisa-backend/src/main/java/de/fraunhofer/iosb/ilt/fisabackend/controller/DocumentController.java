package de.fraunhofer.iosb.ilt.fisabackend.controller;

import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaDocument;
import de.fraunhofer.iosb.ilt.fisabackend.service.DocumentService;
import de.fraunhofer.iosb.ilt.fisabackend.service.exception.ClientRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * The controller managing frontend requests related to FisaDocuments.
 */
@RestController
@RequestMapping("/documents")
public class DocumentController {
    private DocumentService documentService;
    private static final Logger LOGGER = LoggerFactory.getLogger(DocumentController.class);
    /**
     * Instantiates a new Document controller.
     *
     * @param fisaFilesDirectory path to repository folder
     * @throws IOException if creating new DocumentService instance fails
     */
    public DocumentController(
            @Value("${app.filesDirectory}") String fisaFilesDirectory
    ) throws IOException {
        this.documentService = new DocumentService(fisaFilesDirectory);
    }

    /**
     * Endpoint for listing all available FisaDocuments on the server.
     *
     * @return All available FisaDocuments as a tuple of UUID and Name
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/")
    public ResponseEntity listFisaDocuments() {
        List<MapNameListElement> documents = new ArrayList<>();
        try {
            documentService.listFisaDocument().forEach((uuid, name)
                                                               -> documents.add(new MapNameListElement(name, uuid)));
            return ResponseEntity.ok(documents);
        } catch (IOException e) {
            LOGGER.error("Failed to fulfill request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * Endpoint for creating a FisaDocument
     *
     * @return Response of backend operation
     * @param document The FisaDocument that should be created
     */
    @CrossOrigin(origins = "*")
    @PostMapping("/")
    public ResponseEntity createFisaDocument(@RequestBody FisaDocument document) {
        try {
            documentService.createFisaDocument(document);
            return ResponseEntity.ok("stored successfully");
        } catch (IOException e) {
            LOGGER.error("Failed to fulfill request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        } catch (ClientRequestException e) {
            LOGGER.error("Failed to fulfill request", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Endpoint for fetching one specific FisaDocument
     *
     * @param uuidString The UUID of the requested FisaDocument
     *
     * @return The FisaDocument
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/{uuid}")
    public ResponseEntity getFisaDocument(@PathVariable(value = "uuid")String uuidString) {
        FisaDocument document;
        try {
            document = documentService.getFisaDocument(UUID.fromString(uuidString));
            return ResponseEntity.ok(document);
        } catch (IOException e) {
            LOGGER.error("Failed to fulfill request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        } catch (ClientRequestException e) {
            LOGGER.error("Failed to fulfill request", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Endpoint for deleting the FisaDocument
     *
     * @return Response of backend operation
     * @param uuidString The UUID of the FisaDocument to delete
     */
    @CrossOrigin(origins = "*")
    @DeleteMapping("/{uuid}")
    public ResponseEntity deleteFisaDocument(@PathVariable(value = "uuid")String uuidString) {
        try {
            documentService.deleteFisaDocument(UUID.fromString(uuidString));
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
     * Offers the given FisaDocument as a file
     *
     * @param uuidString The uuid of the FisaDocument
     *
     * @return The FisaDocument as a file
     *
     * @throws IOException
     * @throws ClientRequestException
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/{uuid}/download")
    public ResponseEntity<Resource> download(
            @PathVariable(value = "uuid")String uuidString
    ) throws IOException, ClientRequestException {
        File file = documentService.getFisaDocumentAsFile(UUID.fromString(uuidString));
        FisaDocument document = documentService.getFisaDocument(UUID.fromString(uuidString));
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.add(
                "Content-Disposition",
                "attachment; filename=\"" + document.getName() + ".json\""
        );

        return ResponseEntity.ok()
                .headers(responseHeaders)
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
