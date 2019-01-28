let fpslbl
let sliderE
let pCountLbl
let selectedSim
let withQuadTree

let averagefps = 0
let fpsOn = true
let lastTime = 0

let particles = []
let qtree
let particleCount = 100

function setup() {
    createCanvas(windowWidth, windowHeight).class('noselect')
    fpslbl = select('#framerate')
    pCountLbl = select('#particleCount')
    withQuadTree = select('#quadtreeValue')
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
    qtree = new QuadTree(boundary, 4)
    if (withQuadTree.checked()) {
        for (let p of particles) {
            let point = new Point(p.x, p.y, p)
            qtree.insert(point)
        }
    }

    for (let p of particles) {
        p.setHighlight(false)
        if (withQuadTree.checked()) {
            let range = new Circle(p.x, p.y, p.r * 2)
            let points = qtree.query(range)

            for (let point of points) {
                let other = point.userData
                if (p != other) {
                    p.intersects(other)
                }
            }
        } else {
            for (let other of particles) {
                if (p != other) {
                    let d = dist(p.x, p.y, other.x, other.y)
                    if (d < p.r + other.r) {
                        p.setHighlight(true)
                    }
                }
            }
        }
    }

    for (const p of particles) {
        p.update()
        p.show()
    }

    displayFPS()
}

function randomParticle() {}

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
