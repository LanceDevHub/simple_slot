// 1. deposit money from bank-balance
// 2. choose bet per lines
// 3. choose lines
// 4. calculate bet amount
// 5. spin the wheels
// 6. determine win

//TODO
 //1.changing balance
 //2. what happens if user has no money left
 //3. play again loop and try to search for break restrictions

// 7. play again

// 8. improve console messages
// 9. try to change row and cols



// creating prompt method to collect user inputs
const prompt = require("prompt-sync")()

// constant values
let bankBalance = 1000
let gameBalance = 0
const rows = 3
const cols = 3

// Slotsymbols
const SYMBOLS_AMOUNT = {    // symbols per wheel
    A: 12,
    B: 8,
    C: 4,
    D: 2
}
const SYMBOL_MULTIPLIER = { // multiplier per line
    A: 1,
    B: 2,
    C: 4,
    D: 8
}




// 1. deposit function
const deposit = () => {
    while (true) {
        const amountStr = prompt("How much money do you want to deposit into your game-account?: $")
        const amount = parseFloat(amountStr)
        if (isNaN(amount)|| amount <= 0 || amount > bankBalance) {
            console.log("Invalid input. Please enter a amount that is greater than 0, A NUMBER and less or euqal to your bank balance.")
            console.log("")
        } else return amount;

    }
}

// 2. chose bet per lines
const bet_per_line = () => {
    while (true) {
        const betStr = prompt("Please enter the amount you wanna bet per line on: $")
        const betPerLine = parseFloat(betStr)
        if (betPerLine <= 0 || betPerLine > gameBalance || isNaN(betPerLine)) {
            console.log("Invalid input. Please enter a amount that is greater than 0, A NUMBER and less or euqal to your game balance.")
        } else return betPerLine
    }
}

// 3. choose lines
const choose_lines = () => {
    while (true) {
        const linesStr = prompt("How much lines do you wanna bet on?: ")
        const lines = parseInt(linesStr)
        if (lines <= 0 || lines > 3) {
            console.log("Invalid input. Please enter a amount that is greater than 0, A NUMBER and less or euqal to 3.")
        } else if (lines * betAmount > gameBalance) {
            console.log("You dont have enought game balance to place on " + lines + " lines. Try less lines to bet on.")
        } else return lines
    }
}

// 4. calculate total bet
const calculate_total_bet = (betPerLine, lines) => {
    return betPerLine * lines
}

// 5.1 spin the wheels
const spinWheels = () => {
    const slotWheels = [[], [], []]
    const allSymbols = []
    for (const [symbol, amount] of Object.entries(SYMBOLS_AMOUNT)) {
        for (let i = 0; i < amount; i++) {
            allSymbols.push(symbol)
        }
    }

    for (let i = 0; i < cols; i++) {
        const leftSymbols = [...allSymbols]
        for (let j = 0; j < rows; j++) {
            let posSymbol = Math.floor(Math.random() * leftSymbols.length)
            slotWheels[i] += leftSymbols[posSymbol]
            leftSymbols.splice(posSymbol, 1)
        }
    }
    return slotWheels
}

// 5.2 print the slot
const print_spin = (slotWheels) => {
    for (let i = 0; i < rows; i++) {
        let output = []
        for (let j = 0; j < cols; j++) {
            if (j >= cols - 1) {
                output += slotWheels[j][i]
            } else {
                output += slotWheels[j][i]
                output += " | "
            }
        }
        console.log(output)
    }
}

// 6. determine the potential win
const determine_win = (spinnedWheels, linesAmount, betPerLine) => {
    // initial 0 winnings
    let winnings = 0

    // transpose wheels to get started with comparing lines related to winnings
    const lines = [[], [], []]
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            lines[i].push(spinnedWheels[j][i])
        }
    }

    // determine which potential multiplier player gets for chosen lines
    const potentialMultiplierSymbols = []
    for (let i = 0; i < linesAmount; i++) {
        potentialMultiplierSymbols.push(lines[i][0])
    }

    // checking if all elements of current line are the same
    for (let i = 0; i < linesAmount; i++ ) {
        let allSame = true
        for (let j = 1; j < cols; j++) {
            if (lines[i][j] != lines[i][0]) {
                allSame = false
            }
        }
        // adding the reward to win related to win on line x
        if (allSame == true) {
            let currentMultiplierSmybol = potentialMultiplierSymbols[i]
            winnings += betPerLine * SYMBOL_MULTIPLIER[currentMultiplierSmybol]
        }
    }
    // output
    console.log("You won: $" + winnings + " in total")
    return winnings
}





// "game loop"
/*
gameBalance += deposit()
let betAmount = bet_per_line()
let betLines = choose_lines()
let totalBet = calculate_total_bet(betAmount, betLines)
console.log("Your total bet is: $" + totalBet)

 */

let spin = spinWheels()
console.log(spin)
print_spin(spin)
determine_win(spin, 2, 5)