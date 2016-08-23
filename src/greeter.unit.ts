import Greeter from './greeter';

var assert = require('power-assert');

describe('Sayings Greeter', () => {
    it('should greet', () => {
        var greeter = new Greeter('John');
        assert.equal(greeter.greet(), 'Hello, Jack');
    });
});
