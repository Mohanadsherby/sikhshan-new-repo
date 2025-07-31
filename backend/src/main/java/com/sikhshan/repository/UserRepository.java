package com.sikhshan.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sikhshan.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
	Optional<User> findByEmail(String email);
	
	// Search by name or email (case insensitive)
	@Query("SELECT u FROM User u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))")
	Page<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(@Param("query") String query, @Param("query") String emailQuery, Pageable pageable);
	
	// Search by name or email with role filter
	@Query("SELECT u FROM User u WHERE (LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :emailQuery, '%'))) AND u.role = :role")
	Page<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseAndRole(@Param("query") String query, @Param("emailQuery") String emailQuery, @Param("role") String role, Pageable pageable);
	
	// Search by role only
	@Query("SELECT u FROM User u WHERE u.role = :role")
	Page<User> findByRole(@Param("role") String role, Pageable pageable);
}
