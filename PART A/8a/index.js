// index.js

function vowelCount(str) {
    const vowels = { a: 0, e: 0, i: 0, o: 0, u: 0 };
    for (let char of str.toLowerCase()) {
        if (vowels.hasOwnProperty(char)) {
            vowels[char]++;
        }
    }
    console.log(`a, e, i, o, and u appear, respectively, ${vowels.a}, ${vowels.e}, ${vowels.i}, ${vowels.o}, ${vowels.u} times`);
}

// Example usage
vowelCount('Le Tour de France');
