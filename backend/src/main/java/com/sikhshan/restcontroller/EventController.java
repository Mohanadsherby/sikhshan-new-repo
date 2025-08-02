package com.sikhshan.restcontroller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sikhshan.dto.EventRequest;
import com.sikhshan.dto.EventResponse;
import com.sikhshan.service.EventService;
import com.sikhshan.service.JwtService;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private JwtService jwtService;

    // Create a new event
    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody EventRequest request, @RequestHeader("Authorization") String token) {
        try {
            // Extract user ID from JWT token
            String email = jwtService.extractEmail(token.substring(7)); // Remove "Bearer " prefix
            Long userId = jwtService.extractUserId(token.substring(7));
            
            EventResponse event = eventService.createEvent(request, userId);
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all events for a specific date
    @GetMapping("/date/{date}")
    public ResponseEntity<?> getEventsByDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<EventResponse> events = eventService.getEventsByDate(date);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all events for a month and year
    @GetMapping("/month/{year}/{month}")
    public ResponseEntity<?> getEventsByMonthAndYear(@PathVariable int year, @PathVariable int month) {
        try {
            List<EventResponse> events = eventService.getEventsByMonthAndYear(year, month);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get events by creator (current user)
    @GetMapping("/my-events")
    public ResponseEntity<?> getMyEvents(@RequestHeader("Authorization") String token) {
        try {
            Long userId = jwtService.extractUserId(token.substring(7));
            List<EventResponse> events = eventService.getEventsByCreator(userId);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get events by creator for a specific month and year
    @GetMapping("/my-events/{year}/{month}")
    public ResponseEntity<?> getMyEventsByMonthYear(@PathVariable int year, @PathVariable int month, 
                                                   @RequestHeader("Authorization") String token) {
        try {
            Long userId = jwtService.extractUserId(token.substring(7));
            List<EventResponse> events = eventService.getEventsByCreatorAndMonthYear(userId, year, month);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get event by ID
    @GetMapping("/{eventId}")
    public ResponseEntity<?> getEventById(@PathVariable Long eventId) {
        try {
            EventResponse event = eventService.getEventById(eventId);
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Update event
    @PutMapping("/{eventId}")
    public ResponseEntity<?> updateEvent(@PathVariable Long eventId, @RequestBody EventRequest request,
                                        @RequestHeader("Authorization") String token) {
        try {
            Long userId = jwtService.extractUserId(token.substring(7));
            EventResponse event = eventService.updateEvent(eventId, request, userId);
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete event
    @DeleteMapping("/{eventId}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId, @RequestHeader("Authorization") String token) {
        try {
            Long userId = jwtService.extractUserId(token.substring(7));
            eventService.deleteEvent(eventId, userId);
            return ResponseEntity.ok().body("Event deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 