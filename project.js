// 1. deposit money from bank-balance
// 2. choose bet per lines
// 3. choose lines
// 4. calculate bet amount

// 5. spin the wheels
// 6. determine win
// 7. play again



// creating prompt method to collect user inputs
const prompt = require("prompt-sync")()

//constant values
let bankBalance = 1000
let gameBalance = 0



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




// "game loop"
gameBalance += deposit()
let betAmount = bet_per_line()
let betLines = choose_lines()
let totalBet = calculate_total_bet(betAmount, betLines)
console.log("Your total bet is: $" + totalBet)