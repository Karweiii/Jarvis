-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Dec 13, 2024 at 03:39 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rag`
--

-- --------------------------------------------------------

--
-- Table structure for table `advisors`
--

CREATE TABLE `advisors` (
  `advisor_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `office` varchar(100) DEFAULT NULL,
  `experience` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `advisors`
--

INSERT INTO `advisors` (`advisor_id`, `user_id`, `office`, `experience`) VALUES
(2, 4, 'B-06-07', 6),
(4, 11, NULL, NULL),
(5, 12, NULL, NULL),
(6, 13, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `appointmentID` int(11) NOT NULL,
  `studentID` int(11) NOT NULL,
  `advisorID` int(11) NOT NULL,
  `time` time NOT NULL,
  `date` date NOT NULL,
  `status` enum('Pending','Confirmed','Cancelled') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointment`
--

INSERT INTO `appointment` (`appointmentID`, `studentID`, `advisorID`, `time`, `date`, `status`) VALUES
(8, 1, 6, '12:00:00', '2024-12-17', 'Cancelled'),
(9, 1, 4, '16:00:00', '2024-12-13', 'Confirmed'),
(10, 1, 4, '13:00:00', '2024-12-17', 'Cancelled'),
(11, 1, 4, '14:00:00', '2024-12-23', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` longtext NOT NULL,
  `intake` varchar(50) NOT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `study_mode` varchar(50) DEFAULT NULL,
  `level` enum('Diploma','Undergraduate','Postgraduate','') DEFAULT NULL,
  `category` enum('Accounting, Business, Finance, Marketing','Actuarial, Statistics','Biology, Medicine and Psychology','Communication, Creative Arts','Computing','Engineering','Hospitality, Culinary, Events Management') NOT NULL,
  `fees` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`fees`)),
  `career_prospects` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`career_prospects`)),
  `qualifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`qualifications`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`course_id`, `name`, `description`, `intake`, `duration`, `study_mode`, `level`, `category`, `fees`, `career_prospects`, `qualifications`) VALUES
(1, 'Bachelor of Science (Honours) in Computer Science', 'The Computer Science degree programme focuses on the design and development of systems infrastructure, as well as software and application technologies such as web browsers or databases. This programme has been developed according to the Malaysian Qualifications Agency Programme Standards for Computing and the Curriculum Guidelines for Undergraduate Degree Programs in Computer Science published by the ACM-IEEE CS (Association for Computing Machinery and Institute of Electrical and Electronics Engineers Computer Society, USA). It is designed to ensure that graduates are well equipped with the knowledge, principles and skills in developing new technological and innovative solutions in the field of Computer Science.', 'February, April, September', '3 Years', 'Full-time', 'Undergraduate', 'Computing', '{\"local\": 36300, \"international\": 8567}', '[\"Chief Technology Officer\", \"Game Developer\", \"Mobile App Developer\", \"Game Developer\", \"Software Architect\", \"Software Engineer\", \"System Designer\"]', '[{ \"type\": \"STPM\", \"requirement\": \"Average C or GP 2.00 (minimum 2 Principals)\" },\r\n{ \"type\": \"A-Level\", \"requirement\": \"Minimum 12 points (Minimum Grade D in at least 2 subjects)\" },\r\n{ \"type\": \"Australian Matriculation\", \"requirement\": \"ATAR 60\" }]'),
(3, 'Master of Marketing', 'The Master of Marketing programme will take you on a developmental journey of skills and knowledge needed to become an effective and reflective marketing practitioner. You will gain in-depth understanding of markets and how they work, and be introduced to the theories, tools and techniques that firms use to connect with and shape markets.', 'February, April, September', '1 Year / 2 Years', 'Full-time / Part-time', 'Postgraduate', 'Accounting, Business, Finance, Marketing', '{\"local\": 59140, \"international\": 13642}', '[\"CEO/COO\", \"Sales manager\", \"Managing Director\"]', '[{ \"type\": \"STPM\", \"requirement\": \"Average C or GP 2.00 (minimum 2 Principals)\" },\r\n{ \"type\": \"A-Level\", \"requirement\": \"Minimum 12 points (Minimum Grade D in at least 2 subjects)\" },\r\n{ \"type\": \"Australian Matriculation\", \"requirement\": \"ATAR 60\" }]'),
(4, 'Diploma in Interior Design', 'This programme allows you to explore the art and science of enhancing interior spaces to make them aesthetically pleasing to the end user. Interior spaces no longer just meet functional and practical requirements, they are crucial to how we experience life, work and play.\r\n\r\nInspiring new developments in technology and materials have created countless opportunities for the creative professional who chooses to pursue interior design. You will be equipped with the principles and theories of interior design before you begin to explore your creative potential through the many hands-on interior design activities as part of your curriculum.', 'February, April, September', '2 Years, 6 Months', 'Full-time ', 'Diploma', 'Communication, Creative Arts', '{\"local\": 29500, \"international\": 7056}', '[ \r\n\"3D visualiser\",\r\n\"Design consultant\",\r\n\"Display artist\",\r\n\"Exhibition designer\",\r\n\"Furniture designer\",\r\n\"Interior designer\",\r\n\"Project Manager\",\r\n\"Retail designer\",\r\n\"Set designer\",\r\n\"Theme park designer\"]', '[{ \"type\": \"SPM / O Level\", \"requirement\": \"Pass with minimum 3 credits (including a pass in Art /Technical Drawing / Portfolio)\" },\r\n{ \"type\": \"UEC\", \"requirement\": \"Pass with minimum 3 Grade Bs (including a pass in Art /Technical Drawing / Portfolio)\" },\r\n{ \"type\": \"APEL.A\", \"requirement\": \"An APEL.A Certificate (APEL T-4) (Recognition of Prior Learning)\" }]'),
(6, 'Master of Science in  \r\nComputer Science ', 'The Master of Science in Computer Science programme will train students to carry out research in current and emerging fields within the Information Technology industry. With the aim of expanding a student\'s intellect by nurturing advanced knowledge in specialist technical subject areas, our focus is to enable students to lead future developments be it in industry or in academia.', 'Rolling Intake', '2 Year / 3 Years', 'Full-time / Part-time', 'Postgraduate', 'Computing', '{\"local\": 45700, \"international\": 11156}', '[\"Computer Science Researcher\", \"Internet and Networking Specialist\", \"Software Engineer\"]', '[{ \"type\": \"STPM\", \"requirement\": \"Average C or GP 2.00 (minimum 2 Principals)\" },\r\n{ \"type\": \"A-Level\", \"requirement\": \"Minimum 12 points (Minimum Grade D in at least 2 subjects)\" },\r\n{ \"type\": \"Australian Matriculation\", \"requirement\": \"ATAR 60\" }]'),
(7, 'Bachelor of Nursing (Honours) ', 'Nurturing future nurses who are not only skilled in clinical care but also committed to promoting sustainable clinical practices and planetary health.', 'October', '4 Years', 'Full-time', 'Undergraduate', 'Hospitality, Culinary, Events Management', '{\"local\": 36300, \"international\": 8567}', '[\"Registered Nurse\", \"Nursing educators\", \"Clinical instructor\", \"Midwife\", \"Paediatric and Coronary Care\", \"Specialised nurse\", \"Nursing Manager\"]', '[{ \"type\": \"STPM\", \"requirement\": \"Average C or GP 2.00 (minimum 2 Principals)\" },\r\n{ \"type\": \"A-Level\", \"requirement\": \"Minimum 12 points (Minimum Grade D in at least 2 subjects)\" },\r\n{ \"type\": \"Australian Matriculation\", \"requirement\": \"ATAR 60\" }]');

-- --------------------------------------------------------

--
-- Table structure for table `electives`
--

CREATE TABLE `electives` (
  `elective_id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `electives` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`electives`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `electives`
