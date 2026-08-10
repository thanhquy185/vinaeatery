package vn.tuhoc.vinaeatery.modules.global.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.tuhoc.vinaeatery.modules.global.exceptions.FileNameIsEmptyException;
import vn.tuhoc.vinaeatery.modules.global.exceptions.FileUploadIsEmptyException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {
    private final Cloudinary cloudinary;

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

    // Tải ảnh
    public String uploadImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new FileUploadIsEmptyException();
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.isBlank()) {
            throw new FileNameIsEmptyException();
        }

        // Tách tên và extension
        String[] nameParts = extractNameAndExtension(originalName);
        String fileName = nameParts[0];
        String extension = nameParts[1];

        // Sinh public_id
        String publicId = generatePublicId(fileName);
        log.info("public_id: {}", publicId);

        // Upload trực tiếp bằng InputStream (không cần convert sang File)
        @SuppressWarnings("unchecked")
        Map<Object, Object> uploadResult = cloudinary.uploader().upload(
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

    // Lấy đường dẫn ảnh
    public String getImage(MultipartFile file) {
        String image = null;
        if (file != null && !file.isEmpty()) {
            try {
                image = this.uploadImage(file);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        return image;
    }
}
