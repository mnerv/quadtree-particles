let fpslbl
let sliderE
let pCountLbl
let selectedSim
let withQuadTree
let sliderSettingContainer

let sliderName1
let sliderName2
let sliderName3
let sliderLabel1
let sliderLabel2
let sliderLabel3
let slider1
let slider2
let slider3

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
    // selectedSim.selected('flocksim')

    sliderSettingContainer = select('.particleSettingContainer')
    sliderLabel1 = select('#sliderLabel1')
    slider1 = select('#slider1').value(100)
    sliderName1 = select('#setting1').html('perception radius')
    sliderLabel2 = select('#sliderLabel2')
    slider2 = select('#slider2').value(100)
    sliderName2 = select('#setting2').html('max speed')
    sliderLabel3 = select('#sliderLabel3')
    slider3 = select('#slider3').value(100)
    sliderName3 = select('#setting3').html('max force')

    slider1.input(updateSliderValue)
    slider2.input(updateSliderValue)
    slider3.input(updateSliderValue)
    updateSliderValue()

    if (!fpsOn) select('.displayfps').hide()
    selectSim()

    sliderE.input(setParticleCount)

    // noLoop()
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
        if (withQuadTree.checked()) {
            let range = new Circle(p.x, p.y, p.r * 2)
            let points = qtree.query(range)

            // stroke(0, 0, 255)
            // noFill()
            // ellipse(range.x, range.y, p.r * 2)

            p.calculate(points, true)
        } else {
            p.calculate(particles, false)
        }
    }

    if (particles)
        for (const p of particles) {
            p.update()
            p.show()
        }

    displayFPS()
}

function selectSim() {
    setParticleCount()

    if (selectedSim.value() == 'randomParticle')
        sliderSettingContainer.addClass('hideThis')
    else sliderSettingContainer.removeClass('hideThis')
}

function updateSliderValue() {
    sliderLabel1.html(slider1.value() / 100)
    sliderLabel2.html(slider2.value() / 100)
    sliderLabel3.html(slider3.value() / 100)

    for (const p of particles) {
        p.r = p.basePerception * (slider1.value() / 100)
        p.maxSpeed = p.baseSpeed * (slider2.value() / 100)
        p.maxForce = p.baseForce * (slider1.value() / 100)
    }
}

function setParticleCount() {
    particleCount = sliderE.value()
    pCountLbl.html(particleCount)
    particles = []

    for (let i = 0; i < particleCount; i++) {
        if (selectedSim.value() == 'randomParticle') {
            particles.push(new RandomParticle(random(width), random(height), 5))
        } else if (selectedSim.value() == 'flocksim') {
            particles.push(new Boid())
        }
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
