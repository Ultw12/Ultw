let modal = document.getElementById("premiumModal");

var btns = document.querySelectorAll("#openModalBtn1, #openModalBtn2, #openModalBtn3");

var span = document.getElementsByClassName("close")[0];

const originalContent = {
    imgSrc: './assets/premium.png',
    h2Text: 'Upgrade To Premium',
    pText: 'Unlock all features and enjoy an enhanced experience with our premium membership.',
    btnHtml: '<button id="subscribeBtn">Subscribe Now</button>',
    spanHtml: '<span class="close">Keep using free plan</span>'
};

function imageExists(src, callback) {
    const img = new Image();
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
    img.src = src;
}

function setImageSrc(imgElement, primaryPath, fallbackPath) {
    imageExists(primaryPath, function(exists) {
        if (exists) {
            imgElement.src = primaryPath;
        } else {
            imgElement.src = fallbackPath;
        }
    });
}

function resetModalContent() {
    const premiumImage = document.getElementById('premiumImage');
    setImageSrc(premiumImage, './assets/premium.png', '../assets/premium.png');

    document.querySelector('.premium-modal-content h2').textContent = originalContent.h2Text;
    document.querySelector('.premium-modal-content p').textContent = originalContent.pText;

    if (!document.getElementById('subscribeBtn')) {
        const button = document.createElement('div');
        button.innerHTML = originalContent.btnHtml;
        document.querySelector('.premium-modal-content').appendChild(button.firstChild);

        document.getElementById('subscribeBtn').addEventListener('click', subscribeBtnClick);
    }

    if (!document.querySelector('.premium-modal-content .close')) {
        const spanContainer = document.createElement('div');
        spanContainer.innerHTML = originalContent.spanHtml;
        document.querySelector('.premium-modal-content').appendChild(spanContainer.firstChild);
    }
}

function subscribeBtnClick() {
    const clockImage = document.getElementById('premiumImage');
    setImageSrc(clockImage, './assets/clock.png', '../assets/clock.png');

    document.querySelector('.premium-modal-content h2').textContent = 'Coming soon';
    document.querySelector('.premium-modal-content p').textContent = "We are thrilled to announce that something exciting is on the horizon!";
    document.getElementById('subscribeBtn').remove();
}

btns.forEach(function (btn) {
    btn.onclick = function (event) {
        event.preventDefault();
        resetModalContent(); 
        modal.style.display = "flex";
        modal.style.opacity = 1;
    }
});

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.getElementById('subscribeBtn').addEventListener('click', subscribeBtnClick);