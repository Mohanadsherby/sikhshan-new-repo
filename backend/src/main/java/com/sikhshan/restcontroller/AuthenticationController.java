package com.sikhshan.restcontroller;

import java.util.Map;
import java.util.Optional;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sikhshan.dto.LoginRequest;
import com.sikhshan.model.User;
import com.sikhshan.repository.UserRepository;
import com.sikhshan.service.JwtService;

@RestController
@RequestMapping("/api/users")
public class AuthenticationController {
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JwtService jwtService;

	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
		Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());

		if (optionalUser.isPresent()) {
			User user = optionalUser.get();

			// Check if the role is allowed (student or faculty)
			if (!(user.getRole().name().equalsIgnoreCase("student")
					|| user.getRole().name().equalsIgnoreCase("faculty"))) {
				return ResponseEntity.status(403).body("Login allowed only for students or faculty");
			}

			// Check if the role matches
			if (user.getRole() != loginRequest.getRole()) {
				return ResponseEntity.status(403)
						.body("Role mismatch: Your account is registered as " + user.getRole().name());
			}

			// Check password
			boolean passwordMatch = BCrypt.checkpw(loginRequest.getPassword(), user.getPassword());
			if (!passwordMatch) {
				return ResponseEntity.status(401).body("Incorrect password");
			}

			// Generate token on successful login
			String token = jwtService.generateToken(user.getEmail(), user.getRole().name(), user.getId());
			return ResponseEntity
					.ok(Map.of(
							"message", "Login successful",
							"token", token,
							"role", user.getRole().name(),
							"id", user.getId()
					));
		} else {
			return ResponseEntity.status(404).body("User not found with email: " + loginRequest.getEmail());
		}
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logoutUser() {
		return ResponseEntity.ok(Map.of("message", "Logout successful"));
	}
}
