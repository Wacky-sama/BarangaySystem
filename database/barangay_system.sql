-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 07, 2025 at 02:26 PM
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
-- Database: `barangay_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `timestamp`) VALUES
('055e0ff4-de29-4a6c-a972-e38bbeb0c67c', 'dff37b12-40b9-4d71-942b-bca38832b8f2', 'Requested clearance: Barangay Clearance', '2025-11-07 11:12:31'),
('1f9107e3-6aa3-41e3-967a-007c33e5770f', '86abbe98-7f1b-407c-8337-7674a278b3ee', 'Requested clearance: Barangay Clearance', '2025-11-07 13:25:52'),
('2036505a-0439-436b-be13-f19e8245a7dd', '949e35e4-bbb2-11f0-85a5-80fa5b9ef5da', 'Approved clearance e3e8634e-3792-445a-9820-e6c130703892 (BC-2025-0005)', '2025-11-07 13:26:10'),
('251327db-bace-4380-9069-06c935087b83', '949e35e4-bbb2-11f0-85a5-80fa5b9ef5da', 'Added new staff: Kenji \"Brocks\" Tabugadir', '2025-11-07 09:38:57'),
('31ef9fee-e1b5-429e-bebb-4d949dd07591', '949e35e4-bbb2-11f0-85a5-80fa5b9ef5da', 'Approved clearance 12acaedc-b3c8-4ba3-86f0-c93a563a2e72 (BC-2025-0004)', '2025-11-07 13:16:16'),
('3607fc10-31ac-406b-8054-f82900e9a60f', '949e35e4-bbb2-11f0-85a5-80fa5b9ef5da', 'Approved user dff37b12-40b9-4d71-942b-bca38832b8f2', '2025-11-07 10:37:24'),
('42661ab0-58a2-414a-9ad1-9734a1536227', '2afc8025-d1bd-4de9-a21a-ddccdb7eba9e', 'Walk-in clearance request: Kenji \"Brocks\" Ibus Tabugadir', '2025-11-07 13:08:36'),
('50b7cb3d-eeb5-44d2-8c86-abf8e121c0eb', '86abbe98-7f1b-407c-8337-7674a278b3ee', 'New resident registered: Kim Dokja', '2025-11-07 13:25:30'),
('52ffaabb-5a53-468c-8f05-bff0b107aed1', NULL, 'Verified clearance 8351483a-6706-457a-bd6e-9ea0e5f3f507', '2025-11-07 11:15:30'),
('5b63e3b3-2637-4700-91d3-6594b43fc9a1', 'dff37b12-40b9-4d71-942b-bca38832b8f2', 'Requested clearance: For employment requirement at XYZ company', '2025-11-07 10:56:10'),
('6c077108-53c4-4cd2-aa46-f6ae26454cac', '949e35e4-bbb2-11f0-85a5-80fa5b9ef5da', 'Approved user 86abbe98-7f1b-407c-8337-7674a278b3ee', '2025-11-07 13:25:38'),
('74f2701a-e07c-4faf-bf52-6e82537e6f1c', '949e35e4-bbb2-11f0-85a5-80fa5b9ef5da', 'Declined user f9fd8c38-b514-4205-9536-68d0b35a63b5', '2025-11-07 10:33:31'),
('9afc30be-e349-415b-9eec-9ca79a9aebec', '2afc8025-d1bd-4de9-a21a-ddccdb7eba9e', 'Verified clearance 12acaedc-b3c8-4ba3-86f0-c93a563a2e72', '2025-11-07 13:09:20'),
('a398effc-9c10-47a2-9bed-0d65822bfc20', '2afc8025-d1bd-4de9-a21a-ddccdb7eba9e', 'Walk-in clearance request: Kenji \"Brocks\" Tabugadir', '2025-11-07 12:07:23'),
('b938f865-9b64-46e1-9c17-1ea67e7ae379', '949e35e4-bbb2-11f0-85a5-80fa5b9ef5da', 'Declined user 6aa3cca0-d59b-4a24-8ccb-ff91c8cf0393', '2025-11-07 10:36:32'),
('b9871c6a-8d79-49a7-b3d2-b22c5a23d8b8', 'dff37b12-40b9-4d71-942b-bca38832b8f2', 'New resident registered: Han Sooyoung', '2025-11-07 10:37:19'),
('c308bab5-694d-481a-9dd5-0f821ee9a4d7', '949e35e4-bbb2-11f0-85a5-80fa5b9ef5da', 'Added new staff: Kim Dokja', '2025-11-07 09:44:56'),
('c99015a4-9ebc-4aa6-847d-2c8bc201d68d', '2afc8025-d1bd-4de9-a21a-ddccdb7eba9e', 'Walk-in clearance request: Kenji \"Brocks\" Ibus Tabugadir', '2025-11-07 12:51:33'),
('db914656-fceb-409a-bc10-6cd65243a068', '949e35e4-bbb2-11f0-85a5-80fa5b9ef5da', 'Approved clearance 8351483a-6706-457a-bd6e-9ea0e5f3f507 (BC-2025-0003)', '2025-11-07 11:19:24'),
('df0c4827-c389-41b0-9c42-1893cb61b112', '2afc8025-d1bd-4de9-a21a-ddccdb7eba9e', 'Verified clearance e3e8634e-3792-445a-9820-e6c130703892', '2025-11-07 13:26:03'),
('f06d17e5-d05a-42bb-a3ac-f0e99a39d26e', '949e35e4-bbb2-11f0-85a5-80fa5b9ef5da', 'Added new staff: Staff Barangay', '2025-11-07 10:09:41'),
('fe331d7e-9e6a-40ff-9713-46a9b5e4da02', '949e35e4-bbb2-11f0-85a5-80fa5b9ef5da', 'Deleted user d2834c19-b038-49af-a724-c9b0614c14c2', '2025-11-07 09:45:01');

-- --------------------------------------------------------

--
-- Table structure for table `clearance_requests`
--

CREATE TABLE `clearance_requests` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `purpose` varchar(255) NOT NULL,
  `status` enum('pending','verified','approved','rejected') NOT NULL DEFAULT 'pending',
  `issued_date` date DEFAULT NULL,
  `control_number` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `released_date` date DEFAULT NULL,
  `resident_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `clearance_requests`
