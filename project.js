//TODO
 // 1.checking balance
 // 2. what happens if user has no money left
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
    A: 4,
    B: 8,
    C: 16,
    D: 30
}


// deposit function
const deposit = () => {
    while (true) {
        const amountStr = prompt("How much money do you want to deposit into your game-account?: $")
        const amount = parseFloat(amountStr)
        if (isNaN(amount)|| amount <= 0 || amount > bankBalance) {
            console.log("Invalid input. Please enter a amount that is greater than 0, A NUMBER and less or euqal to your bank balance.")
            console.log("")
        } else {
            gameBalance += amount
            bankBalance -= amount
            console.log("You added $" + amount + " to you game-balance.")
            console.log("You got $" + bankBalance + " left in your bankaccount")
            console.log("and $" + gameBalance + " as game-balance.")
            break
        }
    }
}

// choose bet per lines
const bet_per_line = () => {
    while (true) {
        const betStr = prompt("Please enter the amount you wanna bet per line on: $")
        const betPerLine = parseFloat(betStr)
        if (betPerLine <= 0 || betPerLine > gameBalance || isNaN(betPerLine)) {
            console.log("Invalid input. Please enter a amount that is greater than 0, A NUMBER and less or euqal to your game balance.")
        } else return betPerLine
    }
}

// choose lines
const choose_lines = (betAmount) => {
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

// calculate total bet
const calculate_total_bet = (betPerLine, lines) => {
    const totatlBet = betPerLine * lines
    console.log("Your total bet is $" + totatlBet + ". You have $" + (gameBalance - totatlBet) + " game-balance left. ")
    return totatlBet
}

// spin the wheels
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

// print the slot
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
    console.log("")
}

// determine the potential win
const determine_win = (spinnedWheels, linesAmount, betPerLine) => {
    // substract total bet of game-balance
    gameBalance -= linesAmount * betPerLine
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
    console.log("You won: $" + winnings + " in total.")
    gameBalance += winnings
    return winnings
}

// print status -> balance, lines, bet, total bet ...
const print_status = (all = false, lines = undefined, betPerLine = undefined) => { // true or false. when true print blance and bet, lines, total bet otherwise false just balance
    if (all == true) {
        console.log("--------------------------------------------")
        console.log("bank-ballance: $" + bankBalance + ".")
        console.log("game-ballance: $" + gameBalance + ".")
        console.log("--------------------------------------------")
        console.log("bet per line: $" + betPerLine + ". lines: " + lines + ". total bet: $" + (betPerLine * lines))
        console.log("--------------------------------------------")
    } else {
        console.log("--------------------------------------------")
        console.log("bank-ballance: $" + bankBalance + ".")
        console.log("game-ballance: $" + gameBalance + ".")
        console.log("--------------------------------------------")
    }
}

// check yes or no question related to deposit
const check_yes_no_deposit = (question, messageNo, execute, condition) => {
    while (true) {
        let answer = prompt(question + " (y/n)")
        if (answer == "y") {
            execute()
            console.clear()
            print_status()

        } else if (answer == "n" && gameBalance != condition) {
            console.clear()
            print_status()
            break
        } else if (answer == "n" && gameBalance == condition) {
            console.clear()
            print_status()
            console.log(messageNo)
        } else {
            console.clear()
            print_status()
            console.log("wrong symbol. please choose between y or n.")
        }
    }
    console.clear()
    print_status()
}

// check yes or no question related to respin mechanic
const check_for_respin = (question, messageNo, execute, condition) => {
    while (true) {
        let answer = prompt(question + " (y/n)")
        if (answer == "y") {
            execute()
            console.clear()
            print_status()

        } else if (answer == "n" && gameBalance != condition) {
            console.clear()
            print_status()
            break
        } else if (answer == "n" && gameBalance == condition) {
            console.clear()
            print_status()
            console.log(messageNo)
        } else {
            console.clear()
            print_status()
            console.log("wrong symbol. please choose between y or n.")
        }
    }
    console.clear()
    print_status()
}


// game loop
while (true) {
    console.clear()
    print_status()
    // adding game-balance
    check_yes_no_deposit("Do you wanna add some money to your game-balance?", "You have no game-balance left.", deposit , 0)
    // getting input for amout bet per spin
    let singleBet = bet_per_line()
    // getting input for amout of lines
    let lines = choose_lines(singleBet)
    // calculation total bet
    let totalBet = calculate_total_bet(singleBet, lines)

    // respin construct
    let respin = true
    while (respin = true) {
        // print current status
        console.clear()
        print_status(true, lines, singleBet)
        // let the user start the spin
        prompt("Start the spin by pressing enter!")
        console.clear()
        let currSlot = spinWheels()
        print_spin(currSlot)
        let win = determine_win(currSlot, lines, singleBet)
        print_status()
        // play again?
        if (gameBalance >= totalBet) {
            respinStr = prompt("do you wanna spin again with $" + totalBet + " as bet? (y/n)")
            if (respinStr == "y") {
                continue
            } else if (respinStr == "n") {
                break
            } else {
                prompt("wrong symbol. press enter to get to the main menu.")
                break
            }
        } else {
            console.log("your game-balance ran out of resources for current bet amout: $" + totalBet + ".")
            prompt("you get back to the deposit menu by pressing enter.")
            break
        }

    }


}
