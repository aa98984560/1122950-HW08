// ===================================
// 1. 初始變數與元素選取
// ===================================

const cells = Array.from(document.querySelectorAll('.cell'));
const btnReset = document.getElementById('reset');
const btnResetAll = document.getElementById('reset-all'); // 新增重置計分按鈕
const turnEl = document.getElementById('turn');
const stateEl = document.getElementById('state');

// 計分板元素
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');

// 勝利條件 (8種線條組合)
const WIN_LINES = [
    [0,1,2], [3,4,5], [6,7,8], // 橫排 (rows)
    [0,3,6], [1,4,7], [2,5,8], // 直排 (cols)
    [0,4,8], [2,4,6] // 斜線 (diags)
];

// 遊戲狀態變數
let board; // 儲存9格的內容 ('X', 'O', '')
let current; // 目前輪到誰下棋 ('X' or 'O')
let active; // 遊戲是否進行中 (true/false)

// 計分用變數
let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;


// ===================================
// 2. 核心函式
// ===================================

/**
 * 更新計分板數字
 */
function updateScoreboard(){
    scoreXEl.textContent = scoreX;
    scoreOEl.textContent = scoreO;
    scoreDrawEl.textContent = scoreDraw;
}

/**
 * 起始函式 (初始化遊戲)
 */
// 在 script.js 內找到 init 函式，並修改成這樣：
function init(){
    board = Array(9).fill(''); 
    current = 'X'; 
    active = true; 

    cells.forEach(c=>{
        c.textContent = ''; 
        c.className = 'cell'; 
        c.disabled = false; 
    });

    turnEl.textContent = current; 
    stateEl.textContent = ''; 
    
    // ✨ UX 改善：確保初始時狀態文字有顏色
    turnEl.classList.remove('o-turn');
    turnEl.classList.add('x-turn');
}

/**
 * 換手函式
 */
// 在 script.js 內找到 switchTurn 函式，並修改成這樣：
function switchTurn(){
    current = current === 'X' ? 'O' : 'X';
    turnEl.textContent = current;
    
    // ✨ UX 改善：動態切換狀態文字的顏色類別
    if (current === 'X') {
        turnEl.classList.remove('o-turn');
        turnEl.classList.add('x-turn');
    } else {
        turnEl.classList.remove('x-turn');
        turnEl.classList.add('o-turn');
    }
}

/**
 * 計算是否成一線結束遊戲的函式
 */
function evaluate(){
    // 檢查是否有勝利連線
    for(const line of WIN_LINES){
        const [a,b,c] = line;
        if(board[a] && board[a]===board[b] && board[a]===board[c]){
            return { finished:true, winner:board[a], line }; // 找到贏家
        }
    }
    // 檢查是否平手 (所有格子都有內容且沒有贏家)
    if(board.every(v=>v)) return { finished:true, winner:null };

    // 遊戲未結束
    return { finished:false };
}

/**
 * 遊戲結束,處理勝利或平手 (包含計分更新)
 * @param {object} param0 - {winner, line}
 */
function endGame({winner, line}){
    active = false; // 停止遊戲
    
    if (winner) {
        stateEl.textContent = `${winner}勝利!`;
        line.forEach(i=> cells[i].classList.add('win')); // 高亮勝利線條

        // 更新分數
        if(winner === 'X') scoreX++; else scoreO++;

    }else{
        stateEl.textContent = '平手';
        scoreDraw++; // 更新平手次數
    }

    updateScoreboard(); // 更新計分板顯示
    cells.forEach(c=> c.disabled = true); // 禁用所有格子
}

/**
 * 下手函式
 * @param {number} idx - 格子索引 (0-8)
 */
function place(idx){
    // 遊戲已結束或該格子已有棋子，則不動作
    if(!active || board[idx]) return;

    // 放置棋子
    board[idx] = current;
    const cell = cells[idx];
    cell.textContent = current;
    cell.classList.add(current.toLowerCase()); 

    // 檢查遊戲結果
    const result = evaluate();

    if (result.finished){
        endGame(result);
    }else{
        switchTurn(); // 換手
    }
}


// ===================================
// 3. 綁定事件與啟動
// ===================================

// 綁定事件: 點擊棋盤格
cells.forEach(cell=>{
    cell.addEventListener('click', ()=>{
        const idx = +cell.getAttribute('data-idx'); 
        place(idx);
    });
});

// 綁定事件: 重開一局 (保留分數)
btnReset.addEventListener('click', init);

// 綁定事件: 重置計分 (連同遊戲一起重置)
btnResetAll.addEventListener('click', ()=>{
    scoreX = scoreO = scoreDraw = 0;
    updateScoreboard();
    init();
});

// 網頁載入時啟動遊戲並更新計分板
init();
updateScoreboard();