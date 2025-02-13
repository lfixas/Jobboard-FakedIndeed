# Jobboard - A Job Posting and Application Platform

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Jobboard

FakedIndeed is a jobboard web application developed by Lucas FIXARI and Maxime SARRAZIN for an Epitech project. It's designed to serve as a platform where companies can post job offers, and individuals can apply to those job offers. The website is built using Next.js, PHPMyAdmin for the database, and several dependencies.

---

## Features

- **User Registration/Login**: Users can register as either individuals or companies. Logging in is required to access various features.

- **Individual Profile**: Individual users can complete their profiles with personal information, which is automatically filled in when applying for jobs.

- **Company Profiles**: Companies can post job offers, view job applicants, and edit their profiles. Admins can manage companies and their information.

- **Email Notification**: Nodemailer is used to send email notifications to companies when an individual applies for a job on the platform.

- **Admin Panel**: Admins have access to an admin panel where they can add, edit, and delete companies, user profiles, and job offers.



## Dependencies

- [Next.js](https://nextjs.org/): The web framework used for building the website.
- [js-cookie](https://github.com/js-cookie/js-cookie): For handling cookies in the application.
- [mysql2](https://www.npmjs.com/package/mysql2): Used for database interactions.
- [react](https://reactjs.org/),[react-dom](https://reactjs.org/docs/react-dom.html): Core React libraries for building the user interface.
- [react-icons](https://react-icons.github.io/react-icons/): Provides a wide selection of icons for the application.
- [tw-elements](https://github.com/tw-elements/tw-elements): A Tailwind CSS library to enhance styling.
- [postcss](https://postcss.org/),[tailwindcss](https://tailwindcss.com/): CSS-related dependencies for styling and design.
- [nodemailer express](https://nodemailer.com): Module for sending email notifications. 

## Installation

### Step 1: Clone the repository:
```bash
git clone <git@github.com:EpitechMscProPromo2026/T-WEB-501-STG_4.git>
```

### Step 2: Change the directory:
```bash
cd jobboard
```

### Step 3: Install project dependencies:
```bash
npm install
```

### Step 4: Configure the database connection in **`next.config.js`**:
```bash
module.exports = {
    'MYSQL_HOST': '127.0.0.1',
    'MYSQL_PORT': '3306',
    'MYSQL_DATABASE': 'jobboard',
    'MYSQL_USER': 'root',
    'MYSQL_PASSWORD': 'password',
};
```
*Change MYSQL data for your database*

---

## Database Setup

To set up the database for the project, follow these steps:
```sql
CREATE DATABASE IF NOT EXISTS jobboard;

USE jobboard;

-- Create the 'ads' table for job offers --
CREATE TABLE IF NOT EXISTS `ads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `jobTypes` JSON CHECK (json_valid(`jobTypes`)),
  `minSalary` INT DEFAULT NULL,
  `maxSalary` INT DEFAULT NULL,
  `advantages` TEXT DEFAULT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `positionLocation` VARCHAR(255) DEFAULT NULL
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create the 'apply' table for job applications
CREATE TABLE IF NOT EXISTS `apply` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ad_id` INT DEFAULT NULL,
  `company_name` VARCHAR(255) DEFAULT NULL,
  `name` VARCHAR(255) DEFAULT NULL,
  `lastname` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `motivations` TEXT DEFAULT NULL,
  `website` VARCHAR(255) DEFAULT NULL,
  `cv` VARCHAR(255) DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create the 'company' table for company profiles
CREATE TABLE IF NOT EXISTS `company` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) DEFAULT NULL,
  `emails` JSON DEFAULT '[""]',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create the 'users' table for user profiles
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) DEFAULT NULL,
  `password` VARCHAR(255) DEFAULT NULL,
  `userType` VARCHAR(50) DEFAULT NULL,
  `name` VARCHAR(255) DEFAULT NULL,
  `lastname` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `website` VARCHAR(255) DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

```

---

## Getting Started

Run the development server:
*Must be on [port 3000](http://localhost:3000)*
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Run the mail server:
*Must be on [port 3001](http://localhost:3001)*
```bash
node mail-server.js
```

---

## Usage

- Access the website by navigating to [http://localhost:3000](http://localhost:3000) in your web browser.
- Register an account as an individual or a company.
- Explore the features and functionalities described above.

## License

This project is licensed under the **MIT License**.

## Contact

If you have any questions or need assistance, feel free to reach out to the project maintainers:

- Lucas: [lucas.fixari@epitech.eu](mailto:lucas.fixari@epitech.eu)
- Maxime: [maxime.sarrazin@epitech.eu](mailto:maxime.sarrazin@epitech.eu)

