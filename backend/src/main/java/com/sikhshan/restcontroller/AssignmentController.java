package com.sikhshan.restcontroller;

import com.sikhshan.dto.AssignmentRequest;
import com.sikhshan.dto.AssignmentResponse;
import com.sikhshan.model.Assignment;
import com.sikhshan.model.Course;
import com.sikhshan.model.User;
import com.sikhshan.repository.AssignmentRepository;
import com.sikhshan.repository.CourseRepository;
import com.sikhshan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {
    @Autowired
    private AssignmentRepository assignmentRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private UserRepository userRepository;

    private AssignmentResponse toResponse(Assignment assignment) {
        AssignmentResponse resp = new AssignmentResponse();
        resp.setId(assignment.getId());
        resp.setName(assignment.getName());
        resp.setDescription(assignment.getDescription());
        resp.setDueDate(assignment.getDueDate());
        resp.setCreatedAt(assignment.getCreatedAt());
        if (assignment.getCourse() != null) {
            resp.setCourseId(assignment.getCourse().getId());
            resp.setCourseName(assignment.getCourse().getName());
        }
        if (assignment.getInstructor() != null) {
            resp.setInstructorId(assignment.getInstructor().getId());
            resp.setInstructorName(assignment.getInstructor().getName());
        }
        return resp;
    }

    // Create assignment
    @PostMapping
    public ResponseEntity<?> createAssignment(@RequestBody AssignmentRequest request) {
        Optional<Course> courseOpt = courseRepository.findById(request.getCourseId());
        Optional<User> instructorOpt = userRepository.findById(request.getInstructorId());
        if (courseOpt.isEmpty() || instructorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid course or instructor ID");
        }
        Assignment assignment = new Assignment();
        assignment.setName(request.getName());
        assignment.setDescription(request.getDescription());
        assignment.setDueDate(request.getDueDate());
        assignment.setCreatedAt(LocalDate.now());
        assignment.setCourse(courseOpt.get());
        assignment.setInstructor(instructorOpt.get());
        assignmentRepository.save(assignment);
        return ResponseEntity.ok(toResponse(assignment));
    }

    // List all assignments
    @GetMapping
    public ResponseEntity<List<AssignmentResponse>> getAllAssignments() {
        List<Assignment> assignments = assignmentRepository.findAll();
        List<AssignmentResponse> responses = assignments.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Get assignment by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAssignmentById(@PathVariable Long id) {
        Optional<Assignment> assignmentOpt = assignmentRepository.findById(id);
        if (assignmentOpt.isPresent()) {
            return ResponseEntity.ok(toResponse(assignmentOpt.get()));
        } else {
            return ResponseEntity.status(404).body("Assignment not found with id: " + id);
        }
    }

    // List assignments for a course
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<AssignmentResponse>> getAssignmentsByCourse(@PathVariable Long courseId) {
        List<Assignment> assignments = assignmentRepository.findByCourseId(courseId);
        List<AssignmentResponse> responses = assignments.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // List assignments by instructor
    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<List<AssignmentResponse>> getAssignmentsByInstructor(@PathVariable Long instructorId) {
        List<Assignment> assignments = assignmentRepository.findByInstructorId(instructorId);
        List<AssignmentResponse> responses = assignments.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Update assignment
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAssignment(@PathVariable Long id, @RequestBody AssignmentRequest request) {
        Optional<Assignment> assignmentOpt = assignmentRepository.findById(id);
        if (assignmentOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Assignment not found with id: " + id);
        }
        Optional<Course> courseOpt = courseRepository.findById(request.getCourseId());
        Optional<User> instructorOpt = userRepository.findById(request.getInstructorId());
        if (courseOpt.isEmpty() || instructorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid course or instructor ID");
        }
        Assignment assignment = assignmentOpt.get();
        assignment.setName(request.getName());
        assignment.setDescription(request.getDescription());
        assignment.setDueDate(request.getDueDate());
        assignment.setCourse(courseOpt.get());
        assignment.setInstructor(instructorOpt.get());
        assignmentRepository.save(assignment);
        return ResponseEntity.ok(toResponse(assignment));
    }

    // Delete assignment
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        if (!assignmentRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Assignment not found with id: " + id);
        }
        assignmentRepository.deleteById(id);
        return ResponseEntity.ok("Assignment deleted successfully");
    }
} 