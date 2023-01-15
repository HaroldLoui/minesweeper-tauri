const { invoke } = window.__TAURI__.tauri;

invoke("get_rank_list").then((res) => {
    var rankArray = initRankArray();
    var array = res.trim().split("\n");
    array.forEach((item) => {
        var ss = item.split(" ");
        switch (ss[0]) {
            case "1":
                rankArray[0].push({
                    level: 1,
                    player: ss[1],
                    time: parseInt(ss[2])
                });
                break;
            case "2":
                rankArray[1].push({
                    level: 2,
                    player: ss[1],
                    time: parseInt(ss[2])
                });
                break;
            case "3":
                rankArray[2].push({
                    level: 3,
                    player: ss[1],
                    time: parseInt(ss[2])
                });
                break;
            case "4":
                rankArray[3].push({
                    level: 4,
                    player: ss[1],
                    time: parseInt(ss[2])
                });
                break;
            case "5":
                rankArray[4].push({
                    level: 5,
                    player: ss[1],
                    time: parseInt(ss[2])
                });
                break;
            default: break;
        }
    });
    rankArray.map((arr) => {
        arr.sort((o1, o2) => {
            return o1.time - o2.time;
        });
        return arr;
    }).forEach((arr, index) => {
        var dom = document.querySelector("#content" + (index + 1));
        dom.innerHTML = "";
        var div = document.createElement("div");
        div.classList.add("top");
        var ul = document.createElement("ul");
        arr.forEach((obj) => {
            var li = document.createElement("li");
            var playerDiv = document.createElement("div");
            playerDiv.innerHTML = obj.player;
            var timeDiv = document.createElement("div");
            timeDiv.innerHTML = obj.time;
            li.appendChild(playerDiv);
            li.appendChild(timeDiv);
            ul.appendChild(li);
        });
        div.appendChild(ul);
        dom.appendChild(div);
    })
});

function initRankArray() {
    var rankArray = [];
    for (var i = 0; i < 5; i++) {
        rankArray[i] = [];
    }
    return rankArray;
}

// document.querySelectorAll获取所有的a标签
var aArr = document.querySelectorAll("a");
// 循环遍历
for (var i = 0; i < aArr.length; i++) {
    // 给每个获取到的元素添加点击事件
    aArr[i].onclick = function () {
        // 获取当前激活的tab选项卡
        var active = document.querySelector(".active");
        // 移除之前的选项卡激活属性
        active.classList.remove("active");
        // 给当前点击的选项卡添加激活属性
        this.classList.add("active");
        // 获取当前的section标签id名字
        var name = this.getAttribute("data-cont");
        // 根据获取到的名字获取当前的内容卡
        var section = document.getElementById(name);
        // 获取所有class为cont的元素，并循环遍历，取消所有内容卡的样式
        var cont = document.querySelectorAll(".cont");
        for (var i = 0; i < cont.length; i++) {
            cont[i].style.display = "none";
        }
        // 激活当前内容卡的样式
        section.style.display = "block";
    };
}