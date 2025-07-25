package com.sikhshan.restcontroller.admin;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sikhshan.model.User;
import com.sikhshan.repository.UserRepository;

@RestController
@RequestMapping("/api/admin/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        // Check if user with the same email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("User with this email already exists");
        }

        // Hash the password
        String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt(12));
        user.setPassword(hashedPassword);
        user.setCreatedAt(LocalDateTime.now());

        // Save the user
        User savedUser = userRepository.save(user);

        // Return the saved user or a success message
        return ResponseEntity.ok(savedUser);
    }
    
	// List all users
	@GetMapping
	public ResponseEntity<List<User>> getAllUsers() {
		List<User> users = userRepository.findAll();
		return ResponseEntity.ok(users);
	}

	// Get user by ID
	@GetMapping("/{id}")
	public ResponseEntity<?> getUserById(@PathVariable Long id) {
		Optional<User> userOpt = userRepository.findById(id);
		if (userOpt.isPresent()) {
			return ResponseEntity.ok(userOpt.get());
		} else {
			return ResponseEntity.status(404).body("User not found with id: " + id);
		}
	}
	
	// Update user
	@PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Update fields
            user.setEmail(updatedUser.getEmail());
            user.setRole(updatedUser.getRole());
            
            user.setUpdatedAt(LocalDateTime.now());

            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        } else {
            return ResponseEntity.status(404).body("User not found with id: " + id);
        }
    }
	
	// Delete user
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteUser(@PathVariable Long id) {
		Optional<User> userOpt = userRepository.findById(id);
		if (userOpt.isPresent()) {
			userRepository.deleteById(id);
			return ResponseEntity.ok("User deleted successfully");
		} else {
			return ResponseEntity.status(404).body("User not found with id: " + id);
		}
	}
}