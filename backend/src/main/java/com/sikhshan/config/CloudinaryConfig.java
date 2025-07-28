package com.sikhshan.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(CloudinaryConfig.class);
    
    @Value("${cloudinary.cloud-name:}")
    private String cloudName;
    
    @Value("${cloudinary.api-key:}")
    private String apiKey;
    
    @Value("${cloudinary.api-secret:}")
    private String apiSecret;
    
    @Bean
    public Cloudinary cloudinary() {
        logger.info("Initializing Cloudinary configuration...");
        
        // Check if environment variables are set
        if (cloudName == null || cloudName.isEmpty()) {
            logger.warn("CLOUDINARY_CLOUD_NAME is not set");
            cloudName = "dummy-cloud-name";
        }
        if (apiKey == null || apiKey.isEmpty()) {
            logger.warn("CLOUDINARY_API_KEY is not set");
            apiKey = "dummy-api-key";
        }
        if (apiSecret == null || apiSecret.isEmpty()) {
            logger.warn("CLOUDINARY_API_SECRET is not set");
            apiSecret = "dummy-api-secret";
        }
        
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        
        logger.info("Cloudinary configuration initialized with cloud_name: {}", cloudName);
        return new Cloudinary(config);
    }
} 