package de.fraunhofer.iosb.ilt.fisabackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaDocument;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.Scanner;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

 class DocumentRepositoryTest {

    /**
     * Testing of standard directory creation
     */
    @Test
    void CreateStandardDir(){

        Path currentRelativePath = Paths.get("");
        String dir = currentRelativePath.toAbsolutePath().toString() + File.separator + "DocumentRepository";

        try {
            DocumentRepository repo = new DocumentRepository(dir);
        } catch (Exception e){
            fail("create repo failed");
        }
        File file = new File(dir);
        assertTrue(file.exists());
    }

    /**
     * testing if a FisaDocument can be saved inside the repository and if the saved use-case represents the same
     * java classes as represented inside the FisaDocument that had to be saved
     */
    @Test
    void saveFisaDocumentInRepo(){
        //read fisa Document. Fisa Document has to be testet to be a usable Fisa Document

        Path currentRelativePath = Paths.get("");
        String repoDir = currentRelativePath.toAbsolutePath().toString() + File.separator + "DocumentRepository";

        FisaDocument[] testDocs = getTestDocuments();

        for (FisaDocument fisaDoc : testDocs) {
            ObjectMapper objectMapper = new ObjectMapper();

            //save fisa doc in repo
            DocumentRepository repo;
            try {
                repo = new DocumentRepository(repoDir);
                repo.saveFisaDocument(fisaDoc);
            }catch (Exception e) {
                System.out.print(e.toString());
                fail("Should not have thrown any exception");
            }

            //check if File was created in correct folder with correct name

            String filename = repoDir + File.separator
                              + UUID.nameUUIDFromBytes(fisaDoc.getName().getBytes()).toString() + ".json";

            assertTrue(new File(filename).exists());

            //check if repo document contains same string as test document
            String repoJSON = null, testJSON = null;

            try {
                Scanner scan = new Scanner(new File(repoDir+ File.separator
                                                    + UUID.nameUUIDFromBytes(fisaDoc.getName().getBytes()).toString()
                                                    + ".json")).useDelimiter("\\Z");
                repoJSON = scan.next();
                scan.close();

                testJSON = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(fisaDoc);
            }catch (Exception e){
                //we checked for existence of both files so no error should be thrown here
                System.out.print(e.toString());
                fail();
            }

            assertEquals(0,repoJSON.compareTo(testJSON));
        }
    }

    /**
     * testing if correct exception will be thrown when repository has to save another use-case with the same
     * name as a use-case that has already been saved inside the repository
     */
    @Test
    void saveFisaDocumentSameName(){
        Path currentRelativePath = Paths.get("");
        String repoDir = currentRelativePath.toAbsolutePath().toString() + File.separator + "DocumentRepository";

        FisaDocument[] testDocs = getTestDocuments();

        for (FisaDocument fisaDoc : testDocs) {
            ObjectMapper objectMapper = new ObjectMapper();

            //save fisa doc in repo
            DocumentRepository repo;
            try {
                repo = new DocumentRepository(repoDir);
                repo.saveFisaDocument(fisaDoc);
                repo.saveFisaDocument(fisaDoc);
                fail("Should have thrown any exception");
            } catch (Exception e) {
                e.printStackTrace();
                if (0 != e.getMessage().compareTo("Name of use case already exists in Repository")) {
                    System.out.print(e.getMessage());
                    fail("wrong exception sent here");
                }
            }
        }
    }

    /**
     * Testing if two use-cases with same content but different use-case-name can be saved in repository
     */
    @Test
    void saveFisaDocumentDifferentName (){
        Path currentRelativePath = Paths.get("");
        String repoDir = currentRelativePath.toAbsolutePath().toString() + File.separator + "DocumentRepository";

        FisaDocument[] testDocs = getTestDocuments();
        DocumentRepository repo = null;
        try {
            repo = new DocumentRepository(repoDir);
        } catch (Exception e) {
            fail("creating repo should not fail");
        }


        for (FisaDocument fisaDoc : testDocs) {
            ObjectMapper objectMapper = new ObjectMapper();

            //save fisa doc in repo

            try {
                repo.saveFisaDocument(fisaDoc);
                String name = fisaDoc.getName() + "_01";
                fisaDoc.setName(name);
                repo.saveFisaDocument(fisaDoc);

            } catch (Exception e) {
                System.out.print(e.getMessage());
                fail("Should have not thrown any exception");
            }
        }
    }

    /**
     * testing if use-case request with uuid that matches a use-case inside the repository results in returnal of
     * the requested use-case
     */
    @Test
    void getFisaDocumentCorrectUuid() {
        DocumentRepository repo = populatedTestRepoCreater();
        FisaDocument[] fisaList = getTestDocuments();

        for (FisaDocument fisaDoc:fisaList) {
            UUID uuid = UUID.nameUUIDFromBytes(fisaDoc.getName().getBytes());
            FisaDocument repoDoc = null;
            try {
                repoDoc = repo.getFisaDocument(uuid);
            } catch (Exception e){
                System.out.print(e.getMessage());
                fail("should return matching FisaDocument");
            }
            assertTrue(checkEqualFisaDoc(repoDoc,fisaDoc));
        }

    }

    /**
     * testing if use-case request with uuid that should not match to any project inside the repository results in
     * an exception
     */
    @Test
    void getFisaDocumentUnmatchingUuid() {
        DocumentRepository repo = populatedTestRepoCreater();
        FisaDocument[] fisaList = getTestDocuments();


            String fakename = "bluegreenisnotacolor";
            UUID uuid = UUID.nameUUIDFromBytes(fakename.getBytes());
            try {
                repo.getFisaDocument(uuid);
                fail("should throw exception");
            } catch (Exception e) {
                if (e.getMessage().compareTo("Specified UUID does not exist in database") == 0) return;
                System.out.print(e.getMessage());
                fail("wrong exception thrown");
            }

    }

    /**
     * Testing if list request of repository returns a list with all saved use-cases and their corresponding uuid
     * correctly
     */
    @Test
    void getFisaDocumentListComplete() {
        DocumentRepository repo = populatedTestRepoCreater();
        FisaDocument[] fisaDocs = getTestDocuments();
        Map<UUID,String> testmap = null;

        try {
            testmap = repo.getFisaDocumentList();
        } catch (Exception e) {
            e.printStackTrace();
            fail("no error should be generated here");
        }
        for (FisaDocument doc: fisaDocs) {
            String name = doc.getName();
            UUID uuid = UUID.nameUUIDFromBytes(name.getBytes());


            assertEquals(0,testmap.get(uuid).compareTo(name));
        }

    }

    /**
     * testing if delete request results in deletion of requested item in repository.
     */
    @Test
    void deleteFisaDocDeletion() {
        DocumentRepository repo = populatedTestRepoCreater();
        FisaDocument[] fisaDocs = getTestDocuments();

        for (FisaDocument doc : fisaDocs) {
            UUID uuid = UUID.nameUUIDFromBytes(doc.getName().getBytes());
            try {
                repo.deleteFisaDocument(uuid);
            } catch (Exception e) {
                fail("delete process should be successfull");
            }

            try {
                repo.deleteFisaDocument(uuid);
                fail("file should be deleted and error should be thrown");
            } catch (Exception e) {
                if(e.getMessage().compareTo("Specified UUID cannot be matched with use case in database")!=0){
                    System.out.print(e.getMessage());
                    fail("wrong exception thrown");
                }
            }

            try {
                repo.getFisaDocument(uuid);
                fail("File should be deleted and repository should throw error when try to access uuid matching file");
            } catch (Exception e) {
                if(e.getMessage().compareTo("Specified UUID does not exist in database")!=0){
                    System.out.print(e.getMessage());
                    fail("wrong exception thrown");
                }
            }
        }
    }

    /**
     * removes folder that the repository has been created to save all use-cases so that every test starts with
     * creation of fresh and empty repository folder
     */
    @AfterEach
    void removeTestDir(){
        Path currentRelativePath = Paths.get("");
        String dir = currentRelativePath.toAbsolutePath().toString() + File.separator + "DocumentRepository";

        File file = new File(dir);
        if(file.exists()){
            try {
                deleteDirectoryRecursion(Paths.get(dir));
            }catch (Exception e){
                System.out.print(e.toString());
                fail("could not delete generated path of DocumentRepository");
            }
        }
        assertFalse(file.exists());
    }

    /**
     * deletes path directory and it's content
     * @param path the path directory that has to be deleted
     * @throws IOException if deletion fails
     */
    void deleteDirectoryRecursion(Path path) throws IOException {
        if (Files.isDirectory(path, LinkOption.NOFOLLOW_LINKS)) {
            try (DirectoryStream<Path> entries = Files.newDirectoryStream(path)) {
                for (Path entry : entries) {
                    deleteDirectoryRecursion(entry);
                }
            }
        }
        Files.delete(path);
    }

    /**
     * loads a list of test use-cases that can be saved in the document repository
     * @return list of use-cases
     */
    FisaDocument[] getTestDocuments() {
        Path currentRelativePath = Paths.get("");

        // preparing testfolder path
        String projectDir = currentRelativePath.toAbsolutePath().toString();
        if (projectDir.contains("fisa-backend")) {
            int index = projectDir.indexOf("fisa-backend");
            projectDir = projectDir.substring(0, index - 1);
            System.out.println(projectDir);
        }
        String dir = projectDir + File.separator + "fisa-backend"
                     + File.separator + "src" + File.separator + "test" + File.separator + "resources" + File.separator
                     + "Use-Cases";

        File folder = new File(dir);
        File[] listOfFiles = folder.listFiles();
        if (listOfFiles == null) return null;

        FisaDocument[] fisaDocList = new FisaDocument[listOfFiles.length];
        int i=0;
        for (File fisaJSON : listOfFiles) {
            ObjectMapper objectMapper = new ObjectMapper();
            FisaDocument fisaDoc = null;
            try {
                fisaDoc = objectMapper.readValue(fisaJSON, FisaDocument.class);
            }catch (Exception e) {
                System.out.print(e.toString());
                fail("Fisa doc json is not valid. jackson could not convert");
            }
            assertNotNull(fisaDoc);
            fisaDocList[i] = fisaDoc;
            i++;
        }


        return fisaDocList;
    }

    /**
     * creates a fresh repository at specified path and fills it with the test use-cases from resource folder
     **/
    DocumentRepository populatedTestRepoCreater() {
        Path currentRelativePath = Paths.get("");
        String repoDir = currentRelativePath.toAbsolutePath().toString() + File.separator + "DocumentRepository";
        DocumentRepository repo = null;
        try {
            repo = new DocumentRepository(repoDir);
        } catch (Exception e) {
            fail("creating repo should not fail");
        }
        FisaDocument[] testDoc = getTestDocuments();
        for (FisaDocument doc : testDoc) {
            try {
                repo.saveFisaDocument(doc);
            }catch (Exception e){
                System.out.print(e.getMessage());
                fail("Populating Repo schould not fail");
            }
        }
        assertNotNull(repo);
        return repo;
    }

    /**
     * checks if two FisaDocuments result in same java class instances. Will fail test if FisaDocuments cannot be
     * parsed as java class instances
     * @param docA first document to be tested
     * @param docB second document to be tested
     * @return true if documents represent equal java class instances, otherwise false
     */
    boolean checkEqualFisaDoc(FisaDocument docA, FisaDocument docB){
        String docAString = null, docBString = null;
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            docAString = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(docA);
            docBString = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(docB);
        } catch (Exception e) {
            fail("Objects should be matchable");
        }
        return (docAString.compareTo(docBString) == 0);
    }
}
