package de.fraunhofer.iosb.ilt.fisabackend.service;

import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaDocument;
import de.fraunhofer.iosb.ilt.fisabackend.service.exception.ClientRequestException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

/**
 * The Document service manages all requested operations from the frontend of the application related to the
 * FisaDocument.
 */
public class DocumentService {

    private DocumentRepository repo;

    /**
     * Instantiates a new Document service. Default path is a subdirectory called DocumentRepository located
     * inside the application dir
     *
     * @param fisaFilesDirectory path to repository
     * @throws IOException if creating a new DocumentRepository fails
     */
    public DocumentService(String fisaFilesDirectory) throws IOException {
        if (fisaFilesDirectory == null) {
            fisaFilesDirectory = "";
        }
        Path currentRelativePath = Paths.get(fisaFilesDirectory);
        String dir = currentRelativePath.toAbsolutePath().toString() + File.separator + "DocumentRepository";
        dir = "/home/nicolai/FISA_DIRS/DocumentRepository";
        repo = new DocumentRepository(dir);
    }

    /**
     *
     * Will return a fisa document by it's uuid.
     *
     * @param uuid the uuid generated from the use-case name
     * @return the fisa document matching the uuid
     * @throws IOException If DocumentRepository operation failed
     * @throws ClientRequestException if uuid cannot be found in repo
     */
    public FisaDocument getFisaDocument(UUID uuid) throws IOException, ClientRequestException {
        return repo.getFisaDocument(uuid);
    }

    /**
     *
     * Will return a fisa document by it's uuid.
     *
     * @param uuid the uuid generated from the use-case name
     * @return the fisa document matching the uuid
     * @throws ClientRequestException if uuid cannot be found in repo
     */
    public File getFisaDocumentAsFile(UUID uuid) throws ClientRequestException {
        return repo.getFisaDocumentAsFile(uuid);
    }

    /**
     * Will create a List of use-cases currently available in Repository.
     *
     * @return key value pair of uuid and name of the FisaDocument
     * @throws IOException if DocumentRepository operation failed
     */
    public Map<UUID, String> listFisaDocument() throws IOException {
        return repo.getFisaDocumentList();
    }

    /**
     * Saves a FisaDocument in the Document Repository.
     *
     * @param doc The FisaDocument that has to be stored
     * @throws IOException if DocumentRepository operation failed
     * @throws ClientRequestException if document with same name is already in repository
     */
    public void createFisaDocument(FisaDocument doc) throws IOException, ClientRequestException {
        repo.saveFisaDocument(doc);
    }

    /**
     * removes a FisaDocument from the repository.
     *
     * @param uuid the uuid of the FisaDocument that has to be removed
     * @throws IOException if DocumentRepository operation failed
     * @throws ClientRequestException if no file matching uuid can be found
     */
    public void deleteFisaDocument(UUID uuid) throws IOException, ClientRequestException {
        repo.deleteFisaDocument(uuid);
    }
}
