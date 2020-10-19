package de.fraunhofer.iosb.ilt.fisabackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaProject;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.Scanner;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

 class ProjectRepositoryTest {

    /**
     * Testing of standard directory creation
     **/
    @Test
    void createDefaultDirectory(){

        Path currentRelativePath = Paths.get("");
        String dir = currentRelativePath.toAbsolutePath().toString() + File.separator + "ProjectRepository";

        try {
            ProjectRepository repo = new ProjectRepository(dir);
        } catch (Exception e){
            fail("create repo failed");
        }
        File file = new File(dir);
        assertTrue(file.exists());
    }

    /**
     * testing if a project can be saved inside the repository and if the saved project represents the same
     * java classes as the project that had to be saved
     */
    @Test //done
    void saveFisaProjectInRepo() {
        //read fisa Project. Fisa Project has to be testet to be a usable Fisa Project

        Path currentRelativePath = Paths.get("");
        String repoDir = currentRelativePath.toAbsolutePath().toString() + File.separator + "ProjectRepository";

        FisaProject[] testDocs = getTestDocuments();

        for (FisaProject fisaDoc : testDocs) {
            ObjectMapper objectMapper = new ObjectMapper();

            //save fisa doc in repo
            ProjectRepository repo;
            try {
                repo = new ProjectRepository(repoDir);
                repo.saveProject(fisaDoc);
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
                Scanner scan = new Scanner(new File(repoDir + File.separator
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
     * testing if correct exception will be thrown when repository has to save another project with the same
     * name as a project that has already been saved inside the repository
     */
    @Test
    void saveFisaProjectSameName(){
        Path currentRelativePath = Paths.get("");
        String repoDir = currentRelativePath.toAbsolutePath().toString() + File.separator + "ProjectRepository";

        FisaProject[] testDocs = getTestDocuments();

        for (FisaProject fisaDoc : testDocs) {
            ObjectMapper objectMapper = new ObjectMapper();

            //save fisa doc in repo
            ProjectRepository repo;
            try {
                repo = new ProjectRepository(repoDir);
                repo.saveProject(fisaDoc);
                repo.saveProject(fisaDoc);
                fail("Should have thrown any exception");
            } catch (Exception e) {
                if (0 != e.getMessage().compareTo("Name of project already exists in Repository")) {
                    System.out.print(e.getMessage());
                    fail("wrong exception sent here");
                }
            }
        }
    }

    /**
     * Testing if two projects with same content but different project name can be saved in repository
     */
    @Test
    void saveFisaProjectDifferentName (){
        Path currentRelativePath = Paths.get("");
        String repoDir = currentRelativePath.toAbsolutePath().toString() + File.separator + "ProjectRepository";

        FisaProject[] testDocs = getTestDocuments();
        ProjectRepository repo = null;
        try {
            repo = new ProjectRepository(repoDir);
        } catch (Exception e) {
            fail("creating repo should not fail");
        }


        for (FisaProject fisaDoc : testDocs) {
            ObjectMapper objectMapper = new ObjectMapper();

            //save fisa doc in repo

            try {
                repo.saveProject(fisaDoc);
                String name = fisaDoc.getName() + "_01";
                fisaDoc.setName(name);
                repo.saveProject(fisaDoc);

            } catch (Exception e) {
                System.out.print(e.getMessage());
                fail("Should have not thrown any exception");
            }
        }
    }

    /**
     * testing if project request with uuid that matches a project inside the repository results in returnal of
     * the requested project
     */
    @Test
    void getFisaProjectCorrectUuid() {
        ProjectRepository repo = populatedTestRepoCreator();
        FisaProject[] fisaList = getTestDocuments();

        for (FisaProject fisaDoc:fisaList) {
            UUID uuid = UUID.nameUUIDFromBytes(fisaDoc.getName().getBytes());
            FisaProject repoDoc = null;
            try {
                repoDoc = repo.getProject(uuid);
            } catch (Exception e){
                System.out.print(e.getMessage());
                fail("should return matching FisaDocument");
            }
            assertTrue(checkEqualFisaDoc(repoDoc,fisaDoc));
        }

    }

    /**
     * testing if project request with uuid that should not match to any project inside the repository results in
     * an exception
     */
    @Test
    void getFisaProjectUnmatchingUuid() {
        ProjectRepository repo = populatedTestRepoCreator();
        FisaProject[] fisaList = getTestDocuments();


        String fakename = "bluegreenisnotacolor";
        UUID uuid = UUID.nameUUIDFromBytes(fakename.getBytes());
        try {
            repo.getProject(uuid);
            fail("should throw exception");
        } catch (Exception e) {
            if (e.getMessage().compareTo("Specified UUID does not exist in database") == 0) return;
            System.out.print(e.getMessage());
            fail("wrong exception thrown");
        }

    }

    /**
     * testing if list request of repository returns a list with all saved projects and their corresponding uuid
     * correctly
     */
    @Test
    void getFisaDocumentListComplete() {
        ProjectRepository repo = populatedTestRepoCreator();
        FisaProject[] fisaDocs = getTestDocuments();
        Map<UUID,String> testmap = null;

        try {
            testmap = repo.getProjectList();
        } catch (Exception e) {
            fail("no error should be generated here");
        }
        for (FisaProject doc: fisaDocs) {
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
        ProjectRepository repo = populatedTestRepoCreator();
        FisaProject[] fisaDocs = getTestDocuments();

        for (FisaProject doc : fisaDocs) {
            UUID uuid = UUID.nameUUIDFromBytes(doc.getName().getBytes());
            try {
                repo.deleteProject(uuid);
            } catch (Exception e) {
                fail("delete process should be successfull");
            }

            try {
                repo.deleteProject(uuid);
                fail("file should be deleted and error should be thrown");
            } catch (Exception e) {
                if(e.getMessage().compareTo("Specified UUID cannot be matched with project in database")!=0){
                    System.out.print(e.getMessage());
                    fail("wrong exception thrown");
                }
            }

            try {
                repo.getProject(uuid);
                fail("File should be deleted and repository should throw error when try to access uuid matching file");
            } catch (Exception e) {
                if (e.getMessage().compareTo("Specified UUID does not exist in database") != 0){
                    System.out.print(e.getMessage());
                    fail("wrong exception thrown");
                }
            }
        }
    }

    /**
     * removes folder that the repository has been created to save all projects so that every test starts with
     * creation of fresh and empty repository folder
     */
    @AfterEach
    void removeTestDir(){
        Path currentRelativePath = Paths.get("");
        String dir = currentRelativePath.toAbsolutePath().toString() + File.separator + "ProjectRepository";

        File file = new File(dir);
        if(file.exists()){
            try {
                deleteDirectoryRecursion(Paths.get(dir));
            } catch (Exception e) {
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
     * loads a list of test projects that can be saved in the project repository
     * @return list of projects
     */
    FisaProject[] getTestDocuments() {
        Path currentRelativePath = Paths.get("");

        // preparing testfolder path
        String projectDir = currentRelativePath.toAbsolutePath().toString();
        if (projectDir.contains("fisa-backend")) {
            int index = projectDir.indexOf("fisa-backend");
            projectDir = projectDir.substring(0, index - 1);
            System.out.println(projectDir);
        }
        String dir = projectDir + File.separator + "fisa-backend" + File.separator
                     + "src" + File.separator + "test" + File.separator + "resources" + File.separator
                     + "Projects";
        File folder = new File(dir);
        File[] listOfFiles = folder.listFiles();
        if (listOfFiles == null) return null;

        FisaProject[] fisaDocList = new FisaProject[listOfFiles.length];
        int i = 0;
        for (File fisaJSON : listOfFiles) {
            ObjectMapper objectMapper = new ObjectMapper();
            FisaProject fisaDoc = null;
            try {
                fisaDoc = objectMapper.readValue(fisaJSON, FisaProject.class);
            }catch (Exception e) {
                System.out.print(e.toString());
                fail("Fisa doc json is not valid. jackson could not convert");
            }
            assertNotNull(fisaDoc);
            fisaDocList[i] = fisaDoc;
        }


        return fisaDocList;
    }

    /**
     * creates a fresh repository at specified path and fills it with the test projects from resource folder
     **/
    ProjectRepository populatedTestRepoCreator() {
        Path currentRelativePath = Paths.get("");
        String repoDir = currentRelativePath.toAbsolutePath().toString() + File.separator + "ProjectRepository";
        ProjectRepository repo = null;
        try {
            repo = new ProjectRepository(repoDir);
        } catch (Exception e) {
            fail("creating repo should not fail");
        }
        FisaProject[] testDoc = getTestDocuments();
        for (FisaProject doc : testDoc) {
            try {
                repo.saveProject(doc);
            }catch (Exception e){
                System.out.print(e.getMessage());
                fail("Populating Repo schould not fail");
            }
        }
        assertNotNull(repo);
        return repo;
    }

    /**
     * checks if two projects result in same java class instances. Will fail test if projects cannot be
     * parsed as java class instances
     * @param docA first project to be tested
     * @param docB second project to be tested
     * @return true if projects represent equal java class instances, otherwise false
     */
    boolean checkEqualFisaDoc(FisaProject docA, FisaProject docB){
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
