-- phpMyAdmin SQL Dump
-- version 4.4.3
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 05, 2015 at 12:41 AM
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
  `date` datetime NOT NULL,
  `showName` tinyint(1) NOT NULL DEFAULT '0',
  `votes` int(11) NOT NULL DEFAULT '0',
  `hidden` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`c_id`, `u_id`, `p_id`, `ownage_id`, `comment`, `date`, `showName`, `votes`, `hidden`) VALUES
(1, 1, 1, 0, 'shiznit ma nizzle fames crazy that''s the shizzle egestizzle. Doggy tempor bizzle izzle. Aliquam erat fo shizzle. Vivamizzle tortor enizzle, break it down cool, things a, sure vizzle, arcu. Sheezy elizzle. Donizzle fermentum, est at pharetra sizzle, magna dope ultricizzle neque, nizzle mammasay mammasa mamma oo sa urna g', '2015-06-25 00:00:00', 1, 0, 0),
(2, 9, 1, 0, 'Praesent ghetto nisi quis justo doggy molestie. ', '2015-06-26 00:00:00', 0, 0, 0),
(3, 9, 2, 17, 'asdfasdf', '2015-07-02 00:00:00', 0, 0, 0),
(4, 9, 2, 18, 'asdfasdf', '2015-07-02 00:00:00', 1, 1, 1);

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
(4, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE IF NOT EXISTS `messages` (
  `m_id` int(11) NOT NULL,
  `to_ownage` int(11) NOT NULL,
  `ownage_id` int(11) NOT NULL,
  `message` varchar(2048) NOT NULL,
  `date` datetime NOT NULL,
  `showName` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`m_id`, `to_ownage`, `ownage_id`, `message`, `date`, `showName`) VALUES
(3, 3, 7, 'testmessage', '2015-07-01 00:00:00', 0),
(4, 3, 9, 'testing123', '2015-07-01 00:00:00', 0),
(5, 18, 19, 'testmessage', '2015-07-02 00:00:00', 0),
(6, 18, 20, 'testmessage2', '2015-07-02 00:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ownage`
--

CREATE TABLE IF NOT EXISTS `ownage` (
  `ownage_id` int(11) NOT NULL,
  `u_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;

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
(9, 1),
(10, 10),
(11, 10),
(12, 10),
(13, 10),
(14, 10),
(15, 1),
(16, 1),
(17, 9),
(18, 9),
(19, 1),
(20, 1),
(21, 1),
(22, 1),
(23, 1),
(24, 1),
(25, 1),
(26, 1),
(27, 1),
(28, 1),
(29, 1);

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
  `date` datetime NOT NULL,
  `showName` tinyint(1) NOT NULL DEFAULT '0',
  `votes` int(11) NOT NULL DEFAULT '0',
  `hidden` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`p_id`, `u_id`, `ownage_id`, `for_name`, `post`, `date`, `showName`, `votes`, `hidden`) VALUES
(1, 1, 1, '', 'Phat ipsum dolizzle sit amizzle, gangster adipiscing elit. Nullam boom shackalack velizzle, yippiyo volutpizzle, the bizzle quis, we gonna chung mah nizzle, fo. Pellentesque my shizz tortor. Sed erizzle. Doggy izzle dolor dapibizzle shit tempizzle shit. Hizzle crackalackin nibh izzle turpizzle. Crunk phat pizzle. Pellentesque dang rhoncus funky fresh. In hac funky fresh platea dictumst. We gonna chung dapibizzle. Mammasay mammasa mamma oo sa tellizzle urna, sure hizzle, fo shizzle izzle, eleifend vitae, . Dang suscipizzle. Integer sempizzle pot sizzle purizzle.', '2015-06-23 00:00:00', 0, -1, 0),
(2, 9, 0, '', 'Praesent non mi tellivizzle maurizzle pizzle bibendizzle. Funky fresh lacinia sure tellivizzle. I saw beyonces tizzles and my pizzle went crizzle id enim et leo funky fresh euismod. Aliquizzle lobortizzle, shizzlin dizzle vitae dapibus we gonna chung, brizzle ligula bibendizzle fo shizzle, izzle gangster augue dui uhuh ... yih! shizzle my nizzle crocodizzle. Dope ghetto lacizzle izzle shit. Shizznit arcu magna, fermentum sit amizzle, go to hizzle izzle, i''m in the shizzle izzle, doggy. Sed vehicula laorizzle break it down. Vestibulizzle erat diam, hendrerit get down get down, fo izzle, fizzle a, dang. Morbi boofron placerat nulla. Maecenas malesuada erizzle crazy erat. Things metizzle sizzle, egestizzle tellivizzle, brizzle quis, elementizzle nizzle, neque. Shit iaculis bling bling a orci shizznit sizzle. Fusce sagittis, nulla eget sollicitudizzle check it out, lacus quam pot erat, vitae dizzle dizzle gizzle vitae arcu. Etiam vehicula da bomb. Shiznit mammasay mammasa mamma oo sa check out this. Duis gizzle t', '2015-06-25 00:00:00', 0, -35, 1),
(3, 3, 3, '', 'Things a pimpin'' sed augue hendrerizzle accumsan. Aenizzle get down get down bizzle. Vivamus maurizzle mammasay mammasa mamma oo sa, viverra yo mamma, facilisizzle brizzle, phat in, erizzle. Brizzle ante da bomb i''m in the shizzle in faucibizzle orci fizzle its fo rizzle ultricizzle posuere cubilia Go to hizzle; Dope dolor. Integizzle daahng dawg. We gonna chung we gonna chung blandizzle fo shizzle mah nizzle fo rizzle, mah home g-dizzle. Vivamus brizzle aliquizzle nizzle. Sizzle fo shizzle my nizzle. Maurizzle sem nulla, venenatis eu, rizzle vizzle, izzle ac, for sure.', '2015-07-01 00:00:00', 0, 0, 0),
(4, 1, 8, 'bob', 'Things a pimpin'' sed augue hendrerizzle accumsan. Aenizzle get down get down bizzle. Vivamus maurizzle mammasay mammasa mamma oo sa, viverra yo mamma, facilisizzle brizzle, phat in, erizzle. Brizzle ante da bomb i''m in the shizzle in faucibizzle orci fizzle its fo rizzle ultricizzle posuere cubilia Go to hizzle; Dope dolor. Integizzle daahng dawg. We gonna chung we gonna chung blandizzle fo shizzle mah nizzle fo rizzle, mah home g-dizzle. Vivamus brizzle aliquizzle nizzle. Sizzle fo shizzle my nizzle. Maurizzle sem nulla, venenatis eu, rizzle vizzle, izzle ac, for sure.', '2015-07-01 00:00:00', 0, 0, 0),
(5, 10, 10, 'steven', 'gabarro', '2015-07-02 00:00:00', 0, 0, 0),
(6, 10, 11, 'steven', 'gabarro', '2015-07-02 00:00:00', 0, 0, 0),
(7, 10, 12, 'steven', 'gabarro', '2015-07-02 00:00:00', 0, 0, 0),
(8, 10, 13, 'steven', 'gabarro', '2015-07-02 00:00:00', 0, 0, 0),
(9, 10, 14, 'steven', 'gabarro', '2015-07-02 00:00:00', 1, 0, 1),
(10, 1, 15, '', 'gabarro', '2015-07-02 00:00:00', 0, 0, 0),
(11, 1, 16, 'asdas', 'gabarro', '2015-07-02 00:00:00', 0, 0, 0),
(12, 1, 21, 'bob', 'test', '2015-07-04 00:00:00', 0, 0, 0),
(13, 1, 22, 'asdfasdfzxcvzxcvz', 'asdfasdfx zxv zxcvzx cv zxcv', '2015-07-04 00:00:00', 0, 0, 0),
(14, 1, 23, 'asdf asd testing asfasdfzxcv xzv', ' asdfasdf  asdf  zxcv ', '2015-07-04 00:00:00', 0, 0, 0),
(15, 1, 24, 'post123', 'testing123', '2015-07-04 00:00:00', 0, 0, 0),
(16, 1, 25, 'post 123asdfzxcv ', 'asdfa sdfasdfa ', '2015-07-04 00:00:00', 0, 0, 0),
(17, 1, 26, 'zxcv wae 3424 234 52345', 'sadf ', '2015-07-04 00:00:00', 0, 0, 0),
(18, 1, 27, 'zxcvzpowui50[3u4poewfkjasd', 'asdf a', '2015-07-04 00:00:00', 0, 0, 0),
(19, 1, 28, 'fasdfasdf', 'tesadfasd', '2015-07-04 22:40:08', 0, 0, 0),
(20, 1, 29, 'sdf asdf a asdf a sdf ', 'asdfzxvczx', '2015-07-04 22:40:20', 0, 0, 0);

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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`u_id`, `password`, `email`, `name`, `admin`) VALUES
(1, '$2y$10$pl5SOtHvC.6Z/2uFHYyyYOwpSBabOdziaJq2D5qG4rGE8Vxmz0kTu', 'brianz176@gmail.com', 'brian zawisza', 1),
(9, '$2y$10$ttniAMXBolwfYTTlLQCn/egKDRhyuxQtYIObgf1IaM0UC5OA63Dgm', 'test.com', 'brian2', 0),
(10, '$2y$10$0owAL394m.f7Gv2gdXPpF.GGLcqvDEXGsxTxHXQkXZT2PksbGM9vC', 'test2.com', 'steve', 0),
(11, '$2y$10$PFwOnCcRIU2h/I/NHzquuet3p7vmG1QcDHcgFJAa9ZvvGwjDCHeUe', 'test2.com&lt;script&gt;test&lt;/script&gt;', 'steve', 0),
(12, '$2y$10$6crXgEDyQU57hlQ1PQN7Aee.JJHwOTeKKW3TyjYHscL9xB/CNRgQa', 'test2.comtest', 'steve', 0);

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
  MODIFY `c_id` int(12) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `m_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `ownage`
--
ALTER TABLE `ownage`
  MODIFY `ownage_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=30;
--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `p_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `u_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
