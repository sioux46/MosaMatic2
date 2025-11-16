function generateGrid(H, L) {
    let grid = Array.from({ length: H }, () => Array(L).fill(null));
    let pieceCounter = 0;

    for (let r = 0; r < H; r++) {
        for (let c = 0; c < L; c++) {
            if (!grid[r][c]) {
                const pieceType = Math.floor(Math.random() * 4) + 1;
                const pieceId = `p${pieceCounter++}_${pieceType}`;

                if (pieceType === 1) {
                    grid[r][c] = pieceId;
                } else if (pieceType === 2 && r + 1 < H && c + 1 < L &&
                           !grid[r + 1][c] && !grid[r][c + 1] && !grid[r + 1][c + 1]) {
                    grid[r][c] = grid[r + 1][c] = grid[r][c + 1] = grid[r + 1][c + 1] = pieceId;
                } else if (pieceType === 3 && c + 1 < L && !grid[r][c + 1]) {
                    grid[r][c] = grid[r][c + 1] = pieceId;
                } else if (pieceType === 4 && r + 1 < H && !grid[r + 1][c]) {
                    grid[r][c] = grid[r + 1][c] = pieceId;
                } else {
                    grid[r][c] = `p${pieceCounter++}_1`;
                }
            }
        }
    }
    return grid;
}

function renderGrid(grid, H, L) {
    const colors = {
        1: "#ff6666", // carré 1x1
        2: "#66b3ff", // carré 2x2
        3: "#ffcc66", // rectangle 1x2
        4: "#99ff99"  // rectangle 2x1
    };

    let html = `<div id="mosaic" style="grid-template-columns: repeat(${L}, 1fr);">`;

    grid.forEach((row, r) => {
        row.forEach((id, c) => {
            let type = id.split("_")[1];
            html += `<div class="tile" data-pieceid="${id}" style="background-color:${colors[type]};"></div>`;
        });
    });
    html += `</div>`;
    $("#mosaic-container").html(html);

    $(".tile").each(function (index) {
        let tile = this;
        let row = Math.floor(index / L);
        let col = index % L;
        let id = tile.dataset.pieceid;

        let borders = {};

        borders.top = row === 0 || grid[row - 1][col] !== id;
        borders.right = col === L - 1 || grid[row][col + 1] !== id;
        borders.bottom = row === H - 1 || grid[row + 1][col] !== id;
        borders.left = col === 0 || grid[row][col - 1] !== id;

        tile.style.borderTop = borders.top ? "2px solid #333" : "none";
        tile.style.borderRight = borders.right ? "2px solid #333" : "none";
        tile.style.borderBottom = borders.bottom ? "2px solid #333" : "none";
        tile.style.borderLeft = borders.left ? "2px solid #333" : "none";
    });
}

$("#randomBtn").click(() => {
    const H = +$("#height").val();
    const L = +$("#width").val();
    const grid = generateGrid(H, L);
    renderGrid(grid, H, L);
});

$("#clearBtn").click(() => {
    $("#mosaic-container").html("");
});

$("#exportBtn").click(() => {
    html2canvas(document.querySelector("#mosaic")).then(canvas => {
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = "mosaic.png";
        a.click();
    });
});