--

INSERT INTO `clearance_requests` (`id`, `user_id`, `purpose`, `status`, `issued_date`, `control_number`, `created_at`, `released_date`, `resident_id`) VALUES
('12acaedc-b3c8-4ba3-86f0-c93a563a2e72', NULL, 'Barangay Clearance', 'approved', '2025-11-07', 'BC-2025-0004', '2025-11-07 13:08:36', NULL, 'ebf301fe-2adf-4aaf-a371-5473bf6cf881'),
('8351483a-6706-457a-bd6e-9ea0e5f3f507', 'dff37b12-40b9-4d71-942b-bca38832b8f2', 'Barangay Clearance', 'approved', '2025-11-07', 'BC-2025-0003', '2025-11-07 11:12:31', NULL, NULL),
('b6bcb494-973e-4c3e-8c0d-d8e3bd52a696', 'dff37b12-40b9-4d71-942b-bca38832b8f2', 'For employment requirement at XYZ company', 'approved', '2025-11-07', 'BC-2025-0003', '2025-11-07 10:56:10', NULL, NULL),
('e3e8634e-3792-445a-9820-e6c130703892', '86abbe98-7f1b-407c-8337-7674a278b3ee', 'Barangay Clearance', 'approved', '2025-11-07', 'BC-2025-0005', '2025-11-07 13:25:52', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `residents`
--

CREATE TABLE `residents` (
  `id` varchar(36) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `middle_initial` char(1) DEFAULT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `birthdate` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `residents`
--

INSERT INTO `residents` (`id`, `first_name`, `last_name`, `middle_initial`, `gender`, `birthdate`, `address`, `contact_number`, `created_at`, `user_id`) VALUES
('0592b4a4-3081-49af-87c9-2f38938f818c', 'Kim', 'Dokja', '', 'Male', '2003-12-01', 'Casambalangan, Santa Ana, Cagayan', '09454516696', '2025-11-07 13:25:30', '86abbe98-7f1b-407c-8337-7674a278b3ee'),
('0ee3dbd7-d17e-41a5-a949-54767cc78d8e', 'Han', 'Sooyoung', 'D', 'Female', '1999-01-04', 'Casambalangan, Santa Ana, Cagayan', '09454516696', '2025-11-07 10:37:19', 'dff37b12-40b9-4d71-942b-bca38832b8f2'),
('ebf301fe-2adf-4aaf-a371-5473bf6cf881', 'Kenji', '\"Brocks\" Ibus Tabugadir', '', 'Male', '2003-12-01', 'Casambalangan, Santa Ana, Cagayan', '09454516696', '2025-11-07 13:08:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `role` enum('admin','staff','resident') DEFAULT 'resident',
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `middle_initial` char(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','approved','declined') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role`, `username`, `password`, `first_name`, `last_name`, `middle_initial`, `created_at`, `status`) VALUES
('2afc8025-d1bd-4de9-a21a-ddccdb7eba9e', 'staff', 'staff01', '10176e7b7b24d317acfcf8d2064cfd2f24e154f7b5a96603077d5ef813d6a6b6', 'Staff', 'Barangay', '', '2025-11-07 10:09:41', 'approved'),
('86abbe98-7f1b-407c-8337-7674a278b3ee', 'resident', 'kimdokja', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Kim', 'Dokja', '', '2025-11-07 13:25:30', 'approved'),
('949e35e4-bbb2-11f0-85a5-80fa5b9ef5da', 'admin', 'admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'System', 'Administrator', NULL, '2025-11-01 08:25:19', 'approved'),
('dff37b12-40b9-4d71-942b-bca38832b8f2', 'resident', 'hansooyoung', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Han', 'Sooyoung', 'D', '2025-11-07 10:37:19', 'approved');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `clearance_requests`
--
ALTER TABLE `clearance_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_clearance_requests_resident` (`resident_id`);

--
-- Indexes for table `residents`
--
ALTER TABLE `residents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_resident_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `fk_activity_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `clearance_requests`
--
ALTER TABLE `clearance_requests`
  ADD CONSTRAINT `fk_clearance_requests_resident` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_clearance_requests_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `residents`
--
ALTER TABLE `residents`
  ADD CONSTRAINT `fk_resident_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
