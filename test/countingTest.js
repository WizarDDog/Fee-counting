const assert = require('chai').assert;
const app = require('../counting');

const input = { 
    "date": "2019-06-04", 
    "user_id": 1, 
    "user_type": "natural", 
    "type": "cash_out", 
    "operation": 
        { 
        "amount": 500.00, 
        "currency": "EUR" 
        } 
};

describe('App', () => {
    it('naturalCashOut should return type number', () => {
        assert.typeOf(app.naturalCashOut(input), 'number')
    });
    describe('Cash in', () => {
        it('cash in should return type number', () => {
            assert.typeOf(app.cashIn(input), 'number')
        });
        it('cash in should return number not above 5', () => {
            assert.isBelow(app.cashIn(input), 5)
        });
    })
    describe('Juridical Cash Out', () => {
        it('juridicalCashOut should return type number', () => {
            assert.typeOf(app.juridicalCashOut(input), 'number')
        });
        it('juridicalCashOut should return number above 0.49', () => {
            assert.isAbove(app.juridicalCashOut(input), 0.49)
        });
    })
    describe('Add new user', () => {
        it('addNewUser should type array', () => {
            assert.typeOf(app.addNewUser(input), 'array')
        });
        it('addNewUser should have array longer than 0', () => {
            assert.isAbove(app.addNewUser(input).length, 0)
        });
    })
})