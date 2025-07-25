package com.sikhshan.restcontroller;

import com.sikhshan.dto.QuizRequest;
import com.sikhshan.dto.QuizResponse;
import com.sikhshan.model.Quiz;
import com.sikhshan.model.Course;
import com.sikhshan.model.User;
import com.sikhshan.repository.QuizRepository;
import com.sikhshan.repository.CourseRepository;
import com.sikhshan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {
    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private UserRepository userRepository;

    private QuizResponse toResponse(Quiz quiz) {
        QuizResponse resp = new QuizResponse();
        resp.setId(quiz.getId());
        resp.setName(quiz.getName());
        resp.setDescription(quiz.getDescription());
        resp.setStartDateTime(quiz.getStartDateTime());
        resp.setDurationMinutes(quiz.getDurationMinutes());
        resp.setCreatedAt(quiz.getCreatedAt());
        if (quiz.getCourse() != null) {
            resp.setCourseId(quiz.getCourse().getId());
            resp.setCourseName(quiz.getCourse().getName());
        }
        if (quiz.getInstructor() != null) {
            resp.setInstructorId(quiz.getInstructor().getId());
            resp.setInstructorName(quiz.getInstructor().getName());
        }
        return resp;
    }

    // Create quiz
    @PostMapping
    public ResponseEntity<?> createQuiz(@RequestBody QuizRequest request) {
        Optional<Course> courseOpt = courseRepository.findById(request.getCourseId());
        Optional<User> instructorOpt = userRepository.findById(request.getInstructorId());
        if (courseOpt.isEmpty() || instructorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid course or instructor ID");
        }
        Quiz quiz = new Quiz();
        quiz.setName(request.getName());
        quiz.setDescription(request.getDescription());
        quiz.setStartDateTime(request.getStartDateTime());
        quiz.setDurationMinutes(request.getDurationMinutes());
        quiz.setCreatedAt(LocalDateTime.now());
        quiz.setCourse(courseOpt.get());
        quiz.setInstructor(instructorOpt.get());
        quizRepository.save(quiz);
        return ResponseEntity.ok(toResponse(quiz));
    }

    // List all quizzes
    @GetMapping
    public ResponseEntity<List<QuizResponse>> getAllQuizzes() {
        List<Quiz> quizzes = quizRepository.findAll();
        List<QuizResponse> responses = quizzes.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Get quiz by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getQuizById(@PathVariable Long id) {
        Optional<Quiz> quizOpt = quizRepository.findById(id);
        if (quizOpt.isPresent()) {
            return ResponseEntity.ok(toResponse(quizOpt.get()));
        } else {
            return ResponseEntity.status(404).body("Quiz not found with id: " + id);
        }
    }

    // List quizzes for a course
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<QuizResponse>> getQuizzesByCourse(@PathVariable Long courseId) {
        List<Quiz> quizzes = quizRepository.findByCourseId(courseId);
        List<QuizResponse> responses = quizzes.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // List quizzes by instructor
    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<List<QuizResponse>> getQuizzesByInstructor(@PathVariable Long instructorId) {
        List<Quiz> quizzes = quizRepository.findByInstructorId(instructorId);
        List<QuizResponse> responses = quizzes.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Update quiz
    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuiz(@PathVariable Long id, @RequestBody QuizRequest request) {
        Optional<Quiz> quizOpt = quizRepository.findById(id);
        if (quizOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Quiz not found with id: " + id);
        }
        Optional<Course> courseOpt = courseRepository.findById(request.getCourseId());
        Optional<User> instructorOpt = userRepository.findById(request.getInstructorId());
        if (courseOpt.isEmpty() || instructorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid course or instructor ID");
        }
        Quiz quiz = quizOpt.get();
        quiz.setName(request.getName());
        quiz.setDescription(request.getDescription());
        quiz.setStartDateTime(request.getStartDateTime());
        quiz.setDurationMinutes(request.getDurationMinutes());
        quiz.setCourse(courseOpt.get());
        quiz.setInstructor(instructorOpt.get());
        quizRepository.save(quiz);
        return ResponseEntity.ok(toResponse(quiz));
    }

    // Delete quiz
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuiz(@PathVariable Long id) {
        if (!quizRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Quiz not found with id: " + id);
        }
        quizRepository.deleteById(id);
        return ResponseEntity.ok("Quiz deleted successfully");
    }
} 