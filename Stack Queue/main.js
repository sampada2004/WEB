// main.js
import { Stack } from './stack.js';
import { Queue } from './queue.js';

const s = new Stack();
s.push(10);
s.push(20);
s.push(30);
console.log("Stack:", s.print());
s.pop();
console.log("Stack after pop:", s.print());

const q = new Queue();
q.enqueue(100);
q.enqueue(200);
q.enqueue(300);
console.log("Queue:", q.print());
q.dequeue();
console.log("Queue after dequeue:", q.print());
