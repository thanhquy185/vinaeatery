package vn.tuhoc.vinaeatery.service;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.ServletContext;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UploadService {
    // Properties
    private final ServletContext servletContext;

    // Methods
    public String uploadImage(MultipartFile file, String folder, String id) {
        String rootPath = System.getProperty("user.dir") + File.separator + "client-web" + File.separator + "src"
                + File.separator + "assets" + File.separator + "images";
        String filename = "";
        try {
            byte[] bytes = file.getBytes();

            File dir = new File(rootPath + File.separator + folder);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            filename = System.currentTimeMillis() + "-" + folder.substring(0, folder.length() - 1).replace("-", "_")
                    + "-" + id + "."
                    + String.valueOf(file.getContentType()).split("/")[1];
            File serverFile = new File(dir.getAbsolutePath() + File.separator + filename);

            BufferedOutputStream stream = new BufferedOutputStream(
                    new FileOutputStream(serverFile));
            stream.write(bytes);
            stream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return filename;
    }
}