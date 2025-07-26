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
import com.sikhshan.model.Enrollment;
import com.sikhshan.repository.CourseRepository;
import com.sikhshan.repository.UserRepository;
import com.sikhshan.repository.EnrollmentRepository;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

	@Autowired
	private CourseRepository courseRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private EnrollmentRepository enrollmentRepository;

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

	// List Available Courses for a Student (not enrolled)
	@GetMapping("/available/{studentId}")
	public ResponseEntity<List<CourseResponse>> getAvailableCoursesForStudent(@PathVariable Long studentId) {
		List<Long> enrolledCourseIds = enrollmentRepository.findByStudentId(studentId)
			.stream().map(e -> e.getCourse().getId()).toList();
		List<Course> availableCourses;
		if (enrolledCourseIds.isEmpty()) {
			availableCourses = courseRepository.findAll();
		} else {
			availableCourses = courseRepository.findByIdNotIn(enrolledCourseIds);
		}
		List<CourseResponse> responses = availableCourses.stream().map(this::toResponse).toList();
		return ResponseEntity.ok(responses);
	}

	// Enroll Student in Course
	@PostMapping("/{courseId}/enroll")
	public ResponseEntity<?> enrollStudentInCourse(@PathVariable Long courseId, @RequestBody EnrollmentRequest enrollmentRequest) {
		Optional<Course> courseOpt = courseRepository.findById(courseId);
		if (courseOpt.isEmpty()) {
			return ResponseEntity.status(404).body("Course not found");
		}

		Optional<User> studentOpt = userRepository.findById(enrollmentRequest.getStudentId());
		if (studentOpt.isEmpty() || !studentOpt.get().getRole().name().equalsIgnoreCase("student")) {
			return ResponseEntity.badRequest().body("Student must be a valid student user");
		}

		// Check if already enrolled
		Optional<Enrollment> existingEnrollment = enrollmentRepository.findByStudentIdAndCourseId(
			enrollmentRequest.getStudentId(), courseId);
		if (existingEnrollment.isPresent()) {
			return ResponseEntity.badRequest().body("Student is already enrolled in this course");
		}

		Enrollment enrollment = new Enrollment();
		enrollment.setStudent(studentOpt.get());
		enrollment.setCourse(courseOpt.get());
		enrollment.setEnrollmentDate(LocalDate.now());
		enrollment.setStatus("ACTIVE");

		enrollmentRepository.save(enrollment);
		return ResponseEntity.ok("Student enrolled successfully");
	}

	// Unenroll Student from Course
	@DeleteMapping("/{courseId}/unenroll")
	public ResponseEntity<?> unenrollStudentFromCourse(@PathVariable Long courseId, @RequestParam Long studentId) {
		Optional<Enrollment> enrollmentOpt = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId);
		if (enrollmentOpt.isEmpty()) {
			return ResponseEntity.status(404).body("Enrollment not found");
		}

		enrollmentRepository.delete(enrollmentOpt.get());
		return ResponseEntity.ok("Student unenrolled successfully");
	}

	// Get Students enrolled in a Course
	@GetMapping("/{courseId}/students")
	public ResponseEntity<List<StudentResponse>> getStudentsInCourse(@PathVariable Long courseId) {
		Optional<Course> courseOpt = courseRepository.findById(courseId);
		if (courseOpt.isEmpty()) {
			return ResponseEntity.status(404).body("Course not found");
		}

		List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
		List<StudentResponse> students = enrollments.stream()
			.map(this::toStudentResponse)
			.collect(Collectors.toList());
		return ResponseEntity.ok(students);
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

	// Helper method to convert Enrollment to StudentResponse
	private StudentResponse toStudentResponse(Enrollment enrollment) {
		StudentResponse response = new StudentResponse();
		response.setId(enrollment.getStudent().getId());
		response.setName(enrollment.getStudent().getName());
		response.setEmail(enrollment.getStudent().getEmail());
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
	}

	// Inner class for enrollment request
	public static class EnrollmentRequest {
		private Long studentId;

		public Long getStudentId() { return studentId; }
		public void setStudentId(Long studentId) { this.studentId = studentId; }
	}
}