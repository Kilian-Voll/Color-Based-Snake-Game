const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

const square_Size = 40;
const gameField = [];


// Hashmap of body parts and their cords
const snake_parts = {};
// current snake cords
let x = 0;
let y = 0;
// current number of body parts
let partNumber = 0;


const set_Snake_body_part = (partNumber, x, y) => {
    snake_parts[partNumber] = { x: x, y: y };
}

const init_Game_Field = () => {
    for (let i = 0; i < 10; ++i) {
        const row = [];
        for (let j = 0; j < 10; ++j) {
            const x = i * square_Size;
            const y = j * square_Size;
            row.push({ x, y })
        }
        gameField.push(row);
    }
}

/**
 * 
 */
const draw_Game_Field = () => {
    for (let i = 0; i < 10; ++i) {
        for (let j = 0; j < 10; ++j) {
            const square = gameField[i][j];
            ctx.moveTo(square.x, square.y);
            ctx.lineTo(square.x + square_Size, square.y);
            ctx.lineTo(square.x + square_Size, square.y + square_Size);
            ctx.stroke();
        }
    }
};

const check_Boundaries = (x, y) => {
    if (x < 10 && y < 10 && x > -1 && y > -1) return true;
    return false
}

const check_Square = (x, y) => {
    canvas.get
}

const place_Square = (x, y) => {
    const square = gameField[x][y];
    ctx.fillStyle = "green";
    ctx.fillRect(square.x, square.y, square_Size - 1, square_Size - 1);
}

const getFieldColor = (x, y) => {
    const x_image = gameField[x][0].x;
    const y_image = gameField[0][y].y;
    const imageData = ctx.getImageData(x_image, y_image, 1, 1).data;
    let color = "";
    if (imageData[1] === 128 && imageData[3] === 255) {
        color = "green";
    }
    else {
        color = "white";
    }
    return color;
}

const try_Placing = (x, y) => {
    if (check_Boundaries(x, y)) {
        if (getFieldColor(x, y) === "green") {
            const square = gameField[x][y];
            ctx.fillStyle = "red";
            ctx.fillRect(square.x, square.y, square_Size - 1, square_Size - 1);
            document.removeEventListener("keydown", keyInputHandler);
            window.location.reload()
        } else {
            place_Square(x, y);
        }
    } else {
        alert("you lost! Try again");
        document.removeEventListener("keydown", keyInputHandler);
        window.location.reload()
    }
}

// init and draw game Field

window.addEventListener("load", () => {
    init_Game_Field();
    draw_Game_Field();
    place_Square(0, 0);
    set_Snake_body_part(partNumber, 0, 0);
})


// Key Handling

function keyInputHandler(event) {
    let name = event.key;
    if (name === "w" || name === "ArrowUp") try_Placing(x, --y)
    else if (name === "s" || name === "ArrowDown") try_Placing(x, ++y);
    else if (name === "a" || name === "ArrowLeft") try_Placing(--x, y);
    else if (name === "d" || name === "ArrowRight") try_Placing(++x, y);
}

document.addEventListener("keydown", keyInputHandler, false);
