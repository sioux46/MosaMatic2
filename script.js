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

/*
function renderGrid(grid, H, L) {
    const colors = {
        1: "#ff6666", // carré 1x1
        2: "#66b3ff", // carré 2x2
        3: "#ffcc66", // rectangle 1x2
        4: "#99ff99"  // rectangle 2x1
    };

    let html = `<div id="mosaic" style="grid-template-columns: repeat(${L}, 1fr);">`;
}
*/

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
      1: $("#color1").val(),
      2: $("#color2").val(),
      3: $("#color3").val(),
      4: $("#color4").val()
  };
  let borderPix;
  if ( H < 20 || L < 20 ) borderPix = "4px";
  else if ( H < 40 || L < 40 ) borderPix = "3px";
  else if ( H < 60 || L < 60 ) borderPix = "2px";
  else if ( H < 120 || L < 120 ) borderPix = "1px";
  else borderPix = "0px";

  // borderPix = "0px";


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

      // Applique les bordures si nécessaires
      tile.style.borderTop = borders.top ? borderPix + " solid #333" : "none";
      tile.style.borderRight = borders.right ?  borderPix + " solid #333" : "none";
      tile.style.borderBottom = borders.bottom ?  borderPix + " solid #333" : "none";
      tile.style.borderLeft = borders.left ?  borderPix + " solid #333" : "none";

      let radius = "0px";
      tile.style.borderTopLeftRadius = borders.top && borders.left ? radius : "0";
      tile.style.borderTopRightRadius = borders.top && borders.right ? radius : "0";
      tile.style.borderBottomLeftRadius = borders.bottom && borders.left ? radius : "0";
      tile.style.borderBottomRightRadius = borders.bottom && borders.right ? radius : "0";
  });
}

function changeColor(type, val) {
  let tiles = $(".tile");
  for ( let t of tiles ) {
    if ( $(t).attr("data-pieceid").lastIndexOf(type) != -1 )
                                    $(t).css("background-color", val);
  }
}

$(document).ready(function () {

  $(document).on("change", "#color1", function(e) {
    changeColor("_1", this.value);
  });
  $(document).on("change", "#color2", function(e) {
    changeColor("_2", this.value);
  });
  $(document).on("change", "#color3", function(e) {
    changeColor("_3", this.value);
  });
  $(document).on("change", "#color4", function(e) {
    changeColor("_4", this.value);
  });

  $("h1").click(() => {
    // window.location = "http://localhost:8888/MosaMatic/";
    if ( window.location.href.lastIndexOf("8888") == -1 )
        window.location = "https://www.siouxlog.fr/MosaMatic/";
  });

  $("#randomBtn").click(() => {
      const H = +$("#height").val();
      const L = +$("#width").val();
      const grid = generateGrid(H, L);
      renderGrid(grid, H, L);
  });

  $("#exportBtn").click(() => {
      html2canvas(document.querySelector("#mosaic")).then(canvas => {
          const a = document.createElement("a");
          a.href = canvas.toDataURL("image/png");
          a.download = "mosaic.png";
          a.click();
      });
  });
});
