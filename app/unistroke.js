/**
 * The $1 Unistroke Recognizer (JavaScript version)
 *
 *	Jacob O. Wobbrock, Ph.D.
 * 	The Information School
 *	University of Washington
 *	Seattle, WA 98195-2840
 *	wobbrock@uw.edu
 *
 *	Andrew D. Wilson, Ph.D.
 *	Microsoft Research
 *	One Microsoft Way
 *	Redmond, WA 98052
 *	awilson@microsoft.com
 *
 *	Yang Li, Ph.D.
 *	Department of Computer Science and Engineering
 * 	University of Washington
 *	Seattle, WA 98195-2840
 * 	yangli@cs.washington.edu
 *
 * The academic publication for the $1 recognizer, and what should be 
 * used to cite it, is:
 *
 *	Wobbrock, J.O., Wilson, A.D. and Li, Y. (2007). Gestures without 
 *	  libraries, toolkits or training: A $1 recognizer for user interface 
 *	  prototypes. Proceedings of the ACM Symposium on User Interface 
 *	  Software and Technology (UIST '07). Newport, Rhode Island (October 
 *	  7-10, 2007). New York: ACM Press, pp. 159-168.
 *
 * The Protractor enhancement was separately published by Yang Li and programmed 
 * here by Jacob O. Wobbrock:
 *
 *	Li, Y. (2010). Protractor: A fast and accurate gesture
 *	  recognizer. Proceedings of the ACM Conference on Human
 *	  Factors in Computing Systems (CHI '10). Atlanta, Georgia
 *	  (April 10-15, 2010). New York: ACM Press, pp. 2169-2172.
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2007-2012, Jacob O. Wobbrock, Andrew D. Wilson and Yang Li.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University of Washington nor Microsoft,
 *      nor the names of its contributors may be used to endorse or promote
 *      products derived from this software without specific prior written
 *      permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Jacob O. Wobbrock OR Andrew D. Wilson
 * OR Yang Li BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/
//
// Point class
//
function Point(x, y) // constructor
{
	this.X = x;
	this.Y = y;
}
//
// Rectangle class
//
function Rectangle(x, y, width, height) // constructor
{
	this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;
}
//
// Unistroke class: a unistroke template
//
function Unistroke(name, points) // constructor
{
	this.Name = name;
	this.Points = Resample(points, NumPoints);
	var radians = IndicativeAngle(this.Points);
	this.Points = RotateBy(this.Points, -radians);
	this.Points = ScaleTo(this.Points, SquareSize);
	this.Points = TranslateTo(this.Points, Origin);
	this.Vector = Vectorize(this.Points); // for Protractor
}
//
// Result class
//
function Result(name, score) // constructor
{
	this.Name = name;
	this.Score = score;
}
//
// DollarRecognizer class constants
//
var NumUnistrokes = 11;
var NumPoints = 64;
var SquareSize = 250.0;
var Origin = new Point(0,0);
var Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
var HalfDiagonal = 0.5 * Diagonal;
var AngleRange = Deg2Rad(45.0);
var AnglePrecision = Deg2Rad(2.0);
var Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio
//
// DollarRecognizer class
//
function DollarRecognizer() // constructor
{
	//
	// one built-in unistroke per gesture type
	//
	this.Unistrokes = new Array(NumUnistrokes);
	this.Unistrokes[0] = new Unistroke("delete video", new Array(new Point(87,142),new Point(89,145),new Point(91,148),new Point(93,151),new Point(96,155),new Point(98,157),new Point(100,160),new Point(102,162),new Point(106,167),new Point(108,169),new Point(110,171),new Point(115,177),new Point(119,183),new Point(123,189),new Point(127,193),new Point(129,196),new Point(133,200),new Point(137,206),new Point(140,209),new Point(143,212),new Point(146,215),new Point(151,220),new Point(153,222),new Point(155,223),new Point(157,225),new Point(158,223),new Point(157,218),new Point(155,211),new Point(154,208),new Point(152,200),new Point(150,189),new Point(148,179),new Point(147,170),new Point(147,158),new Point(147,148),new Point(147,141),new Point(147,136),new Point(144,135),new Point(142,137),new Point(140,139),new Point(135,145),new Point(131,152),new Point(124,163),new Point(116,177),new Point(108,191),new Point(100,206),new Point(94,217),new Point(91,222),new Point(89,225),new Point(87,226),new Point(87,224)));
	this.Unistrokes[1] = new Unistroke("seek back", new Array(new Point(127,141),new Point(124,140),new Point(120,139),new Point(118,139),new Point(116,139),new Point(111,140),new Point(109,141),new Point(104,144),new Point(100,147),new Point(96,152),new Point(93,157),new Point(90,163),new Point(87,169),new Point(85,175),new Point(83,181),new Point(82,190),new Point(82,195),new Point(83,200),new Point(84,205),new Point(88,213),new Point(91,216),new Point(96,219),new Point(103,222),new Point(108,224),new Point(111,224),new Point(120,224),new Point(133,223),new Point(142,222),new Point(152,218),new Point(160,214),new Point(167,210),new Point(173,204),new Point(178,198),new Point(179,196),new Point(182,188),new Point(182,177),new Point(178,167),new Point(170,150),new Point(163,138),new Point(152,130),new Point(143,129),new Point(140,131),new Point(129,136),new Point(126,139)));
	this.Unistrokes[2] = new Unistroke("add video", new Array(new Point(91,185),new Point(93,185),new Point(95,185),new Point(97,185),new Point(100,188),new Point(102,189),new Point(104,190),new Point(106,193),new Point(108,195),new Point(110,198),new Point(112,201),new Point(114,204),new Point(115,207),new Point(117,210),new Point(118,212),new Point(120,214),new Point(121,217),new Point(122,219),new Point(123,222),new Point(124,224),new Point(126,226),new Point(127,229),new Point(129,231),new Point(130,233),new Point(129,231),new Point(129,228),new Point(129,226),new Point(129,224),new Point(129,221),new Point(129,218),new Point(129,212),new Point(129,208),new Point(130,198),new Point(132,189),new Point(134,182),new Point(137,173),new Point(143,164),new Point(147,157),new Point(151,151),new Point(155,144),new Point(161,137),new Point(165,131),new Point(171,122),new Point(174,118),new Point(176,114),new Point(177,112),new Point(177,114),new Point(175,116),new Point(173,118)));
	this.Unistrokes[3] = new Unistroke("volume up", new Array(new Point(79,245),new Point(79,242),new Point(79,239),new Point(80,237),new Point(80,234),new Point(81,232),new Point(82,230),new Point(84,224),new Point(86,220),new Point(86,218),new Point(87,216),new Point(88,213),new Point(90,207),new Point(91,202),new Point(92,200),new Point(93,194),new Point(94,192),new Point(96,189),new Point(97,186),new Point(100,179),new Point(102,173),new Point(105,165),new Point(107,160),new Point(109,158),new Point(112,151),new Point(115,144),new Point(117,139),new Point(119,136),new Point(119,134),new Point(120,132),new Point(121,129),new Point(122,127),new Point(124,125),new Point(126,124),new Point(129,125),new Point(131,127),new Point(132,130),new Point(136,139),new Point(141,154),new Point(145,166),new Point(151,182),new Point(156,193),new Point(157,196),new Point(161,209),new Point(162,211),new Point(167,223),new Point(169,229),new Point(170,231),new Point(173,237),new Point(176,242),new Point(177,244),new Point(179,250),new Point(181,255),new Point(182,257)));
	this.Unistrokes[4] = new Unistroke("volume down", new Array(new Point(89,164),new Point(90,162),new Point(92,162),new Point(94,164),new Point(95,166),new Point(96,169),new Point(97,171),new Point(99,175),new Point(101,178),new Point(103,182),new Point(106,189),new Point(108,194),new Point(111,199),new Point(114,204),new Point(117,209),new Point(119,214),new Point(122,218),new Point(124,222),new Point(126,225),new Point(128,228),new Point(130,229),new Point(133,233),new Point(134,236),new Point(136,239),new Point(138,240),new Point(139,242),new Point(140,244),new Point(142,242),new Point(142,240),new Point(142,237),new Point(143,235),new Point(143,233),new Point(145,229),new Point(146,226),new Point(148,217),new Point(149,208),new Point(149,205),new Point(151,196),new Point(151,193),new Point(153,182),new Point(155,172),new Point(157,165),new Point(159,160),new Point(162,155),new Point(164,150),new Point(165,148),new Point(166,146)));
	this.Unistrokes[5] = new Unistroke("mute", new Array(new Point(137,139),new Point(135,141),new Point(133,144),new Point(132,146),new Point(130,149),new Point(128,151),new Point(126,155),new Point(123,160),new Point(120,166),new Point(116,171),new Point(112,177),new Point(107,183),new Point(102,188),new Point(100,191),new Point(95,195),new Point(90,199),new Point(86,203),new Point(82,206),new Point(80,209),new Point(75,213),new Point(73,213),new Point(70,216),new Point(67,219),new Point(64,221),new Point(61,223),new Point(60,225),new Point(62,226),new Point(65,225),new Point(67,226),new Point(74,226),new Point(77,227),new Point(85,229),new Point(91,230),new Point(99,231),new Point(108,232),new Point(116,233),new Point(125,233),new Point(134,234),new Point(145,233),new Point(153,232),new Point(160,233),new Point(170,234),new Point(177,235),new Point(179,236),new Point(186,237),new Point(193,238),new Point(198,239),new Point(200,237),new Point(202,239),new Point(204,238),new Point(206,234),new Point(205,230),new Point(202,222),new Point(197,216),new Point(192,207),new Point(186,198),new Point(179,189),new Point(174,183),new Point(170,178),new Point(164,171),new Point(161,168),new Point(154,160),new Point(148,155),new Point(143,150),new Point(138,148),new Point(136,148)));
	this.Unistrokes[6] = new Unistroke("playback faster", new Array(new Point(81,219),new Point(84,218),new Point(86,220),new Point(88,220),new Point(90,220),new Point(92,219),new Point(95,220),new Point(97,219),new Point(99,220),new Point(102,218),new Point(105,217),new Point(107,216),new Point(110,216),new Point(113,214),new Point(116,212),new Point(118,210),new Point(121,208),new Point(124,205),new Point(126,202),new Point(129,199),new Point(132,196),new Point(136,191),new Point(139,187),new Point(142,182),new Point(144,179),new Point(146,174),new Point(148,170),new Point(149,168),new Point(151,162),new Point(152,160),new Point(152,157),new Point(152,155),new Point(152,151),new Point(152,149),new Point(152,146),new Point(149,142),new Point(148,139),new Point(145,137),new Point(141,135),new Point(139,135),new Point(134,136),new Point(130,140),new Point(128,142),new Point(126,145),new Point(122,150),new Point(119,158),new Point(117,163),new Point(115,170),new Point(114,175),new Point(117,184),new Point(120,190),new Point(125,199),new Point(129,203),new Point(133,208),new Point(138,213),new Point(145,215),new Point(155,218),new Point(164,219),new Point(166,219),new Point(177,219),new Point(182,218),new Point(192,216),new Point(196,213),new Point(199,212),new Point(201,211)));
	this.Unistrokes[7] = new Unistroke("play pause", new Array(new Point(-116.703922719819,0),new Point(-108.87698266389691,6.7932204352748045),new Point(-101.0500426079748,13.586440870549723),new Point(-93.22310255205271,20.379661305824584),new Point(-85.3961624961306,27.17288174109939),new Point(-77.5692224402085,33.96610217637431),new Point(-69.74228238428641,40.75932261164911),new Point(-61.91258836042506,47.546112300336006),new Point(-53.866523204596916,53.827657211547944),new Point(-45.82045804876876,60.10920212275994),new Point(-37.774392892940625,66.39074703397188),new Point(-29.85861152580324,72.976515541129),new Point(-22.03167146988116,79.76973597640387),new Point(-14.204731413959081,86.56295641167867),new Point(-6.257969110313894,93.07892503851667),new Point(1.7514415665452248,99.44993415158109),new Point(9.653072135180707,106.07033125799694),new Point(17.480012191102816,112.86355169327175),new Point(25.306952247024952,119.65677212854666),new Point(33.13389230294703,126.44999256382152),new Point(32.55423359252242,118.98063833474515),new Point(28.362794241988468,107.5706380258091),new Point(24.171354891454513,96.160637716873),new Point(19.76543228172963,84.91686101866367),new Point(14.955348747637544,73.98630731238546),new Point(10.145265213545485,63.05575360610726),new Point(5.335181679453399,52.12519989982911),new Point(0.5250981453612837,41.19464619355085),new Point(-4.118128390157125,30.131529526953955),new Point(-8.483624518116471,18.847764249203408),new Point(-12.84912064607579,7.563998971452918),new Point(-17.214616774035107,-3.719766306297629),new Point(-21.55551518842745,-15.021711895853912),new Point(-25.874975804676694,-26.339502285521576),new Point(-30.274262371386016,-37.59781175285667),new Point(-34.23834276717909,-49.12152965791702),new Point(-37.37597097492883,-61.16349945845241),new Point(-40.55498323362258,-73.18574089679618),new Point(-43.50096099671026,-85.32125003146916),new Point(-45.08286394555992,-97.81414051749621),new Point(-45.16826328478237,-110.52509370585003),new Point(-41.67265210716681,-122.19490621777447),new Point(-33.92562380374787,-123.55000743617848),new Point(-25.26810039205273,-119.25463929277416),new Point(-16.742394114784673,-114.33840226818293),new Point(-8.504993466081004,-108.56891241568925),new Point(-0.6066899038176814,-101.94823157674071),new Point(7.27193479822995,-95.27654253988536),new Point(15.345500697454725,-89.06323869241385),new Point(23.246717342904134,-82.4446724043911),new Point(31.073657398826214,-75.65145196911627),new Point(38.90059745474832,-68.8582315338414),new Point(46.7275375106704,-62.065011098566515),new Point(54.55447756659251,-55.271790663291654),new Point(62.38141762251459,-48.47857022801682),new Point(70.2083576784367,-41.68534979274196),new Point(78.03529773435883,-34.8921293574671),new Point(85.86223779028091,-28.098908922192265),new Point(93.689177846203,-21.305688486917404),new Point(101.51611790212513,-14.512468051642486),new Point(109.34305795804721,-7.7192476163676815),new Point(117.20638949775082,-1.0175722832083238),new Point(125.5021132585544,4.590176046643251),new Point(133.296077280181,9.471805881363366)));
	this.Unistrokes[8] = new Unistroke("seek forward", new Array( new Point(-149.414773269335,1.1368683772161603e-13),new Point(-142.6162633290752,-8.511827399688684),new Point(-135.3743961422752,-16.379325136658707),new Point(-127.77224392937194,-23.66410824200082),new Point(-120.44077844811761,-31.402983326465375),new Point(-112.93039719247298,-38.8393745261921),new Point(-105.59893171121868,-46.578249610656655),new Point(-97.80447687869975,-53.45460126352987),new Point(-89.70106351000405,-59.76315324772466),new Point(-81.717689546255,-66.32615570481809),new Point(-73.73431558250599,-72.88915816191155),new Point(-65.66594964222742,-79.27200104032224),new Point(-57.46624110198616,-85.35781076506771),new Point(-48.9845036134156,-90.76624704170993),new Point(-40.395874998434806,-95.87655585126655),new Point(-31.74557109990326,-100.81484761240887),new Point(-22.872877543093523,-105.01080704825017),new Point(-13.693430145645152,-107.92541313340678),new Point(-4.545442500535273,-110.99713927419214),new Point(4.565977271337317,-114.25149705859191),new Point(13.928327996626876,-115.77867027960966),new Point(23.244283419520627,-117.8383100880686),new Point(32.59911771276927,-118.89570739738994),new Point(42.02735580581816,-118.06085817057206),new Point(51.455593898866994,-117.22600894375418),new Point(60.88383199191588,-116.39115971693631),new Point(69.08731760662619,-110.82713614757552),new Point(76.32181323823158,-103.00104659070604),new Point(82.44684612555659,-93.6923144588647),new Point(87.3425094312845,-83.22153445885303),new Point(91.82629871727988,-72.4260306816416),new Point(95.82471554399757,-61.33669144953927),new Point(98.066928251072,-49.446852061212184),new Point(99.5889756419673,-37.34768482357015),new Point(100.585226730665,-25.171685524616237),new Point(100.53642055982817,-12.918756632279099),new Point(100.2560007676758,-0.6591986077208105),new Point(99.64201198146105,11.579172828561951),new Point(98.99876031282798,23.815685636936905),new Point(96.39512735755324,35.56127061233889),new Point(92.1751872635449,46.46618342153846),new Point(86.73556542208371,56.458909251612624),new Point(80.9595216868932,66.16396699521079),new Point(74.82438138408833,75.38620522924452),new Point(67.44664459016127,83.04904933417544),new Point(59.6825914035706,90.04123056309385),new Point(51.333582457012085,95.68472070339726),new Point(42.75609251428284,100.82622799287168),new Point(34.303429970787704,106.31080115257618),new Point(25.33286173222956,110.12793152550853),new Point(16.262994493691224,113.56591263569845),new Point(7.148472179341411,116.804705852263),new Point(-2.0358354838507466,119.69340594233455),new Point(-11.29485372751708,122.12109855832563),new Point(-20.59759964858057,124.27896612442044),new Point(-29.94930981016455,126.03827963014447),new Point(-39.33837613824295,127.38343832741509),new Point(-48.75941540511457,128.33567655352607),new Point(-58.2031882624147,128.78639115168545),new Point(-67.51205210182542,130.4780640724066),new Point(-76.94900321969482,131.10429260261003),new Point(-86.39242639706947,131.01157253875652),new Point(-95.82459545272545,131.03517199289553),new Point(-105.25288962879412,130.21257024822984)));
	this.Unistrokes[9] = new Unistroke("change size", new Array(new Point(78,149),new Point(78,153),new Point(78,157),new Point(78,160),new Point(79,162),new Point(79,164),new Point(79,167),new Point(79,169),new Point(79,173),new Point(79,178),new Point(79,183),new Point(80,189),new Point(80,193),new Point(80,198),new Point(80,202),new Point(81,208),new Point(81,210),new Point(81,216),new Point(82,222),new Point(82,224),new Point(82,227),new Point(83,229),new Point(83,231),new Point(85,230),new Point(88,232),new Point(90,233),new Point(92,232),new Point(94,233),new Point(99,232),new Point(102,233),new Point(106,233),new Point(109,234),new Point(117,235),new Point(123,236),new Point(126,236),new Point(135,237),new Point(142,238),new Point(145,238),new Point(152,238),new Point(154,239),new Point(165,238),new Point(174,237),new Point(179,236),new Point(186,235),new Point(191,235),new Point(195,233),new Point(197,233),new Point(200,233),new Point(201,235),new Point(201,233),new Point(199,231),new Point(198,226),new Point(198,220),new Point(196,207),new Point(195,195),new Point(195,181),new Point(195,173),new Point(195,163),new Point(194,155),new Point(192,145),new Point(192,143),new Point(192,138),new Point(191,135),new Point(191,133),new Point(191,130),new Point(190,128),new Point(188,129),new Point(186,129),new Point(181,132),new Point(173,131),new Point(162,131),new Point(151,132),new Point(149,132),new Point(138,132),new Point(136,132),new Point(122,131),new Point(120,131),new Point(109,130),new Point(107,130),new Point(90,132),new Point(81,133),new Point(76,133)));
	this.Unistrokes[10] = new Unistroke("playback slower",new Array(new Point(-116.9918995210348,0),new Point(-109.62316431039072,-5.959281954187418),new Point(-102.25442909974664,-11.918563908374722),new Point(-94.88569388910255,-17.87784586256214),new Point(-87.51695867845847,-23.837127816749557),new Point(-80.1482234678144,-29.796409770936975),new Point(-72.43443855713153,-31.715006102471875),new Point(-64.66866195521618,-31.567668397328134),new Point(-56.924157045224604,-29.878473951106002),new Point(-49.27317679501925,-26.46462936451212),new Point(-41.622196544813875,-23.05078477791824),new Point(-33.971216294608496,-19.636940191324356),new Point(-26.52027837733229,-14.444205116232297),new Point(-19.16921450793663,-8.363333059226761),new Point(-12.022008897418573,-1.0855044297120457),new Point(-4.953634927387213,6.655185261806082),new Point(1.8378688791504487,15.653894656034936),new Point(8.55533753894619,24.988998814217894),new Point(15.05172393603172,35.14539094854808),new Point(21.110419894932733,46.743375743898014),new Point(26.64298305246959,59.64746029779678),new Point(31.628250008936988,73.77922479691097),new Point(34.67112587933789,90.61391014439278),new Point(33.90545403388833,107.48252216830804),new Point(27.845632550403963,118.17227597982537),new Point(20.919399977788316,126.37376163387398),new Point(13.55066476714424,132.3330435880614),new Point(6.181929556500137,138.29232554224882),new Point(-1.2003247120765081,144.0211660870117),new Point(-8.9088662520914,141.9888774285505),new Point(-16.555731962518053,138.77077151723927),new Point(-23.88587240388236,133.3072118523104),new Point(-31.1858540269383,126.92712828756157),new Point(-37.7402112967342,117.09823262042642),new Point(-43.26980445350145,104.20443721203401),new Point(-46.33521218631273,87.47283540538035),new Point(-46.15752643654619,69.56741693799893),new Point(-43.260350875577785,52.43636753451369),new Point(-39.63607600167765,36.101945774545015),new Point(-35.78203131421523,20.05497172271646),new Point(-31.502181135624596,4.635737003172721),new Point(-26.905998406031216,-10.271133370605753),new Point(-21.946063597454582,-24.465895043587125),new Point(-16.388660595670217,-37.373777500031),new Point(-10.24646726448995,-48.643664565206905),new Point(-3.558922690279786,-58.0425718583524),new Point(3.3957346213666995,-66.32357034345364),new Point(10.599012174507436,-73.32946689166425),new Point(17.8022897276482,-80.33536343987475),new Point(25.160461621898975,-86.36146442961092),new Point(32.56405633597558,-92.04377352880186),new Point(40.10374615641203,-96.64475195922807),new Point(47.75544830095345,-99.41862809826756),new Point(55.535225924649296,-100.10338588981108),new Point(63.31696828877273,-100.5757079882573),new Point(71.10191906251043,-100.70112384372118),new Point(78.86755535751757,-100.11333222052599),new Point(86.60820583907298,-98.44952008157298),new Point(94.39220927953903,-98.13529507074992),new Point(102.17364004043651,-98.42925133819591),new Point(109.94651754126107,-99.45954187719485),new Point(117.72502083925133,-100.18280036763724),new Point(125.48860681399316,-101.48984063739749),new Point(133.00810047896522,-105.9788339129883)));
	//
	// The $1 Gesture Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), and DeleteUserGestures()
	//
	this.Recognize = function(points, useProtractor)
	{
		points = Resample(points, NumPoints);
		var radians = IndicativeAngle(points);
		points = RotateBy(points, -radians);
		points = ScaleTo(points, SquareSize);
		points = TranslateTo(points, Origin);
		var vector = Vectorize(points); // for Protractor

		var b = +Infinity;
		var u = -1;
		for (var i = 0; i < this.Unistrokes.length; i++) // for each unistroke
		{
			var d;
			if (useProtractor) // for Protractor
				d = OptimalCosineDistance(this.Unistrokes[i].Vector, vector);
			else // Golden Section Search (original $1)
				d = DistanceAtBestAngle(points, this.Unistrokes[i], -AngleRange, +AngleRange, AnglePrecision);
			if (d < b) {
				b = d; // best (least) distance
				u = i; // unistroke
			}
		}
		return (u == -1) ? new Result("Could not recognize gesture. Please try again.", 0.0) : new Result(this.Unistrokes[u].Name, useProtractor ? 1.0 / b : 1.0 - b / HalfDiagonal);
	};
	this.AddGesture = function(name, points)
	{
		this.Unistrokes[this.Unistrokes.length] = new Unistroke(name, points); // append new unistroke
		var num = 0;
		for (var i = 0; i < this.Unistrokes.length; i++) {
			if (this.Unistrokes[i].Name == name)
				num++;
		}
		console.log(this.Unistrokes[12]);

		return num;
	}
	this.DeleteUserGestures = function()
	{
		this.Unistrokes.length = NumUnistrokes; // clear any beyond the original set
		return NumUnistrokes;
	}
}
//
// Private helper functions from this point down
//
function Resample(points, n)
{
	var I = PathLength(points) / (n - 1); // interval length
	var D = 0.0;
	var newpoints = new Array(points[0]);
	for (var i = 1; i < points.length; i++)
	{
		var d = Distance(points[i - 1], points[i]);
		if ((D + d) >= I)
		{
			var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
			var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
			var q = new Point(qx, qy);
			newpoints[newpoints.length] = q; // append new point 'q'
			points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
			D = 0.0;
		}
		else D += d;
	}
	if (newpoints.length == n - 1) // somtimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y);
	return newpoints;
}
function IndicativeAngle(points)
{
	var c = Centroid(points);
	return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
}
function RotateBy(points, radians) // rotates points around centroid
{
	var c = Centroid(points);
	var cos = Math.cos(radians);
	var sin = Math.sin(radians);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X
		var qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function ScaleTo(points, size) // non-uniform scale; assumes 2D gestures (i.e., no lines)
{
	var B = BoundingBox(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X * (size / B.Width);
		var qy = points[i].Y * (size / B.Height);
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function TranslateTo(points, pt) // translates points' centroid
{
	var c = Centroid(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X + pt.X - c.X;
		var qy = points[i].Y + pt.Y - c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function Vectorize(points) // for Protractor
{
	var sum = 0.0;
	var vector = new Array();
	for (var i = 0; i < points.length; i++) {
		vector[vector.length] = points[i].X;
		vector[vector.length] = points[i].Y;
		sum += points[i].X * points[i].X + points[i].Y * points[i].Y;
	}
	var magnitude = Math.sqrt(sum);
	for (var i = 0; i < vector.length; i++)
		vector[i] /= magnitude;
	return vector;
}
function OptimalCosineDistance(v1, v2) // for Protractor
{
	var a = 0.0;
	var b = 0.0;
	for (var i = 0; i < v1.length; i += 2) {
		a += v1[i] * v2[i] + v1[i + 1] * v2[i + 1];
                b += v1[i] * v2[i + 1] - v1[i + 1] * v2[i];
	}
	var angle = Math.atan(b / a);
	return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
}
function DistanceAtBestAngle(points, T, a, b, threshold)
{
	var x1 = Phi * a + (1.0 - Phi) * b;
	var f1 = DistanceAtAngle(points, T, x1);
	var x2 = (1.0 - Phi) * a + Phi * b;
	var f2 = DistanceAtAngle(points, T, x2);
	while (Math.abs(b - a) > threshold)
	{
		if (f1 < f2) {
			b = x2;
			x2 = x1;
			f2 = f1;
			x1 = Phi * a + (1.0 - Phi) * b;
			f1 = DistanceAtAngle(points, T, x1);
		} else {
			a = x1;
			x1 = x2;
			f1 = f2;
			x2 = (1.0 - Phi) * a + Phi * b;
			f2 = DistanceAtAngle(points, T, x2);
		}
	}
	return Math.min(f1, f2);
}
function DistanceAtAngle(points, T, radians)
{
	var newpoints = RotateBy(points, radians);
	return PathDistance(newpoints, T.Points);
}
function Centroid(points)
{
	var x = 0.0, y = 0.0;
	for (var i = 0; i < points.length; i++) {
		x += points[i].X;
		y += points[i].Y;
	}
	x /= points.length;
	y /= points.length;
	return new Point(x, y);
}
function BoundingBox(points)
{
	var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}
	return new Rectangle(minX, minY, maxX - minX, maxY - minY);
}
function PathDistance(pts1, pts2)
{
	var d = 0.0;
	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
		d += Distance(pts1[i], pts2[i]);
	return d / pts1.length;
}
function PathLength(points)
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++)
		d += Distance(points[i - 1], points[i]);
	return d;
}
function Distance(p1, p2)
{
	var dx = p2.X - p1.X;
	var dy = p2.Y - p1.Y;
	return Math.sqrt(dx * dx + dy * dy);
}
function Deg2Rad(d) { return (d * Math.PI / 180.0); }