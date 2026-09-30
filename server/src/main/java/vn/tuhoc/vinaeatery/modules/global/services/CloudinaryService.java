package vn.tuhoc.vinaeatery.modules.global.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.CloudinaryUploadResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.exceptions.FileNameIsEmptyException;
import vn.tuhoc.vinaeatery.modules.global.exceptions.FileUploadIsEmptyException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class CloudinaryService {
    final Cloudinary cloudinary;

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
        String publicId = this.generatePublicId(fileName);
        log.info("public_id: {}", publicId);

        // Upload trực tiếp bằng InputStream (không cần convert sang File)
        @SuppressWarnings("unchecked")
        Map<Object, Object> uploadResult = this.cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "public_id", publicId,
                        "resource_type", "image",
                        "folder", "vinaeatery/images",
                        "format", extension));

        // Lấy url từ kết quả trả về Cloudinary (chuẩn nhất)
        String url = (String) uploadResult.get("secure_url");
        log.info("Upload URL: {}", url);

        return url;
    }

    public CloudinaryUploadResponseDTO newUploadImage(MultipartFile file, String objectType) throws IOException {
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
        String publicId = this.generatePublicId(fileName);
        log.info("public_id: {}", publicId);

        // Upload trực tiếp bằng InputStream (không cần convert sang File)
        @SuppressWarnings("unchecked")
        Map<Object, Object> uploadResult = this.cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "public_id", publicId,
                        "resource_type", "image",
                        "folder", String.format("vinaeatery/images/%s", objectType),
                        "format", extension));

        // Lấy url từ kết quả trả về Cloudinary (chuẩn nhất)
        String uploadedUrl = (String) uploadResult.get("secure_url");
        String uploadedPublicId = (String) uploadResult.get("public_id");

        log.info("Upload URL: {}", uploadedUrl);
        log.info("Upload Public Id: {}", uploadedPublicId);

        return CloudinaryUploadResponseDTO.builder()
                .url(uploadedUrl)
                .publicId(uploadedPublicId)
                .build();
    }

    // Xoá ảnh
    public void deleteImage(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            return;
        }

        try {
            this.cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap("resource_type", "image"));
        } catch (IOException e) {
            e.printStackTrace();
        }

        log.info("Deleted image from Cloudinary: {}", publicId);
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

    public CloudinaryUploadResponseDTO newGetImage(MultipartFile file, String objectType) {
        CloudinaryUploadResponseDTO image = null;
        if (file != null && !file.isEmpty()) {
            try {
                image = this.newUploadImage(file, objectType);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        return image;
    }
}
