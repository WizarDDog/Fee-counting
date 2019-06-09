const data = require('./data.json');
let userAmount = [];
const cashInfee = 0.0003;
const cashOutFee = 0.003;
let cashWeekAmount = 0;
let cashOutExceededWeekLimit = false;

let newDate = new Date();
newDate.setDate(newDate.getDate() - 7);
const weekAgo = newDate.toLocaleString();

data.map(input => 
    calUserAmount(input)/
    calculateFee(input)
)

function calculateFee(input) {
    if (input.type === 'cash_in') {
        cashIn(input);
    } else {
        if (input.user_type === "natural") {
            naturalCashOut(input);
        } 
        else if (input.user_type === "juridical") {
            juridicalCashOut(input);
        }
    }
}

function calUserAmount(input) {
    if (userAmount.length > 0) {
        let alreadyExist = false;
        let index = 0;
        userAmount.find((user, i) => {
            if (user.userId === input.user_id) {
                index = i;
                return alreadyExist = true
            } else {
                return alreadyExist = false
            }
        })
        if (alreadyExist) {
            if (input.type === 'cash_out') {
                if (new Date(input.date) > new Date(weekAgo)) {
                    userAmount[index].cashOutWeek = userAmount[index].cashOutWeek + input.operation.amount;
                }
            }
        } else {
            addNewUser(input);
        }
    } else {
        addNewUser(input);
    }
}


function addNewUser(input) {
    if (input.type === 'cash_out') {
        if (new Date(input.date) > new Date(weekAgo)) {
            userAmount.push({
                userId: input.user_id,
                cashOutWeek: input.operation.amount
            })
            return userAmount;
        }
    } else {
        userAmount.push({
            userId: input.user_id,
            cashOutWeek: 0
        })
        return userAmount;
    }
}

function roundUpAndLog(num) {
    console.log(Math.ceil(num * 100) / 100 );
  }

function userWeekCashOutExceeded(input) {
    userAmount.find(user => {
        if(user.userId === input.user_id) {
            if (user.cashOutWeek > 1000) {
                cashWeekAmount = user.cashOutWeek;
                cashOutExceededWeekLimit = true;
                return true;
            } else {
                cashOutExceededWeekLimit = false;
                return false;
            }
        }
    })
}


function cashIn(input) {
    if (input.operation.amount * cashInfee > 5) {
        num = 5;
        console.log(num.toFixed(2));
        return num;
    } else {
        num = input.operation.amount * cashInfee;
        roundUpAndLog(num);
        return num;
    }
}

function naturalCashOut(input) {
    userWeekCashOutExceeded(input);
    let num = 0;
    if (cashOutExceededWeekLimit) {
        if (cashWeekAmount - input.operation.amount > 1000) {
            num = input.operation.amount * cashOutFee;
            roundUpAndLog(num);
            return num;
        } else {
            num = (cashWeekAmount - 1000) * cashOutFee;
            roundUpAndLog(num);
            return num;
        }
    } else if (!cashOutExceededWeekLimit && input.operation.amount > 1000) {
        num = (input.operation.amount + cashWeekAmount - 1000) * cashOutFee;
        roundUpAndLog(num);
        return num;
    } else {
        num = 0;
        console.log(num.toFixed(2));
        return num;
    }
}

function juridicalCashOut(input) {
    let num = 0;
    if (input.operation.amount * cashOutFee < 0.5 ) {
        num = 0.50;
        console.log(num.toFixed(2));
        return num
    } else {
        num = input.operation.amount * cashOutFee
        roundUpAndLog(num);
        return num
    }
}

module.exports = { 
    naturalCashOut: (input) => naturalCashOut(input),
    juridicalCashOut: (input) => juridicalCashOut(input),
    addNewUser: (input) => addNewUser(input, weekAgo),
    cashIn: (input) => cashIn(input)
};