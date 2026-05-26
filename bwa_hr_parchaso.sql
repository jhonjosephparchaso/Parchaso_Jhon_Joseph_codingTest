-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 26, 2026 at 07:02 AM
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
-- Database: `bwa_hr_parchaso`
--

-- --------------------------------------------------------

--
-- Table structure for table `class_master`
--

CREATE TABLE `class_master` (
  `class_id` int(11) NOT NULL,
  `class_name` varchar(100) NOT NULL,
  `delete_flg` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `class_master`
--

INSERT INTO `class_master` (`class_id`, `class_name`, `delete_flg`) VALUES
(1, 'A', 0),
(2, 'AE', 0),
(3, 'AS', 0),
(4, 'WA', 0),
(5, 'WAE', 0),
(6, 'WAS', 0);

-- --------------------------------------------------------

--
-- Table structure for table `division_master`
--

CREATE TABLE `division_master` (
  `division_id` int(11) NOT NULL,
  `division_name` varchar(100) NOT NULL,
  `delete_flg` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `division_master`
--

INSERT INTO `division_master` (`division_id`, `division_name`, `delete_flg`) VALUES
(1, 'Mobile', 0),
(2, 'Web', 0),
(3, 'Infra', 0);

-- --------------------------------------------------------

--
-- Table structure for table `employee_master`
--

CREATE TABLE `employee_master` (
  `employee_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `division_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `birthday` date NOT NULL,
  `delete_flg` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_master`
--

INSERT INTO `employee_master` (`employee_id`, `first_name`, `last_name`, `division_id`, `class_id`, `birthday`, `delete_flg`) VALUES
(1, 'John', 'Smith Updated', 2, 4, '1998-01-02', 1),
(2, 'John', 'Smith', 1, 2, '1998-01-03', 1),
(3, 'Rix', 'Potot', 2, 6, '2000-04-05', 0),
(4, 'John', 'Smith', 1, 1, '1998-01-02', 0),
(5, 'Maria', 'Garcia', 2, 4, '1997-05-14', 0),
(6, 'Ken', 'Tanaka', 3, 2, '1995-09-21', 0),
(7, 'Anna', 'Santos', 1, 3, '1999-03-08', 0),
(8, 'David', 'Lee', 2, 5, '1996-12-11', 0),
(9, 'Sarah', 'Kim', 3, 1, '1994-07-25', 0),
(10, 'Mark', 'Reyes', 1, 2, '2000-01-19', 0),
(11, 'Lisa', 'Wong', 2, 6, '1998-10-30', 0),
(12, 'Paul', 'Cruz', 3, 3, '1993-04-17', 0),
(13, 'Grace', 'Lopez', 1, 1, '1997-08-05', 0),
(14, 'James', 'Miller', 2, 4, '1995-11-13', 0),
(15, 'Nina', 'Torres', 3, 2, '1999-06-22', 0),
(16, 'Leo', 'Mendoza', 1, 3, '1996-02-28', 0),
(17, 'Ella', 'Davis', 2, 5, '1998-09-09', 0),
(18, 'Ryan', 'Flores', 3, 1, '1994-12-03', 0),
(19, 'update', 'update', 2, 6, '2014-08-17', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_master`
--

CREATE TABLE `user_master` (
  `user_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `delete_flg` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_master`
--

INSERT INTO `user_master` (`user_id`, `email`, `password`, `delete_flg`) VALUES
(1, 'admin@gmail.com', 'admin123', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `class_master`
--
ALTER TABLE `class_master`
  ADD PRIMARY KEY (`class_id`);

--
-- Indexes for table `division_master`
--
ALTER TABLE `division_master`
  ADD PRIMARY KEY (`division_id`);

--
-- Indexes for table `employee_master`
--
ALTER TABLE `employee_master`
  ADD PRIMARY KEY (`employee_id`),
  ADD KEY `division_id` (`division_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `user_master`
--
ALTER TABLE `user_master`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `class_master`
--
ALTER TABLE `class_master`
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `division_master`
--
ALTER TABLE `division_master`
  MODIFY `division_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `employee_master`
--
ALTER TABLE `employee_master`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `user_master`
--
ALTER TABLE `user_master`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `employee_master`
--
ALTER TABLE `employee_master`
  ADD CONSTRAINT `employee_master_ibfk_1` FOREIGN KEY (`division_id`) REFERENCES `division_master` (`division_id`),
  ADD CONSTRAINT `employee_master_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `class_master` (`class_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
