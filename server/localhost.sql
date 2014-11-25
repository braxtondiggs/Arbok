-- phpMyAdmin SQL Dump
-- version 4.2.5
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Nov 25, 2014 at 10:38 PM
-- Server version: 5.5.38
-- PHP Version: 5.5.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

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

--
-- Dumping data for table `jukebox_locations`
--

INSERT INTO `jukebox_locations` (`id`, `sid`, `name`, `lat`, `lng`, `create_date`) VALUES
(61, 'dWkxCRhKpbNJ', 'Casa De Melo', 38.9033, -77.0217, '2014-11-21 00:00:02');

-- --------------------------------------------------------

--
-- Table structure for table `jukebox_section`
--

DROP TABLE IF EXISTS `jukebox_section`;
CREATE TABLE `jukebox_section` (
`id` int(11) NOT NULL,
  `title` varchar(64) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `jukebox_section`
--

INSERT INTO `jukebox_section` (`id`, `title`) VALUES
(0, 'Best New Music Video'),
(1, 'Brand New Music Videos'),
(2, 'Top Music Video of The Week'),
(3, 'Top Music Video of The Month'),
(4, 'Top Music Video of All Time');

-- --------------------------------------------------------

--
-- Table structure for table `jukebox_section_music`
--

DROP TABLE IF EXISTS `jukebox_section_music`;
CREATE TABLE `jukebox_section_music` (
  `artist_order` int(11) NOT NULL,
  `section` int(11) NOT NULL,
  `artist_title` varchar(128) NOT NULL,
  `artist_name` varchar(128) NOT NULL,
  `artist_image` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jukebox_section_music`
--

INSERT INTO `jukebox_section_music` (`artist_order`, `section`, `artist_title`, `artist_name`, `artist_image`) VALUES
(1, 0, '7/11', 'Beyoncé', 'http://images.imvdb.com/video/208886557197-beyonce-711_music_video_tv.jpg?v=2'),
(2, 0, 'Night Changes', 'One Direction', 'http://images.imvdb.com/video/161374300159-one-direction-night-changes_music_video_tv.jpg?v=2'),
(3, 0, 'Lips Are Movin', 'Meghan Trainor', 'http://images.imvdb.com/video/132943219231-meghan-trainor-lips-are-movin_music_video_tv.jpg?v=2'),
(4, 0, 'Good Boy', 'G-Dragon & Taeyang', 'http://images.imvdb.com/video/269323885853-g-dragon-taeyang-good-boy_music_video_tv.jpg?v=2'),
(5, 0, 'Uptown Funk', 'Mark Ronson', 'http://images.imvdb.com/video/197166307626-mark-ronson-uptown-funk_music_video_tv.jpg?v=2'),
(6, 0, 'Fuck That', 'Skrillex', 'http://images.imvdb.com/video/173562068162-skrillex-fuck-that_music_video_tv.jpg?v=3'),
(7, 0, 'FUN', 'Megan Nicole', 'http://images.imvdb.com/video/101352898735-megan-nicole-fun_music_video_tv.jpg?v=2'),
(8, 0, 'Torn Apart', 'Bastille', 'http://images.imvdb.com/video/168711218287-bastille-torn-apart_music_video_tv.jpg?v=2'),
(9, 0, 'No Good In Goodbye', 'The Script', 'http://images.imvdb.com/video/277986650705-the-script-no-good-in-goodbye_music_video_tv.jpg?v=2'),
(10, 0, 'Unpack Your Heart', 'Phillip Phillips', 'http://images.imvdb.com/video/211908928201-phillip-phillips-unpack-your-heart_music_video_tv.jpg?v=2'),
(11, 0, 'Not For Long', 'B.o.B', 'http://images.imvdb.com/video/761975859156-bob-not-for-long_music_video_tv.jpg?v=2'),
(12, 0, 'From Eden', 'Hozier', 'http://images.imvdb.com/video/582733750095-hozier-from-eden_music_video_tv.jpg?v=2'),
(13, 0, 'Stay Awhile', 'She & Him', 'http://images.imvdb.com/video/421623237365-she-him-stay-awhile_music_video_tv.jpg?v=2'),
(14, 0, 'I Forget Where We Were', 'Ben Howard', 'http://images.imvdb.com/video/155614177726-ben-howard-i-forget-where-we-were_music_video_tv.jpg?v=3'),
(15, 0, 'Can''t Help Myself', 'Brodinski', 'http://images.imvdb.com/video/979404273651-brodinski-cant-help-myself_music_video_tv.jpg?v=2'),
(16, 0, 'One Day', 'Paolo Nutini', 'http://images.imvdb.com/video/110667273273-paolo-nutini-one-day_music_video_tv.jpg?v=2'),
(17, 0, '74 Is the New 24', 'Giorgio Moroder', 'http://images.imvdb.com/video/601996467227-giorgio-moroder-74-is-the-new-24_music_video_tv.jpg?v=2'),
(18, 0, 'Punch Drunk Recreation', 'Jesse McCartney', 'http://images.imvdb.com/video/282520545717-jesse-mccartney-punch-drunk-recreation_music_video_tv.jpg?v=2'),
(19, 0, 'Yoohoo', 'Dusky', 'http://images.imvdb.com/video/204716530959-dusky-yoohoo_music_video_tv.jpg?v=2'),
(20, 0, 'The Party Line', 'Belle & Sebastian', 'http://images.imvdb.com/video/928486714139-belle-and-sebastian-the-party-line_music_video_tv.jpg?v=3'),
(21, 0, 'Do You Feel The Same?', 'Hercules & Love Affair', 'http://images.imvdb.com/video/191391561404-hercules-and-love-affair-do-you-feel-the-same_music_video_tv.jpg?v=2'),
(22, 0, 'The Followers', 'Wale', 'http://images.imvdb.com/video/225424252590-wale-the-followers_music_video_tv.jpg?v=2'),
(23, 0, 'Lightning In A Bottle', 'Eli Lieb', 'http://images.imvdb.com/video/117896972104-eli-lieb-lightning-in-a-bottle_music_video_tv.jpg?v=2'),
(24, 0, 'Dehydration', 'Mick Jenkins', 'http://images.imvdb.com/video/199597429261-mick-jenkins-dehydration_music_video_tv.jpg?v=2'),
(25, 0, 'ripple', 'iamamiwhoami', 'http://images.imvdb.com/video/191661835322-iamamiwhoami-ripple_music_video_tv.jpg?v=2'),
(26, 0, 'Windows', 'Angel Olsen', 'http://images.imvdb.com/video/253688098399-angel-olsen-windows_music_video_tv.jpg?v=2'),
(27, 0, 'Blockbuster Night Part 1', 'Run The Jewels', 'http://images.imvdb.com/video/104002715986-run-the-jewels-blockbuster-night-part-1_music_video_tv.jpg?v=2'),
(28, 0, 'Pop It', 'Anamanaguchi', 'http://images.imvdb.com/video/299578669928-anamanaguchi-pop-it_music_video_tv.jpg?v=2'),
(29, 0, 'Bloom', 'Talos', 'http://images.imvdb.com/video/268330897569-talos-bloom_music_video_tv.jpg?v=2'),
(30, 0, 'The One I Love', 'Blonde Redhead', 'http://images.imvdb.com/video/115291892129-blonde-redhead-the-one-i-love_music_video_tv.jpg?v=2'),
(31, 0, 'RUN', 'San Cisco', 'http://images.imvdb.com/video/301619444113-san-cisco-run_music_video_tv.jpg?v=2'),
(32, 0, 'Against The Moon', 'Iceage', 'http://images.imvdb.com/video/173084093893-iceage-against-the-moon_music_video_tv.jpg?v=2'),
(33, 0, 'Continental Shelf', 'Viet Cong', 'http://images.imvdb.com/video/134903222529-viet-cong-continental-shelf_music_video_tv.jpg?v=2'),
(34, 0, 'Candy', 'Jessica Sutta', 'http://images.imvdb.com/video/138711736440-jessica-sutta-candy_music_video_tv.jpg?v=2'),
(35, 0, 'El Rey', 'Bodega Bamz', 'http://images.imvdb.com/video/156703112603-bodega-bamz-el-rey_music_video_tv.jpg?v=2'),
(36, 0, 'After Life, After Party', 'Jacques Greene', 'http://images.imvdb.com/video/206812236726-jacques-greene-after-life-after-party_music_video_tv.jpg?v=2'),
(37, 0, 'Paradise Girls', 'Deerhoof', 'http://images.imvdb.com/video/537190703879-deerhoof-paradise-girls_music_video_tv.jpg?v=2'),
(38, 0, 'Getcha Good', 'Celine Neon', 'http://images.imvdb.com/video/234115172161-celine-neon-getcha-good_music_video_tv.jpg?v=2'),
(39, 0, 'Madora', 'Beverly', 'http://images.imvdb.com/video/142435566838-beverly-madora_music_video_tv.jpg?v=2'),
(40, 0, 'Fall Harder', 'Saint Pepsi', 'http://images.imvdb.com/video/237861923106-saint-pepsi-fall-harder_music_video_tv.jpg?v=2'),
(41, 3, 'BedRock', 'Young Money', 'http://images.imvdb.com/video/260537581988-young-money-bedrock_music_video_tv.jpg?v=4'),
(42, 3, 'Feel So Close', 'Calvin Harris', 'http://images.imvdb.com/video/138865353830-calvin-harris-feel-so-close_music_video_tv.jpg'),
(43, 3, 'All About That Bass', 'Meghan Trainor', 'http://images.imvdb.com/video/233238531864-meghan-trainor-all-about-that-bass_music_video_tv.jpg?v=2'),
(44, 3, 'Shake It Off', 'Taylor Swift', 'http://images.imvdb.com/video/225092244997-taylor-swift-shake-it-off_music_video_tv.jpg?v=2'),
(45, 3, 'Pour It Up', 'Rihanna', 'http://images.imvdb.com/video/212831182001-rihanna-pour-it-up_music_video_tv.jpg?v=4'),
(46, 3, 'Anaconda', 'Nicki Minaj', 'http://images.imvdb.com/video/667544321684-nicki-minaj-anaconda_music_video_tv.jpg?v=3'),
(47, 3, 'Bailando', 'Enrique Iglesias', 'http://images.imvdb.com/video/223849095584-enrique-iglesias-bailando_music_video_tv.jpg?v=2'),
(48, 3, 'Chandelier', 'Sia', 'http://images.imvdb.com/video/118224591639-sia-chandelier_music_video_tv.jpg?v=2'),
(49, 3, 'Break Free', 'Ariana Grande', 'http://images.imvdb.com/video/150961129331-ariana-grande-break-free_music_video_tv.jpg?v=2'),
(50, 3, 'Rude', 'Magic!', 'http://images.imvdb.com/video/544400399477-magic-1-rude_music_video_tv.jpg?v=2'),
(51, 3, 'Bounce', 'Calvin Harris', 'http://images.imvdb.com/video/114326349033-calvin-harris-bounce_music_video_tv.jpg'),
(52, 3, 'En la Obscuridad', 'Belinda', 'http://images.imvdb.com/video/106509882312-belinda-en-la-obscuridad_music_video_tv.jpg'),
(53, 3, 'Dark Horse', 'Katy Perry', 'http://images.imvdb.com/video/187220738362-katy-perry-dark-horse_music_video_tv.jpg?v=3'),
(54, 3, '#SELFIE', 'The Chainsmokers', 'http://images.imvdb.com/video/486604082052-the-chainsmokers-selfie_music_video_tv.jpg?v=2'),
(55, 3, 'Problem', 'Ariana Grande', 'http://images.imvdb.com/video/287139894913-ariana-grande-problem_music_video_tv.jpg?v=4'),
(56, 3, 'Bang Bang', 'Jessie J', 'http://images.imvdb.com/video/103835599698-jessie-j-bang-bang_music_video_tv.jpg?v=2'),
(57, 3, 'Wiggle', 'Jason Derulo', 'http://images.imvdb.com/video/116870559093-jason-derulo-wiggle_music_video_tv.jpg?v=2'),
(58, 3, 'Counting Stars', 'OneRepublic', 'http://images.imvdb.com/video/280097230854-onerepublic-counting-stars_music_video_tv.jpg?v=2'),
(59, 3, 'Ay Vamos', 'J Balvin', 'http://images.imvdb.com/video/217943697587-j-balvin-ay-vamos_music_video_tv.jpg?v=2'),
(60, 3, 'Fancy', 'Iggy Azalea', 'http://images.imvdb.com/video/147217573781-iggy-azalea-fancy_music_video_tv.jpg?v=2'),
(61, 3, 'Black Widow', 'Iggy Azalea', 'http://images.imvdb.com/video/269637108954-iggy-azalea-black-widow_music_video_tv.jpg?v=2'),
(62, 3, 'Summer', 'Calvin Harris', 'http://images.imvdb.com/video/932271708979-calvin-harris-summer_music_video_tv.jpg?v=2'),
(63, 3, 'Roar', 'Katy Perry', 'http://images.imvdb.com/video/254918746548-katy-perry-roar_music_video_tv.jpg?v=3'),
(64, 3, 'This Is How We Do', 'Katy Perry', 'http://images.imvdb.com/video/559029743904-katy-perry-this-is-how-we-do_music_video_tv.jpg?v=2'),
(65, 3, 'All Of Me', 'John Legend', 'http://images.imvdb.com/video/159536861704-john-legend-all-of-me_music_video_tv.jpg?v=2'),
(66, 3, 'Propuesta Indecente', 'Romeo Santos', 'http://images.imvdb.com/video/236289858134-romeo-santos-propuesta-indecente_music_video_tv.jpg?v=2'),
(67, 3, 'Happy', 'Pharrell Williams', 'http://images.imvdb.com/video/215205598091-pharrell-williams-happy_music_video_tv.jpg?v=2'),
(68, 3, 'Eres Mía', 'Romeo Santos', 'http://images.imvdb.com/video/219921822535-romeo-santos-eres-mia_music_video_tv.jpg?v=2'),
(69, 3, 'Thinking Out Loud', 'Ed Sheeran', 'http://images.imvdb.com/video/136574138114-ed-sheeran-thinking-out-loud_music_video_tv.jpg?v=2'),
(70, 3, 'Animals', 'Martin Garrix', 'http://images.imvdb.com/video/139849684867-martin-garrix-animals_music_video_tv.jpg?v=2'),
(71, 3, 'Loyal', 'Chris Brown', 'http://images.imvdb.com/video/666343455209-chris-brown-loyal_music_video_tv.jpg?v=2'),
(72, 3, 'Timber', 'Pitbull', 'http://images.imvdb.com/video/289612023913-pitbull-timber_music_video_tv.jpg?v=2'),
(73, 3, 'La La La (Brazil 2014)', 'Shakira', 'http://images.imvdb.com/video/879250120640-shakira-la-la-la-brazil-2014_music_video_tv.jpg?v=3'),
(74, 3, 'Stay With Me', 'Sam Smith', 'http://images.imvdb.com/video/603029705495-sam-smith-stay-with-me_music_video_tv.jpg?v=2'),
(75, 3, 'Every Girl', 'Young Money', 'http://images.imvdb.com/video/236410794286-young-money-every-girl_music_video_tv.jpg?v=2'),
(76, 3, 'Booty', 'Jennifer Lopez', 'http://images.imvdb.com/video/202605397500-jennifer-lopez-booty_music_video_tv.jpg?v=2'),
(77, 3, 'Gangnam Style', 'Psy', 'http://images.imvdb.com/video/111003023482-psy-gangnam-style_music_video_tv.jpg'),
(78, 3, 'Blame', 'Calvin Harris', 'http://images.imvdb.com/video/231371390680-calvin-harris-blame_music_video_tv.jpg?v=2'),
(79, 3, '6 AM', 'J Balvin', 'http://images.imvdb.com/video/197303119008-j-balvin-6-am_music_video_tv.jpg?v=2'),
(80, 3, 'I''m Not The Only One', 'Sam Smith', 'http://images.imvdb.com/video/177262050097-sam-smith-im-not-the-only-one_music_video_tv.jpg?v=2'),
(81, 2, 'One Day (Wankelmut Remix)', 'Asaf Avidan', 'http://images.imvdb.com/video/175970724241-asaf-avidan-one-day-wankelmut-remix_music_video_tv.jpg?v=2'),
(82, 2, 'Started From The Bottom', 'Drake', 'http://images.imvdb.com/video/212576340774-drake-started-from-the-bottom_music_video_tv.jpg?v=6'),
(83, 2, 'Work', 'Iggy Azalea', 'http://images.imvdb.com/video/165554393342-iggy-azalea-work_music_video_tv.jpg'),
(84, 2, 'Barbra Streisand', 'Duck Sauce', 'http://images.imvdb.com/video/220730929832-duck-sauce-barbra-streisand_music_video_tv.jpg'),
(85, 2, 'My Love', 'Route 94', 'http://images.imvdb.com/video/187856376168-route-94-my-love_music_video_tv.jpg?v=6'),
(86, 2, 'Red Nose', 'Sage The Gemini', 'http://images.imvdb.com/video/362610051641-sage-the-gemini-red-nose_music_video_tv.jpg?v=2'),
(87, 2, 'Lonely  (Version 1)', '2NE1', 'http://images.imvdb.com/video/105313976104-2ne1-lonely_music_video_tv.jpg?v=2'),
(88, 2, 'Worst Behavior', 'Drake', 'http://images.imvdb.com/video/217651653687-drake-worst-behavior_music_video_tv.jpg?v=7'),
(89, 2, 'Chandelier', 'Sia', 'http://images.imvdb.com/video/118224591639-sia-chandelier_music_video_tv.jpg?v=2'),
(90, 2, 'Amami', 'Emma Marrone', 'http://images.imvdb.com/video/134916698118-emma-marrone-amami_music_video_tv.jpg?v=2'),
(91, 2, 'Drinking From the Bottle', 'Calvin Harris', 'http://images.imvdb.com/video/150586396771-calvin-harris-drinking-from-the-bottle_music_video_tv.jpg'),
(92, 2, 'Gotta Be You', '2NE1', 'http://images.imvdb.com/video/191663949868-2ne1-gotta-be-you_music_video_tv.jpg?v=2'),
(93, 2, 'Bang Bang', 'Jessie J', 'http://images.imvdb.com/video/103835599698-jessie-j-bang-bang_music_video_tv.jpg?v=2'),
(94, 2, 'Break Free', 'Ariana Grande', 'http://images.imvdb.com/video/150961129331-ariana-grande-break-free_music_video_tv.jpg?v=2'),
(95, 2, 'Rude', 'Magic!', 'http://images.imvdb.com/video/544400399477-magic-1-rude_music_video_tv.jpg?v=2'),
(96, 2, 'With Every Heartbeat', 'Robyn', 'http://images.imvdb.com/video/151344275901-robyn-with-every-heartbeat_music_video_tv.jpg'),
(97, 2, 'Radioactive', 'Rita Ora', 'http://images.imvdb.com/video/194196979983-rita-ora-radioactive_music_video_tv.jpg'),
(98, 2, 'Happy', '2NE1', 'http://images.imvdb.com/video/484094927463-2ne1-happy_music_video_tv.jpg?v=2'),
(99, 2, 'All I Want', 'Kodaline', 'http://images.imvdb.com/video/196199713520-kodaline-all-i-want_music_video_tv.jpg'),
(100, 2, 'Spaceship', 'Benny Benassi', 'http://images.imvdb.com/video/275418267667-benny-benassi-spaceship_music_video_tv.jpg'),
(101, 2, 'This Is How We Do', 'Katy Perry', 'http://images.imvdb.com/video/559029743904-katy-perry-this-is-how-we-do_music_video_tv.jpg?v=2'),
(102, 2, 'Anaconda', 'Nicki Minaj', 'http://images.imvdb.com/video/667544321684-nicki-minaj-anaconda_music_video_tv.jpg?v=3'),
(103, 2, 'Wiggle', 'Jason Derulo', 'http://images.imvdb.com/video/116870559093-jason-derulo-wiggle_music_video_tv.jpg?v=2'),
(104, 2, '#SELFIE', 'The Chainsmokers', 'http://images.imvdb.com/video/486604082052-the-chainsmokers-selfie_music_video_tv.jpg?v=2'),
(105, 2, 'Summer', 'Calvin Harris', 'http://images.imvdb.com/video/932271708979-calvin-harris-summer_music_video_tv.jpg?v=2'),
(106, 2, 'Problem', 'Ariana Grande', 'http://images.imvdb.com/video/287139894913-ariana-grande-problem_music_video_tv.jpg?v=4'),
(107, 2, 'Children Of The Sun', 'Tinie Tempah', 'http://images.imvdb.com/video/648640340457-tinie-tempah-children-of-the-sun_music_video_tv.jpg?v=2'),
(108, 2, 'All Of Me', 'John Legend', 'http://images.imvdb.com/video/159536861704-john-legend-all-of-me_music_video_tv.jpg?v=2'),
(109, 2, 'You & Me', 'Disclosure', 'http://images.imvdb.com/video/128839969828-disclosure-you-me_music_video_tv.jpg?v=2'),
(110, 2, 'Never Say Never', 'Basement Jaxx', 'http://images.imvdb.com/video/280466261946-basement-jaxx-never-say-never_music_video_tv.jpg?v=5'),
(111, 2, 'Propuesta Indecente', 'Romeo Santos', 'http://images.imvdb.com/video/236289858134-romeo-santos-propuesta-indecente_music_video_tv.jpg?v=2'),
(112, 2, 'Black Widow', 'Iggy Azalea', 'http://images.imvdb.com/video/269637108954-iggy-azalea-black-widow_music_video_tv.jpg?v=2'),
(113, 2, 'Heart Skips A Beat', 'Lenka', 'http://images.imvdb.com/video/228316367605-lenka-heart-skips-a-beat_music_video_tv.jpg'),
(114, 2, 'I''m Not The Only One', 'Sam Smith', 'http://images.imvdb.com/video/177262050097-sam-smith-im-not-the-only-one_music_video_tv.jpg?v=2'),
(115, 2, 'Guns For Hands', 'twenty | one | pilots', 'http://images.imvdb.com/video/668269253452-twenty-one-pilots-guns-for-hands_music_video_tv.jpg'),
(116, 2, 'Thinking Out Loud', 'Ed Sheeran', 'http://images.imvdb.com/video/136574138114-ed-sheeran-thinking-out-loud_music_video_tv.jpg?v=2'),
(117, 2, 'Lifestyle', 'Rich Gang', 'http://images.imvdb.com/video/293173781922-rich-gang-lifestyle_music_video_tv.jpg?v=2'),
(118, 2, 'La La La (Brazil 2014)', 'Shakira', 'http://images.imvdb.com/video/879250120640-shakira-la-la-la-brazil-2014_music_video_tv.jpg?v=3'),
(119, 2, 'Darte un Beso', 'Prince Royce', 'http://images.imvdb.com/video/110995721579-prince-royce-darte-un-beso_music_video_tv.jpg?v=2'),
(120, 2, 'Ay Vamos', 'J Balvin', 'http://images.imvdb.com/video/217943697587-j-balvin-ay-vamos_music_video_tv.jpg?v=2'),
(121, 4, 'Gangnam Style', 'Psy', 'http://images.imvdb.com/video/111003023482-psy-gangnam-style_music_video_tv.jpg'),
(122, 4, 'Baby', 'Justin Bieber', 'http://images.imvdb.com/video/280548936187-justin-bieber-baby_music_video_tv.jpg'),
(123, 4, 'On The Floor', 'Jennifer Lopez', 'http://images.imvdb.com/video/150549201840-jennifer-lopez-on-the-floor_music_video_tv.jpg'),
(124, 4, 'Party Rock Anthem', 'LMFAO', 'http://images.imvdb.com/video/256638317647-lmfao-party-rock-anthem_music_video_tv.jpg'),
(125, 4, 'Waka Waka (This Time For Africa)', 'Shakira', 'http://images.imvdb.com/video/115971161451-shakira-waka-waka-this-time-for-africa_music_video_tv.jpg'),
(126, 4, 'Love The Way You Lie', 'Eminem', 'http://images.imvdb.com/video/216948743315-eminem-love-the-way-you-lie_music_video_tv.jpg'),
(127, 4, 'Gentleman', 'Psy', 'http://images.imvdb.com/video/207430707998-psy-gentleman_music_video_tv.jpg?v=2'),
(128, 4, 'Wrecking Ball', 'Miley Cyrus', 'http://images.imvdb.com/video/244701510750-miley-cyrus-wrecking-ball_music_video_tv.jpg?v=2'),
(129, 4, 'Roar', 'Katy Perry', 'http://images.imvdb.com/video/254918746548-katy-perry-roar_music_video_tv.jpg?v=3'),
(130, 4, 'Dark Horse', 'Katy Perry', 'http://images.imvdb.com/video/187220738362-katy-perry-dark-horse_music_video_tv.jpg?v=3'),
(131, 4, 'Danza Kuduro', 'Don Omar', 'http://images.imvdb.com/video/117039428201-don-omar-danza-kuduro_music_video_tv.jpg'),
(132, 4, 'Call Me Maybe', 'Carly Rae Jepsen', 'http://images.imvdb.com/video/122985980321-carly-rae-jepsen-call-me-maybe_music_video_tv.jpg'),
(133, 4, 'Thrift Shop', 'Macklemore X Ryan Lewis', 'http://images.imvdb.com/video/234915882699-macklemore-and-ryan-lewis-thrift-shop_music_video_tv.jpg'),
(134, 4, 'Bad Romance', 'Lady Gaga', 'http://images.imvdb.com/video/230982484954-lady-gaga-bad-romance_music_video_tv.jpg'),
(135, 4, 'What Makes You Beautiful', 'One Direction', 'http://images.imvdb.com/video/167791761471-one-direction-what-makes-you-beautiful_music_video_tv.jpg'),
(136, 4, 'Somebody That I Used To Know', 'Gotye', 'http://images.imvdb.com/video/180874604947-gotye-somebody-that-i-used-to-know_music_video_tv.jpg'),
(137, 4, 'Rolling In The Deep', 'Adele', 'http://images.imvdb.com/video/101950927964-adele-rolling-in-the-deep_music_video_tv.jpg'),
(138, 4, 'The Lazy Song  (Version 2)', 'Bruno Mars', 'http://images.imvdb.com/video/128896914374-bruno-mars-the-lazy-song_music_video_tv.jpg'),
(139, 4, 'Not Afraid', 'Eminem', 'http://images.imvdb.com/video/208655643140-eminem-not-afraid_music_video_tv.jpg'),
(140, 4, 'Bailando', 'Enrique Iglesias', 'http://images.imvdb.com/video/223849095584-enrique-iglesias-bailando_music_video_tv.jpg?v=2'),
(141, 4, 'Counting Stars', 'OneRepublic', 'http://images.imvdb.com/video/280097230854-onerepublic-counting-stars_music_video_tv.jpg?v=2'),
(142, 4, 'Rain Over Me', 'Pitbull', 'http://images.imvdb.com/video/103027437221-pitbull-rain-over-me_music_video_tv.jpg'),
(143, 4, 'We Can''t Stop', 'Miley Cyrus', 'http://images.imvdb.com/video/119814108932-miley-cyrus-we-cant-stop_music_video_tv.jpg?v=4'),
(144, 4, 'Firework', 'Katy Perry', 'http://images.imvdb.com/video/287687503511-katy-perry-firework_music_video_tv.jpg'),
(145, 4, 'Diamonds', 'Rihanna', 'http://images.imvdb.com/video/337539916482-rihanna-diamonds_music_video_tv.jpg'),
(146, 4, 'Propuesta Indecente', 'Romeo Santos', 'http://images.imvdb.com/video/236289858134-romeo-santos-propuesta-indecente_music_video_tv.jpg?v=2'),
(147, 4, 'Happy', 'Pharrell Williams', 'http://images.imvdb.com/video/215205598091-pharrell-williams-happy_music_video_tv.jpg?v=2'),
(148, 4, 'Wake Me Up', 'Avicii', 'http://images.imvdb.com/video/161167601260-avicii-wake-me-up_music_video_tv.jpg?v=2'),
(149, 4, 'Just The Way You Are', 'Bruno Mars', 'http://images.imvdb.com/video/257876514694-bruno-mars-just-the-way-you-are_music_video_tv.jpg'),
(150, 4, 'The Fox', 'Ylvis', 'http://images.imvdb.com/video/197087906504-ylvis-the-fox_music_video_tv.jpg?v=6'),
(151, 4, 'Timber', 'Pitbull', 'http://images.imvdb.com/video/289612023913-pitbull-timber_music_video_tv.jpg?v=2'),
(152, 4, 'Never Say Never', 'Justin Bieber', 'http://images.imvdb.com/video/375284567400-justin-bieber-never-say-never_music_video_tv.jpg?v=2'),
(153, 4, 'Super Bass', 'Nicki Minaj', 'http://images.imvdb.com/video/166256648402-nicki-minaj-super-bass_music_video_tv.jpg'),
(154, 4, 'Royals', 'Lorde', 'http://images.imvdb.com/video/249319656891-lorde-royals_music_video_tv.jpg?v=2'),
(155, 4, 'Can''t Remember To Forget You', 'Shakira', 'http://images.imvdb.com/video/174041333339-shakira-cant-remember-to-forget-you_music_video_tv.jpg?v=2'),
(156, 4, 'La La La', 'Naughty Boy', 'http://images.imvdb.com/video/116791082379-naughty-boy-la-la-la_music_video_tv.jpg?v=2'),
(157, 4, 'Beauty And A Beat', 'Justin Bieber', 'http://images.imvdb.com/video/224963639234-justin-bieber-beauty-and-a-beat_music_video_tv.jpg'),
(158, 4, 'Party in the U.S.A.', 'Miley Cyrus', 'http://images.imvdb.com/video/270086188961-miley-cyrus-party-in-the-u.s.a_music_video_tv.jpg'),
(159, 4, 'Someone Like You', 'Adele', 'http://images.imvdb.com/video/168256846779-adele-someone-like-you_music_video_tv.jpg'),
(160, 4, 'Scream & Shout', 'will.i.am', 'http://images.imvdb.com/video/453795709435-will.i.am-scream-shout_music_video_tv.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `jukebox_songs`
--

DROP TABLE IF EXISTS `jukebox_songs`;
CREATE TABLE `jukebox_songs` (
`id` int(11) NOT NULL,
  `track_id` int(12) NOT NULL,
  `customtrack_id` varchar(12) NOT NULL,
  `youtube_id` varchar(12) NOT NULL,
  `artist` varchar(64) NOT NULL,
  `track` varchar(64) NOT NULL,
  `image` varchar(128) NOT NULL,
  `year` year(4) NOT NULL,
  `jukebox_id` varchar(12) NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
 ADD PRIMARY KEY (`artist_order`);

--
-- Indexes for table `jukebox_songs`
--
ALTER TABLE `jukebox_songs`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `youtube_id` (`youtube_id`), ADD KEY `jukebox_id` (`jukebox_id`);

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
-- AUTO_INCREMENT for table `jukebox_songs`
--
ALTER TABLE `jukebox_songs`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
