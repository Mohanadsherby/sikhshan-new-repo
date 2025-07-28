-- Migration script to add Cloudinary fields to existing tables
-- Run this script after updating the application.properties with Cloudinary credentials

-- Add Cloudinary fields to user table for profile pictures
ALTER TABLE user 
ADD COLUMN cloudinary_public_id VARCHAR(255),
ADD COLUMN cloudinary_url VARCHAR(255);

-- Add Cloudinary fields to course table for course images
ALTER TABLE course 
ADD COLUMN cloudinary_public_id VARCHAR(255),
ADD COLUMN cloudinary_url VARCHAR(255);

-- Add Cloudinary fields to course_attachment table for course attachments
ALTER TABLE course_attachment 
ADD COLUMN cloudinary_public_id VARCHAR(255),
ADD COLUMN cloudinary_url VARCHAR(255);

-- Update existing profile picture URLs to use Cloudinary URLs if they exist
-- (This will be handled by the application when users update their profiles)

-- Update existing course image URLs to use Cloudinary URLs if they exist
-- (This will be handled by the application when courses are updated)

-- Update existing attachment URLs to use Cloudinary URLs if they exist
-- (This will be handled by the application when attachments are re-uploaded) 