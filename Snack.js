import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const players = [
  {
    "rank": 1,
    "position": "RB",
    "positionRank": 1,
    "name": "Jahmyr Gibbs",
    "team": "DET",
    "value": 57,
    "bye": 6
  },
  {
    "rank": 2,
    "position": "RB",
    "positionRank": 2,
    "name": "Bijan Robinson",
    "team": "ATL",
    "value": 56,
    "bye": 11
  },
  {
    "rank": 3,
    "position": "WR",
    "positionRank": 1,
    "name": "Puka Nacua",
    "team": "LAR",
    "value": 56,
    "bye": 11
  },
  {
    "rank": 4,
    "position": "WR",
    "positionRank": 2,
    "name": "Ja'Marr Chase",
    "team": "CIN",
    "value": 55,
    "bye": 6
  },
  {
    "rank": 5,
    "position": "WR",
    "positionRank": 3,
    "name": "Jaxon Smith-Njigba",
    "team": "SEA",
    "value": 54,
    "bye": 11
  },
  {
    "rank": 6,
    "position": "RB",
    "positionRank": 3,
    "name": "Christian McCaffrey",
    "team": "SF",
    "value": 53,
    "bye": 8
  },
  {
    "rank": 7,
    "position": "RB",
    "positionRank": 4,
    "name": "Jonathan Taylor",
    "team": "IND",
    "value": 52,
    "bye": 13
  },
  {
    "rank": 8,
    "position": "WR",
    "positionRank": 4,
    "name": "Amon-Ra St. Brown",
    "team": "DET",
    "value": 52,
    "bye": 6
  },
  {
    "rank": 9,
    "position": "WR",
    "positionRank": 5,
    "name": "CeeDee Lamb",
    "team": "DAL",
    "value": 51,
    "bye": 14
  },
  {
    "rank": 10,
    "position": "RB",
    "positionRank": 5,
    "name": "De'Von Achane",
    "team": "MIA",
    "value": 50,
    "bye": 6
  },
  {
    "rank": 11,
    "position": "WR",
    "positionRank": 6,
    "name": "Justin Jefferson",
    "team": "MIN",
    "value": 48,
    "bye": 6
  },
  {
    "rank": 12,
    "position": "RB",
    "positionRank": 6,
    "name": "Jeremiyah Love",
    "team": "ARI",
    "value": 46,
    "bye": 14
  },
  {
    "rank": 13,
    "position": "WR",
    "positionRank": 7,
    "name": "Drake London",
    "team": "ATL",
    "value": 45,
    "bye": 11
  },
  {
    "rank": 14,
    "position": "WR",
    "positionRank": 8,
    "name": "Rashee Rice",
    "team": "KC",
    "value": 43,
    "bye": 5
  },
  {
    "rank": 15,
    "position": "RB",
    "positionRank": 7,
    "name": "James Cook III",
    "team": "BUF",
    "value": 42,
    "bye": 7
  },
  {
    "rank": 16,
    "position": "TE",
    "positionRank": 1,
    "name": "Trey McBride",
    "team": "ARI",
    "value": 40,
    "bye": 14
  },
  {
    "rank": 17,
    "position": "RB",
    "positionRank": 8,
    "name": "Ashton Jeanty",
    "team": "LV",
    "value": 38,
    "bye": 13
  },
  {
    "rank": 18,
    "position": "RB",
    "positionRank": 9,
    "name": "Omarion Hampton",
    "team": "LAC",
    "value": 37,
    "bye": 7
  },
  {
    "rank": 19,
    "position": "RB",
    "positionRank": 10,
    "name": "Saquon Barkley",
    "team": "PHI",
    "value": 36,
    "bye": 10
  },
  {
    "rank": 20,
    "position": "RB",
    "positionRank": 11,
    "name": "Derrick Henry",
    "team": "BAL",
    "value": 35,
    "bye": 13
  },
  {
    "rank": 21,
    "position": "RB",
    "positionRank": 12,
    "name": "Josh Jacobs",
    "team": "GB",
    "value": 34,
    "bye": 11
  },
  {
    "rank": 22,
    "position": "RB",
    "positionRank": 13,
    "name": "Chase Brown",
    "team": "CIN",
    "value": 33,
    "bye": 6
  },
  {
    "rank": 23,
    "position": "RB",
    "positionRank": 14,
    "name": "Breece Hall",
    "team": "NYJ",
    "value": 32,
    "bye": 13
  },
  {
    "rank": 24,
    "position": "TE",
    "positionRank": 2,
    "name": "Brock Bowers",
    "team": "LV",
    "value": 32,
    "bye": 13
  },
  {
    "rank": 25,
    "position": "WR",
    "positionRank": 9,
    "name": "Nico Collins",
    "team": "HOU",
    "value": 31,
    "bye": 8
  },
  {
    "rank": 26,
    "position": "WR",
    "positionRank": 10,
    "name": "Garrett Wilson",
    "team": "NYJ",
    "value": 30,
    "bye": 13
  },
  {
    "rank": 27,
    "position": "WR",
    "positionRank": 11,
    "name": "A.J. Brown",
    "team": "NE",
    "value": 30,
    "bye": 11
  },
  {
    "rank": 28,
    "position": "WR",
    "positionRank": 12,
    "name": "Chris Olave",
    "team": "NO",
    "value": 29,
    "bye": 8
  },
  {
    "rank": 29,
    "position": "WR",
    "positionRank": 13,
    "name": "George Pickens",
    "team": "DAL",
    "value": 28,
    "bye": 14
  },
  {
    "rank": 30,
    "position": "RB",
    "positionRank": 15,
    "name": "Kenneth Walker III",
    "team": "KC",
    "value": 27,
    "bye": 5
  },
  {
    "rank": 31,
    "position": "RB",
    "positionRank": 16,
    "name": "Javonte Williams",
    "team": "DAL",
    "value": 26,
    "bye": 14
  },
  {
    "rank": 32,
    "position": "WR",
    "positionRank": 14,
    "name": "Tetairoa McMillan",
    "team": "CAR",
    "value": 25,
    "bye": 5
  },
  {
    "rank": 33,
    "position": "WR",
    "positionRank": 15,
    "name": "Zay Flowers",
    "team": "BAL",
    "value": 24,
    "bye": 13
  },
  {
    "rank": 34,
    "position": "WR",
    "positionRank": 16,
    "name": "DeVonta Smith",
    "team": "PHI",
    "value": 23,
    "bye": 10
  },
  {
    "rank": 35,
    "position": "WR",
    "positionRank": 17,
    "name": "Emeka Egbuka",
    "team": "TB",
    "value": 22,
    "bye": 10
  },
  {
    "rank": 36,
    "position": "QB",
    "positionRank": 1,
    "name": "Josh Allen",
    "team": "BUF",
    "value": 22,
    "bye": 7
  },
  {
    "rank": 37,
    "position": "RB",
    "positionRank": 17,
    "name": "Kyren Williams",
    "team": "LAR",
    "value": 22,
    "bye": 11
  },
  {
    "rank": 38,
    "position": "RB",
    "positionRank": 18,
    "name": "Travis Etienne Jr.",
    "team": "NO",
    "value": 21,
    "bye": 8
  },
  {
    "rank": 39,
    "position": "RB",
    "positionRank": 19,
    "name": "Cam Skattebo",
    "team": "NYG",
    "value": 21,
    "bye": 8
  },
  {
    "rank": 40,
    "position": "RB",
    "positionRank": 20,
    "name": "Quinshon Judkins",
    "team": "CLE",
    "value": 20,
    "bye": 11
  },
  {
    "rank": 41,
    "position": "RB",
    "positionRank": 21,
    "name": "Bucky Irving",
    "team": "TB",
    "value": 19,
    "bye": 10
  },
  {
    "rank": 42,
    "position": "WR",
    "positionRank": 18,
    "name": "Malik Nabers",
    "team": "NYG",
    "value": 19,
    "bye": 8
  },
  {
    "rank": 43,
    "position": "WR",
    "positionRank": 19,
    "name": "Davante Adams",
    "team": "LAR",
    "value": 18,
    "bye": 11
  },
  {
    "rank": 44,
    "position": "WR",
    "positionRank": 20,
    "name": "Ladd McConkey",
    "team": "LAC",
    "value": 17,
    "bye": 7
  },
  {
    "rank": 45,
    "position": "WR",
    "positionRank": 21,
    "name": "Terry McLaurin",
    "team": "WAS",
    "value": 17,
    "bye": 7
  },
  {
    "rank": 46,
    "position": "WR",
    "positionRank": 22,
    "name": "Tee Higgins",
    "team": "CIN",
    "value": 15,
    "bye": 6
  },
  {
    "rank": 47,
    "position": "WR",
    "positionRank": 23,
    "name": "Jaylen Waddle",
    "team": "DEN",
    "value": 15,
    "bye": 10
  },
  {
    "rank": 48,
    "position": "WR",
    "positionRank": 24,
    "name": "Jameson Williams",
    "team": "DET",
    "value": 14,
    "bye": 6
  },
  {
    "rank": 49,
    "position": "TE",
    "positionRank": 3,
    "name": "Colston Loveland",
    "team": "CHI",
    "value": 13,
    "bye": 10
  },
  {
    "rank": 50,
    "position": "TE",
    "positionRank": 4,
    "name": "Tyler Warren",
    "team": "IND",
    "value": 13,
    "bye": 13
  },
  {
    "rank": 51,
    "position": "WR",
    "positionRank": 25,
    "name": "Carnell Tate",
    "team": "TEN",
    "value": 12,
    "bye": 9
  },
  {
    "rank": 52,
    "position": "WR",
    "positionRank": 26,
    "name": "Rome Odunze",
    "team": "CHI",
    "value": 11,
    "bye": 10
  },
  {
    "rank": 53,
    "position": "WR",
    "positionRank": 27,
    "name": "Luther Burden III",
    "team": "CHI",
    "value": 11,
    "bye": 10
  },
  {
    "rank": 54,
    "position": "WR",
    "positionRank": 28,
    "name": "DJ Moore",
    "team": "BUF",
    "value": 10,
    "bye": 7
  },
  {
    "rank": 55,
    "position": "QB",
    "positionRank": 2,
    "name": "Jayden Daniels",
    "team": "WAS",
    "value": 10,
    "bye": 7
  },
  {
    "rank": 56,
    "position": "QB",
    "positionRank": 3,
    "name": "Lamar Jackson",
    "team": "BAL",
    "value": 10,
    "bye": 13
  },
  {
    "rank": 57,
    "position": "QB",
    "positionRank": 4,
    "name": "Drake Maye",
    "team": "NE",
    "value": 10,
    "bye": 11
  },
  {
    "rank": 58,
    "position": "QB",
    "positionRank": 5,
    "name": "Jalen Hurts",
    "team": "PHI",
    "value": 9,
    "bye": 10
  },
  {
    "rank": 59,
    "position": "RB",
    "positionRank": 22,
    "name": "TreVeyon Henderson",
    "team": "NE",
    "value": 9,
    "bye": 11
  },
  {
    "rank": 60,
    "position": "RB",
    "positionRank": 23,
    "name": "Bhayshul Tuten",
    "team": "JAC",
    "value": 9,
    "bye": 7
  },
  {
    "rank": 61,
    "position": "RB",
    "positionRank": 24,
    "name": "Jadarian Price",
    "team": "SEA",
    "value": 8,
    "bye": 11
  },
  {
    "rank": 62,
    "position": "RB",
    "positionRank": 25,
    "name": "D'Andre Swift",
    "team": "CHI",
    "value": 8,
    "bye": 10
  },
  {
    "rank": 63,
    "position": "RB",
    "positionRank": 26,
    "name": "David Montgomery",
    "team": "HOU",
    "value": 8,
    "bye": 8
  },
  {
    "rank": 64,
    "position": "RB",
    "positionRank": 27,
    "name": "Tony Pollard",
    "team": "TEN",
    "value": 7,
    "bye": 9
  },
  {
    "rank": 65,
    "position": "WR",
    "positionRank": 29,
    "name": "Marvin Harrison Jr.",
    "team": "ARI",
    "value": 7,
    "bye": 14
  },
  {
    "rank": 66,
    "position": "WR",
    "positionRank": 30,
    "name": "Courtland Sutton",
    "team": "DEN",
    "value": 7,
    "bye": 10
  },
  {
    "rank": 67,
    "position": "WR",
    "positionRank": 31,
    "name": "Michael Pittman Jr.",
    "team": "PIT",
    "value": 7,
    "bye": 9
  },
  {
    "rank": 68,
    "position": "WR",
    "positionRank": 32,
    "name": "DK Metcalf",
    "team": "PIT",
    "value": 6,
    "bye": 9
  },
  {
    "rank": 69,
    "position": "WR",
    "positionRank": 33,
    "name": "Alec Pierce",
    "team": "IND",
    "value": 6,
    "bye": 13
  },
  {
    "rank": 70,
    "position": "WR",
    "positionRank": 34,
    "name": "Jordyn Tyson",
    "team": "NO",
    "value": 6,
    "bye": 8
  },
  {
    "rank": 71,
    "position": "TE",
    "positionRank": 5,
    "name": "Kyle Pitts Sr.",
    "team": "ATL",
    "value": 6,
    "bye": 11
  },
  {
    "rank": 72,
    "position": "TE",
    "positionRank": 6,
    "name": "Harold Fannin Jr.",
    "team": "CLE",
    "value": 6,
    "bye": 11
  },
  {
    "rank": 73,
    "position": "TE",
    "positionRank": 7,
    "name": "Sam LaPorta",
    "team": "DET",
    "value": 6,
    "bye": 6
  },
  {
    "rank": 74,
    "position": "QB",
    "positionRank": 6,
    "name": "Joe Burrow",
    "team": "CIN",
    "value": 5,
    "bye": 6
  },
  {
    "rank": 75,
    "position": "QB",
    "positionRank": 7,
    "name": "Jaxson Dart",
    "team": "NYG",
    "value": 5,
    "bye": 8
  },
  {
    "rank": 76,
    "position": "WR",
    "positionRank": 35,
    "name": "Parker Washington",
    "team": "JAC",
    "value": 5,
    "bye": 7
  },
  {
    "rank": 77,
    "position": "WR",
    "positionRank": 36,
    "name": "Christian Watson",
    "team": "GB",
    "value": 5,
    "bye": 11
  },
  {
    "rank": 78,
    "position": "WR",
    "positionRank": 37,
    "name": "Matthew Golden",
    "team": "GB",
    "value": 4,
    "bye": 11
  },
  {
    "rank": 79,
    "position": "WR",
    "positionRank": 38,
    "name": "Mike Evans",
    "team": "SF",
    "value": 4,
    "bye": 8
  },
  {
    "rank": 80,
    "position": "WR",
    "positionRank": 39,
    "name": "Brian Thomas Jr.",
    "team": "JAC",
    "value": 4,
    "bye": 7
  },
  {
    "rank": 81,
    "position": "WR",
    "positionRank": 40,
    "name": "Jakobi Meyers",
    "team": "JAC",
    "value": 4,
    "bye": 7
  },
  {
    "rank": 82,
    "position": "QB",
    "positionRank": 8,
    "name": "Trevor Lawrence",
    "team": "JAC",
    "value": 4,
    "bye": 7
  },
  {
    "rank": 83,
    "position": "QB",
    "positionRank": 9,
    "name": "Dak Prescott",
    "team": "DAL",
    "value": 4,
    "bye": 14
  },
  {
    "rank": 84,
    "position": "QB",
    "positionRank": 10,
    "name": "Bo Nix",
    "team": "DEN",
    "value": 4,
    "bye": 10
  },
  {
    "rank": 85,
    "position": "QB",
    "positionRank": 11,
    "name": "Brock Purdy",
    "team": "SF",
    "value": 4,
    "bye": 8
  },
  {
    "rank": 86,
    "position": "QB",
    "positionRank": 12,
    "name": "Matthew Stafford",
    "team": "LAR",
    "value": 4,
    "bye": 11
  },
  {
    "rank": 87,
    "position": "QB",
    "positionRank": 13,
    "name": "Caleb Williams",
    "team": "CHI",
    "value": 3,
    "bye": 10
  },
  {
    "rank": 88,
    "position": "WR",
    "positionRank": 41,
    "name": "Wan'Dale Robinson",
    "team": "TEN",
    "value": 3,
    "bye": 9
  },
  {
    "rank": 89,
    "position": "WR",
    "positionRank": 42,
    "name": "Makai Lemon",
    "team": "PHI",
    "value": 3,
    "bye": 10
  },
  {
    "rank": 90,
    "position": "WR",
    "positionRank": 43,
    "name": "Michael Wilson",
    "team": "ARI",
    "value": 3,
    "bye": 14
  },
  {
    "rank": 91,
    "position": "WR",
    "positionRank": 44,
    "name": "Ricky Pearsall",
    "team": "SF",
    "value": 3,
    "bye": 8
  },
  {
    "rank": 92,
    "position": "WR",
    "positionRank": 45,
    "name": "Jordan Addison",
    "team": "MIN",
    "value": 3,
    "bye": 6
  },
  {
    "rank": 93,
    "position": "QB",
    "positionRank": 14,
    "name": "Justin Herbert",
    "team": "LAC",
    "value": 3,
    "bye": 7
  },
  {
    "rank": 94,
    "position": "QB",
    "positionRank": 15,
    "name": "Patrick Mahomes",
    "team": "KC",
    "value": 3,
    "bye": 5
  },
  {
    "rank": 95,
    "position": "RB",
    "positionRank": 28,
    "name": "Jaylen Warren",
    "team": "PIT",
    "value": 3,
    "bye": 9
  },
  {
    "rank": 96,
    "position": "RB",
    "positionRank": 29,
    "name": "Rhamondre Stevenson",
    "team": "NE",
    "value": 2,
    "bye": 11
  },
  {
    "rank": 97,
    "position": "RB",
    "positionRank": 30,
    "name": "Rico Dowdle",
    "team": "PIT",
    "value": 2,
    "bye": 9
  },
  {
    "rank": 98,
    "position": "RB",
    "positionRank": 31,
    "name": "Chuba Hubbard",
    "team": "CAR",
    "value": 2,
    "bye": 5
  },
  {
    "rank": 99,
    "position": "RB",
    "positionRank": 32,
    "name": "Aaron Jones Sr.",
    "team": "MIN",
    "value": 2,
    "bye": 6
  },
  {
    "rank": 100,
    "position": "RB",
    "positionRank": 33,
    "name": "Kenny Gainwell",
    "team": "TB",
    "value": 2,
    "bye": 10
  },
  {
    "rank": 101,
    "position": "TE",
    "positionRank": 8,
    "name": "George Kittle",
    "team": "SF",
    "value": 2,
    "bye": 8
  },
  {
    "rank": 102,
    "position": "TE",
    "positionRank": 9,
    "name": "Dallas Goedert",
    "team": "PHI",
    "value": 2,
    "bye": 10
  },
  {
    "rank": 103,
    "position": "TE",
    "positionRank": 10,
    "name": "Travis Kelce",
    "team": "KC",
    "value": 2,
    "bye": 5
  },
  {
    "rank": 104,
    "position": "TE",
    "positionRank": 11,
    "name": "Jake Ferguson",
    "team": "DAL",
    "value": 2,
    "bye": 14
  },
  {
    "rank": 105,
    "position": "RB",
    "positionRank": 34,
    "name": "Rachaad White",
    "team": "WAS",
    "value": 2,
    "bye": 7
  },
  {
    "rank": 106,
    "position": "RB",
    "positionRank": 35,
    "name": "J.K. Dobbins",
    "team": "DEN",
    "value": 2,
    "bye": 10
  },
  {
    "rank": 107,
    "position": "RB",
    "positionRank": 36,
    "name": "RJ Harvey",
    "team": "DEN",
    "value": 2,
    "bye": 10
  },
  {
    "rank": 108,
    "position": "RB",
    "positionRank": 37,
    "name": "Kyle Monangai",
    "team": "CHI",
    "value": 2,
    "bye": 10
  },
  {
    "rank": 109,
    "position": "TE",
    "positionRank": 12,
    "name": "Mark Andrews",
    "team": "BAL",
    "value": 2,
    "bye": 13
  },
  {
    "rank": 110,
    "position": "TE",
    "positionRank": 13,
    "name": "Tucker Kraft",
    "team": "GB",
    "value": 2,
    "bye": 11
  },
  {
    "rank": 111,
    "position": "TE",
    "positionRank": 14,
    "name": "T.J. Hockenson",
    "team": "MIN",
    "value": 2,
    "bye": 6
  },
  {
    "rank": 112,
    "position": "WR",
    "positionRank": 46,
    "name": "Khalil Shakir",
    "team": "BUF",
    "value": 2,
    "bye": 7
  },
  {
    "rank": 113,
    "position": "WR",
    "positionRank": 47,
    "name": "Jayden Reed",
    "team": "GB",
    "value": 2,
    "bye": 11
  },
  {
    "rank": 114,
    "position": "WR",
    "positionRank": 48,
    "name": "Josh Downs",
    "team": "IND",
    "value": 2,
    "bye": 13
  },
  {
    "rank": 115,
    "position": "RB",
    "positionRank": 38,
    "name": "Jonathon Brooks",
    "team": "CAR",
    "value": 2,
    "bye": 5
  },
  {
    "rank": 116,
    "position": "TE",
    "positionRank": 15,
    "name": "Kenyon Sadiq",
    "team": "NYJ",
    "value": 2,
    "bye": 13
  },
  {
    "rank": 117,
    "position": "TE",
    "positionRank": 16,
    "name": "Isaiah Likely",
    "team": "NYG",
    "value": 2,
    "bye": 8
  },
  {
    "rank": 118,
    "position": "TE",
    "positionRank": 17,
    "name": "Dalton Kincaid",
    "team": "BUF",
    "value": 2,
    "bye": 7
  },
  {
    "rank": 119,
    "position": "TE",
    "positionRank": 18,
    "name": "Hunter Henry",
    "team": "NE",
    "value": 2,
    "bye": 11
  },
  {
    "rank": 120,
    "position": "RB",
    "positionRank": 39,
    "name": "Jacory Croskey-Merritt",
    "team": "WAS",
    "value": 2,
    "bye": 7
  },
  {
    "rank": 121,
    "position": "RB",
    "positionRank": 40,
    "name": "Blake Corum",
    "team": "LAR",
    "value": 1,
    "bye": 11
  },
  {
    "rank": 122,
    "position": "RB",
    "positionRank": 41,
    "name": "Woody Marks",
    "team": "HOU",
    "value": 1,
    "bye": 8
  },
  {
    "rank": 123,
    "position": "RB",
    "positionRank": 42,
    "name": "Jordan Mason",
    "team": "MIN",
    "value": 1,
    "bye": 6
  },
  {
    "rank": 124,
    "position": "WR",
    "positionRank": 49,
    "name": "KC Concepcion",
    "team": "CLE",
    "value": 1,
    "bye": 11
  },
  {
    "rank": 125,
    "position": "WR",
    "positionRank": 50,
    "name": "Chris Godwin Jr.",
    "team": "TB",
    "value": 1,
    "bye": 10
  },
  {
    "rank": 126,
    "position": "WR",
    "positionRank": 51,
    "name": "Xavier Worthy",
    "team": "KC",
    "value": 1,
    "bye": 5
  },
  {
    "rank": 127,
    "position": "WR",
    "positionRank": 52,
    "name": "Romeo Doubs",
    "team": "NE",
    "value": 1,
    "bye": 11
  },
  {
    "rank": 128,
    "position": "WR",
    "positionRank": 53,
    "name": "Quentin Johnston",
    "team": "LAC",
    "value": 1,
    "bye": 7
  },
  {
    "rank": 129,
    "position": "WR",
    "positionRank": 54,
    "name": "Jayden Higgins",
    "team": "HOU",
    "value": 1,
    "bye": 8
  },
  {
    "rank": 130,
    "position": "WR",
    "positionRank": 55,
    "name": "Jerry Jeudy",
    "team": "CLE",
    "value": 1,
    "bye": 11
  },
  {
    "rank": 131,
    "position": "WR",
    "positionRank": 56,
    "name": "Jalen Coker",
    "team": "CAR",
    "value": 1,
    "bye": 5
  },
  {
    "rank": 132,
    "position": "WR",
    "positionRank": 57,
    "name": "Rashid Shaheed",
    "team": "SEA",
    "value": 1,
    "bye": 11
  },
  {
    "rank": 133,
    "position": "QB",
    "positionRank": 16,
    "name": "Kyler Murray",
    "team": "MIN",
    "value": 1,
    "bye": 6
  },
  {
    "rank": 134,
    "position": "QB",
    "positionRank": 17,
    "name": "Tyler Shough",
    "team": "NO",
    "value": 1,
    "bye": 8
  },
  {
    "rank": 135,
    "position": "QB",
    "positionRank": 18,
    "name": "Daniel Jones",
    "team": "IND",
    "value": 1,
    "bye": 13
  },
  {
    "rank": 136,
    "position": "QB",
    "positionRank": 19,
    "name": "Jared Goff",
    "team": "DET",
    "value": 1,
    "bye": 6
  },
  {
    "rank": 137,
    "position": "RB",
    "positionRank": 43,
    "name": "Zach Charbonnet",
    "team": "SEA",
    "value": 1,
    "bye": 11
  },
  {
    "rank": 138,
    "position": "RB",
    "positionRank": 44,
    "name": "Alvin Kamara",
    "team": "NO",
    "value": 1,
    "bye": 8
  },
  {
    "rank": 139,
    "position": "RB",
    "positionRank": 45,
    "name": "Isiah Pacheco",
    "team": "DET",
    "value": 1,
    "bye": 6
  },
  {
    "rank": 140,
    "position": "RB",
    "positionRank": 46,
    "name": "Chris Rodriguez Jr.",
    "team": "JAC",
    "value": 1,
    "bye": 7
  },
  {
    "rank": 141,
    "position": "RB",
    "positionRank": 47,
    "name": "Braelon Allen",
    "team": "NYJ",
    "value": 1,
    "bye": 13
  },
  {
    "rank": 142,
    "position": "RB",
    "positionRank": 48,
    "name": "Tank Bigsby",
    "team": "PHI",
    "value": 1,
    "bye": 10
  },
  {
    "rank": 143,
    "position": "WR",
    "positionRank": 58,
    "name": "Jalen McMillan",
    "team": "TB",
    "value": 1,
    "bye": 10
  },
  {
    "rank": 144,
    "position": "WR",
    "positionRank": 59,
    "name": "Calvin Ridley",
    "team": "TEN",
    "value": 1,
    "bye": 9
  },
  {
    "rank": 145,
    "position": "WR",
    "positionRank": 60,
    "name": "Denzel Boston",
    "team": "CLE",
    "value": 1,
    "bye": 11
  },
  {
    "rank": 146,
    "position": "WR",
    "positionRank": 61,
    "name": "Travis Hunter",
    "team": "JAC",
    "value": 1,
    "bye": 7
  },
  {
    "rank": 147,
    "position": "WR",
    "positionRank": 62,
    "name": "Germie Bernard",
    "team": "PIT",
    "value": 1,
    "bye": 9
  },
  {
    "rank": 148,
    "position": "WR",
    "positionRank": 63,
    "name": "Antonio Williams",
    "team": "WAS",
    "value": 1,
    "bye": 7
  },
  {
    "rank": 149,
    "position": "QB",
    "positionRank": 20,
    "name": "Baker Mayfield",
    "team": "TB",
    "value": 1,
    "bye": 10
  },
  {
    "rank": 150,
    "position": "QB",
    "positionRank": 21,
    "name": "Malik Willis",
    "team": "MIA",
    "value": 1,
    "bye": 6
  },
  {
    "rank": 151,
    "position": "WR",
    "positionRank": 64,
    "name": "Adonai Mitchell",
    "team": "NYJ",
    "value": 1,
    "bye": 13
  },
  {
    "rank": 152,
    "position": "WR",
    "positionRank": 65,
    "name": "Omar Cooper Jr.",
    "team": "NYJ",
    "value": 1,
    "bye": 13
  },
  {
    "rank": 153,
    "position": "WR",
    "positionRank": 66,
    "name": "Tre Tucker",
    "team": "LV",
    "value": 1,
    "bye": 13
  },
  {
    "rank": 154,
    "position": "RB",
    "positionRank": 49,
    "name": "Mike Washington Jr.",
    "team": "LV",
    "value": 1,
    "bye": 13
  },
  {
    "rank": 155,
    "position": "RB",
    "positionRank": 50,
    "name": "Ray Davis",
    "team": "BUF",
    "value": 1,
    "bye": 7
  },
  {
    "rank": 156,
    "position": "RB",
    "positionRank": 51,
    "name": "Tyrone Tracy Jr.",
    "team": "NYG",
    "value": 1,
    "bye": 8
  },
  {
    "rank": 157,
    "position": "RB",
    "positionRank": 52,
    "name": "Brian Robinson Jr.",
    "team": "ATL",
    "value": 1,
    "bye": 11
  },
  {
    "rank": 158,
    "position": "RB",
    "positionRank": 53,
    "name": "Tyjae Spears",
    "team": "TEN",
    "value": 1,
    "bye": 9
  },
  {
    "rank": 159,
    "position": "TE",
    "positionRank": 19,
    "name": "Terrance Ferguson",
    "team": "LAR",
    "value": 1,
    "bye": 11
  },
  {
    "rank": 160,
    "position": "TE",
    "positionRank": 20,
    "name": "Juwan Johnson",
    "team": "NO",
    "value": 1,
    "bye": 8
  },
  {
    "rank": 161,
    "position": "WR",
    "positionRank": 67,
    "name": "Jalen Nailor",
    "team": "LV",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 162,
    "position": "WR",
    "positionRank": 68,
    "name": "Rashod Bateman",
    "team": "BAL",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 163,
    "position": "WR",
    "positionRank": 69,
    "name": "Jauan Jennings",
    "team": "MIN",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 164,
    "position": "WR",
    "positionRank": 70,
    "name": "Jaylin Noel",
    "team": "HOU",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 165,
    "position": "WR",
    "positionRank": 71,
    "name": "Darnell Mooney",
    "team": "NYG",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 166,
    "position": "RB",
    "positionRank": 54,
    "name": "Tyler Allgeier",
    "team": "ARI",
    "value": 0,
    "bye": 14
  },
  {
    "rank": 167,
    "position": "RB",
    "positionRank": 55,
    "name": "James Conner",
    "team": "ARI",
    "value": 0,
    "bye": 14
  },
  {
    "rank": 168,
    "position": "RB",
    "positionRank": 56,
    "name": "Keaton Mitchell",
    "team": "LAC",
    "value": 0,
    "bye": 7
  },
  {
    "rank": 169,
    "position": "DST",
    "positionRank": 1,
    "name": "Broncos D/ST",
    "team": "DEN",
    "value": 0,
    "bye": 10
  },
  {
    "rank": 170,
    "position": "DST",
    "positionRank": 2,
    "name": "Texans D/ST",
    "team": "HOU",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 171,
    "position": "DST",
    "positionRank": 3,
    "name": "Steelers D/ST",
    "team": "PIT",
    "value": 0,
    "bye": 9
  },
  {
    "rank": 172,
    "position": "DST",
    "positionRank": 4,
    "name": "Seahawks D/ST",
    "team": "SEA",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 173,
    "position": "DST",
    "positionRank": 5,
    "name": "Rams D/ST",
    "team": "LAR",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 174,
    "position": "DST",
    "positionRank": 6,
    "name": "Ravens D/ST",
    "team": "BAL",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 175,
    "position": "DST",
    "positionRank": 7,
    "name": "Eagles D/ST",
    "team": "PHI",
    "value": 0,
    "bye": 10
  },
  {
    "rank": 176,
    "position": "DST",
    "positionRank": 8,
    "name": "Browns D/ST",
    "team": "CLE",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 177,
    "position": "DST",
    "positionRank": 9,
    "name": "Patriots D/ST",
    "team": "NE",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 178,
    "position": "DST",
    "positionRank": 10,
    "name": "Lions D/ST",
    "team": "DET",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 179,
    "position": "DST",
    "positionRank": 11,
    "name": "Chiefs D/ST",
    "team": "KC",
    "value": 0,
    "bye": 5
  },
  {
    "rank": 180,
    "position": "DST",
    "positionRank": 12,
    "name": "Chargers D/ST",
    "team": "LAC",
    "value": 0,
    "bye": 7
  },
  {
    "rank": 181,
    "position": "K",
    "positionRank": 1,
    "name": "Brandon Aubrey",
    "team": "DAL",
    "value": 0,
    "bye": 14
  },
  {
    "rank": 182,
    "position": "K",
    "positionRank": 2,
    "name": "Cameron Dicker",
    "team": "LAC",
    "value": 0,
    "bye": 7
  },
  {
    "rank": 183,
    "position": "K",
    "positionRank": 3,
    "name": "Jason Myers",
    "team": "SEA",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 184,
    "position": "K",
    "positionRank": 4,
    "name": "Harrison Mevis",
    "team": "LAR",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 185,
    "position": "K",
    "positionRank": 5,
    "name": "Ka'imi Fairbairn",
    "team": "HOU",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 186,
    "position": "K",
    "positionRank": 6,
    "name": "Eddy Pineiro",
    "team": "SF",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 187,
    "position": "K",
    "positionRank": 7,
    "name": "Harrison Butker",
    "team": "KC",
    "value": 0,
    "bye": 5
  },
  {
    "rank": 188,
    "position": "K",
    "positionRank": 8,
    "name": "Cam Little",
    "team": "JAC",
    "value": 0,
    "bye": 7
  },
  {
    "rank": 189,
    "position": "K",
    "positionRank": 9,
    "name": "Jake Bates",
    "team": "DET",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 190,
    "position": "K",
    "positionRank": 10,
    "name": "Tyler Loop",
    "team": "BAL",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 191,
    "position": "K",
    "positionRank": 11,
    "name": "Cairo Santos",
    "team": "CHI",
    "value": 0,
    "bye": 10
  },
  {
    "rank": 192,
    "position": "K",
    "positionRank": 12,
    "name": "Will Reichard",
    "team": "MIN",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 193,
    "position": "RB",
    "positionRank": 57,
    "name": "Justice Hill",
    "team": "BAL",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 194,
    "position": "TE",
    "positionRank": 21,
    "name": "Brenton Strange",
    "team": "JAC",
    "value": 0,
    "bye": 7
  },
  {
    "rank": 195,
    "position": "RB",
    "positionRank": 58,
    "name": "Jordan James",
    "team": "SF",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 196,
    "position": "RB",
    "positionRank": 59,
    "name": "Kaelon Black",
    "team": "SF",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 197,
    "position": "WR",
    "positionRank": 72,
    "name": "Chris Bell",
    "team": "MIA",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 198,
    "position": "QB",
    "positionRank": 22,
    "name": "Jordan Love",
    "team": "GB",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 199,
    "position": "QB",
    "positionRank": 23,
    "name": "Cam Ward",
    "team": "TEN",
    "value": 0,
    "bye": 9
  },
  {
    "rank": 200,
    "position": "QB",
    "positionRank": 24,
    "name": "C.J. Stroud",
    "team": "HOU",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 201,
    "position": "WR",
    "positionRank": 73,
    "name": "Jack Bech",
    "team": "LV",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 202,
    "position": "WR",
    "positionRank": 74,
    "name": "Deebo Samuel Sr.",
    "team": "FA",
    "value": 0,
    "bye": 0
  },
  {
    "rank": 203,
    "position": "WR",
    "positionRank": 75,
    "name": "Stefon Diggs",
    "team": "FA",
    "value": 0,
    "bye": 0
  },
  {
    "rank": 204,
    "position": "WR",
    "positionRank": 76,
    "name": "Tre Harris",
    "team": "LAC",
    "value": 0,
    "bye": 7
  },
  {
    "rank": 205,
    "position": "WR",
    "positionRank": 77,
    "name": "Isaac TeSlaa",
    "team": "DET",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 206,
    "position": "TE",
    "positionRank": 22,
    "name": "Pat Freiermuth",
    "team": "PIT",
    "value": 0,
    "bye": 9
  },
  {
    "rank": 207,
    "position": "TE",
    "positionRank": 23,
    "name": "Dalton Schultz",
    "team": "HOU",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 208,
    "position": "WR",
    "positionRank": 78,
    "name": "Ryan Flournoy",
    "team": "DAL",
    "value": 0,
    "bye": 14
  },
  {
    "rank": 209,
    "position": "WR",
    "positionRank": 79,
    "name": "Brandon Aiyuk",
    "team": "SF",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 210,
    "position": "WR",
    "positionRank": 80,
    "name": "Cooper Kupp",
    "team": "SEA",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 211,
    "position": "WR",
    "positionRank": 81,
    "name": "Tank Dell",
    "team": "HOU",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 212,
    "position": "RB",
    "positionRank": 60,
    "name": "Kaytron Allen",
    "team": "WAS",
    "value": 0,
    "bye": 7
  },
  {
    "rank": 213,
    "position": "RB",
    "positionRank": 61,
    "name": "Nicholas Singleton",
    "team": "TEN",
    "value": 0,
    "bye": 9
  },
  {
    "rank": 214,
    "position": "RB",
    "positionRank": 62,
    "name": "Demond Claiborne",
    "team": "MIN",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 215,
    "position": "TE",
    "positionRank": 24,
    "name": "Gunnar Helm",
    "team": "TEN",
    "value": 0,
    "bye": 9
  },
  {
    "rank": 216,
    "position": "TE",
    "positionRank": 25,
    "name": "Oronde Gadsden",
    "team": "LAC",
    "value": 0,
    "bye": 7
  },
  {
    "rank": 217,
    "position": "TE",
    "positionRank": 26,
    "name": "Chig Okonkwo",
    "team": "WAS",
    "value": 0,
    "bye": 7
  },
  {
    "rank": 218,
    "position": "QB",
    "positionRank": 25,
    "name": "Sam Darnold",
    "team": "SEA",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 219,
    "position": "QB",
    "positionRank": 26,
    "name": "Bryce Young",
    "team": "CAR",
    "value": 0,
    "bye": 5
  },
  {
    "rank": 220,
    "position": "QB",
    "positionRank": 27,
    "name": "Fernando Mendoza",
    "team": "LV",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 221,
    "position": "RB",
    "positionRank": 63,
    "name": "Jonah Coleman",
    "team": "DEN",
    "value": 0,
    "bye": 10
  },
  {
    "rank": 222,
    "position": "RB",
    "positionRank": 64,
    "name": "Seth McGowan",
    "team": "IND",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 223,
    "position": "RB",
    "positionRank": 65,
    "name": "Emmett Johnson",
    "team": "KC",
    "value": 0,
    "bye": 5
  },
  {
    "rank": 224,
    "position": "WR",
    "positionRank": 82,
    "name": "Zachariah Branch",
    "team": "ATL",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 225,
    "position": "RB",
    "positionRank": 66,
    "name": "Dylan Sampson",
    "team": "CLE",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 226,
    "position": "RB",
    "positionRank": 67,
    "name": "Samaje Perine",
    "team": "CIN",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 227,
    "position": "WR",
    "positionRank": 83,
    "name": "Caleb Douglas",
    "team": "MIA",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 228,
    "position": "WR",
    "positionRank": 84,
    "name": "Jalen Tolbert",
    "team": "MIA",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 229,
    "position": "WR",
    "positionRank": 85,
    "name": "Malik Washington",
    "team": "MIA",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 230,
    "position": "WR",
    "positionRank": 86,
    "name": "Christian Kirk",
    "team": "SF",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 231,
    "position": "WR",
    "positionRank": 87,
    "name": "Savion Williams",
    "team": "GB",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 232,
    "position": "WR",
    "positionRank": 88,
    "name": "Chris Brazzell II",
    "team": "CAR",
    "value": 0,
    "bye": 5
  },
  {
    "rank": 233,
    "position": "WR",
    "positionRank": 89,
    "name": "Tyreek Hill",
    "team": "FA",
    "value": 0,
    "bye": 0
  },
  {
    "rank": 234,
    "position": "WR",
    "positionRank": 90,
    "name": "De'Zhaun Stribling",
    "team": "SF",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 235,
    "position": "DST",
    "positionRank": 13,
    "name": "Buccaneers D/ST",
    "team": "TB",
    "value": 0,
    "bye": 10
  },
  {
    "rank": 236,
    "position": "DST",
    "positionRank": 14,
    "name": "Packers D/ST",
    "team": "GB",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 237,
    "position": "K",
    "positionRank": 13,
    "name": "Chris Boswell",
    "team": "PIT",
    "value": 0,
    "bye": 9
  },
  {
    "rank": 238,
    "position": "K",
    "positionRank": 14,
    "name": "Chase McLaughlin",
    "team": "TB",
    "value": 0,
    "bye": 10
  },
  {
    "rank": 239,
    "position": "RB",
    "positionRank": 68,
    "name": "LeQuint Allen",
    "team": "JAC",
    "value": 0,
    "bye": 7
  },
  {
    "rank": 240,
    "position": "RB",
    "positionRank": 69,
    "name": "Jaylen Wright",
    "team": "MIA",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 241,
    "position": "RB",
    "positionRank": 70,
    "name": "Ollie Gordon II",
    "team": "MIA",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 242,
    "position": "RB",
    "positionRank": 71,
    "name": "Kimani Vidal",
    "team": "LAC",
    "value": 0,
    "bye": 7
  },
  {
    "rank": 243,
    "position": "RB",
    "positionRank": 72,
    "name": "Adam Randall",
    "team": "BAL",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 244,
    "position": "RB",
    "positionRank": 73,
    "name": "MarShawn Lloyd",
    "team": "GB",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 245,
    "position": "RB",
    "positionRank": 74,
    "name": "Emari Demercado",
    "team": "KC",
    "value": 0,
    "bye": 5
  },
  {
    "rank": 246,
    "position": "RB",
    "positionRank": 75,
    "name": "Jaydon Blue",
    "team": "DAL",
    "value": 0,
    "bye": 14
  },
  {
    "rank": 247,
    "position": "RB",
    "positionRank": 76,
    "name": "Trey Benson",
    "team": "ARI",
    "value": 0,
    "bye": 14
  },
  {
    "rank": 248,
    "position": "RB",
    "positionRank": 77,
    "name": "Kaleb Johnson",
    "team": "PIT",
    "value": 0,
    "bye": 9
  },
  {
    "rank": 249,
    "position": "RB",
    "positionRank": 78,
    "name": "Ty Johnson",
    "team": "BUF",
    "value": 0,
    "bye": 7
  },
  {
    "rank": 250,
    "position": "RB",
    "positionRank": 79,
    "name": "Kyle Juszczyk",
    "team": "SF",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 251,
    "position": "RB",
    "positionRank": 80,
    "name": "Chris Brooks",
    "team": "GB",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 252,
    "position": "WR",
    "positionRank": 91,
    "name": "Xavier Legette",
    "team": "CAR",
    "value": 0,
    "bye": 5
  },
  {
    "rank": 253,
    "position": "WR",
    "positionRank": 92,
    "name": "Pat Bryant",
    "team": "DEN",
    "value": 0,
    "bye": 10
  },
  {
    "rank": 254,
    "position": "DST",
    "positionRank": 15,
    "name": "Jaguars D/ST",
    "team": "JAC",
    "value": 0,
    "bye": 7
  },
  {
    "rank": 255,
    "position": "DST",
    "positionRank": 16,
    "name": "Colts D/ST",
    "team": "IND",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 256,
    "position": "K",
    "positionRank": 15,
    "name": "Evan McPherson",
    "team": "CIN",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 257,
    "position": "K",
    "positionRank": 16,
    "name": "Nick Folk",
    "team": "ATL",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 258,
    "position": "TE",
    "positionRank": 27,
    "name": "AJ Barner",
    "team": "SEA",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 259,
    "position": "TE",
    "positionRank": 28,
    "name": "Greg Dulcich",
    "team": "MIA",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 260,
    "position": "TE",
    "positionRank": 29,
    "name": "Cade Otton",
    "team": "TB",
    "value": 0,
    "bye": 10
  },
  {
    "rank": 261,
    "position": "WR",
    "positionRank": 93,
    "name": "Tory Horton",
    "team": "SEA",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 262,
    "position": "WR",
    "positionRank": 94,
    "name": "Ja'Kobi Lane",
    "team": "BAL",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 263,
    "position": "WR",
    "positionRank": 95,
    "name": "Ted Hurst",
    "team": "TB",
    "value": 0,
    "bye": 10
  },
  {
    "rank": 264,
    "position": "WR",
    "positionRank": 96,
    "name": "Keon Coleman",
    "team": "BUF",
    "value": 0,
    "bye": 7
  },
  {
    "rank": 265,
    "position": "RB",
    "positionRank": 81,
    "name": "George Holani",
    "team": "SEA",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 266,
    "position": "RB",
    "positionRank": 82,
    "name": "Isaiah Davis",
    "team": "NYJ",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 267,
    "position": "QB",
    "positionRank": 28,
    "name": "Geno Smith",
    "team": "NYJ",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 268,
    "position": "QB",
    "positionRank": 29,
    "name": "Aaron Rodgers",
    "team": "PIT",
    "value": 0,
    "bye": 9
  },
  {
    "rank": 269,
    "position": "QB",
    "positionRank": 30,
    "name": "Deshaun Watson",
    "team": "CLE",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 270,
    "position": "QB",
    "positionRank": 31,
    "name": "Jacoby Brissett",
    "team": "ARI",
    "value": 0,
    "bye": 14
  },
  {
    "rank": 271,
    "position": "WR",
    "positionRank": 97,
    "name": "Elijah Sarratt",
    "team": "BAL",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 272,
    "position": "WR",
    "positionRank": 98,
    "name": "Dontayvion Wicks",
    "team": "PHI",
    "value": 0,
    "bye": 10
  },
  {
    "rank": 273,
    "position": "WR",
    "positionRank": 99,
    "name": "Kayshon Boutte",
    "team": "NE",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 274,
    "position": "WR",
    "positionRank": 100,
    "name": "Nick Westbrook-Ikhine",
    "team": "IND",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 275,
    "position": "WR",
    "positionRank": 101,
    "name": "Darius Slayton",
    "team": "NYG",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 276,
    "position": "RB",
    "positionRank": 83,
    "name": "DJ Giddens",
    "team": "IND",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 277,
    "position": "RB",
    "positionRank": 84,
    "name": "Malik Davis",
    "team": "DAL",
    "value": 0,
    "bye": 14
  },
  {
    "rank": 278,
    "position": "RB",
    "positionRank": 85,
    "name": "Sean Tucker",
    "team": "TB",
    "value": 0,
    "bye": 10
  },
  {
    "rank": 279,
    "position": "RB",
    "positionRank": 86,
    "name": "Trevor Etienne",
    "team": "CAR",
    "value": 0,
    "bye": 5
  },
  {
    "rank": 280,
    "position": "RB",
    "positionRank": 87,
    "name": "Emanuel Wilson",
    "team": "SEA",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 281,
    "position": "RB",
    "positionRank": 88,
    "name": "Will Shipley",
    "team": "PHI",
    "value": 0,
    "bye": 10
  },
  {
    "rank": 282,
    "position": "RB",
    "positionRank": 89,
    "name": "Devin Singletary",
    "team": "NYG",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 283,
    "position": "RB",
    "positionRank": 90,
    "name": "Hunter Luepke",
    "team": "DAL",
    "value": 0,
    "bye": 14
  },
  {
    "rank": 284,
    "position": "WR",
    "positionRank": 102,
    "name": "Dyami Brown",
    "team": "WAS",
    "value": 0,
    "bye": 7
  },
  {
    "rank": 285,
    "position": "DST",
    "positionRank": 17,
    "name": "Bengals D/ST",
    "team": "CIN",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 286,
    "position": "DST",
    "positionRank": 18,
    "name": "Bears D/ST",
    "team": "CHI",
    "value": 0,
    "bye": 10
  },
  {
    "rank": 287,
    "position": "K",
    "positionRank": 17,
    "name": "Trey Smack",
    "team": "GB",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 288,
    "position": "K",
    "positionRank": 18,
    "name": "Jake Elliott",
    "team": "PHI",
    "value": 0,
    "bye": 10
  },
  {
    "rank": 289,
    "position": "TE",
    "positionRank": 30,
    "name": "Mike Gesicki",
    "team": "CIN",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 290,
    "position": "TE",
    "positionRank": 31,
    "name": "Evan Engram",
    "team": "DEN",
    "value": 0,
    "bye": 10
  },
  {
    "rank": 291,
    "position": "TE",
    "positionRank": 32,
    "name": "David Njoku",
    "team": "LAC",
    "value": 0,
    "bye": 7
  },
  {
    "rank": 292,
    "position": "TE",
    "positionRank": 33,
    "name": "Michael Mayer",
    "team": "LV",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 293,
    "position": "TE",
    "positionRank": 34,
    "name": "Jake Tonges",
    "team": "SF",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 294,
    "position": "WR",
    "positionRank": 103,
    "name": "Jahan Dotson",
    "team": "ATL",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 295,
    "position": "WR",
    "positionRank": 104,
    "name": "Andrei Iosivas",
    "team": "CIN",
    "value": 0,
    "bye": 6
  },
  {
    "rank": 296,
    "position": "QB",
    "positionRank": 32,
    "name": "Tua Tagovailoa",
    "team": "ATL",
    "value": 0,
    "bye": 11
  },
  {
    "rank": 297,
    "position": "DST",
    "positionRank": 19,
    "name": "49ers D/ST",
    "team": "SF",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 298,
    "position": "DST",
    "positionRank": 20,
    "name": "Jets D/ST",
    "team": "NYJ",
    "value": 0,
    "bye": 13
  },
  {
    "rank": 299,
    "position": "DST",
    "positionRank": 21,
    "name": "Saints D/ST",
    "team": "NO",
    "value": 0,
    "bye": 8
  },
  {
    "rank": 300,
    "position": "DST",
    "positionRank": 22,
    "name": "Panthers D/ST",
    "team": "CAR",
    "value": 0,
    "bye": 5
  }
]
;

