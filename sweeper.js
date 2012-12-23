/*
 I wrote this piece at my last day on LMG G2 project, to cheer up my coworkers before christmas.
 I think it's dead simple, don't expect neither beautiful-code-relevations, nor comments.
 Consider it public domain.

 Cheers, 
 Tom.
 https://github.com/tomkmec/G2-Minesweeper
*/

function sweep() {
	if (typeof(window.score)=='undefined') window.score=[0,0];
    window.arr=[];
    var ts=document.getElementsByClassName('pretty'); 
    if (ts.length>0) {
        window.t=ts[0]; window.phase=0;
        t.oncontextmenu = function(e) {ms_clicked(e); return false;};
        ms_transform();
        var se = document.getElementById('score');
        if (!se) {
        	se = document.createElement('h2');
        	se.setAttribute('id','score');
        	t.parentNode.appendChild(se);
        }
        se.innerHTML=score[0]+":"+score[1];
    }
}
function ms_transform() {
    if (phase==0) {
        var h = t.getElementsByTagName('thead'); 
        if (h.length>0) { t.removeChild(h[0]); setTimeout(ms_transform,200); return; }
        var r = t.getElementsByTagName('tr'); 
        if (r.length>0) { t.firstElementChild.removeChild(r[r.length-1]); setTimeout(ms_transform,200); return; }
        phase = 1; setTimeout(ms_transform,200); return;
    } else if (phase==1) {
        var tb = t.firstElementChild;
        var r = t.getElementsByTagName('tr'); 
        if (r.length<10) {
            var tr = document.createElement('tr');
            arr.push([]);
            for (var i=0; i<10; i++) {
                arr[r.length].push(false);
                var td = document.createElement('td');
                td.setAttribute('style','width:30px; height:30px; text-align:center; padding:4px; font-weight:bold')
                td.onclick = function(e) {ms_clicked(e)};
                td.setAttribute('x',i); td.setAttribute('y',r.length);
                tr.appendChild(td);
            }
            tb.appendChild(tr);
            setTimeout(ms_transform,100); return;
        } else {
            count=0;
            while (count<10) {
                x = Math.floor(Math.random()*10); y = Math.floor(Math.random()*10);
                if (!arr[y][x]) { arr[y][x]=true; count++; }
            }
            phase=2;
        }
    }
}

function ms_count(x,y) {
    var c = 0;
    for (var i=-1; i<2; i++) for (var j=-1; j<2; j++) {
        var x2=x+i, y2=y+j;
        if (x2>=0 && x2<10 && y2>=0 && y2<10 && !(x==x2 && y==y2)) {
            if(arr[y2][x2]) c++;
        }
    } 
    return c;
}

function ms_process(x,y) {
    var el = t.getElementsByTagName('tr')[y].getElementsByTagName('td')[x];
    if (arr[y][x]) {
        el.innerHTML="&#x2620;"; ms_explode(x,y); score[1]++;
    } else if (el.innerHTML=='') {
        var cnt=ms_count(x,y);
        el.innerHTML=cnt;
        if (cnt==0) {
        	el.style.fontWeight="normal";
            for (var i=-1; i<2; i++) for (var j=-1; j<2; j++) {
                var x2=x+i, y2=y+j;
                if (x2>=0 && x2<10 && y2>=0 && y2<10 && !(x==x2 && y==y2)) {
                    ms_process(x2,y2);
                }
            } 
        }
    }
}

function ms_explode(x,y) {
	if (phase>3) {
		phase=2;
		sweep();
		return;
	} else {
		phase += 0.05;
		var time = phase-2;
		for (var i=0;i<10;i++) for (var j=0;j<10;j++) {
			var dist = Math.sqrt((x-i)*(x-i)+(y-j)*(y-j))/20;
			var state = 3*(time-dist);
			var el = t.getElementsByTagName('tr')[j].getElementsByTagName('td')[i];
			if (state>=0 && !(i==x && j==y)) {
				if (state<1) {
					el.style.backgroundColor='red';
					el.style.opacity=(1-state);
				} else {
					el.style.backgroundColor='inherit';
					el.style.opacity=1;
					el.innerHTML='';
				}
			} 
		}
		setTimeout(function(){ms_explode(x,y);},60);
	}
}

function ms_clicked(e) {
    if (phase!=2) return;
    var x = parseInt(e.target.getAttribute('x'));
    var y = parseInt(e.target.getAttribute('y'));
    var el = t.getElementsByTagName('tr')[y].getElementsByTagName('td')[x];
    if (e.button==2 && el.innerHTML=='') el.innerHTML='!';
    else if (e.button==2 && el.innerHTML=='!') el.innerHTML='?';
    else if (e.button==2 && el.innerHTML=='?') el.innerHTML='';
    else if (e.button==0 && el.innerHTML=='') ms_process(x,y);
    ms_checkWin();
}

function ms_checkWin() {
	var cnt = 0;
	for (var i=0;i<10;i++) for (var j=0;j<10;j++) {
		var val = t.getElementsByTagName('tr')[j].getElementsByTagName('td')[i].innerHTML;
		if (val=='') return;
		if (val=='!') cnt++;
	}
	if (cnt==10) {
		score[0]++; sweep();
	}
}
