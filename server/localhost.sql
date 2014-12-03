-- phpMyAdmin SQL Dump
-- version 4.2.5
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Dec 03, 2014 at 10:44 PM
-- Server version: 5.5.38
-- PHP Version: 5.5.14

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `cymbitco_quilava`
--
DROP DATABASE `cymbitco_quilava`;
CREATE DATABASE IF NOT EXISTS `cymbitco_quilava` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `cymbitco_quilava`;

-- --------------------------------------------------------

--
-- Table structure for table `jukebox_locations`
--

DROP TABLE IF EXISTS `jukebox_locations`;
CREATE TABLE `jukebox_locations` (
`id` int(11) NOT NULL,
  `sid` varchar(12) NOT NULL DEFAULT '',
  `name` varchar(64) NOT NULL,
  `lat` float NOT NULL,
  `lng` float NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=62 ;

-- --------------------------------------------------------

--
-- Table structure for table `jukebox_section`
--

DROP TABLE IF EXISTS `jukebox_section`;
CREATE TABLE `jukebox_section` (
`id` int(11) NOT NULL,
  `title` varchar(64) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

-- --------------------------------------------------------

--
-- Table structure for table `jukebox_section_music`
--

DROP TABLE IF EXISTS `jukebox_section_music`;
CREATE TABLE `jukebox_section_music` (
`id` int(11) NOT NULL,
  `artist_order` int(11) NOT NULL,
  `section` int(11) NOT NULL,
  `artist_title` varchar(128) NOT NULL,
  `artist_name` varchar(128) NOT NULL,
  `artist_image` varchar(256) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=161 ;

-- --------------------------------------------------------

--
-- Table structure for table `jukebox_songs`
--

DROP TABLE IF EXISTS `jukebox_songs`;
CREATE TABLE `jukebox_songs` (
`id` int(11) NOT NULL,
  `imvdbtrack_id` int(12) NOT NULL,
  `imvdbartist_id` varchar(128) NOT NULL,
  `track_id` varchar(12) NOT NULL,
  `youtube_id` varchar(12) NOT NULL,
  `artist` varchar(64) NOT NULL,
  `track` varchar(64) NOT NULL,
  `image` varchar(128) NOT NULL,
  `year` year(4) NOT NULL,
  `jukebox_id` varchar(12) NOT NULL,
  `downvote` int(11) NOT NULL,
  `upvote` int(11) NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=37 ;

-- --------------------------------------------------------

--
-- Table structure for table `jukebox_votes`
--

DROP TABLE IF EXISTS `jukebox_votes`;
CREATE TABLE `jukebox_votes` (
`id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `jukebox_locations`
--
ALTER TABLE `jukebox_locations`
 ADD PRIMARY KEY (`sid`), ADD KEY `id` (`id`);

--
-- Indexes for table `jukebox_section`
--
ALTER TABLE `jukebox_section`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `jukebox_section_music`
--
ALTER TABLE `jukebox_section_music`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jukebox_songs`
--
ALTER TABLE `jukebox_songs`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `youtube_id` (`youtube_id`), ADD KEY `jukebox_id` (`jukebox_id`);

--
-- Indexes for table `jukebox_votes`
--
ALTER TABLE `jukebox_votes`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `jukebox_locations`
--
ALTER TABLE `jukebox_locations`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=62;
--
-- AUTO_INCREMENT for table `jukebox_section`
--
ALTER TABLE `jukebox_section`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `jukebox_section_music`
--
ALTER TABLE `jukebox_section_music`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=161;
--
-- AUTO_INCREMENT for table `jukebox_songs`
--
ALTER TABLE `jukebox_songs`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=37;
--
-- AUTO_INCREMENT for table `jukebox_votes`
--
ALTER TABLE `jukebox_votes`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;SET FOREIGN_KEY_CHECKS=1;
