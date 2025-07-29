package com.sikhshan.restcontroller;

import com.sikhshan.dto.QuizRequest;
import com.sikhshan.dto.QuizResponse;
import com.sikhshan.dto.QuestionRequest;
import com.sikhshan.dto.QuestionResponse;
import com.sikhshan.dto.QuestionOptionRequest;
import com.sikhshan.dto.QuestionOptionResponse;
import com.sikhshan.model.Quiz;
import com.sikhshan.model.Question;
import com.sikhshan.model.QuestionOption;
import com.sikhshan.model.Course;
import com.sikhshan.model.User;
import com.sikhshan.repository.QuizRepository;
import com.sikhshan.repository.QuestionRepository;
import com.sikhshan.repository.QuestionOptionRepository;
import com.sikhshan.repository.CourseRepository;
import com.sikhshan.repository.UserRepository;
import com.sikhshan.repository.QuizAttemptRepository;
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
    private QuestionRepository questionRepository;
    @Autowired
    private QuestionOptionRepository optionRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private QuizAttemptRepository attemptRepository;

    private QuizResponse toResponse(Quiz quiz) {
        QuizResponse resp = new QuizResponse();
        resp.setId(quiz.getId());
        resp.setName(quiz.getName());
        resp.setDescription(quiz.getDescription());
        resp.setStartDateTime(quiz.getStartDateTime());
        resp.setDurationMinutes(quiz.getDurationMinutes());
        resp.setTotalPoints(quiz.getTotalPoints());
        resp.setStatus(quiz.getStatus());
        resp.setCreatedAt(quiz.getCreatedAt());
        
        if (quiz.getCourse() != null) {
            resp.setCourseId(quiz.getCourse().getId());
            resp.setCourseName(quiz.getCourse().getName());
        }
        if (quiz.getInstructor() != null) {
            resp.setInstructorId(quiz.getInstructor().getId());
            resp.setInstructorName(quiz.getInstructor().getName());
        }
        
        // Calculate quiz status
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endTime = quiz.getStartDateTime().plusMinutes(quiz.getDurationMinutes());
        
        resp.setActive(now.isAfter(quiz.getStartDateTime()) && now.isBefore(endTime));
        resp.setOverdue(now.isAfter(endTime));
        
        // Get attempt count
        List<com.sikhshan.model.QuizAttempt> attempts = attemptRepository.findByQuizId(quiz.getId());
        resp.setAttemptCount(attempts.size());
        
        return resp;
    }

    private QuestionResponse toQuestionResponse(Question question) {
        QuestionResponse resp = new QuestionResponse();
        resp.setId(question.getId());
        resp.setText(question.getText());
        resp.setType(question.getType());
        resp.setPoints(question.getPoints());
        resp.setCorrectAnswer(question.getCorrectAnswer());
        
        if (question.getOptions() != null) {
            List<QuestionOptionResponse> optionResponses = question.getOptions().stream()
                .map(this::toOptionResponse)
                .collect(Collectors.toList());
            resp.setOptions(optionResponses);
        }
        
        return resp;
    }

    private QuestionOptionResponse toOptionResponse(QuestionOption option) {
        QuestionOptionResponse resp = new QuestionOptionResponse();
        resp.setId(option.getId());
        resp.setText(option.getText());
        resp.setIsCorrect(option.getIsCorrect());
        return resp;
    }

    // Create quiz with questions
    @PostMapping
    public ResponseEntity<?> createQuiz(@RequestBody QuizRequest request) {
        try {
            Optional<Course> courseOpt = courseRepository.findById(request.getCourseId());
            Optional<User> instructorOpt = userRepository.findById(request.getInstructorId());
            
            if (courseOpt.isEmpty() || instructorOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid course or instructor ID");
            }
            
            // Validate quiz data
            if (request.getStartDateTime() == null || request.getDurationMinutes() == null || request.getDurationMinutes() <= 0) {
                return ResponseEntity.badRequest().body("Invalid start time or duration");
            }
            
            Quiz quiz = new Quiz();
            quiz.setName(request.getName());
            quiz.setDescription(request.getDescription());
            quiz.setStartDateTime(request.getStartDateTime());
            quiz.setDurationMinutes(request.getDurationMinutes());
            quiz.setTotalPoints(request.getTotalPoints() != null ? request.getTotalPoints() : 100);
            quiz.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
            quiz.setCourse(courseOpt.get());
            quiz.setInstructor(instructorOpt.get());
            
            Quiz savedQuiz = quizRepository.save(quiz);
            
            // Save questions if provided
            if (request.getQuestions() != null && !request.getQuestions().isEmpty()) {
                for (QuestionRequest questionReq : request.getQuestions()) {
                    Question question = new Question();
                    question.setText(questionReq.getText());
                    question.setType(questionReq.getType());
                    question.setPoints(questionReq.getPoints() != null ? questionReq.getPoints() : 1);
                    question.setCorrectAnswer(questionReq.getCorrectAnswer());
                    question.setQuiz(savedQuiz);
                    
                    Question savedQuestion = questionRepository.save(question);
                    
                    // Save options if provided
                    if (questionReq.getOptions() != null && !questionReq.getOptions().isEmpty()) {
                        for (QuestionOptionRequest optionReq : questionReq.getOptions()) {
                            QuestionOption option = new QuestionOption();
                            option.setText(optionReq.getText());
                            option.setIsCorrect(optionReq.getIsCorrect());
                            option.setQuestion(savedQuestion);
                            optionRepository.save(option);
                        }
                    }
                }
            }
            
            return ResponseEntity.ok(toResponse(savedQuiz));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating quiz: " + e.getMessage());
        }
    }

    // Get quiz by ID with questions
    @GetMapping("/{id}")
    public ResponseEntity<?> getQuizById(@PathVariable Long id) {
        Optional<Quiz> quizOpt = quizRepository.findById(id);
        if (quizOpt.isPresent()) {
            Quiz quiz = quizOpt.get();
            QuizResponse response = toResponse(quiz);
            
            // Add questions to response
            List<Question> questions = questionRepository.findByQuizIdOrderById(id);
            List<QuestionResponse> questionResponses = questions.stream()
                .map(this::toQuestionResponse)
                .collect(Collectors.toList());
            response.setQuestions(questionResponses);
            
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(404).body("Quiz not found with id: " + id);
        }
    }

    // Get quiz by ID for students (without correct answers)
    @GetMapping("/{id}/student")
    public ResponseEntity<?> getQuizForStudent(@PathVariable Long id) {
        Optional<Quiz> quizOpt = quizRepository.findById(id);
        if (quizOpt.isPresent()) {
            Quiz quiz = quizOpt.get();
            QuizResponse response = toResponse(quiz);
            
            // Check if quiz is active
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime endTime = quiz.getStartDateTime().plusMinutes(quiz.getDurationMinutes());
            
            if (now.isBefore(quiz.getStartDateTime())) {
                return ResponseEntity.badRequest().body("Quiz has not started yet");
            }
            
            if (now.isAfter(endTime)) {
                return ResponseEntity.badRequest().body("Quiz has ended");
            }
            
            // Add questions without correct answers
            List<Question> questions = questionRepository.findByQuizIdOrderById(id);
            List<QuestionResponse> questionResponses = questions.stream()
                .map(q -> {
                    QuestionResponse qResp = toQuestionResponse(q);
                    qResp.setCorrectAnswer(null); // Hide correct answer from students
                    return qResp;
                })
                .collect(Collectors.toList());
            response.setQuestions(questionResponses);
            
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(404).body("Quiz not found with id: " + id);
        }
    }

    // List all quizzes
    @GetMapping
    public ResponseEntity<List<QuizResponse>> getAllQuizzes() {
        List<Quiz> quizzes = quizRepository.findAll();
        List<QuizResponse> responses = quizzes.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // List quizzes for a course
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<QuizResponse>> getQuizzesByCourse(@PathVariable Long courseId) {
        List<Quiz> quizzes = quizRepository.findByCourseId(courseId);
        List<QuizResponse> responses = quizzes.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // List active quizzes for a course (for students)
    @GetMapping("/course/{courseId}/active")
    public ResponseEntity<List<QuizResponse>> getActiveQuizzesByCourse(@PathVariable Long courseId) {
        List<Quiz> quizzes = quizRepository.findByCourseId(courseId);
        LocalDateTime now = LocalDateTime.now();
        
        List<QuizResponse> responses = quizzes.stream()
            .filter(quiz -> {
                LocalDateTime endTime = quiz.getStartDateTime().plusMinutes(quiz.getDurationMinutes());
                return now.isAfter(quiz.getStartDateTime()) && now.isBefore(endTime);
            })
            .map(this::toResponse)
            .collect(Collectors.toList());
        
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
        
        try {
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
            quiz.setTotalPoints(request.getTotalPoints() != null ? request.getTotalPoints() : quiz.getTotalPoints());
            quiz.setStatus(request.getStatus() != null ? request.getStatus() : quiz.getStatus());
            quiz.setCourse(courseOpt.get());
            quiz.setInstructor(instructorOpt.get());
            
            Quiz savedQuiz = quizRepository.save(quiz);
            return ResponseEntity.ok(toResponse(savedQuiz));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating quiz: " + e.getMessage());
        }
    }

    // Delete quiz
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuiz(@PathVariable Long id) {
        if (!quizRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Quiz not found with id: " + id);
        }
        
        try {
            // Delete questions and options first
            List<Question> questions = questionRepository.findByQuizId(id);
            for (Question question : questions) {
                optionRepository.deleteAll(question.getOptions());
            }
            questionRepository.deleteAll(questions);
            
            // Delete quiz attempts
            attemptRepository.deleteAll(attemptRepository.findByQuizId(id));
            
            // Delete quiz
            quizRepository.deleteById(id);
            return ResponseEntity.ok("Quiz deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting quiz: " + e.getMessage());
        }
    }
} 