import { Stack } from './stack.js';
import { Queue } from './queue.js';

const stack = new Stack();
const queue = new Queue();

function showMenu() {
  return prompt(`
Choose an operation:
1. Push to Stack
2. Pop from Stack
3. Peek Stack
4. Show Stack
5. Enqueue to Queue
6. Dequeue from Queue
7. Front of Queue
8. Show Queue
9. Exit
`);
}

function main() {
  let choice;
  do {
    choice = showMenu();
    switch (choice) {
      case '1':
        const pushVal = prompt("Enter value to push to stack:");
        stack.push(pushVal);
        alert(`Pushed ${pushVal} to stack.`);
        break;
      case '2':
        alert(`Popped from stack: ${stack.pop()}`);
        break;
      case '3':
        alert(`Top of stack: ${stack.peek()}`);
        break;
      case '4':
        alert(`Stack: ${stack.print()}`);
        break;
      case '5':
        const enqueueVal = prompt("Enter value to enqueue to queue:");
        queue.enqueue(enqueueVal);
        alert(`Enqueued ${enqueueVal} to queue.`);
        break;
      case '6':
        alert(`Dequeued from queue: ${queue.dequeue()}`);
        break;
      case '7':
        alert(`Front of queue: ${queue.front()}`);
        break;
      case '8':
        alert(`Queue: ${queue.print()}`);
        break;
      case '9':
        alert("Exiting...");
        break;
      default:
        alert("Invalid choice! Try again.");
    }
  } while (choice !== '9');
}

main();
