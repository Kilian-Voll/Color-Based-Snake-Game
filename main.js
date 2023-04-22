const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

const fieldSize = 10;
const gameEndSnakeSize = fieldSize * fieldSize;
const square_Size = canvas.width / fieldSize;
const gameField = [];


// Hashmap of body parts and their cords
const snake_parts = {};

// current head cords
let x = 0;
let y = 0;

// current number of body parts and end of snake
let partNumbers = 1;


const set_Snake_body_part = (partNumber, x, y) => {
    snake_parts[partNumber] = { x: x, y: y };
}

const add_Snake_Body_Part = (x, y) => {
    snake_parts[++partNumbers] = { x: x, y: y };
}

const update_Snake = (x, y) => {
    let adjustX = x;
    let adjustY = y;

    for (snake_part in snake_parts) {
        const current = snake_parts[snake_part];
        const currentX = current.x;
        const currentY = current.y;
        clear_Field(snake_parts[partNumbers].x, snake_parts[partNumbers].y);
        move_snake(adjustX, adjustY)
        set_Snake_body_part(snake_part, adjustX, adjustY);
        adjustX = currentX;
        adjustY = currentY;
    }

}

/**
 * creates the 2D array according the canvas.width/fieldSize
 */
const init_Game_Field = () => {
    for (let i = 0; i < fieldSize; ++i) {
        const row = [];
        for (let j = 0; j < fieldSize; ++j) {
            const x = i * square_Size;
            const y = j * square_Size;
            row.push({ x, y })
        }
        gameField.push(row);
    }
}

/**
 * Draws a fieldSize x fieldSize squares game field on the canvas
*/
const draw_Game_Field = () => {
    for (let i = 0; i < fieldSize; ++i) {
        for (let j = 0; j < fieldSize; ++j) {
            const square = gameField[i][j];
            ctx.moveTo(square.x, square.y);
            ctx.lineTo(square.x + square_Size, square.y);
            ctx.lineTo(square.x + square_Size, square.y + square_Size);
            ctx.lineTo(square.x, square.y + square_Size);
            ctx.stroke();
        }
    }
};

/**
 * 
 * @param {*} x cord on the game field
 * @param {*} y cord on the game field
 * @returns true should the coordinates be inside the game field, false otherwise
 */
const check_Boundaries = (x, y) => {
    if (x < fieldSize && y < fieldSize && x > -1 && y > -1) return true;
    return false
}

/**
 * Generates a Fruit(red circle) somewhere on a white field on the game field
 */
const generate_Fruit = () => {
    const randomeX = Math.floor(Math.random() * fieldSize);
    const randomeY = Math.floor(Math.random() * fieldSize);

    if (getFieldColor(randomeX, randomeY) === "white") {
        placeFruit(randomeX, randomeY);
    } else {
        generate_Fruit();
    }
}
/**
 * draws a red circle at the given cords
 * @param {*} x cord on the game field
 * @param {*} y cord on the game field
 */
const placeFruit = (x, y) => {
    const square = gameField[x][y];
    const centerX = square.x + square_Size / 2;
    const centerY = square.y + square_Size / 2;
    const radius = square_Size / 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "red";
    ctx.fill();
    fruit_exists = true
}
/**
 * 
 * @param {*} x cord on the game field
 * @param {*} y cord on the game field
 */
const move_snake = (x, y) => {
    const square = gameField[x][y];
    ctx.fillStyle = "green";
    ctx.fillRect(square.x + 3, square.y + 3, square_Size - 6, square_Size - 6);
}

/**
 * 
 * @param {*} x cord on the game field
 * @param {*} y cord on the game field
 */
const clear_Field = (x, y) => {
    const square = gameField[x][y];
    ctx.fillStyle = "white";
    ctx.fillRect(square.x + 3, square.y + 3, square_Size - 6, square_Size - 6);
}

/**
 * 
 * @param {*} x cord on the game field
 * @param {*} y cord on the game field
 * @returns the color of the square center as String
 */
const getFieldColor = (x, y) => {
    // x cords of the square center 
    const centerX = gameField[x][0].x + square_Size / 2;
    // y cords of the square center 
    const centerY = gameField[0][y].y + square_Size / 2;
    // image data from the center of the block
    const imageData = ctx.getImageData(centerX, centerY, 1, 1).data;
    // color name as a string
    let color = "";

    // check the rbg colors for green
    if (imageData[1] === 128 && imageData[3] === 255) {
        color = "green";
    }
    //for red
    else if (imageData[0] === 255 && imageData[1] === 0 && imageData[2] === 0 && imageData[3] === 255) {
        color = "red";
    }
    //everything else is white
    else {
        color = "white";
    }
    return color;
}

/**
 * 
 * @param {*} x cord on the game field
 * @param {*} y cord on the game field
 */
const game_rules = (x, y) => {
    if (check_Boundaries(x, y)) {
        if (getFieldColor(x, y) === "green") {
            const square = gameField[x][y];
            ctx.fillStyle = "yellow";
            ctx.fillRect(square.x, square.y, square_Size - 1, square_Size - 1);
            document.removeEventListener("keydown", keyInputHandler);
            window.location.reload()
        } else {
            if (getFieldColor(x, y) === "red") {
                const last_Part_X = snake_parts[partNumbers].x;
                const last_Part_Y = snake_parts[partNumbers].y;
                if ((last_Part_X - 1) < 0) add_Snake_Body_Part(last_Part_X, last_Part_Y)
                else add_Snake_Body_Part(last_Part_X - 1, last_Part_Y);
                if (gameEndSnakeSize === partNumbers) {
                    alert("you won!!!");
                }
                generate_Fruit();

            }
            update_Snake(x, y);
        }
    } else {
        document.removeEventListener("keydown", keyInputHandler);
        window.location.reload()
    }
}

// init and draw game Field

window.addEventListener("load", () => {
    init_Game_Field();
    draw_Game_Field();
    move_snake(0, 0);
    set_Snake_body_part(1, 0, 0);
    generate_Fruit();
})


// Key Handling


/**
 * 
 * @param {*} event the key input event 
 */
function keyInputHandler(event) {
    let name = event.key;
    if (name === "w" || name === "ArrowUp") game_rules(x, --y)
    else if (name === "s" || name === "ArrowDown") game_rules(x, ++y);
    else if (name === "a" || name === "ArrowLeft") game_rules(--x, y);
    else if (name === "d" || name === "ArrowRight") game_rules(++x, y);
}

document.addEventListener("keydown", keyInputHandler, false);