--

INSERT INTO `electives` (`elective_id`, `course_id`, `year`, `electives`) VALUES
(1, 1, 2, '[{ \"elective_name\": \"Social & Web Analytics\"}, \n{ \"elective_name\": \"Data Communications\"},\n{ \"elective_name\": \"Database Management Systems\"},\n{ \"elective_name\": \"Digital Image Processing\"},\n{ \"elective_name\": \"Functional Programming Principles\"},\n{ \"elective_name\": \"Information Systems Analysis & Design\"},\n{ \"elective_name\": \"Programming Languages\"}\n]'),
(2, 1, 3, '[{ \"elective_name\": \"Data Mining & Knowledge Discovery Fundamentals\"}, \r\n{ \"elective_name\": \"Computer Vision\"},\r\n{ \"elective_name\": \"Computational Intelligence\"},\r\n{ \"elective_name\": \"Concurrent Programming\"},\r\n{ \"elective_name\": \"Database Engineering\"},\r\n{ \"elective_name\": \"Mobile Application Development\"},\r\n{ \"elective_name\": \"Cloud Computing\"}\r\n]'),
(3, 4, 2, '[{ \"elective_name\": \"Digital Photography\"}, \r\n{ \"elective_name\": \"Interior Design Digital Composition\"}\r\n]');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `preferredField` enum('Accounting, Business, Finance, Marketing','Actuarial, Statistics','Biology, Medicine and Psychology','Communication, Creative Arts','Computing','Engineering','Hospitality, Culinary, Events Management') DEFAULT NULL,
  `educationBg` enum('SPM','STPM','A-levels','IGCSE','Diploma','Undergraduate','Postgraduate') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`student_id`, `user_id`, `preferredField`, `educationBg`) VALUES
