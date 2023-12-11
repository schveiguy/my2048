var board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

function reduce(b)
{
    let nb = [];
    for(let r = 0; r < 4; ++r)
    {
        let nr = b[r].filter(v => v > 0);
        for(let i = 0; i + 1 < nr.length; ++i)
        {
            if(nr[i] == nr[i + 1])
            {
                nr = [...nr.slice(0, i), ...nr.slice(i + 1)];
                nr[i] *= 2;
            }
        }
        while(nr.length < 4)
            nr.push(0);
        nb.push(nr);
    }
    return nb;
}

function transverse(b)
{
    let nb = [];
    for(let i = 0; i < 4; ++i)
    {
        let nr = [];
        for(let j = 0; j < 4; ++j)
        {
            nr.push(b[j][i]);
        }
        nb.push(nr);
    }
    return nb;
}

function reverse(b)
{
    let nb = [];
    for(let i = 0; i < 4; ++i)
    {
        nb.push(b[i].toReversed());
    }
    return nb;
}

function swipeLeft()
{
    board = reduce(board);
    finishSwipe();
}

function swipeUp()
{
    board = transverse(reduce(transverse(board)));
    finishSwipe();
}

function swipeRight()
{
    board = reverse(reduce(reverse(board)));
    finishSwipe();
}

function swipeDown()
{
    board = transverse(reverse(reduce(reverse(transverse(board)))));
    finishSwipe();
}

function addRandomValue()
{
    let idx = Math.floor(Math.random() * 16) + 1;
    while(true)
    {
        let oldidx = idx;
        for(let r = 0; r < 4; ++r)
        {
            for(let c = 0; c < 4; ++c)
            {
                if(board[r][c] == 0)
                {
                    if(--idx == 0)
                    {
                        board[r][c] = Math.random() > 0.80 ? 4 : 2;
                        return {r: r, c: c}
                    }
                }
            }
        }
        if(oldidx == idx)
            return {r: -1, c: -1}
    }
}

function checkForGameOver()
{
    let done = true;
    for(let i = 0; done && i < 4; ++i)
    {
        for(let j = 0; done && j < 4; ++j)
            if(board[i][j] == 0)
                done = false;
        for(let j = 0; done && j < 3; ++j)
        {
            if(board[i][j] == board[i][j+1])
                done = false;
            if(board[j][i] == board[j+1][i])
                done = false;
        }
    }
    if(done)
        setTimeout(function() {
            alert("Game over");
        }, 20);
}

function finishSwipe()
{
    let coord = addRandomValue();
    for(let r = 0; r < 4; ++r)
    {
        let rowDiv = document.getElementById(`row-${r}`);
        rowDiv.innerHTML = "";
        for(let c = 0; c < 4; ++c)
        {
            let newdiv = document.createElement('div');
            newdiv.classList.add('numcell');
            if(board[r][c] != 0)
            {
                if(coord.r == r && coord.c == c)
                {
                    newdiv.classList.add('newcell');
                    setTimeout(() => {newdiv.classList.remove('newcell')}, 0);
                }
                newdiv.classList.add(`nc-${board[r][c]}`);
                newdiv.innerText = board[r][c];
            }
            rowDiv.appendChild(newdiv);
        }
    }
    checkForGameOver();
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('body').addEventListener('keydown', ev => {
        if(ev.key == 'w')
            swipeUp();
        else if(ev.key == 'a')
            swipeLeft();
        else if(ev.key == 's')
            swipeDown();
        else if(ev.key == 'd')
            swipeRight();
    });
    finishSwipe();
});
