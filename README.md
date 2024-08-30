# Real-time Data Classification API

## Project Overview

This API processes a live stream of data, classifies it based on user-defined classification rules using a Domain Specific Language (DSL), and authenticates incoming requests using JWT tokens.

## Technology Stack

- Language: Node.js
- Framework: Fastify
- Database: MongoDB
- Tools:
  - ChatGPT-4.0 for assistance and guidance
  - JWT for authentication
  - WebSocket for live data streaming

## Development Phases

### Phase 1: Initial Setup

1. **Project Initialization**
   - Set up the project repository.
   - Initialize the project using Node.js and Fastify.
   - Set up environment configurations.

2. **Dependency Management**
   - Install necessary packages/libraries for JWT, database connectivity, and WebSocket.
   - Set up dependency management using npm or yarn.

### Phase 2: Authentication

3. **JWT Authentication**
   - Implement JWT authentication middleware.
   - Ensure incoming requests contain a valid JWT token in the header.
   - Implement signup and login endpoints:
     - `POST /register`: User registration
     - `POST /login`: User login

### Phase 3: Data Models and Database

4. **Database Schema**
   - Design and implement database schema for storing user-defined rules.
   - Create models for user and classification rules.

5. **Database Integration**
   - Implement database connection and setup.
   - Create CRUD operations for user-defined rules:
     - `POST /createrule`: Create a new classification rule
     - `GET /readrules`: Read all classification rules
     - `PUT /updaterule`: Update an existing classification rule
     - `DELETE /deleterule`: Delete a classification rule

### Phase 4: User-Defined Classification Rules

6. **Classification DSL**
   - Design a Domain Specific Language (DSL) for user-defined classification rules.

#### DSL Rules

The API supports the following DSL rules for classifying data based on character occurrences in a string:

- **count: (char, str)**  
  Counts occurrences of a character in a string.

- **avg: (char, str)**  
  Computes the average occurrence of a character in a string.

- **min: (char, str)**  
  Finds the least frequent character in a string.

- **max: (char, str)**  
  Finds the most frequent character in a string.

- **sum: (char, str)**  
  Computes the total number of characters in a string.

#### Example Rules and Usage

```javascript
const rules = [
  `count('a', str) > 1`,    // Rule: count of 'a' should be more than 1
  `avg('o', str) < 0.5`,    // Rule: average occurrence of 'o' should be less than 0.5
  `min(str) = 'b'`,         // Rule: least frequent character should be 'b'
  `max(str) != 'a'`,        // Rule: most frequent character should not be 'a'
  `sum(str) >= 10`,         // Rule: total number of characters should be at least 10
];
```

### Phase 5: Real-time Data Processing

7. **Data Streaming Integration**

- Set up WebSocket for live data streaming.
- Implement a mechanism to receive and process incoming data streams.

8. **Classification Engine**

- Develop a classification engine to apply user-defined rules to incoming data.

### Phase 6: Testing and Validation

9. **Unit and Integration Tests**

- Write unit tests for all modules.
- Implement integration tests for end-to-end validation.

10. **Load Testing**

- Perform load testing to ensure the system can handle high volumes of live data.

## API Endpoints

- `POST /register`: User registration
- `POST /login`: User login
- `POST /eval`: Evaluate DSL rules on incoming data
- `POST /createrule`: Create a new classification rule
- `GET /readrules`: Read all classification rules
- `PUT /updaterule`: Update an existing classification rule
- `DELETE /deleterule`: Delete a classification rule

## Setup Instructions

### Clone the repository

```bash
git clone https://github.com/Anujdhanger/Real-time-Data-Classification-API.git
cd Real-time-Data-Classification-API
```

### Install Dependencies

```bash
npm install
```
### Environment Configuration
Ensure necessary environment variables are set (e.g., database credentials, JWT secret).

### Run the Application

```bash
npm start
#or
node server.js
```

## License
This project is licensed under the MIT License.

