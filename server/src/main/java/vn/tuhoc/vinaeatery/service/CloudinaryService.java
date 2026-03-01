package vn.tuhoc.vinaeatery.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {
    // Properties
    private final Cloudinary cloudinary;

    // Methods
    public String uploadImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File upload is empty");
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null) {
            throw new IOException("File name is missing");
        }

        // Tách tên và extension
        String[] nameParts = extractNameAndExtension(originalName);
        String fileName = nameParts[0];
        String extension = nameParts[1];

        // Sinh public_id
        String publicId = generatePublicId(fileName);
        log.info("public_id: {}", publicId);

        // Upload trực tiếp bằng InputStream (không cần convert sang File)
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "public_id", publicId,
                        "resource_type", "image",
                        "format", extension));

        // Lấy url từ kết quả trả về Cloudinary (chuẩn nhất)
        String url = (String) uploadResult.get("secure_url");
        log.info("Upload URL: {}", url);

        return url;
    }

    // Sinh public_id dạng uuid_filename
    private String generatePublicId(String fileName) {
        return UUID.randomUUID() + "_" + fileName;
    }

    // Tách tên và extension một cách an toàn
    private String[] extractNameAndExtension(String originalName) {
        int lastDot = originalName.lastIndexOf(".");

        if (lastDot == -1) {
            return new String[] { originalName, "" }; // không có extension
        }

        String name = originalName.substring(0, lastDot);
        String ext = originalName.substring(lastDot + 1);

        return new String[] { name, ext };
    }
}
