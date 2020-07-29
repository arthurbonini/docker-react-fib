const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

var memo = {};
function fib(index) {
  if (memo[index]) return memo[index];
  if (index < 2) return 1;
  let val = fib(index - 1) + fib(index - 2);
  memo[index] = val;
  return val;
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');