const STORAGE_KEY = 'fantasy-draft-board-v1';
const POSITIONS = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST'];
const POSITION_COLORS = { QB: '#2563eb', RB: '#ea580c', WR: '#7c3aed', TE: '#0f766e', K: '#db2777', DST: '#64748b' };

export default function App() {
  const dark = useColorScheme() === 'dark';
  const theme = dark ? darkTheme : lightTheme;
  const [tab, setTab] = useState('board');
  const [position, setPosition] = useState('ALL');
  const [search, setSearch] = useState('');
  const [statuses, setStatuses] = useState({});
  const [favorites, setFavorites] = useState({});
  const [history, setHistory] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [draftSlot, setDraftSlot] = useState(1);
  const [showPickSelector, setShowPickSelector] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(value => {
        if (value) {
          const saved = JSON.parse(value);
          setStatuses(saved.statuses || {});
          setFavorites(saved.favorites || {});
          setHistory(saved.history || []);
          setDraftSlot(saved.draftSlot || 1);
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ statuses, favorites, history, draftSlot }));
  }, [statuses, favorites, history, draftSlot, loaded]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return players.filter(player =>
      !statuses[player.rank] &&
      (position === 'ALL' || player.position === position) &&
      (!query || player.name.toLowerCase().includes(query) || player.team.toLowerCase().includes(query))
    );
  }, [position, search, statuses]);

  const myPlayers = useMemo(() => players.filter(player => statuses[player.rank] === 'mine'), [statuses]);
  const favoritePlayers = useMemo(() => players.filter(player => favorites[player.rank]), [favorites]);
  const selectedPlayers = useMemo(() => players.filter(player => statuses[player.rank]), [statuses]);
  const draftedCount = selectedPlayers.length;
  const currentOverallPick = draftedCount + 1;
  const nextDraftPick = getNextSnakePick(currentOverallPick, draftSlot);
  const picksAway = nextDraftPick.overall - currentOverallPick;
  const lineup = useMemo(() => buildLineup(myPlayers), [myPlayers]);

  function setPlayerStatus(player, next) {
    const previous = statuses[player.rank] || null;
    if (previous === next) return;
    setHistory(items => [...items, { rank: player.rank, previous }]);
    setStatuses(current => {
      const updated = { ...current };
      if (next) updated[player.rank] = next;
      else delete updated[player.rank];
      return updated;
    });
  }

  function undo() {
    const action = history[history.length - 1];
    if (!action) return;
    setStatuses(current => {
      const updated = { ...current };
      if (action.previous) updated[action.rank] = action.previous;
      else delete updated[action.rank];
      return updated;
    });
    setHistory(items => items.slice(0, -1));
  }

  function toggleFavorite(player) {
    setFavorites(current => {
      const updated = { ...current };
      if (updated[player.rank]) delete updated[player.rank];
      else updated[player.rank] = true;
      return updated;
    });
  }

  function autoPickToMyTurn() {
    if (picksAway <= 0) return;
    const autoSelected = players.filter(player => !statuses[player.rank]).slice(0, picksAway);
    setStatuses(current => {
      const updated = { ...current };
      autoSelected.forEach(player => { updated[player.rank] = 'taken'; });
      return updated;
    });
    setHistory(items => [
      ...items,
      ...autoSelected.map(player => ({ rank: player.rank, previous: null })),
    ]);
  }

  function reset() {
    Alert.alert('Reset the entire draft?', 'All selections will be cleared.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset Draft', style: 'destructive', onPress: () => { setStatuses({}); setHistory([]); } },
    ]);
  }

  const row = ({ item }) => (
    <PlayerRow
      player={item}
      status={statuses[item.rank]}
      favorite={Boolean(favorites[item.rank])}
      theme={theme}
      onMine={() => setPlayerStatus(item, 'mine')}
      onTaken={() => setPlayerStatus(item, 'taken')}
      onRestore={() => setPlayerStatus(item, null)}
      onToggleFavorite={() => toggleFavorite(item)}
    />
  );

  const boardRow = ({ item }) => (
    <PlayerRow
      player={item}
      status={statuses[item.rank]}
      favorite={Boolean(favorites[item.rank])}
      theme={theme}
      showMine={picksAway === 0}
      showOther={picksAway > 0}
      onMine={() => setPlayerStatus(item, 'mine')}
      onTaken={() => setPlayerStatus(item, 'taken')}
      onRestore={() => setPlayerStatus(item, null)}
      onToggleFavorite={() => toggleFavorite(item)}
    />
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>{tab === 'board' ? 'Draft Board' : tab === 'roster' ? 'My Team' : tab === 'favorites' ? 'Favorites' : 'Selected'}</Text>
          <Text style={[styles.subtitle, { color: theme.secondary }]}>ESPN 2026 PPR Top 300</Text>
        </View>
        <View style={styles.headerActions}>
          <SmallButton label='↶' disabled={!history.length} onPress={undo} theme={theme} accessibilityLabel='Undo' />
          <SmallButton label='Reset' disabled={!Object.keys(statuses).length} onPress={reset} theme={theme} danger />
        </View>
      </View>

      {tab === 'board' ? (
        <>
          <View style={[styles.draftTracker, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.draftTrackerTop}>
              <View>
                <Text style={[styles.trackerLabel, { color: theme.secondary }]}>12-TEAM SNAKE DRAFT</Text>
                <Text style={[styles.trackerTitle, { color: theme.text }]}>Next pick #{nextDraftPick.overall}</Text>
                <Text style={[styles.trackerDetail, { color: theme.secondary }]}>Round {nextDraftPick.round} · Pick {nextDraftPick.roundPick}</Text>
              </View>
              <Pressable onPress={() => setShowPickSelector(true)} style={[styles.pickDropdown, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Text style={[styles.pickDropdownLabel, { color: theme.secondary }]}>YOUR SLOT</Text>
                <Text style={[styles.pickDropdownValue, { color: theme.text }]}>Pick {draftSlot} ▾</Text>
              </Pressable>
            </View>
            <View style={[styles.clockBanner, { backgroundColor: picksAway === 0 ? '#dcfce7' : '#e0e7ff' }]}>
              <Text style={{ color: picksAway === 0 ? '#15803d' : '#4338ca', fontWeight: '900' }}>
                {picksAway === 0 ? 'You are on the clock!' : `${picksAway} pick${picksAway === 1 ? '' : 's'} until your turn`}
              </Text>
              <Text style={{ color: picksAway === 0 ? '#15803d' : '#4338ca', fontWeight: '700' }}>{draftedCount} selected</Text>
            </View>
            <Pressable
              disabled={picksAway === 0}
              onPress={autoPickToMyTurn}
              style={[styles.autoPickButton, { backgroundColor: picksAway === 0 ? theme.background : '#4f46e5', borderColor: picksAway === 0 ? theme.border : '#4f46e5' }]}
            >
              <Text style={{ color: picksAway === 0 ? theme.secondary : '#ffffff', fontWeight: '900' }}>
                {picksAway === 0 ? 'Make your pick to continue' : `Auto-pick ${picksAway} player${picksAway === 1 ? '' : 's'} to my turn`}
              </Text>
            </Pressable>
          </View>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder='Search player or team'
            placeholderTextColor={theme.secondary}
            style={[styles.search, { color: theme.text, backgroundColor: theme.card }]}
          />
          <View style={styles.filterArea}>
            <Text style={[styles.filterLabel, { color: theme.secondary }]}>FILTER BY POSITION</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
              {POSITIONS.map(pos => (
                <Pressable
                  key={pos}
                  onPress={() => setPosition(pos)}
                  style={[styles.filter, { backgroundColor: position === pos ? '#4f46e5' : theme.card, borderColor: position === pos ? '#4f46e5' : theme.border }]}
                >
                  <Text style={[styles.filterText, { color: position === pos ? '#ffffff' : theme.text }]}>{pos === 'DST' ? 'D/ST' : pos === 'ALL' ? 'ALL' : pos}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          <FlatList data={filtered} renderItem={boardRow} keyExtractor={item => String(item.rank)} contentContainerStyle={styles.list} />
        </>
      ) : tab === 'roster' && myPlayers.length ? (
        <>
          <View style={[styles.summary, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.secondary, fontWeight: '700' }}>{myPlayers.length} players</Text>
            <Text style={{ color: theme.secondary, fontWeight: '700' }}>${myPlayers.reduce((sum, p) => sum + p.value, 0)} value</Text>
          </View>
          <FlatList
            data={lineup}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => item.header ? (
              <Text style={[styles.lineupHeader, { color: theme.secondary }]}>{item.header}</Text>
            ) : item.player ? (
              <PlayerRow
                player={item.player}
                status='mine'
                favorite={Boolean(favorites[item.player.rank])}
                theme={theme}
                slotLabel={item.label}
                showCrossout={false}
                onMine={() => setPlayerStatus(item.player, 'mine')}
                onTaken={() => setPlayerStatus(item.player, 'taken')}
                onRestore={() => setPlayerStatus(item.player, null)}
                onToggleFavorite={() => toggleFavorite(item.player)}
              />
            ) : (
              <EmptyLineupSlot label={item.label} theme={theme} />
            )}
          />
        </>
      ) : tab === 'favorites' && favoritePlayers.length ? (
        <FlatList data={favoritePlayers} renderItem={row} keyExtractor={item => String(item.rank)} contentContainerStyle={styles.list} />
      ) : tab === 'selected' && selectedPlayers.length ? (
        <FlatList data={selectedPlayers} renderItem={row} keyExtractor={item => String(item.rank)} contentContainerStyle={styles.list} />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>{tab === 'favorites' ? '☆' : tab === 'selected' ? '✓' : '🏈'}</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>{tab === 'favorites' ? 'No favorites yet' : tab === 'selected' ? 'No selections yet' : 'Your team is empty'}</Text>
          <Text style={[styles.emptyText, { color: theme.secondary }]}>{tab === 'favorites' ? 'Tap the star beside any player to add them here.' : tab === 'selected' ? 'Drafted players will appear here.' : 'Go to Draft Board and tap “My Team” on a player.'}</Text>
        </View>
      )}

      <View style={[styles.tabs, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TabButton active={tab === 'board'} icon='☷' label='Draft' onPress={() => setTab('board')} />
        <TabButton active={tab === 'roster'} icon='♟' label={`Team ${myPlayers.length}`} onPress={() => setTab('roster')} />
        <TabButton active={tab === 'favorites'} icon='★' label={`Stars ${favoritePlayers.length}`} onPress={() => setTab('favorites')} />
        <TabButton active={tab === 'selected'} icon='✓' label={`Selected ${selectedPlayers.length}`} onPress={() => setTab('selected')} />
      </View>

      <Modal visible={showPickSelector} transparent animationType='fade' onRequestClose={() => setShowPickSelector(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowPickSelector(false)}>
          <Pressable style={[styles.pickModal, { backgroundColor: theme.card }]} onPress={() => {}}>
            <Text style={[styles.pickModalTitle, { color: theme.text }]}>Choose your draft position</Text>
            <Text style={[styles.pickModalSubtitle, { color: theme.secondary }]}>12-team snake draft</Text>
            <View style={styles.pickGrid}>
              {Array.from({ length: 12 }, (_, index) => index + 1).map(slot => (
                <Pressable
                  key={slot}
                  onPress={() => { setDraftSlot(slot); setShowPickSelector(false); }}
                  style={[styles.pickOption, { backgroundColor: draftSlot === slot ? '#4f46e5' : theme.background, borderColor: draftSlot === slot ? '#4f46e5' : theme.border }]}
                >
                  <Text style={{ color: draftSlot === slot ? '#ffffff' : theme.text, fontWeight: '900', fontSize: 17 }}>{slot}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function buildLineup(selectedPlayers) {
  const pool = [...selectedPlayers];
  const take = eligible => {
    const index = pool.findIndex(player => eligible.includes(player.position));
    return index < 0 ? null : pool.splice(index, 1)[0];
  };
  const starters = [
    ['QB', ['QB']],
    ['RB', ['RB']],
    ['RB', ['RB']],
    ['WR', ['WR']],
    ['WR', ['WR']],
    ['WR', ['WR']],
    ['TE', ['TE']],
    ['FLEX', ['RB', 'WR', 'TE']],
    ['K', ['K']],
    ['D/ST', ['DST']],
  ].map(([label, eligible], index) => ({ id: `starter-${index}`, label, player: take(eligible) }));

  const bench = Array.from({ length: 6 }, (_, index) => ({
    id: `bench-${index}`,
    label: `BN ${index + 1}`,
    player: pool[index] || null,
  }));
  const overflow = pool.slice(6).map((player, index) => ({ id: `over-${player.rank}`, label: 'OVER', player }));

  return [
    { id: 'starters-header', header: 'STARTING LINEUP' },
    ...starters,
    { id: 'bench-header', header: 'BENCH · 6 SPOTS' },
    ...bench,
    ...(overflow.length ? [{ id: 'overflow-header', header: 'OVER ROSTER LIMIT' }, ...overflow] : []),
  ];
}

function getNextSnakePick(currentOverallPick, draftSlot) {
  let round = Math.floor((currentOverallPick - 1) / 12) + 1;
  while (true) {
    const overall = (round - 1) * 12 + (round % 2 === 1 ? draftSlot : 13 - draftSlot);
    if (overall >= currentOverallPick) {
      return { overall, round, roundPick: round % 2 === 1 ? draftSlot : 13 - draftSlot };
    }
    round += 1;
  }
}

function EmptyLineupSlot({ label, theme }) {
  return (
    <View style={[styles.emptySlot, { borderColor: theme.border, backgroundColor: theme.card }]}>
      <Text style={[styles.slotLabel, { color: theme.secondary }]}>{label}</Text>
      <Text style={[styles.emptySlotText, { color: theme.secondary }]}>Empty</Text>
    </View>
  );
}

function PlayerRow({ player, status, favorite, theme, slotLabel, showCrossout = true, showMine = true, showOther = true, onMine, onTaken, onRestore, onToggleFavorite }) {
  return (
    <View style={[styles.row, { backgroundColor: theme.card, borderColor: status === 'mine' ? '#22c55e' : theme.border, opacity: status === 'taken' ? 0.58 : 1 }]}>
      <Text style={[slotLabel ? styles.slotLabel : styles.rank, { color: theme.secondary }]}>{slotLabel || player.rank}</Text>
      <Pressable onPress={onToggleFavorite} hitSlop={8} style={styles.starButton} accessibilityLabel={favorite ? 'Remove favorite' : 'Add favorite'}>
        <Text style={[styles.star, { color: favorite ? '#f59e0b' : theme.secondary }]}>{favorite ? '★' : '☆'}</Text>
      </Pressable>
      <View style={styles.playerInfo}>
        <Text numberOfLines={1} style={[styles.name, { color: status && showCrossout ? theme.secondary : theme.text, textDecorationLine: status && showCrossout ? 'line-through' : 'none' }]}>{player.name}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.badge, { backgroundColor: POSITION_COLORS[player.position] }]}>{player.position === 'DST' ? 'D/ST' : player.position}</Text>
          <Text style={[styles.meta, { color: theme.secondary }]}>{player.team}  •  Bye {player.bye}  •  ${player.value}</Text>
        </View>
      </View>
      <View style={styles.rowActions}>
        {status ? (
          <>
            <Text style={[styles.selectionTag, { color: status === 'mine' ? '#15803d' : '#b91c1c' }]}>{status === 'mine' ? 'MY TEAM' : 'OTHER'}</Text>
            <Pressable onPress={onRestore} style={[styles.action, { backgroundColor: '#e0e7ff' }]}><Text style={{ color: '#4338ca', fontWeight: '800' }}>Undo</Text></Pressable>
          </>
        ) : (
          <>
            {showMine && <Pressable onPress={onMine} style={[styles.action, { backgroundColor: '#dcfce7' }]}><Text style={{ color: '#15803d', fontWeight: '800' }}>Mine</Text></Pressable>}
            {showOther && <Pressable onPress={onTaken} style={[styles.action, { backgroundColor: '#fee2e2' }]}><Text style={{ color: '#b91c1c', fontWeight: '800' }}>Other</Text></Pressable>}
          </>
        )}
      </View>
    </View>
  );
}

function SmallButton({ label, onPress, disabled, theme, danger }) {
  return <Pressable disabled={disabled} onPress={onPress} style={[styles.smallButton, { backgroundColor: theme.card, opacity: disabled ? 0.35 : 1 }]}><Text style={{ color: danger ? '#dc2626' : theme.text, fontWeight: '800' }}>{label}</Text></Pressable>;
}

function TabButton({ active, icon, label, onPress }) {
  return <Pressable onPress={onPress} style={styles.tabButton}><Text style={[styles.tabIcon, { color: active ? '#4f46e5' : '#64748b' }]}>{icon}</Text><Text numberOfLines={1} style={[styles.tabLabel, { color: active ? '#4f46e5' : '#64748b' }]}>{label}</Text></Pressable>;
}

const lightTheme = { background: '#f8fafc', card: '#ffffff', text: '#0f172a', secondary: '#64748b', border: '#e2e8f0' };
const darkTheme = { background: '#0f172a', card: '#1e293b', text: '#f8fafc', secondary: '#94a3b8', border: '#334155' };

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 29, fontWeight: '900', letterSpacing: -0.7 },
  subtitle: { fontSize: 12, marginTop: 2, fontWeight: '600' },
  headerActions: { flexDirection: 'row', gap: 7 },
  smallButton: { minHeight: 38, paddingHorizontal: 12, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  search: { marginHorizontal: 16, paddingHorizontal: 14, height: 44, borderRadius: 13, fontSize: 16 },
  draftTracker: { marginHorizontal: 16, marginBottom: 10, borderWidth: 1, borderRadius: 16, padding: 13 },
  draftTrackerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trackerLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  trackerTitle: { fontSize: 21, fontWeight: '900', marginTop: 3 },
  trackerDetail: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  pickDropdown: { minWidth: 91, borderWidth: 1, borderRadius: 11, paddingHorizontal: 11, paddingVertical: 8 },
  pickDropdownLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  pickDropdownValue: { fontSize: 15, fontWeight: '900', marginTop: 2 },
  clockBanner: { marginTop: 11, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between' },
  autoPickButton: { marginTop: 8, minHeight: 42, borderWidth: 1, borderRadius: 11, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  filterArea: { paddingTop: 10, paddingBottom: 8 },
  filterLabel: { paddingHorizontal: 16, marginBottom: 7, fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  filters: { paddingHorizontal: 16, gap: 9 },
  filter: { minWidth: 52, minHeight: 40, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  filterText: { fontSize: 14, fontWeight: '900', letterSpacing: 0.3 },
  list: { paddingHorizontal: 12, paddingBottom: 16 },
  row: { minHeight: 72, borderRadius: 14, marginBottom: 8, padding: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 9 },
  rank: { width: 38, textAlign: 'right', fontSize: 12, fontWeight: '800', fontVariant: ['tabular-nums'] },
  starButton: { width: 30, height: 40, alignItems: 'center', justifyContent: 'center' },
  star: { fontSize: 27, lineHeight: 31 },
  playerInfo: { flex: 1, minWidth: 0 },
  name: { fontWeight: '800', fontSize: 15 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  badge: { color: 'white', fontWeight: '900', fontSize: 10, overflow: 'hidden', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3 },
  meta: { fontSize: 11, fontWeight: '600' },
  rowActions: { gap: 5 },
  selectionTag: { fontSize: 9, fontWeight: '900', textAlign: 'center' },
  action: { minWidth: 49, alignItems: 'center', paddingHorizontal: 8, paddingVertical: 7, borderRadius: 9 },
  summary: { marginHorizontal: 16, marginBottom: 8, padding: 14, borderRadius: 14, flexDirection: 'row', justifyContent: 'space-between' },
  sectionHeader: { paddingHorizontal: 5, paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between' },
  sectionTitle: { fontWeight: '900', fontSize: 17 },
  lineupHeader: { fontSize: 11, fontWeight: '900', letterSpacing: 0.9, marginTop: 8, marginBottom: 7, marginHorizontal: 4 },
  slotLabel: { width: 44, textAlign: 'center', fontSize: 11, fontWeight: '900' },
  emptySlot: { minHeight: 58, borderRadius: 14, marginBottom: 8, paddingHorizontal: 10, borderWidth: 1, borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', gap: 15 },
  emptySlotText: { fontSize: 14, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36 },
  emptyIcon: { fontSize: 50, marginBottom: 10 },
  emptyTitle: { fontWeight: '900', fontSize: 22 },
  emptyText: { textAlign: 'center', marginTop: 8, lineHeight: 20 },
  tabs: { minHeight: 61, flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth },
  tabButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  tabIcon: { fontSize: 17, fontWeight: '900', lineHeight: 20 },
  tabLabel: { fontSize: 10, fontWeight: '900', marginTop: 2 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  pickModal: { width: '100%', maxWidth: 360, borderRadius: 20, padding: 20 },
  pickModalTitle: { fontSize: 21, fontWeight: '900', textAlign: 'center' },
  pickModalSubtitle: { fontSize: 13, fontWeight: '700', textAlign: 'center', marginTop: 4, marginBottom: 18 },
  pickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  pickOption: { width: 64, height: 48, borderWidth: 1.5, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
