if (document.location.pathname === "/about/") {
    // List of paths to each color smiley face
    const pathList = [
        '/assets/images/face-red.svg',
        '/assets/images/face-green.svg',
        '/assets/images/face-yellow.svg',
    ]
    // Get the smiley id
    const smileyFace = document.getElementById('face-avatar')

    smileyFace.onclick = function () {
        // Choose a random path
        randomColor = pathList[Math.floor(Math.random() * pathList.length)]
        // Set smiley
        smileyFace.src = randomColor
        smileyFace.style.transform = 'rotate(180deg) scaleX(-1)'
        setTimeout(() => smileyFace.style.transform = 'rotate(0deg) scaleX(1)', 3000)
    }
}