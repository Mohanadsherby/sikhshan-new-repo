// Test script to create sample audit logs
// Run this with Node.js to populate the audit logs table

const axios = require('axios');

const API_BASE_URL = 'http://localhost:8081/api';

// Sample audit log data
const sampleLogs = [
  {
    username: 'John Doe',
    action: 'LOGIN',
    details: 'User logged in successfully',
    status: 'SUCCESS',
    ipAddress: '192.168.1.100',
    resourceType: 'USER',
    resourceId: 1
  },
  {
    username: 'Jane Smith',
    action: 'CREATE_COURSE',
    details: 'Created new course: Introduction to Programming',
    status: 'SUCCESS',
    ipAddress: '192.168.1.101',
    resourceType: 'COURSE',
    resourceId: 1
  },
  {
    username: 'Admin User',
    action: 'DELETE_USER',
    details: 'Failed to delete user account - user has active enrollments',
    status: 'ERROR',
    ipAddress: '192.168.1.102',
    resourceType: 'USER',
    resourceId: 5
  },
  {
    username: 'System',
    action: 'SYSTEM_BACKUP',
    details: 'Daily backup completed successfully',
    status: 'SUCCESS',
    ipAddress: '127.0.0.1',
    resourceType: 'SYSTEM',
    resourceId: null
  },
  {
    username: 'Faculty Member',
    action: 'CREATE_ASSIGNMENT',
    details: 'Created assignment: Final Project',
    status: 'SUCCESS',
    ipAddress: '192.168.1.103',
    resourceType: 'ASSIGNMENT',
    resourceId: 1
  },
  {
    username: 'Student User',
    action: 'SUBMIT_ASSIGNMENT',
    details: 'Submitted assignment: Final Project',
    status: 'SUCCESS',
    ipAddress: '192.168.1.104',
    resourceType: 'ASSIGNMENT',
    resourceId: 1
  },
  {
    username: 'Faculty Member',
    action: 'GRADE_ASSIGNMENT',
    details: 'Graded assignment: Final Project - Score: 85/100',
    status: 'SUCCESS',
    ipAddress: '192.168.1.103',
    resourceType: 'ASSIGNMENT',
    resourceId: 1
  },
  {
    username: 'System',
    action: 'SYSTEM_RESTORE',
    details: 'System restore from backup completed',
    status: 'WARNING',
    ipAddress: '127.0.0.1',
    resourceType: 'SYSTEM',
    resourceId: null
  }
];

async function createTestLogs() {
  console.log('Creating test audit logs...');
  
  for (const log of sampleLogs) {
    try {
      // Note: You'll need to implement a POST endpoint for creating logs
      // For now, this is just a demonstration
      console.log(`Would create log: ${log.action} by ${log.username}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error creating log: ${error.message}`);
    }
  }
  
  console.log('Test logs creation completed!');
}

// Run the test
createTestLogs(); 