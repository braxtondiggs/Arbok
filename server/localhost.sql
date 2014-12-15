-- phpMyAdmin SQL Dump
-- version 4.2.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Dec 05, 2014 at 08:22 AM
-- Server version: 5.5.38
-- PHP Version: 5.6.2

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
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `jukebox_section`
--

DROP TABLE IF EXISTS `jukebox_section`;
CREATE TABLE `jukebox_section` (
`id` int(11) NOT NULL,
  `title` varchar(64) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB AUTO_INCREMENT=321 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jukebox_section_music`
--

INSERT INTO `jukebox_section_music` (`id`, `artist_order`, `section`, `artist_title`, `artist_name`, `artist_image`) VALUES
(161, 0, 0, 'Spark The Fire', 'Gwen Stefani', 'http://images.imvdb.com/video/284735815483-gwen-stefani-spark-the-fire_music_video_tv.jpg?v=2'),
(162, 1, 0, 'HAM', 'Mr. Oizo', 'http://images.imvdb.com/video/287666607274-mr.-oizo-ham_music_video_tv.jpg?v=2'),
(163, 2, 0, 'All I Want For Christmas is You', 'Fifth Harmony', 'http://images.imvdb.com/video/236594478606-fifth-harmony-all-i-want-for-christmas-is-you_music_video_tv.jpg?v=2'),
(164, 3, 0, 'Mamacita', 'Travi$ Scott', 'http://images.imvdb.com/video/102500120431-travi-scott-mamacita_music_video_tv.jpg?v=2'),
(165, 4, 0, 'Can''t Stop Dancin''', 'Becky G.', 'http://images.imvdb.com/video/196009669522-becky-g.-cant-stop-dancin_music_video_tv.jpg?v=2'),
(166, 5, 0, 'Text Me Merry Christmas', 'Straight No Chaser', 'http://images.imvdb.com/video/849651958411-straight-no-chaser-text-me-merry-christmas_music_video_tv.jpg?v=2'),
(167, 6, 0, 'Breaking Up', 'Charli XCX', 'http://images.imvdb.com/video/174820467823-charli-xcx-breaking-up_music_video_tv.jpg?v=2'),
(168, 7, 0, 'Big Bad Wolf', 'In This Moment', 'http://images.imvdb.com/video/742514305706-in-this-moment-big-bad-wolf_music_video_tv.jpg?v=2'),
(169, 8, 0, 'Sono sempre i sogni a dare forma al mondo', 'Luciano Ligabue', 'http://images.imvdb.com/video/168920871479-luciano-ligabue-sono-sempre-i-sogni-a-dare-forma-al-mondo_music_video_tv.jpg?v=2'),
(170, 9, 0, 'You & I (Forever)', 'Jessie Ware', 'http://images.imvdb.com/video/209871936370-jessie-ware-you-i-forever_music_video_tv.jpg?v=2'),
(171, 10, 0, 'Stand For', 'Ty Dolla $ign', 'http://images.imvdb.com/video/233242663812-ty-dolla-$ign-stand-for_music_video_tv.jpg?v=4'),
(172, 11, 0, 'Oh My Darling (Don''t Cry)', 'Run The Jewels', 'http://images.imvdb.com/video/572194319458-run-the-jewels-oh-my-darling-dont-cry_music_video_tv.jpg?v=2'),
(173, 12, 0, 'Skulls', 'Röyksopp', 'http://images.imvdb.com/video/266750658462-röyksopp-skulls_music_video_tv.jpg?v=2'),
(174, 13, 0, 'Reindeer Games', 'Froggy Fresh', 'http://images.imvdb.com/video/279239697668-froggy-fresh-reindeer-games_music_video_tv.jpg?v=2'),
(175, 14, 0, 'Chlorine', 'Title Fight', 'http://images.imvdb.com/video/618839075823-title-fight-chlorine_music_video_tv.jpg?v=2'),
(176, 15, 0, 'We Came To Bang', '3LAU', 'http://images.imvdb.com/video/237968924982-3lau-we-came-to-bang_music_video_tv.jpg?v=2'),
(177, 16, 0, 'Over Our Heads', 'OFF!', 'http://images.imvdb.com/video/139455440813-off-1-over-our-heads_music_video_tv.jpg?v=3'),
(178, 17, 0, 'When You Were Mine', 'Night Terrors of 1927', 'http://images.imvdb.com/video/141184011723-night-terrors-of-1927-when-you-were-mine_music_video_tv.jpg?v=2'),
(179, 18, 0, 'Sin Tu Amor', 'J Quiles', 'http://images.imvdb.com/video/119819608299-j-quiles-sin-tu-amor_music_video_tv.jpg?v=2'),
(180, 19, 0, 'Come Closer', 'Emmy Curl', 'http://images.imvdb.com/video/177463287494-emmy-curl-come-closer_music_video_tv.jpg?v=2'),
(181, 20, 0, 'For Blood', 'Bass Drum Of Death', 'http://images.imvdb.com/video/178803272611-bass-drum-of-death-for-blood_music_video_tv.jpg?v=2'),
(182, 21, 0, 'Broke Her', 'Yuna', 'http://images.imvdb.com/video/263058226483-yuna-broke-her_music_video_tv.jpg?v=2'),
(183, 22, 0, 'Internal Fantasy', 'Owen Pallett', 'http://images.imvdb.com/video/168294209833-owen-pallett-internal-fantasy_music_video_tv.jpg?v=2'),
(184, 23, 0, 'the last dancer', 'iamamiwhoami', 'http://images.imvdb.com/video/979586110179-iamamiwhoami-the-last-dancer_music_video_tv.jpg?v=2'),
(185, 24, 0, 'Fade Away', 'Susanne Sundfør', 'http://images.imvdb.com/video/283839586592-susanne-sundfor-fade-away_music_video_tv.jpg?v=2'),
(186, 25, 0, 'When My Train Pulls In', 'Gary Clark Jr.', 'http://images.imvdb.com/video/370178314038-gary-clark-jr-when-my-train-pulls-in_music_video_tv.jpg?v=4'),
(187, 26, 0, 'Time', 'Mikky Ekko', 'http://images.imvdb.com/video/171620017517-mikky-ekko-time_music_video_tv.jpg?v=2'),
(188, 27, 0, 'Black Moon', 'Black Asteroid', 'http://images.imvdb.com/video/106006454603-black-asteroid-black-moon_music_video_tv.jpg?v=2'),
(189, 28, 0, 'Dripping', 'Blonde Redhead', 'http://images.imvdb.com/video/117230370795-blonde-redhead-dripping_music_video_tv.jpg?v=2'),
(190, 29, 0, 'Tres.Passing', 'GIANI NYC', 'http://images.imvdb.com/video/814133780406-giani-nyc-trespassing_music_video_tv.jpg?v=2'),
(191, 30, 0, 'How''d You Like It', 'Rosie Lowe', 'http://images.imvdb.com/video/119840241838-rosie-lowe-howd-you-like-it_music_video_tv.jpg?v=2'),
(192, 31, 0, 'Picture Perfect', 'Ali Love', 'http://images.imvdb.com/video/616886070477-ali-love-1-picture-perfect_music_video_tv.jpg?v=2'),
(193, 32, 0, 'Refugee', 'Nadya', 'http://images.imvdb.com/video/122170060806-nadya-refugee_music_video_tv.jpg?v=2'),
(194, 33, 0, 'Keep Me Alive', 'All We Are', 'http://images.imvdb.com/video/716992983844-all-we-are-keep-me-alive_music_video_tv.jpg?v=2'),
(195, 34, 0, 'It''s All Good', 'Naomi Pilgrim', 'http://images.imvdb.com/video/261125036799-naomi-pilgrim-its-all-good_music_video_tv.jpg?v=2'),
(196, 35, 0, 'You''re Just Like Christmas', 'The Crookes', 'http://images.imvdb.com/video/258189289396-the-crookes-youre-just-like-christmas_music_video_tv.jpg?v=2'),
(197, 36, 0, 'Origins', 'Max Cooper', 'http://images.imvdb.com/video/228425524117-max-cooper-origins_music_video_tv.jpg?v=2'),
(198, 37, 0, 'Polka Dots', 'Bite The Buffalo', 'http://images.imvdb.com/video/243172610931-bite-the-buffalo-polka-dots_music_video_tv.jpg?v=2'),
(199, 38, 0, 'River of Blood', 'MRK', 'http://images.imvdb.com/video/802554628241-mrk-river-of-blood_music_video_tv.jpg?v=2'),
(200, 39, 0, 'Underground', 'FROM KID', 'http://images.imvdb.com/video/161749104856-from-kid-underground_music_video_tv.jpg?v=2'),
(201, 0, 1, 'One Day (Wankelmut Remix)', 'Asaf Avidan', 'http://images.imvdb.com/video/175970724241-asaf-avidan-one-day-wankelmut-remix_music_video_tv.jpg?v=2'),
(202, 1, 1, 'Red Nose', 'Sage The Gemini', 'http://images.imvdb.com/video/362610051641-sage-the-gemini-red-nose_music_video_tv.jpg?v=2'),
(203, 2, 1, 'Blue', 'BIGBANG', 'http://images.imvdb.com/video/244402725525-bigbang-1-blue_music_video_tv.jpg'),
(204, 3, 1, 'Bad Boy', 'BIGBANG', 'http://images.imvdb.com/video/198242644479-bigbang-1-bad-boy_music_video_tv.jpg'),
(205, 4, 1, 'Change Your Life', 'Iggy Azalea', 'http://images.imvdb.com/video/139702228015-iggy-azalea-change-your-life_music_video_tv.jpg?v=2'),
(206, 5, 1, 'Monster', 'BIGBANG', 'http://images.imvdb.com/video/164789714359-bigbang-1-monster_music_video_tv.jpg'),
(207, 6, 1, 'Worst Behavior', 'Drake', 'http://images.imvdb.com/video/217651653687-drake-worst-behavior_music_video_tv.jpg?v=7'),
(208, 7, 1, 'Loud', 'Mac Miller', 'http://images.imvdb.com/video/123093996475-mac-miller-loud_music_video_tv.jpg?v=2'),
(209, 8, 1, 'Love Song', 'BIGBANG', 'http://images.imvdb.com/video/138195033531-bigbang-1-love-song_music_video_tv.jpg?v=2'),
(210, 9, 1, 'Tapout', 'Rich Gang', 'http://images.imvdb.com/video/115485590176-rich-gang-tapout_music_video_tv.jpg?v=3'),
(211, 10, 1, 'MISSING YOU', '2NE1', 'http://images.imvdb.com/video/225771458908-2ne1-missing-you_music_video_tv.jpg?v=2'),
(212, 11, 1, 'All About That Bass', 'Meghan Trainor', 'http://images.imvdb.com/video/233238531864-meghan-trainor-all-about-that-bass_music_video_tv.jpg?v=2'),
(213, 12, 1, 'Miss Jackson', 'Panic! at the Disco', 'http://images.imvdb.com/video/174336517930-panic-at-the-disco-miss-jackson_music_video_tv.jpg?v=4'),
(214, 13, 1, 'Amami', 'Emma Marrone', 'http://images.imvdb.com/video/134916698118-emma-marrone-amami_music_video_tv.jpg?v=2'),
(215, 14, 1, 'Shake It Off', 'Taylor Swift', 'http://images.imvdb.com/video/225092244997-taylor-swift-shake-it-off_music_video_tv.jpg?v=2'),
(216, 15, 1, 'With Every Heartbeat', 'Robyn', 'http://images.imvdb.com/video/151344275901-robyn-with-every-heartbeat_music_video_tv.jpg'),
(217, 16, 1, 'Spaceship', 'Benny Benassi', 'http://images.imvdb.com/video/275418267667-benny-benassi-spaceship_music_video_tv.jpg'),
(218, 17, 1, 'Chandelier', 'Sia', 'http://images.imvdb.com/video/118224591639-sia-chandelier_music_video_tv.jpg?v=2'),
(219, 18, 1, '#SELFIE', 'The Chainsmokers', 'http://images.imvdb.com/video/486604082052-the-chainsmokers-selfie_music_video_tv.jpg?v=2'),
(220, 19, 1, 'Children Of The Sun', 'Tinie Tempah', 'http://images.imvdb.com/video/648640340457-tinie-tempah-children-of-the-sun_music_video_tv.jpg?v=2'),
(221, 20, 1, 'Music', 'Madonna', 'http://images.imvdb.com/video/549060935265-madonna-music_music_video_tv.jpg'),
(222, 21, 1, 'You & Me', 'Disclosure', 'http://images.imvdb.com/video/128839969828-disclosure-you-me_music_video_tv.jpg?v=2'),
(223, 22, 1, 'Rude', 'Magic!', 'http://images.imvdb.com/video/544400399477-magic-1-rude_music_video_tv.jpg?v=2'),
(224, 23, 1, 'Propuesta Indecente', 'Romeo Santos', 'http://images.imvdb.com/video/236289858134-romeo-santos-propuesta-indecente_music_video_tv.jpg?v=2'),
(225, 24, 1, 'Break Free', 'Ariana Grande', 'http://images.imvdb.com/video/150961129331-ariana-grande-break-free_music_video_tv.jpg?v=2'),
(226, 25, 1, 'Thinking Out Loud', 'Ed Sheeran', 'http://images.imvdb.com/video/136574138114-ed-sheeran-thinking-out-loud_music_video_tv.jpg?v=2'),
(227, 26, 1, 'Steal My Girl', 'One Direction', 'http://images.imvdb.com/video/116323931219-one-direction-steal-my-girl_music_video_tv.jpg?v=2'),
(228, 27, 1, 'Gangnam Style', 'Psy', 'http://images.imvdb.com/video/111003023482-psy-gangnam-style_music_video_tv.jpg'),
(229, 28, 1, 'Counting Stars', 'OneRepublic', 'http://images.imvdb.com/video/280097230854-onerepublic-counting-stars_music_video_tv.jpg?v=2'),
(230, 29, 1, 'Animals', 'Martin Garrix', 'http://images.imvdb.com/video/139849684867-martin-garrix-animals_music_video_tv.jpg?v=2'),
(231, 30, 1, 'Problem', 'Ariana Grande', 'http://images.imvdb.com/video/287139894913-ariana-grande-problem_music_video_tv.jpg?v=4'),
(232, 31, 1, 'No Type', 'Rae Sremmurd', 'http://images.imvdb.com/video/714843362621-rae-sremmurd-no-type_music_video_tv.jpg?v=2'),
(233, 32, 1, 'Darte un Beso', 'Prince Royce', 'http://images.imvdb.com/video/110995721579-prince-royce-darte-un-beso_music_video_tv.jpg?v=2'),
(234, 33, 1, 'Black Widow', 'Iggy Azalea', 'http://images.imvdb.com/video/269637108954-iggy-azalea-black-widow_music_video_tv.jpg?v=2'),
(235, 34, 1, 'Ay Vamos', 'J Balvin', 'http://images.imvdb.com/video/217943697587-j-balvin-ay-vamos_music_video_tv.jpg?v=2'),
(236, 35, 1, 'Bang Bang', 'Jessie J', 'http://images.imvdb.com/video/103835599698-jessie-j-bang-bang_music_video_tv.jpg?v=2'),
(237, 36, 1, 'Dark Horse', 'Katy Perry', 'http://images.imvdb.com/video/187220738362-katy-perry-dark-horse_music_video_tv.jpg?v=3'),
(238, 37, 1, 'I''m Not The Only One', 'Sam Smith', 'http://images.imvdb.com/video/177262050097-sam-smith-im-not-the-only-one_music_video_tv.jpg?v=2'),
(239, 38, 1, 'Roar', 'Katy Perry', 'http://images.imvdb.com/video/254918746548-katy-perry-roar_music_video_tv.jpg?v=3'),
(240, 39, 1, 'En la Obscuridad', 'Belinda', 'http://images.imvdb.com/video/106509882312-belinda-en-la-obscuridad_music_video_tv.jpg'),
(241, 0, 3, 'Gangnam Style', 'Psy', 'http://images.imvdb.com/video/111003023482-psy-gangnam-style_music_video_tv.jpg'),
(242, 1, 3, 'Baby', 'Justin Bieber', 'http://images.imvdb.com/video/280548936187-justin-bieber-baby_music_video_tv.jpg'),
(243, 2, 3, 'On The Floor', 'Jennifer Lopez', 'http://images.imvdb.com/video/150549201840-jennifer-lopez-on-the-floor_music_video_tv.jpg'),
(244, 3, 3, 'Party Rock Anthem', 'LMFAO', 'http://images.imvdb.com/video/256638317647-lmfao-party-rock-anthem_music_video_tv.jpg'),
(245, 4, 3, 'Waka Waka (This Time For Africa)', 'Shakira', 'http://images.imvdb.com/video/115971161451-shakira-waka-waka-this-time-for-africa_music_video_tv.jpg'),
(246, 5, 3, 'Love The Way You Lie', 'Eminem', 'http://images.imvdb.com/video/216948743315-eminem-love-the-way-you-lie_music_video_tv.jpg'),
(247, 6, 3, 'Gentleman', 'Psy', 'http://images.imvdb.com/video/207430707998-psy-gentleman_music_video_tv.jpg?v=2'),
(248, 7, 3, 'Wrecking Ball', 'Miley Cyrus', 'http://images.imvdb.com/video/244701510750-miley-cyrus-wrecking-ball_music_video_tv.jpg?v=2'),
(249, 8, 3, 'Roar', 'Katy Perry', 'http://images.imvdb.com/video/254918746548-katy-perry-roar_music_video_tv.jpg?v=3'),
(250, 9, 3, 'Dark Horse', 'Katy Perry', 'http://images.imvdb.com/video/187220738362-katy-perry-dark-horse_music_video_tv.jpg?v=3'),
(251, 10, 3, 'Danza Kuduro', 'Don Omar', 'http://images.imvdb.com/video/117039428201-don-omar-danza-kuduro_music_video_tv.jpg'),
(252, 11, 3, 'Call Me Maybe', 'Carly Rae Jepsen', 'http://images.imvdb.com/video/122985980321-carly-rae-jepsen-call-me-maybe_music_video_tv.jpg'),
(253, 12, 3, 'Thrift Shop', 'Macklemore X Ryan Lewis', 'http://images.imvdb.com/video/234915882699-macklemore-and-ryan-lewis-thrift-shop_music_video_tv.jpg'),
(254, 13, 3, 'Bad Romance', 'Lady Gaga', 'http://images.imvdb.com/video/230982484954-lady-gaga-bad-romance_music_video_tv.jpg'),
(255, 14, 3, 'What Makes You Beautiful', 'One Direction', 'http://images.imvdb.com/video/167791761471-one-direction-what-makes-you-beautiful_music_video_tv.jpg'),
(256, 15, 3, 'Somebody That I Used To Know', 'Gotye', 'http://images.imvdb.com/video/180874604947-gotye-somebody-that-i-used-to-know_music_video_tv.jpg'),
(257, 16, 3, 'Rolling In The Deep', 'Adele', 'http://images.imvdb.com/video/101950927964-adele-rolling-in-the-deep_music_video_tv.jpg'),
(258, 17, 3, 'The Lazy Song  (Version 2)', 'Bruno Mars', 'http://images.imvdb.com/video/128896914374-bruno-mars-the-lazy-song_music_video_tv.jpg'),
(259, 18, 3, 'Bailando', 'Enrique Iglesias', 'http://images.imvdb.com/video/223849095584-enrique-iglesias-bailando_music_video_tv.jpg?v=2'),
(260, 19, 3, 'Not Afraid', 'Eminem', 'http://images.imvdb.com/video/208655643140-eminem-not-afraid_music_video_tv.jpg'),
(261, 20, 3, 'Counting Stars', 'OneRepublic', 'http://images.imvdb.com/video/280097230854-onerepublic-counting-stars_music_video_tv.jpg?v=2'),
(262, 21, 3, 'Rain Over Me', 'Pitbull', 'http://images.imvdb.com/video/103027437221-pitbull-rain-over-me_music_video_tv.jpg'),
(263, 22, 3, 'We Can''t Stop', 'Miley Cyrus', 'http://images.imvdb.com/video/119814108932-miley-cyrus-we-cant-stop_music_video_tv.jpg?v=4'),
(264, 23, 3, 'Propuesta Indecente', 'Romeo Santos', 'http://images.imvdb.com/video/236289858134-romeo-santos-propuesta-indecente_music_video_tv.jpg?v=2'),
(265, 24, 3, 'Happy', 'Pharrell Williams', 'http://images.imvdb.com/video/215205598091-pharrell-williams-happy_music_video_tv.jpg?v=2'),
(266, 25, 3, 'Firework', 'Katy Perry', 'http://images.imvdb.com/video/287687503511-katy-perry-firework_music_video_tv.jpg'),
(267, 26, 3, 'Diamonds', 'Rihanna', 'http://images.imvdb.com/video/337539916482-rihanna-diamonds_music_video_tv.jpg'),
(268, 27, 3, 'Wake Me Up', 'Avicii', 'http://images.imvdb.com/video/161167601260-avicii-wake-me-up_music_video_tv.jpg?v=2'),
(269, 28, 3, 'Just The Way You Are', 'Bruno Mars', 'http://images.imvdb.com/video/257876514694-bruno-mars-just-the-way-you-are_music_video_tv.jpg'),
(270, 29, 3, 'The Fox', 'Ylvis', 'http://images.imvdb.com/video/197087906504-ylvis-the-fox_music_video_tv.jpg?v=6'),
(271, 30, 3, 'Timber', 'Pitbull', 'http://images.imvdb.com/video/289612023913-pitbull-timber_music_video_tv.jpg?v=2'),
(272, 31, 3, 'Super Bass', 'Nicki Minaj', 'http://images.imvdb.com/video/166256648402-nicki-minaj-super-bass_music_video_tv.jpg'),
(273, 32, 3, 'Royals', 'Lorde', 'http://images.imvdb.com/video/249319656891-lorde-royals_music_video_tv.jpg?v=2'),
(274, 33, 3, 'Can''t Remember To Forget You', 'Shakira', 'http://images.imvdb.com/video/174041333339-shakira-cant-remember-to-forget-you_music_video_tv.jpg?v=2'),
(275, 34, 3, 'La La La', 'Naughty Boy', 'http://images.imvdb.com/video/116791082379-naughty-boy-la-la-la_music_video_tv.jpg?v=2'),
(276, 35, 3, 'Beauty And A Beat', 'Justin Bieber', 'http://images.imvdb.com/video/224963639234-justin-bieber-beauty-and-a-beat_music_video_tv.jpg'),
(277, 36, 3, 'Party in the U.S.A.', 'Miley Cyrus', 'http://images.imvdb.com/video/270086188961-miley-cyrus-party-in-the-u.s.a_music_video_tv.jpg'),
(278, 37, 3, 'Darte un Beso', 'Prince Royce', 'http://images.imvdb.com/video/110995721579-prince-royce-darte-un-beso_music_video_tv.jpg?v=2'),
(279, 38, 3, 'Animals', 'Martin Garrix', 'http://images.imvdb.com/video/139849684867-martin-garrix-animals_music_video_tv.jpg?v=2'),
(280, 39, 3, 'Someone Like You', 'Adele', 'http://images.imvdb.com/video/168256846779-adele-someone-like-you_music_video_tv.jpg'),
(281, 0, 2, 'Can''t Hold Us', 'Macklemore X Ryan Lewis', 'http://images.imvdb.com/video/575468493326-macklemore-and-ryan-lewis-cant-hold-us_music_video_tv.jpg'),
(282, 1, 2, 'I Need Your Love', 'Calvin Harris', 'http://images.imvdb.com/video/247752190007-calvin-harris-i-need-your-love_music_video_tv.jpg'),
(283, 2, 2, 'BedRock', 'Young Money', 'http://images.imvdb.com/video/260537581988-young-money-bedrock_music_video_tv.jpg?v=4'),
(284, 3, 2, 'Bailando', 'Enrique Iglesias', 'http://images.imvdb.com/video/223849095584-enrique-iglesias-bailando_music_video_tv.jpg?v=2'),
(285, 4, 2, 'Pour It Up', 'Rihanna', 'http://images.imvdb.com/video/212831182001-rihanna-pour-it-up_music_video_tv.jpg?v=4'),
(286, 5, 2, 'My Love', 'Route 94', 'http://images.imvdb.com/video/187856376168-route-94-my-love_music_video_tv.jpg?v=6'),
(287, 6, 2, 'Girls Just Gotta Have Fun', 'Sophia Grace', 'http://images.imvdb.com/video/278460538516-sophia-grace-girls-just-gotta-have-fun_music_video_tv.jpg?v=4'),
(288, 7, 2, 'Anaconda', 'Nicki Minaj', 'http://images.imvdb.com/video/667544321684-nicki-minaj-anaconda_music_video_tv.jpg?v=3'),
(289, 8, 2, 'Break Free', 'Ariana Grande', 'http://images.imvdb.com/video/150961129331-ariana-grande-break-free_music_video_tv.jpg?v=2'),
(290, 9, 2, 'Bang Bang', 'Jessie J', 'http://images.imvdb.com/video/103835599698-jessie-j-bang-bang_music_video_tv.jpg?v=2'),
(291, 10, 2, 'Change Your Life', 'Iggy Azalea', 'http://images.imvdb.com/video/139702228015-iggy-azalea-change-your-life_music_video_tv.jpg?v=2'),
(292, 11, 2, 'Wiggle', 'Jason Derulo', 'http://images.imvdb.com/video/116870559093-jason-derulo-wiggle_music_video_tv.jpg?v=2'),
(293, 12, 2, 'Counting Stars', 'OneRepublic', 'http://images.imvdb.com/video/280097230854-onerepublic-counting-stars_music_video_tv.jpg?v=2'),
(294, 13, 2, 'En la Obscuridad', 'Belinda', 'http://images.imvdb.com/video/106509882312-belinda-en-la-obscuridad_music_video_tv.jpg'),
(295, 14, 2, 'Fancy', 'Iggy Azalea', 'http://images.imvdb.com/video/147217573781-iggy-azalea-fancy_music_video_tv.jpg?v=2'),
(296, 15, 2, 'Reload', 'Sebastian Ingrosso, Tommy Trash & John Martin', 'http://images.imvdb.com/video/752246117386-sebastian-ingrosso-tommy-trash-and-john-martin-reload_music_video_tv.jpg?v=2'),
(297, 16, 2, '#SELFIE', 'The Chainsmokers', 'http://images.imvdb.com/video/486604082052-the-chainsmokers-selfie_music_video_tv.jpg?v=2'),
(298, 17, 2, 'Summer', 'Calvin Harris', 'http://images.imvdb.com/video/932271708979-calvin-harris-summer_music_video_tv.jpg?v=2'),
(299, 18, 2, 'This Is How We Do', 'Katy Perry', 'http://images.imvdb.com/video/559029743904-katy-perry-this-is-how-we-do_music_video_tv.jpg?v=2'),
(300, 19, 2, 'All Of Me', 'John Legend', 'http://images.imvdb.com/video/159536861704-john-legend-all-of-me_music_video_tv.jpg?v=2'),
(301, 20, 2, 'Roar', 'Katy Perry', 'http://images.imvdb.com/video/254918746548-katy-perry-roar_music_video_tv.jpg?v=3'),
(302, 21, 2, 'Loud', 'Mac Miller', 'http://images.imvdb.com/video/123093996475-mac-miller-loud_music_video_tv.jpg?v=2'),
(303, 22, 2, 'Love Song', 'BIGBANG', 'http://images.imvdb.com/video/138195033531-bigbang-1-love-song_music_video_tv.jpg?v=2'),
(304, 23, 2, 'Ay Vamos', 'J Balvin', 'http://images.imvdb.com/video/217943697587-j-balvin-ay-vamos_music_video_tv.jpg?v=2'),
(305, 24, 2, 'Thinking Out Loud', 'Ed Sheeran', 'http://images.imvdb.com/video/136574138114-ed-sheeran-thinking-out-loud_music_video_tv.jpg?v=2'),
(306, 25, 2, 'Tapout', 'Rich Gang', 'http://images.imvdb.com/video/115485590176-rich-gang-tapout_music_video_tv.jpg?v=3'),
(307, 26, 2, 'Propuesta Indecente', 'Romeo Santos', 'http://images.imvdb.com/video/236289858134-romeo-santos-propuesta-indecente_music_video_tv.jpg?v=2'),
(308, 27, 2, 'Happy', 'Pharrell Williams', 'http://images.imvdb.com/video/215205598091-pharrell-williams-happy_music_video_tv.jpg?v=2'),
(309, 28, 2, 'Stay With Me', 'Sam Smith', 'http://images.imvdb.com/video/603029705495-sam-smith-stay-with-me_music_video_tv.jpg?v=2'),
(310, 29, 2, 'Gangnam Style', 'Psy', 'http://images.imvdb.com/video/111003023482-psy-gangnam-style_music_video_tv.jpg'),
(311, 30, 2, 'Animals', 'Martin Garrix', 'http://images.imvdb.com/video/139849684867-martin-garrix-animals_music_video_tv.jpg?v=2'),
(312, 31, 2, 'Eres Mía', 'Romeo Santos', 'http://images.imvdb.com/video/219921822535-romeo-santos-eres-mia_music_video_tv.jpg?v=2'),
(313, 32, 2, 'La La La (Brazil 2014)', 'Shakira', 'http://images.imvdb.com/video/879250120640-shakira-la-la-la-brazil-2014_music_video_tv.jpg?v=3'),
(314, 33, 2, '6 AM', 'J Balvin', 'http://images.imvdb.com/video/197303119008-j-balvin-6-am_music_video_tv.jpg?v=2'),
(315, 34, 2, 'Boom Clap  (Version 1)', 'Charli XCX', 'http://images.imvdb.com/video/153590234137-charli-xcx-boom-clap_music_video_tv.jpg?v=2'),
(316, 35, 2, 'C’Mon Let Me Ride', 'Skylar Grey', 'http://images.imvdb.com/video/102499619336-skylar-grey-cmon-let-me-ride_music_video_tv.jpg'),
(317, 36, 2, 'Darte un Beso', 'Prince Royce', 'http://images.imvdb.com/video/110995721579-prince-royce-darte-un-beso_music_video_tv.jpg?v=2'),
(318, 37, 2, 'Adrenalina', 'Wisin', 'http://images.imvdb.com/video/906609949195-wisin-adrenalina_music_video_tv.jpg?v=2'),
(319, 38, 2, 'Loyal', 'Chris Brown', 'http://images.imvdb.com/video/666343455209-chris-brown-loyal_music_video_tv.jpg?v=2'),
(320, 39, 2, 'West Coast', 'Lana del Rey', 'http://images.imvdb.com/video/800370230302-lana-del-rey-west-coast_music_video_tv.jpg?v=2');

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
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jukebox_songs`
--

INSERT INTO `jukebox_songs` (`id`, `imvdbtrack_id`, `imvdbartist_id`, `track_id`, `youtube_id`, `artist`, `track`, `image`, `year`, `jukebox_id`, `downvote`, `upvote`, `create_date`) VALUES
(149, 2147483647, 'mosh', 'NocBs9RkCb86', 'DDPvfi6GRJk', 'Mosh', 'McQueen', 'http://images.imvdb.com/video/267206123817-mosh-mcqueen_music_video_ov.jpg?v=2', 2013, 'kLepvQHMrv3L', 2, 10, '2014-12-05 07:21:57');

-- --------------------------------------------------------

--
-- Table structure for table `jukebox_votes`
--

DROP TABLE IF EXISTS `jukebox_votes`;
CREATE TABLE `jukebox_votes` (
`id` int(11) NOT NULL,
  `server_id` varchar(11) NOT NULL,
  `user_id` int(2) NOT NULL,
  `track_id` varchar(12) NOT NULL,
  `upvote` int(32) NOT NULL,
  `downvote` int(32) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jukebox_votes`
--

INSERT INTO `jukebox_votes` (`id`, `server_id`, `user_id`, `track_id`, `upvote`, `downvote`) VALUES
(3, 'kLepvQHMrv3', 2, 'undefined', 0, 1),
(6, 'kLepvQHMrv3', 35, 'undefined', 0, 1),
(7, 'kLepvQHMrv3', 38, 'NocBs9RkCb86', 1, 0),
(11, 'kLepvQHMrv3', 71, 'NocBs9RkCb86', 1, 0),
(19, 'kLepvQHMrv3', 21, 'NocBs9RkCb86', 1, 0),
(20, 'kLepvQHMrv3', 92, 'NocBs9RkCb86', 1, 0),
(21, 'kLepvQHMrv3', 16, 'NocBs9RkCb86', 1, 0),
(22, 'kLepvQHMrv3', 32, 'NocBs9RkCb86', 1, 0),
(24, 'kLepvQHMrv3', 74, 'NocBs9RkCb86', 1, 0),
(25, 'kLepvQHMrv3', 63, 'NocBs9RkCb86', 1, 0),
(26, 'kLepvQHMrv3', 86, 'NocBs9RkCb86', 1, 0),
(27, 'kLepvQHMrv3', 95, 'NocBs9RkCb86', 0, 1),
(32, 'kLepvQHMrv3', 5, 'NocBs9RkCb86', 1, 0),
(34, 'kLepvQHMrv3', 69, 'NocBs9RkCb86', 0, 1);

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
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `user_id` (`user_id`);

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
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=321;
--
-- AUTO_INCREMENT for table `jukebox_songs`
--
ALTER TABLE `jukebox_songs`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=150;
--
-- AUTO_INCREMENT for table `jukebox_votes`
--
ALTER TABLE `jukebox_votes`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=35;SET FOREIGN_KEY_CHECKS=1;
