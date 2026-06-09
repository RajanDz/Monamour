## Backend lokacija

Ovaj projekat sadrži i frontend i backend.

🔧 **Backend** se nalazi u folderu:  
`AdminManager/monamour/src/main/java/com/monamour/monamour`  
[Klik za direktan pristup](./AdminManager/monamour/src/main/java/com/monamour/monamour)

# MonAmour - E-Commerce Management System

MonAmour is a full-stack e-commerce management application built with Spring Boot and React. The system provides user management, role administration, product management, image handling, and activity tracking functionalities.

## Features

### User Management
- User registration and login
- User profile management
- Profile image support
- Search users by ID, email, first name, or last name
- User activity tracking
- Registration statistics

### Role Management
- Assign roles to users
- Remove roles from users
- View available roles for assignment
- User permission management

### Product Management
- Create products
- Edit product details
- Soft delete products
- Bulk product deletion
- Product image gallery
- Multiple product images per product
- Default product image selection
- Replace existing product images

### Activity Logging
- Product deletion tracking
- Bulk deletion tracking
- User action history
- Administrative audit logs

### Media Management
- Product image upload
- Profile image handling
- Base64 image conversion
- Main image selection
- Gallery management

---

## Technologies

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- MySQL

### Frontend
- React
- JavaScript
- HTML
- CSS

### Tools
- Postman
- Git
- GitHub

---

## Architecture

The application follows a layered architecture:

- Controller Layer
- Service Layer
- Repository Layer
- Database Layer

This structure improves maintainability, scalability, and separation of concerns.

---

## Core Modules

### User Module

- User registration
- User authentication
- Profile management
- Activity monitoring
- Monthly registration analytics

### Product Module

- Product creation
- Product updates
- Product image management
- Soft deletion
- Product administration

### Administration Module

- Role management
- User search system
- Product activity logs
- Bulk product operations

---

## Database Design

### User
- id
- name
- lastname
- email
- password
- phoneNumber
- gender
- profileImage

### Role
- id
- name

### Product
- id
- name
- color
- size
- price
- isDeleted

### ProductImage
- id
- imagePath
- isMain

### UserLog
- registrationDate
- lastLoginDate

### ProductsActivityLog
- action
- reason
- timestamp

---

## Implemented Concepts

- One-to-Many Relationships
- Many-to-Many Relationships
- Soft Delete Pattern
- Audit Logging
- File Upload Management
- Image Processing
- User Role Management
- Administrative Operations
- Custom Filtering and Search

---

## Future Improvements

- Spring Security
- JWT Authentication
- Shopping Cart
- Order Management
- Payment Integration
- Docker Support
- AWS Deployment
- Email Notifications

---

## Author

**Rajan Dz**







# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