(1, 1, 'Computing', 'A-levels'),
(3, 6, 'Biology, Medicine and Psychology', 'SPM'),
(4, 7, '', 'IGCSE'),
(5, 8, '', 'SPM');

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE `subject` (
  `subject_id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `subjects` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subject`
--

INSERT INTO `subject` (`subject_id`, `course_id`, `year`, `subjects`) VALUES
(1, 1, 1, '[{ \"course_name\": \"Computer Mathematics\"}, { \"course_name\": \"Object-Oriented Programming Fundamentals\"}, { \"course_name\": \"Quantum Programming Fundamentals\"}]'),
(2, 1, 2, '[{ \"course_name\": \"Data Structures & Algorithms\"}, { \"course_name\": \"Software Engineering\"}]'),
(3, 1, 3, '[{ \"course_name\": \"Data Structures & Algorithms\"}, {\"course_name\": \"Software Engineering\"}]'),
(4, 4, 1, '[\r\n  { \"course_name\": \"Architecture Graphics\" },\r\n  { \"course_name\": \"Building Construction\" },\r\n  { \"course_name\": \"Colour, Materials & Finishes\" },\r\n  { \"course_name\": \"Computer Aided Design\" },\r\n  { \"course_name\": \"Drawing Studies\" },\r\n  { \"course_name\": \"Furniture Design 1\" },\r\n  { \"course_name\": \"History of Interior Design\" },\r\n  { \"course_name\": \"Interior Design 1\" },\r\n  { \"course_name\": \"Interior Design 2\" },\r\n  { \"course_name\": \"Introduction to Design Proposal Writing\" },\r\n  { \"course_name\": \"Principles of Design\" }\r\n]');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `role` enum('student','advisor','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `dob`, `role`) VALUES
(1, 'test122', 'test123@gmail.com', '$2b$10$xgh132XLhayv.1q/XRcBwO82vJIP7YbfMKvGDlnMgIRY15.p2QGc.', '2024-10-09', 'student'),
(4, 'Jack', 'Jack@mail.com', '$2b$10$C3mb5kDROO6k4SeGB4/mee9oMq4p4l/Xa239qvJnzPTZIjby1/nti', '1994-12-12', 'advisor'),
(5, 'a24', 'a24@mail.com', '$2b$10$ELIRRYSr88uub.S/sc1WQujMScx/Ct510.6om2UaRL0fTRTBYNmAy', '2020-02-12', 'admin'),
(6, '12', '12@mail.com', '$2b$10$NdlK9RvllFSidUow..ZqZe7REG16qQiPD1uoXuU8TuxVMqSLzf6Hq', '2024-12-01', 'student'),
(7, '123', '123@mail.com', '$2b$10$MClyGeXq14myLg/0nS5/R.JRHf0Gs0etYBneXIVILedSt6oUEBM1i', '2024-12-03', 'student'),
(8, '12', '1234@mail.com', '$2b$10$q8mNv9qsNSQNLWjTicU72uMKV8Bqj.kJFnNbhsqQvpW25pre8W1OG', '2024-12-02', 'student'),
(11, 'John', 'john@mail.com', '$2b$10$utZU5uwxac1N4RFwVaWRWeI0MHytQtGbXBsVsnQq539kRC/eRWdZa', '1960-06-07', 'advisor'),
(12, 'Alvin', 'alvin@mail.com', '$2b$10$i1.uNl3.yg66cYIQYxLLn.DIm.oXWZ8SX4GsRzKEDo8x6iGILvrdi', '1983-07-13', 'advisor'),
(13, 'Brandon', 'brandon@mail.com', '$2b$10$7IPKJ/kdQCkfaZHexx2o7.ecYDt0Re26f.yEH8PON7CuhJ.sMaLKS', '1984-04-13', 'advisor');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `advisors`
--
ALTER TABLE `advisors`
  ADD PRIMARY KEY (`advisor_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`appointmentID`),
  ADD KEY `appointment_ibfk_1` (`studentID`),
  ADD KEY `appointment_ibfk_2` (`advisorID`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`course_id`);

--
-- Indexes for table `electives`
--
ALTER TABLE `electives`
  ADD PRIMARY KEY (`elective_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`subject_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `advisors`
--
ALTER TABLE `advisors`
  MODIFY `advisor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `appointmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `course_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `electives`
--
ALTER TABLE `electives`
  MODIFY `elective_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `subject_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `advisors`
--
ALTER TABLE `advisors`
  ADD CONSTRAINT `advisors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`advisorID`) REFERENCES `advisors` (`advisor_id`) ON DELETE CASCADE;

--
-- Constraints for table `electives`
--
ALTER TABLE `electives`
  ADD CONSTRAINT `electives_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `subject`
--
ALTER TABLE `subject`
  ADD CONSTRAINT `subject_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
