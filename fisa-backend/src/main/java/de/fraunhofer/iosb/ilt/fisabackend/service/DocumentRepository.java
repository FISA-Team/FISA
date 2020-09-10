package de.fraunhofer.iosb.ilt.fisabackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaDocument;
import de.fraunhofer.iosb.ilt.fisabackend.service.exception.ClientRequestException;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileSystemException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * The repository managing use-cases in form of fisa documents stored as JSON.
 */
  class DocumentRepository {
    private String path; //path to folder containing Documents

    /**
     * Instantiates a new Document repository.
     *
     * @param path the directory where all files are stored
     * @throws IOException if directory creation fails
     */
    DocumentRepository(String path) throws IOException {
        this.path = path;
        //create filepath if it does not exist already
        Path pathvar = Paths.get(this.path);

        if (!Files.exists(pathvar)) {
            Files.createDirectory(pathvar);
        }
    }

    /**
     * Will return a fisa document by it's uuid.
     *
     * @param uuid the uuid generated from the use-case name
     *
     * @return the fisa document matching the uuid
     *
     * @throws IOException if jackson object mapper fails
     * @throws ClientRequestException if uuid cannot be matched to use-case file
     */
     FisaDocument getFisaDocument(UUID uuid) throws IOException, ClientRequestException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(getFisaDocumentAsFile(uuid), FisaDocument.class);
    }

    /**
     * Will return a fisa document by it's uuid.
     *
     * @param uuid the uuid generated from the use-case name
     *
     * @return the fisa document matching the uuid as a file
     *
     * @throws ClientRequestException if uuid cannot be matched to use-case file
     */
    File getFisaDocumentAsFile(UUID uuid) throws ClientRequestException {
        String filename = this.path + File.separator + uuid.toString() + ".json";

        if (!Files.exists(Paths.get(filename))) {
            throw new ClientRequestException("Specified UUID does not exist in database");
        }

        return new File(filename);
    }

    /**
     * Will create a List of use-cases currently available in Repository.
     *
     * @return key value pair of uuid and name of the FisaDocument
     * @throws IOException if jackson object mapper fails
     */
     Map<UUID, String> getFisaDocumentList() throws IOException {
        File folder = new File(this.path);
        File[] listOfFiles = folder.listFiles();
        ObjectMapper objectMapper = new ObjectMapper();

        Map<UUID, String> list = new HashMap<>();

        if (listOfFiles != null) {
            for (File file : listOfFiles) {
                if (file.isFile()) {
                    //getFisaDocument
                    FisaDocument fisaDoc = objectMapper.readValue(file, FisaDocument.class);

                    UUID uuid = UUID.nameUUIDFromBytes(fisaDoc.getName().getBytes());
                    String name = fisaDoc.getName();
                    list.put(uuid, name);
                }
            }
        }
        return list;
    }

    /**
     * Stores a fisa document as JSON file in repository.
     *
     * @param document the fisa document that will be stored as JSON file
     * @throws IOException if jackson object mapper fails
     * @throws ClientRequestException if name of use-case in document matches name of use-case in repository
     */
     void saveFisaDocument(FisaDocument document) throws IOException, ClientRequestException {
        String filename = this.path + File.separator
                          + UUID.nameUUIDFromBytes(document.getName().getBytes()).toString() + ".json";

        File file = new File(filename);

        if (file.exists()) {
            throw new ClientRequestException("Name of use case already exists in Repository");
        }

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, document);
    }

    /**
     * Deletes a fisa document that has been stored in repository.
     *
     * @param uuid the uuid of the fisa document that will be deleted
     * @throws ClientRequestException if uuid cannot be matched with file in repository
     * @throws FileSystemException if file deletion process failed
     */
     void deleteFisaDocument(UUID uuid) throws IOException, ClientRequestException {
        String filename = this.path + File.separator + uuid.toString() + ".json";
        //delete found file if exists
        if (!Files.exists(Paths.get(filename))) {
            throw new ClientRequestException("Specified UUID cannot be matched with use case in database");
        }
        File deleteFile = new File(filename);
        if (!deleteFile.delete()) {
            throw new FileSystemException("File matching use case was found but could not be removed");
        }
    }
}
