function pluralize(noun, number) {
    const irregularNouns = {
        sheep: "sheep",
        goose: "geese",
        child: "children",
        person: "people",
        man: "men",
        woman: "women",
        mouse: "mice",
        foot: "feet",
        tooth: "teeth"
    };

    let plural;

    if (number === 1) {
        plural = noun;
    } else if (irregularNouns[noun]) {
        plural = irregularNouns[noun];
    } else if (noun.endsWith('y') && !/[aeiou]y$/i.test(noun)) {
        // baby -> babies
        plural = noun.slice(0, -1) + 'ies';
    } else if (noun.endsWith('s') || noun.endsWith('sh') || noun.endsWith('ch') || noun.endsWith('x') || noun.endsWith('z')) {
        // bus -> buses
        plural = noun + 'es';
    } else {
        plural = noun + 's';
    }

    return `${number} ${plural}`;
}

// Example usage:
console.log(pluralize("cat", 5));      // 5 cats
console.log(pluralize("dog", 1));      // 1 dog
console.log(pluralize("sheep", 3));    // 3 sheep
console.log(pluralize("goose", 2));    // 2 geese
console.log(pluralize("baby", 4));     // 4 babies
