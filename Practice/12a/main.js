import {Stack} from "./stack.js";
import { Queue } from "./queue.js";

const s=new Stack();
s.push(10);
s.push(20);
s.push(30);

s.pop();

const q=new Queue();
q.enqueue(100);
q.enqueue(200);
q.dequeue();
