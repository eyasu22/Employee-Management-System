-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 14, 2025 at 04:10 PM
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
-- Database: `employees`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `name`, `email`, `password`, `address`, `phone`, `profile_image`, `is_active`) VALUES
(1, 'Eyasu Degefe', 'eyasudegefe@gmail.com', '$2b$10$J0v92d.AOSTdjo2ZjjGVAOeTGvhcYHcOvkkpNGH3/vJb0tbXZABHC', 'Hossana, Ethiopia', '1234567890', 'eyu.jpeg', 1),
(2, 'Zola Tesfaye', 'zola@example.com', '$2b$10$TsiSBtZGwUHNrYAbVNDNbugyrfNRh79Yog1f1HRovJg6W/CeAROeS', 'Addis Ababa, Ethiopia', '9876543210', 'zola.jpg', 1),
(3, 'Natnael Teshome', 'nati@gmail.com', '$2b$10$DwY8Ylx.yZmncKHDbxsvrOKOIsKdEkqrDGQto4NgIjUws6aaixQFm', 'Adama, Ethiopia', '0912345678', 'nati.jpg', 0),
(5, 'Haba', 'Haba@gmail.com', 'haba123', 'head office', '+2567223456', 'nati', 1),
(6, 'Girum Tamirat', 'girum@gmail.com', 'girum123', 'head office', '+251967243828', 'nati', 1),
(7, 'sami', 'sami@gmail.com', 'sami123', 'head office', '+2567223456', 'nati', 1);

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `address`, `phone`, `profile_image`, `is_active`) VALUES
(1, 'Haba', 'Haba@gmail.com', '$2b$10$OYZ0wZcCxkrAtWhtoFn4YuJxgm.c2YEQPL7bwedQj5xppE4QoC8nW', 'head office', '+2567223456', 'nati', 1);

-- --------------------------------------------------------

--
-- Table structure for table `calendar`
--

CREATE TABLE `calendar` (
  `id` int(11) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `event_date` date NOT NULL,
  `event_type` varchar(50) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `calendar_events`
--

CREATE TABLE `calendar_events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `description`) VALUES
(1, 'management', NULL),
(2, 'IT', NULL),
(3, 'Lectures', NULL),
(4, 'Mentainance', NULL),
(5, 'Labore', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `email`, `password`, `address`, `salary`, `image`, `category_id`, `created_at`, `status`) VALUES
(1, 'Eyasu Degefe Lombebo', 'eyasu@gmail.com', '$2b$10$aJHmqqOH3ey1bWy1oRwqe.eI509damHfjLbmC4063jBcaJuv6Q3PC', 'Hossana', 2345.00, 'image_1739523089654.jpg', 3, '2025-02-13 08:45:14', 'active'),
(3, 'Zelalem Teshom', 'zelalem@example.com', '$2b$10$aoM35RisIKGauXetiPvXeuVc429t4KAjB3dGrQZRb/WgWzmCxieEa', 'Hossana', 12342.00, 'image_1739523579885.DNG', 3, '2025-02-14 06:04:39', 'active'),
(4, 'Eyasu Degefe Lombebo', 'eyasudegefe@gmail.com', '$2b$10$ZJtBHyMtNh99Be41UloSxe3MUX5HDB6gV9GKc2NUr6lbkCelQIGeW', 'Hossana', 2345.00, 'image_1739544464905.jpeg', NULL, '2025-02-14 09:02:14', 'active'),
(5, 'Girum Tamerat', 'girum@gmail.com', '$2b$10$zL0r3EZ6eAG/IgTE96rBeeLD7uHLy54n.7luc01HioniaXysjLFby', 'heto', 5000.00, 'image_1739523851446.jpeg', 5, '2025-02-14 09:04:11', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `event_date` date NOT NULL,
  `event_type` enum('workday','holiday','event') NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `event_name`, `event_date`, `event_type`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'fasiga', '2025-02-22', 'holiday', 2, '2025-02-13 08:46:31', '2025-02-13 08:46:31'),
(2, 'gena', '2025-02-22', 'holiday', 2, '2025-02-13 09:04:59', '2025-02-13 10:09:03'),
(4, 'gena', '2025-02-27', 'holiday', 2, '2025-02-14 05:50:36', '2025-02-14 08:11:51'),
(5, 'Enkutatash', '2025-02-27', 'workday', 2, '2025-02-14 08:04:10', '2025-02-14 08:04:10'),
(7, 'fghj', '2025-02-27', 'event', 2, '2025-02-14 08:26:12', '2025-02-14 08:26:12'),
(8, 'gena ', '2025-02-28', 'event', 2, '2025-02-14 08:27:15', '2025-02-14 08:27:15'),
(9, 'gena ', '2025-02-28', 'holiday', 2, '2025-02-14 08:30:40', '2025-02-14 08:30:40'),
(10, 'gena', '2025-02-21', 'event', 2, '2025-02-14 08:35:37', '2025-02-14 08:35:37'),
(11, 'gghm,', '2025-02-28', 'workday', 2, '2025-02-14 08:36:05', '2025-02-14 08:36:05'),
(13, 'Culture day', '2025-02-28', 'event', 2, '2025-02-14 08:43:41', '2025-02-14 08:43:41');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `calendar`
--
ALTER TABLE `calendar`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `calendar_events`
--
ALTER TABLE `calendar_events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `calendar`
--
ALTER TABLE `calendar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `calendar_events`
--
ALTER TABLE `calendar_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
