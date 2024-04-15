import { Category } from "./_types";

export const categories: Category[] = [
  {
    category: 'SQUARE NUMBERS',
    items: ["1", "4", "9", "16"],
    level: 1,
  },
  {
    category: "DIVISIBLE BY 2 BUT NOT DIVISIBLE BY 3",
    items: ["2", "8", "10", "14"]
    ,
    level: 2,
  },
  {
    category: "DIVISIBLE BY 3",
    items: ["3", "6", "12", "15"],
    level: 3,
  },
  {
    category: "PRIME NUMBERS",
    items: ["5", "7", "11", "13"],
    level: 4,
  },
];

/* BASE EXAMPLE
export const categories: Category[] = [
  {
    category: 'ENCOURAGE, WITH "ON"',
    items: ["EGG", "GOAD", "SPUR", "URGE"],
    level: 1,
  },
  {
    category: "SPHERICAL FOODS",
    items: ["JAWBREAKER", "MEATBALL", "MOZZARELLA", "ORANGE"],
    level: 2,
  },
  {
    category: "GROCERY STORE AISLES",
    items: ["DAIRY", "FROZEN", "PRODUCE", "SNACK"],
    level: 3,
  },
  {
    category: "GO ___",
    items: ["BANANAS", "FIGURE", "FISH", "STEADY"],
    level: 4,
  },
];
*/
