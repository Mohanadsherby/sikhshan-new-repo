package com.sikhshan.restcontroller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.sikhshan.dto.CourseRequest;
import com.sikhshan.dto.CourseResponse;
import com.sikhshan.model.Course;
import com.sikhshan.model.User;
import com.sikhshan.repository.CourseRepository;
import com.sikhshan.repository.UserRepository;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

	@Autowired
	private CourseRepository courseRepository;

	@Autowired
	private UserRepository userRepository;

	private CourseResponse toResponse(Course course) {
		CourseResponse resp = new CourseResponse();
		resp.setId(course.getId());
		resp.setName(course.getName());
		resp.setCode(course.getCode());
		resp.setDescription(course.getDescription());
		resp.setCategory(course.getCategory());
		if (course.getInstructor() != null) {
			resp.setInstructorId(course.getInstructor().getId());
			resp.setInstructor(course.getInstructor().getName());
		}
		resp.setStartDate(course.getStartDate());
		resp.setEndDate(course.getEndDate());
		resp.setCredits(course.getCredits());
		resp.setImageUrl(course.getImageUrl());
		resp.setStatus(course.getStatus());
		resp.setCreatedAt(course.getCreatedAt());
		return resp;
	}

	// Create Course
	@PostMapping
	public ResponseEntity<?> createCourse(@RequestBody CourseRequest courseRequest) {
		Optional<User> instructorOpt = userRepository.findById(courseRequest.getInstructorId());
		if (instructorOpt.isEmpty() || !instructorOpt.get().getRole().name().equalsIgnoreCase("faculty")) {
			return ResponseEntity.badRequest().body("Instructor must be a valid faculty user");
		}

		Course course = new Course();
		course.setName(courseRequest.getName());
		course.setCode(courseRequest.getCode());
		course.setDescription(courseRequest.getDescription());
		course.setCategory(courseRequest.getCategory());
		course.setInstructor(instructorOpt.get());
		course.setStartDate(courseRequest.getStartDate());
		course.setEndDate(courseRequest.getEndDate());
		course.setCredits(courseRequest.getCredits());
		course.setImageUrl(courseRequest.getImageUrl());
		course.setStatus(courseRequest.getStatus());
		course.setCreatedAt(LocalDate.now());

		Course savedCourse = courseRepository.save(course);
		return ResponseEntity.ok(toResponse(savedCourse));
	}

	// List All Courses
	@GetMapping
	public ResponseEntity<List<CourseResponse>> getAllCourses() {
		List<Course> courses = courseRepository.findAll();
		List<CourseResponse> responses = courses.stream().map(this::toResponse).collect(Collectors.toList());
		return ResponseEntity.ok(responses);
	}

	// List Courses by Instructor
	@GetMapping("/instructor/{instructorId}")
	public ResponseEntity<List<CourseResponse>> getCoursesByInstructor(@PathVariable Long instructorId) {
		List<Course> courses = courseRepository.findByInstructorId(instructorId);
		List<CourseResponse> responses = courses.stream().map(this::toResponse).collect(Collectors.toList());
		return ResponseEntity.ok(responses);
	}

	// List Courses by Student
	@GetMapping("/student/{studentId}")
	public ResponseEntity<List<CourseResponse>> getCoursesByStudent(@PathVariable Long studentId) {
		List<Course> courses = courseRepository.findByEnrollmentsStudentId(studentId);
		List<CourseResponse> responses = courses.stream().map(this::toResponse).collect(Collectors.toList());
		return ResponseEntity.ok(responses);
	}

	// Get Course by ID
	@GetMapping("/{id}")
	public ResponseEntity<?> getCourseById(@PathVariable Long id) {
		Optional<Course> courseOpt = courseRepository.findById(id);
		if (courseOpt.isPresent()) {
			return ResponseEntity.ok(toResponse(courseOpt.get()));
		} else {
			return ResponseEntity.status(404).body("Course not found with id: " + id);
		}
	}

	// Update Course
	@PutMapping("/{id}")
	public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody CourseRequest courseRequest) {
		Optional<Course> courseOpt = courseRepository.findById(id);
		if (courseOpt.isEmpty()) {
			return ResponseEntity.status(404).body("Course not found with id: " + id);
		}

		Optional<User> instructorOpt = userRepository.findById(courseRequest.getInstructorId());
		if (instructorOpt.isEmpty() || !instructorOpt.get().getRole().name().equalsIgnoreCase("faculty")) {
			return ResponseEntity.badRequest().body("Instructor must be a valid faculty user");
		}

		Course course = courseOpt.get();
		course.setName(courseRequest.getName());
		course.setCode(courseRequest.getCode());
		course.setDescription(courseRequest.getDescription());
		course.setCategory(courseRequest.getCategory());
		course.setInstructor(instructorOpt.get());
		course.setStartDate(courseRequest.getStartDate());
		course.setEndDate(courseRequest.getEndDate());
		course.setCredits(courseRequest.getCredits());
		course.setImageUrl(courseRequest.getImageUrl());
		course.setStatus(courseRequest.getStatus());

		Course savedCourse = courseRepository.save(course);
		return ResponseEntity.ok(toResponse(savedCourse));
	}

	// Delete Course
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
		Optional<Course> courseOpt = courseRepository.findById(id);
		if (courseOpt.isPresent()) {
			courseRepository.deleteById(id);
			return ResponseEntity.ok("Course deleted successfully");
		} else {
			return ResponseEntity.status(404).body("Course not found with id: " + id);
		}
	}

	// Upload course image by ID
	@PostMapping("/{id}/image")
	public ResponseEntity<?> uploadCourseImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
		Optional<Course> courseOpt = courseRepository.findById(id);
		if (courseOpt.isEmpty()) {
			return ResponseEntity.status(404).body("Course not found with id: " + id);
		}
		Course course = courseOpt.get();
		String uploadDir = "uploads/course-images/";
		File dir = new File(uploadDir);
		if (!dir.exists()) dir.mkdirs();
		String filename = course.getCode().replaceAll("[^a-zA-Z0-9]", "_") + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
		Path filepath = Paths.get(uploadDir, filename);
		try {
			Files.write(filepath, file.getBytes());
			course.setImageUrl("/" + uploadDir + filename);
			courseRepository.save(course);
			return ResponseEntity.ok(toResponse(course));
		} catch (IOException e) {
			return ResponseEntity.status(500).body("Failed to upload image");
		}
	}
}