let fpslbl
let sliderE
let pCountLbl
let selectedSim
let checkQuadTree

let averagefps = 0
let fpsOn = true
let lastTime = 0

let particles = []
let qTree
let particleCount = 100

function setup() {
    createCanvas(windowWidth, windowHeight).class('noselect')
    fpslbl = select('#framerate')
    pCountLbl = select('#particleCount')
    checkQuadTree = select('#quadtreeValue')
    sliderE = select('#pSliderValue').value(particleCount)
    selectedSim = select('#simOptions').input(selectSim)
    pCountLbl.html(sliderE.value())

    if (!fpsOn) select('.displayfps').hide()
    setParticleCount()
    sliderE.input(setParticleCount)
}

function draw() {
    background(27)

    let boundary = new Rectangle(width / 2, height / 2, width, height)
    qTree = new QuadTree(boundary, 4)

    for (let p of particles) {
        let point = new Point(p.x, p.y, p)
        qTree.insert(point)

        p.setHighlight(false)
        if (checkQuadTree.checked()) {
            let range = new Circle(p.x, p.y, p.r * 2)
            let points = qTree.query(range)

            if (selectedSim.value() == 'randomParticle')
                for (let point of points) {
                    let other = point.userData
                    if (p !== other) {
                        p.intersects(other)
                    }
                }
            else {
                p.flock(points)
            }
        } else {
            if (selectedSim.value() == 'randomParticle')
                for (const other of particles) {
                    if (p !== other) {
                        p.intersects(other)
                    }
                }
            else if (selectedSim.value() == 'flocksim') {
                p.flock(particles)
            }
        }
    }

    for (const p of particles) {
        p.update()
        p.show()
    }

    displayFPS()
}

function selectSim() {
    setParticleCount()
}

function setParticleCount() {
    particleCount = sliderE.value()
    pCountLbl.html(particleCount)
    particles = []

    for (let i = 0; i < particleCount; i++) {
        if (selectedSim.value() == 'randomParticle')
            particles.push(new RandomParticle(random(width), random(height), 5))
        else if (selectedSim.value() == 'flocksim')
            particles.push(new QuadBoid())
    }
}

function displayFPS() {
    if (millis() - lastTime > 1000) {
        fpslbl.html(round(frameRate()))
        lastTime = millis()
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}
