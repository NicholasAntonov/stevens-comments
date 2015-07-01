-- phpMyAdmin SQL Dump
-- version 4.4.7
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 01, 2015 at 05:31 AM
-- Server version: 5.6.24
-- PHP Version: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `stevens_comments`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `c_id` int(12) NOT NULL,
  `u_id` int(11) NOT NULL,
  `p_id` int(11) NOT NULL,
  `ownage_id` int(11) NOT NULL,
  `comment` varchar(1024) NOT NULL,
  `date` date NOT NULL,
  `showName` tinyint(1) NOT NULL DEFAULT '0',
  `votes` int(11) NOT NULL DEFAULT '0',
  `hidden` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`c_id`, `u_id`, `p_id`, `ownage_id`, `comment`, `date`, `showName`, `votes`, `hidden`) VALUES
(1, 1, 1, 0, 'testcomment1', '2015-06-25', 0, 0, 0),
(2, 1, 1, 0, 'testcomment1', '2015-06-26', 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `comment_votes`
--

CREATE TABLE IF NOT EXISTS `comment_votes` (
  `c_id` int(11) NOT NULL,
  `u_id` int(11) NOT NULL,
  `value` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `comment_votes`
--

INSERT INTO `comment_votes` (`c_id`, `u_id`, `value`) VALUES
(0, 1, 1),
(1, 1, 1),
(2, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE IF NOT EXISTS `messages` (
  `m_id` int(11) NOT NULL,
  `to_ownage` int(11) NOT NULL,
  `ownage_id` int(11) NOT NULL,
  `message` varchar(2048) NOT NULL,
  `date` date NOT NULL,
  `showName` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`m_id`, `to_ownage`, `ownage_id`, `message`, `date`, `showName`) VALUES
(3, 3, 7, 'testmessage', '2015-07-01', 0),
(4, 3, 9, 'testing123', '2015-07-01', 0);

-- --------------------------------------------------------

--
-- Table structure for table `ownage`
--

CREATE TABLE IF NOT EXISTS `ownage` (
  `ownage_id` int(11) NOT NULL,
  `u_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ownage`
--

INSERT INTO `ownage` (`ownage_id`, `u_id`) VALUES
(1, 1),
(3, 3),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE IF NOT EXISTS `posts` (
  `p_id` int(11) NOT NULL,
  `u_id` int(11) NOT NULL,
  `ownage_id` int(11) NOT NULL,
  `for_name` varchar(50) NOT NULL,
  `post` varchar(1024) NOT NULL,
  `date` date NOT NULL,
  `showName` tinyint(1) NOT NULL DEFAULT '0',
  `votes` int(11) NOT NULL DEFAULT '0',
  `hidden` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`p_id`, `u_id`, `ownage_id`, `for_name`, `post`, `date`, `showName`, `votes`, `hidden`) VALUES
(1, 1, 1, '', 'test post', '2015-06-23', 0, 0, 0),
(2, 1, 0, '', 'testpost2', '2015-06-25', 0, -35, 0),
(3, 3, 3, '', 'postcontentasdf', '2015-07-01', 0, 0, 0),
(4, 1, 8, 'bob', 'postcontentasdf', '2015-07-01', 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `post_votes`
--

CREATE TABLE IF NOT EXISTS `post_votes` (
  `p_id` int(11) NOT NULL,
  `u_id` int(11) NOT NULL,
  `value` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `post_votes`
--

INSERT INTO `post_votes` (`p_id`, `u_id`, `value`) VALUES
(1, 1, 1),
(2, 1, -1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `u_id` int(11) NOT NULL,
  `password` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `name` varchar(128) NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`u_id`, `password`, `email`, `name`, `admin`) VALUES
(1, '$2y$10$pl5SOtHvC.6Z/2uFHYyyYOwpSBabOdziaJq2D5qG4rGE8Vxmz0kTu', 'brianz176@gmail.com', 'brian zawisza', 1),
(3, '$2y$10$nnjVzVtHuKv8s4bXM5vX/OcrCeMZgIi29byg3gLsbbljWs1A9ko5W', 'test.com', 'brian2', 0),
(4, '$2y$10$.IFOZGnbyFoP1cRmEeGFeehgFAwSQJ6TycAAbt677rTv93FoMditK', 'test.com', 'brian2', 0),
(5, '$2y$10$ENYdFm9BcTeC3C.awq2hSeeXC0jPa0K49aLu.62kMM.BIrAyNLd4i', 'test.com', 'brian2', 0),
(6, '$2y$10$letvs3S1w2V6L11xI0qX2uWMym8w1lwvAnB/Y2vU5E.Nqgh./N302', 'test.com', 'brian2', 0),
(7, '$2y$10$IJHx/UmZC9pWFdngUlo10e5IdGJuOxw5lXR6suuRpqW4smzAeANX.', 'test.com', 'brian2', 0),
(8, '$2y$10$pmKdy0iNSDv.isftpqgcI.kBqMb.3jfdTZXygcN3hUrfTHdWZOLKq', 'test.com', 'brian2', 0),
(9, '$2y$10$ttniAMXBolwfYTTlLQCn/egKDRhyuxQtYIObgf1IaM0UC5OA63Dgm', 'test.com', 'brian2', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`c_id`);

--
-- Indexes for table `comment_votes`
--
ALTER TABLE `comment_votes`
  ADD PRIMARY KEY (`c_id`,`u_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`m_id`);

--
-- Indexes for table `ownage`
--
ALTER TABLE `ownage`
  ADD PRIMARY KEY (`ownage_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`p_id`);

--
-- Indexes for table `post_votes`
--
ALTER TABLE `post_votes`
  ADD PRIMARY KEY (`p_id`,`u_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`u_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `c_id` int(12) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `m_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `ownage`
--
ALTER TABLE `ownage`
  MODIFY `ownage_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `p_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `u_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
