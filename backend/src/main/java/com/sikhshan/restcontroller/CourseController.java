package com.sikhshan.restcontroller;

import com.sikhshan.dto.CourseRequest;
import com.sikhshan.dto.CourseResponse;
import com.sikhshan.model.Course;
import com.sikhshan.model.Enrollment;
import com.sikhshan.model.User;
import com.sikhshan.repository.CourseRepository;
import com.sikhshan.repository.EnrollmentRepository;
import com.sikhshan.repository.UserRepository;
import com.sikhshan.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
	@Autowired
	private CourseRepository courseRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private EnrollmentRepository enrollmentRepository;
	
	@Autowired
	private CloudinaryService cloudinaryService;

	private CourseResponse toResponse(Course course) {
		CourseResponse response = new CourseResponse();
		response.setId(course.getId());
		response.setName(course.getName());
		response.setCode(course.getCode());
		response.setDescription(course.getDescription());
		response.setCategory(course.getCategory());
		response.setStartDate(course.getStartDate());
		response.setEndDate(course.getEndDate());
		response.setCredits(course.getCredits());
		response.setImageUrl(course.getImageUrl());
		response.setStatus(course.getStatus());
		response.setCreatedAt(course.getCreatedAt());
		
		if (course.getInstructor() != null) {
			response.setInstructorId(course.getInstructor().getId());
			response.setInstructor(course.getInstructor().getName());
			response.setInstructorProfilePictureUrl(course.getInstructor().getCloudinaryUrl());
		}
		
		return response;
	}

	@PostMapping
	public ResponseEntity<?> createCourse(@RequestBody CourseRequest courseRequest) {
		Optional<User> instructorOpt = userRepository.findById(courseRequest.getInstructorId());
		if (instructorOpt.isEmpty()) {
			return ResponseEntity.badRequest().body("Instructor not found");
		}
		Course course = new Course();
		course.setName(courseRequest.getName());
		course.setCode(courseRequest.getCode());
		course.setDescription(courseRequest.getDescription());
		course.setCategory(courseRequest.getCategory());
		course.setStartDate(courseRequest.getStartDate());
		course.setEndDate(courseRequest.getEndDate());
		course.setCredits(courseRequest.getCredits());
		course.setStatus(courseRequest.getStatus());
		course.setCreatedAt(LocalDate.now());
		course.setInstructor(instructorOpt.get());
		courseRepository.save(course);
		return ResponseEntity.ok(toResponse(course));
	}

	@GetMapping
	public ResponseEntity<List<CourseResponse>> getAllCourses() {
		List<Course> courses = courseRepository.findAll();
		List<CourseResponse> responses = courses.stream().map(this::toResponse).collect(Collectors.toList());
		return ResponseEntity.ok(responses);
	}

	@GetMapping("/instructor/{instructorId}")
	public ResponseEntity<List<CourseResponse>> getCoursesByInstructor(@PathVariable Long instructorId) {
		List<Course> courses = courseRepository.findByInstructorId(instructorId);
		List<CourseResponse> responses = courses.stream().map(this::toResponse).collect(Collectors.toList());
		return ResponseEntity.ok(responses);
	}

	@GetMapping("/student/{studentId}")
	public ResponseEntity<List<CourseResponse>> getCoursesByStudent(@PathVariable Long studentId) {
		List<Course> courses = courseRepository.findByEnrollmentsStudentId(studentId);
		List<CourseResponse> responses = courses.stream().map(this::toResponse).collect(Collectors.toList());
		return ResponseEntity.ok(responses);
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getCourseById(@PathVariable Long id) {
		Optional<Course> courseOpt = courseRepository.findById(id);
		if (courseOpt.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(toResponse(courseOpt.get()));
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody CourseRequest courseRequest) {
		Optional<Course> courseOpt = courseRepository.findById(id);
		if (courseOpt.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		Optional<User> instructorOpt = userRepository.findById(courseRequest.getInstructorId());
		if (instructorOpt.isEmpty()) {
			return ResponseEntity.badRequest().body("Instructor not found");
		}
		Course course = courseOpt.get();
		course.setName(courseRequest.getName());
		course.setCode(courseRequest.getCode());
		course.setDescription(courseRequest.getDescription());
		course.setCategory(courseRequest.getCategory());
		course.setStartDate(courseRequest.getStartDate());
		course.setEndDate(courseRequest.getEndDate());
		course.setCredits(courseRequest.getCredits());
		course.setStatus(courseRequest.getStatus());
		course.setInstructor(instructorOpt.get());
		courseRepository.save(course);
		return ResponseEntity.ok(toResponse(course));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
		Optional<Course> courseOpt = courseRepository.findById(id);
		if (courseOpt.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		Course course = courseOpt.get();
		
		// Delete course image from Cloudinary if exists
		if (course.getCloudinaryPublicId() != null && !course.getCloudinaryPublicId().isEmpty()) {
			try {
				cloudinaryService.deleteFile(course.getCloudinaryPublicId());
			} catch (IOException e) {
				// Log error but continue with deletion
				System.err.println("Failed to delete course image from Cloudinary: " + e.getMessage());
			}
		}
		
		// Delete related enrollments first to avoid foreign key constraint
		List<Enrollment> enrollments = enrollmentRepository.findByCourseId(id);
		enrollmentRepository.deleteAll(enrollments);
		
		courseRepository.delete(course);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/available/{studentId}")
	public ResponseEntity<List<CourseResponse>> getAvailableCoursesForStudent(@PathVariable Long studentId) {
		List<Course> allCourses = courseRepository.findAll();
		List<Course> enrolledCourses = courseRepository.findByEnrollmentsStudentId(studentId);
		List<Long> enrolledCourseIds = enrolledCourses.stream().map(Course::getId).collect(Collectors.toList());
		List<Course> availableCourses = allCourses.stream()
				.filter(course -> !enrolledCourseIds.contains(course.getId()))
				.collect(Collectors.toList());
		List<CourseResponse> responses = availableCourses.stream().map(this::toResponse).collect(Collectors.toList());
		return ResponseEntity.ok(responses);
	}

	@PostMapping("/{courseId}/enroll")
	public ResponseEntity<?> enrollStudentInCourse(@PathVariable Long courseId, @RequestBody EnrollmentRequest enrollmentRequest) {
		try {
			Optional<Course> courseOpt = courseRepository.findById(courseId);
			if (courseOpt.isEmpty()) {
				return ResponseEntity.status(404).body("Course not found");
			}
			Optional<User> studentOpt = userRepository.findById(enrollmentRequest.getStudentId());
			if (studentOpt.isEmpty()) {
				return ResponseEntity.status(404).body("Student not found");
			}
			Optional<Enrollment> existingEnrollment = enrollmentRepository.findByStudentIdAndCourseId(enrollmentRequest.getStudentId(), courseId);
			if (existingEnrollment.isPresent()) {
				return ResponseEntity.status(400).body("Student is already enrolled in this course");
			}
			Enrollment enrollment = new Enrollment();
			enrollment.setStudent(studentOpt.get());
			enrollment.setCourse(courseOpt.get());
			enrollment.setEnrollmentDate(LocalDate.now());
			enrollment.setStatus("ACTIVE");
			enrollmentRepository.save(enrollment);
			return ResponseEntity.ok("Student enrolled successfully");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
		}
	}

	@DeleteMapping("/{courseId}/unenroll")
	public ResponseEntity<?> unenrollStudentFromCourse(@PathVariable Long courseId, @RequestParam Long studentId) {
		try {
			Optional<Enrollment> enrollmentOpt = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId);
			if (enrollmentOpt.isEmpty()) {
				return ResponseEntity.status(404).body("Enrollment not found");
			}
			enrollmentRepository.delete(enrollmentOpt.get());
			return ResponseEntity.ok("Student unenrolled successfully");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
		}
	}

	@GetMapping("/{courseId}/students")
	public ResponseEntity<?> getStudentsInCourse(@PathVariable Long courseId) {
		try {
			Optional<Course> courseOpt = courseRepository.findById(courseId);
			if (courseOpt.isEmpty()) {
				return ResponseEntity.status(404).body("Course not found");
			}
			List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
			List<StudentResponse> students = enrollments.stream()
					.map(this::toStudentResponse)
					.collect(Collectors.toList());
			return ResponseEntity.ok(students);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
		}
	}

	// Debug endpoint to test enrollment repository
	@GetMapping("/{courseId}/students/debug")
	public ResponseEntity<?> debugStudentsInCourse(@PathVariable Long courseId) {
		try {
			Optional<Course> courseOpt = courseRepository.findById(courseId);
			if (courseOpt.isEmpty()) {
				return ResponseEntity.status(404).body("Course not found");
			}

			List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
			return ResponseEntity.ok(Map.of(
				"courseId", courseId,
				"enrollmentCount", enrollments.size(),
				"enrollments", enrollments.stream().map(e -> Map.of(
					"id", e.getId(),
					"studentId", e.getStudent() != null ? e.getStudent().getId() : "null",
					"studentName", e.getStudent() != null ? e.getStudent().getName() : "null",
					"enrollmentDate", e.getEnrollmentDate(),
					"status", e.getStatus()
				)).collect(Collectors.toList())
			));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Debug error: " + e.getMessage());
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
		
		try {
			// Delete old course image from Cloudinary if exists
			if (course.getCloudinaryPublicId() != null && !course.getCloudinaryPublicId().isEmpty()) {
				try {
					cloudinaryService.deleteFile(course.getCloudinaryPublicId());
				} catch (IOException e) {
					// Log error but continue with upload
					System.err.println("Failed to delete old course image: " + e.getMessage());
				}
			}
			
			// Upload new course image to Cloudinary
			Map<String, Object> uploadResult = cloudinaryService.uploadCourseImage(file, course.getId());
			
			// Update course with Cloudinary information
			course.setCloudinaryPublicId((String) uploadResult.get("public_id"));
			course.setCloudinaryUrl((String) uploadResult.get("secure_url"));
			course.setImageUrl((String) uploadResult.get("secure_url"));
			
			courseRepository.save(course);
			return ResponseEntity.ok(toResponse(course));
			
		} catch (IOException e) {
			return ResponseEntity.status(500).body("Failed to upload image: " + e.getMessage());
		}
	}

	// Helper method to convert Enrollment to StudentResponse
	private StudentResponse toStudentResponse(Enrollment enrollment) {
		StudentResponse response = new StudentResponse();
		if (enrollment.getStudent() != null) {
			response.setId(enrollment.getStudent().getId());
			response.setName(enrollment.getStudent().getName());
			response.setEmail(enrollment.getStudent().getEmail());
			response.setProfilePictureUrl(enrollment.getStudent().getCloudinaryUrl());
		}
		response.setEnrolledDate(enrollment.getEnrollmentDate());
		response.setStatus(enrollment.getStatus());
		return response;
	}

	// Inner class for student response
	public static class StudentResponse {
		private Long id;
		private String name;
		private String email;
		private LocalDate enrolledDate;
		private String status;
		private String profilePictureUrl;

		// Getters and setters
		public Long getId() { return id; }
		public void setId(Long id) { this.id = id; }
		public String getName() { return name; }
		public void setName(String name) { this.name = name; }
		public String getEmail() { return email; }
		public void setEmail(String email) { this.email = email; }
		public LocalDate getEnrolledDate() { return enrolledDate; }
		public void setEnrolledDate(LocalDate enrolledDate) { this.enrolledDate = enrolledDate; }
		public String getStatus() { return status; }
		public void setStatus(String status) { this.status = status; }
		public String getProfilePictureUrl() { return profilePictureUrl; }
		public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }
	}

	// Inner class for enrollment request
	public static class EnrollmentRequest {
		private Long studentId;

		public Long getStudentId() { return studentId; }
		public void setStudentId(Long studentId) { this.studentId = studentId; }
	}
}