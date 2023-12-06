import * as fs from "fs";

const filePath = "./day3.txt";

const symbols = ["*","%","-","$","@","=","#","/","+","&"];

fs.readFile(filePath, "utf-8", (err, unstructuredData) => {
  if (err) {
    console.error(`Error reading file: ${err.message}`);
    return;
  }

  const lines = unstructuredData.split("\n");

  const dataX: string[][] = lines.map((line) => line.split(""));

  const data: string[][] = dataX[0].map((_, colIndex) =>
    dataX.map((row) => row[colIndex])
  );

  console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVV");
  
  let sum: number = 0;
  let lastFullNumber = 0;

  for (let posX = 0; posX < data.length; posX++) {
    for (let posY = 0; posY < data[posX].length; posY++) {
      const numberAtSpot = getFullNumberFromStartOrZero(data, posY, posX);
      if (numberAtSpot !== -1) {
        if (numberAtSpot !== 0) {
          lastFullNumber = numberAtSpot;
        }
        if (numberTouchesSymbol(data, posY, posX)) {
          sum += lastFullNumber;
          lastFullNumber = 0;
        }
      }
    }
  }
  console.log(sum);
});

function getFullNumberFromStartOrZero(data: string[][], posX: number, posY: number): number {
  const firstPosX = posX;
  const secondPosX = 1 + firstPosX;
  const thirdPosX = 1 + secondPosX;
  if (!isNumber(data[firstPosX][posY])) return -1; // Must be a number
  if (data[posX - 1] && isNumber(data[posX - 1][posY])) return 0; // Must be first number in sequence

  let num: string = data[firstPosX][posY]; // First number
  if (data[secondPosX] && isNumber(data[secondPosX][posY])) { 
    num = num + '' + data[secondPosX][posY]; // Potential second number
    if (data[thirdPosX] && isNumber(data[thirdPosX][posY])) {
      num = num + '' + data[thirdPosX][posY]; // Potential third number
    }
  }
  return parseInt(num); // Return
}

function numberTouchesSymbol (data: string[][], posX: number, posY: number): boolean {
  const relativePositions = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [-1, 1], [1, -1], [-1, -1]
  ];

  for (const [dx, dy] of relativePositions) {
    const newX = posX + dx;
    const newY = posY + dy;

    if (data[newX] && data[newX][newY] && isSymbol(data[newX][newY])) {
      return true;
    }
  }

  return false;
}

function isNumber(value?: string | number): boolean
{
   return ((value != null) &&
           (value !== '.') &&
           (value !== '-') &&
           (value !== '') &&
           !isNaN(parseInt(value.toString())));
}

function isSymbol(character: string): boolean {
  if (symbols.includes(character)) return true;
  return false;
}




// - any number adjacent to a symbol, even diagonally, is a "part number" and should be included in your sum.
//
