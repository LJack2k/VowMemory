const game = "vow";
var imagefolder = "";
var image = "";
var currentId = -1;
var maxChoices = 4;
var maxShuffles = maxChoices;
var score = 0;
var correct = 0;
var wrong = 0;
var showOptions = false;
var newRoundTimer;
var fadeOutTime;
var newSymbolTime;

var symbols = [
    {
        id: -1,
        name: "No symbols loaded",
        image: "",
    }
];

$(function(){
    LoadSymbols(game);
    UpdateScore();

    $("#choices").on("click", ".btn", function() {
        CheckAnwser($(this).data("id"));
        GetNewRound();
    });
    $("#btnNew").on("click", function() {
        score = 0;
        correct = 0;
        wrong = 0;
        GetNewRound();
    });
    $("#btnNext").on("click", function() {
        wrong++;
        GetNewRound();
    });

    $("#btnShowSymbols").show();
    $("#btnHideSymbols").hide();

    $("#btnShowSymbols").on("click", function() {
        $("#chkShowSymbols").prop('checked', true);
        $("#btnShowSymbols").hide();
        $("#btnHideSymbols").show();
    });
    $("#btnHideSymbols").on("click", function() {
        $("#chkShowSymbols").prop('checked', false);
        $("#btnShowSymbols").show();
        $("#btnHideSymbols").hide();
    });
    
    $("#btnOptions").on("click", function() {
        $(".game").hide();
        $(".options").show();
    });

    $("#btnClose").on("click", function() {
        $(".game").show();
        $(".options").hide();
    });

    $(".btnOptions").click();

    //$("#btnShowSymbols").click();
});

function CheckAnwser(choiceId) {
    if (newRoundTimer!= null) { clearTimeout(newRoundTimer); }

    if (choiceId == currentId) {
        correct++;
    }
    else {
        wrong++;
    }
    UpdateScore();
}

function UpdateScore() {
    $("#correct").html(correct);
    $("#wrong").html(wrong);
}

function LoadSymbols(game) {
    $.getJSON("games/" + game + "/game.json", function(data) {
        symbols = data.symbols;
        $(".header > h1").html(data.title);
        $(".header > h2").html(data.description);
        $("#spriteFile").attr("href", "games/" + game + "/game.css")
        FillCheatSheet();
        GetNewRound();
    });
}

function GetNewRound() {
    if (newRoundTimer!= null) { clearTimeout(newRoundTimer); }
    PickNewQuestion();
    PickNewChoices();
    UpdateScore();
}

function PickNewQuestion() {
    $("#question div.sprite").show();

    var newId = currentId;
    while(newId == currentId) {
        newId = randomInt(0, symbols.length -1);
    }
    currentId = newId;
    //currentId++;
    if (currentId > symbols.length-1) currentId = 0;
    
    $("#question div.sprite").attr("class", "sprite img-" + symbols[currentId].image);
    
    fadeOutTime = parseInt($("#fadeOutTime").val());
    newSymbolTime = parseInt($("#newSymbolTime").val());

    if (fadeOutTime > 0) {
        $("#question div.sprite").fadeOut(fadeOutTime, function() {
            if ($("#showChoicesAfter").is(":checked") && fadeOutTime > 0) {
                $("#choices > .btn-row").show();
            }
            if (newSymbolTime > 0) {
                newRoundTimer = setTimeout(EndOfRoundTimer, newSymbolTime);
            }
        });
    } else {
        $("#choices > .btn-row").show();
        if (newSymbolTime > 0) {
            newRoundTimer = setTimeout(EndOfRoundTimer, newSymbolTime);
        }        
    }
}

function EndOfRoundTimer() {
    CheckAnwser(-1); // Is always wrong;
    GetNewRound(); 
}

function PickNewChoices() {
    if ($("#showChoicesAfter").is(":checked") && fadeOutTime > 0) {
        $("#choices > .btn-row").hide();
    } else {
        $("#choices > .btn-row").show();
    }

    var choices = [currentId];
    while(choices.length < maxChoices) {
      var newId = randomInt(0, symbols.length -1);
    
      if (!choices.includes(newId)) {
        choices.push(newId);
      }
    }

    for (let i = 0; i < maxShuffles; i++) {
        shuffleArray(choices);
    }
    
    var list = $("#choices > .btn-row");
    list.html("");

    $.each(choices, function(index, choice) {
        if (symbols[choice] == undefined) return;
        var symbol = symbols[choice];
        list.append(`<div class="btn" data-id="${symbol.id}">${symbol.name}</div>`)
    });
}

function FillCheatSheet() {
    var list = $("#symbols > ul");
    list.html("");

    $.each(symbols, function(index, symbol) {
        list.append(`<li data-id="${symbol.id}"><img class="sprite img-${symbol.image}" /><span>${symbol.name}</span></li>`)
    });

}

function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function shuffleArray(arr) {
  arr.sort(() => Math.random() - 0.5);
}