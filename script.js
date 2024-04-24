let container = document.getElementById('card-container');
let popup = document.getElementById("popupContainer");

const imgs = [
    './images/1.jpg',
    './images/2.webp',
    './images/3.jpg',
    './images/4.jpg',
    './images/5.jpg',
    './images/6.jpg',
    './images/7.jpg',
    './images/8.webp',
    './images/9.jpg',
    './images/10.jpg',
    './images/11.jpg',
    './images/12.webp',
]
let tempImages = [];

let randomCardsArr = [];

const questionMarkImg = './images/question-mark-symbol.jpg';

let firstClickedCardId = null;

let disableClick = false;

let score = 0;

let startedGameType = null;

function fillTempImgsArray(cardCount, [...imgsCp]) {
    tempImages = [];
    for (let i = 0; i < cardCount / 2; i++) {
        let randImageIndex = Math.floor(Math.random() * imgsCp.length)
        tempImages.push(imgsCp[randImageIndex])
        tempImages.push(imgsCp[randImageIndex])
        imgsCp.splice(randImageIndex, 1);
    }

}

function removeImg(id, divElement) {
    const imageElement = document.getElementById(id);
    divElement.removeChild(imageElement);
}

function addNewImage(id, src, divElement) {
    const imgElement = document.createElement('img');
    imgElement.setAttribute("id", id);
    imgElement.setAttribute('src', src);
    divElement.appendChild(imgElement)
}

function updateImg(id, imgPath) {
    const imgElement = document.getElementById(id)
    imgElement.setAttribute('src', imgPath)
}

function game(cardCount) {
    scoreCounter(true)
    startedGameType = cardCount;
    randomCardsArr = [];
    firstClickedCardId = null;
    fillTempImgsArray(cardCount, imgs)
    container.setAttribute('class', 'container card-game' + cardCount)
    console.log(container)
    container.innerHTML = '';
    for (let i = 0; i < cardCount; i++) {
        const cardId = "card_" + i;
        const cardImgId = "img_card_" + i;

        let randImageIndex = Math.floor(Math.random() * tempImages.length);
        randomCardsArr.push({
            id: cardId,
            img: tempImages[randImageIndex]
        })
        tempImages.splice(randImageIndex, 1);


        let cardDiv = document.createElement('div');
        cardDiv.setAttribute("id", cardId);
        cardDiv.onclick = () => {
            showAndCompareCards(cardId, cardImgId)
        }

        addNewImage(cardImgId, questionMarkImg, cardDiv)
        container.appendChild(cardDiv)
    }

}

function showAndCompareCards(cardId, cardImgId) {
    if (firstClickedCardId === cardId) {
        console.log('You are clicking the same image, you dumb!!!')
        return;
    }
    if (firstClickedCardId === null) {
        //find question mark element and remove. 
        const cardDiv = document.getElementById(cardId);
        removeImg(cardImgId, cardDiv)
        //append associated image to card section.
        addNewImage(cardImgId, randomCardsArr.find((item) => item.id === cardId).img, cardDiv)
        flipCard(cardId);

        firstClickedCardId = cardId;
    } else {
        const firstImg = randomCardsArr.find((item) => item.id === firstClickedCardId);
        const secondImg = randomCardsArr.find((item) => item.id === cardId);
        cardDiv = document.getElementById(cardId);
        // removing question mark img
        removeImg(cardImgId, cardDiv)
        //show card img
        addNewImage(cardImgId, randomCardsArr.find((item) => item.id === cardId).img, cardDiv);
        flipCard(cardId);

        if (firstImg.img === secondImg.img) {
            scoreCounter();
            document.getElementById(firstClickedCardId).onclick = null;
            cardDiv.onclick = null;
        } else {
            disableClick = true;
            setTimeout(() => {
                //return questionmark logic for first image
                //remove image card from div
                const firstClickedDivElement = document.getElementById(firstImg.id);
                removeImg('img_' + firstImg.id, firstClickedDivElement)

                //add question mark image to div.
                addNewImage('img_' + firstImg.id, questionMarkImg, firstClickedDivElement);
                flipCard(firstImg.id);
                //return questionmark logic for second image
                //remove image card from div
                removeImg(cardImgId, cardDiv);
                //add question mark image to div.
                addNewImage(cardImgId, questionMarkImg, cardDiv);
                disableClick = false;
                flipCard(cardId);
            }, 2000)

        }
        firstClickedCardId = null;
    }
}

function flipCard(cardId) {
    const cardElement = document.getElementById(cardId);
    cardElement.classList.toggle('flipped');
}

function disableClickFnc(e) {
    if (disableClick) {
        e.stopPropagation();
        e.preventDefault();
    }
}

function resetBoard() {
    firstClickedCardId = null;
    cardDiv = null;
    disableClick = false;

}

function restart() {
    resetBoard();
    randomCardsArr = [];
    scoreCounter(true)
    container.innerHTML = '';
    document.getElementById('loader').style.display = "block";
    setTimeout(() => {
        document.getElementById('loader').style.display = "none";
        game(startedGameType);
    }, 1000)

}

function scoreCounter(reset = false) {
    if (reset === true) {
        score = 0;
    } else {
        score++;
    }
    document.querySelector(".score").textContent = score;
    if ((startedGameType === 12 && score === 6) || (startedGameType === 24 && score === 12)) {
        popup.style.display = 'block'
    }
}

function closePopup() {
    popup.style.display = 'none'
    game(startedGameType)
}

window.onclick = function (event) {
    if (event.target == popup) {
        popup.style.display = "none";
        game(startedGameType)
    }
}

document.addEventListener("click", disableClickFnc, true);
