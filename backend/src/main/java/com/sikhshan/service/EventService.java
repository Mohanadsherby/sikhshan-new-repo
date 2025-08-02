package com.sikhshan.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sikhshan.dto.EventRequest;
import com.sikhshan.dto.EventResponse;
import com.sikhshan.model.Event;
import com.sikhshan.model.User;
import com.sikhshan.repository.EventRepository;
import com.sikhshan.repository.UserRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new event
    public EventResponse createEvent(EventRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if event with same title and date already exists for this user
        if (eventRepository.existsByTitleAndDateAndCreator(request.getTitle(), request.getEventDate(), user)) {
            throw new RuntimeException("An event with this title already exists on the selected date");
        }

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setType(request.getType());
        event.setCreatedBy(user);
        event.setCreatedAt(LocalDateTime.now());

        Event savedEvent = eventRepository.save(event);
        return toEventResponse(savedEvent);
    }

    // Get all events for a specific date
    public List<EventResponse> getEventsByDate(LocalDate date) {
        List<Event> events = eventRepository.findEventsByDate(date);
        return events.stream()
                .map(this::toEventResponse)
                .collect(Collectors.toList());
    }

    // Get all events for a month and year
    public List<EventResponse> getEventsByMonthAndYear(int year, int month) {
        List<Event> events = eventRepository.findEventsByMonthAndYear(year, month);
        return events.stream()
                .map(this::toEventResponse)
                .collect(Collectors.toList());
    }

    // Get events by creator
    public List<EventResponse> getEventsByCreator(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Event> events = eventRepository.findEventsByCreator(user);
        return events.stream()
                .map(this::toEventResponse)
                .collect(Collectors.toList());
    }

    // Get events by creator for a specific month and year
    public List<EventResponse> getEventsByCreatorAndMonthYear(Long userId, int year, int month) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Event> events = eventRepository.findEventsByCreatorAndMonthYear(user, year, month);
        return events.stream()
                .map(this::toEventResponse)
                .collect(Collectors.toList());
    }

    // Get event by ID
    public EventResponse getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return toEventResponse(event);
    }

    // Update event
    public EventResponse updateEvent(Long eventId, EventRequest request, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Check if user is the creator of the event
        if (event.getCreatedBy().getId() != userId) {
            throw new RuntimeException("You can only update events created by you");
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setType(request.getType());
        event.setUpdatedAt(LocalDateTime.now());

        Event updatedEvent = eventRepository.save(event);
        return toEventResponse(updatedEvent);
    }

    // Delete event
    public void deleteEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Check if user is the creator of the event
        if (event.getCreatedBy().getId() != userId) {
            throw new RuntimeException("You can only delete events created by you");
        }

        eventRepository.delete(event);
    }

    // Convert Event entity to EventResponse DTO
    private EventResponse toEventResponse(Event event) {
        EventResponse.UserSummary userSummary = new EventResponse.UserSummary(
                event.getCreatedBy().getId(),
                event.getCreatedBy().getName(),
                event.getCreatedBy().getEmail(),
                event.getCreatedBy().getRole().name()
        );

        return new EventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getEventDate(),
                event.getStartTime(),
                event.getEndTime(),
                event.getType(),
                userSummary,
                event.getCreatedAt(),
                event.getUpdatedAt()
        );
    }
} 