package com.sikhshan.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sikhshan.model.Event;
import com.sikhshan.model.User;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Find events by date range
    @Query("SELECT e FROM Event e WHERE e.eventDate BETWEEN :startDate AND :endDate ORDER BY e.eventDate, e.startTime")
    List<Event> findEventsByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Find events by specific date
    @Query("SELECT e FROM Event e WHERE e.eventDate = :date ORDER BY e.startTime")
    List<Event> findEventsByDate(@Param("date") LocalDate date);
    
    // Find events by creator
    @Query("SELECT e FROM Event e WHERE e.createdBy = :user ORDER BY e.eventDate DESC, e.startTime")
    List<Event> findEventsByCreator(@Param("user") User user);
    
    // Find events by creator and date range
    @Query("SELECT e FROM Event e WHERE e.createdBy = :user AND e.eventDate BETWEEN :startDate AND :endDate ORDER BY e.eventDate, e.startTime")
    List<Event> findEventsByCreatorAndDateRange(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Find events by month and year
    @Query("SELECT e FROM Event e WHERE YEAR(e.eventDate) = :year AND MONTH(e.eventDate) = :month ORDER BY e.eventDate, e.startTime")
    List<Event> findEventsByMonthAndYear(@Param("year") int year, @Param("month") int month);
    
    // Find events by month, year and creator
    @Query("SELECT e FROM Event e WHERE e.createdBy = :user AND YEAR(e.eventDate) = :year AND MONTH(e.eventDate) = :month ORDER BY e.eventDate, e.startTime")
    List<Event> findEventsByCreatorAndMonthYear(@Param("user") User user, @Param("year") int year, @Param("month") int month);
    
    // Check if event exists by title and date
    @Query("SELECT COUNT(e) > 0 FROM Event e WHERE e.title = :title AND e.eventDate = :date AND e.createdBy = :user")
    boolean existsByTitleAndDateAndCreator(@Param("title") String title, @Param("date") LocalDate date, @Param("user") User user);
} 