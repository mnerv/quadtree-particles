class RandomParticle {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.r = r
        this.highlight = false
    }

    update() {
        this.edges()
        this.x += random(-1, 1)
        this.y += random(-1, 1)
    }

    show() {
        noStroke()

        if (this.highlight) {
            fill(255)
        } else {
            fill(100)
        }

        ellipse(this.x, this.y, this.r * 2)
    }

    edges() {
        if (this.x > width) {
            this.x = 0
        } else if (this.x < 0) {
            this.x = width
        }

        if (this.y > height) {
            this.y = 0
        } else if (this.x < 0) {
            this.y = height
        }
    }

    intersects(other) {
        let d = dist(this.x, this.y, other.x, other.y)
        this.setHighlight(d < this.r + other.r)
    }

    setHighlight(value) {
        this.highlight = value
        // if (!value) this.particleRange = this.r
    }
}

class Boid {
    constructor() {
        this.position = createVector(random(width), random(height))
        this.velocity = p5.Vector.random2D()
        this.velocity.setMag(random(2, 4))
        this.acceleration = createVector()
        this.maxForce = 0.03
        this.maxSpeed = 4

        this.x = this.position.x
        this.y = this.position.y
        this.r = 50
    }

    update() {
        this.edges()
        this.position.add(this.velocity)
        this.velocity.add(this.acceleration)
        this.velocity.limit(this.maxSpeed)
    }

    show() {
        stroke(255)
        ellipse(this.position.x, this.position.y, 8)
    }

    edges() {
        if (this.position.x > width) {
            this.position.x = 0
        } else if (this.position.x < 0) {
            this.position.x = width
        }

        if (this.position.y > height) {
            this.position.y = 0
        } else if (this.position.x < 0) {
            this.position.y = height
        }
    }

    align(boids) {
        return this.average(boids, 'align')
    }

    cohesion(boids) {
        return this.average(boids, 'cohesion')
    }

    separation(boids) {
        return this.average(boids)
    }

    average(boids, type) {
        let perceptionRadius = this.r
        let steering = createVector()
        let total = 0

        for (let other of boids) {
            let d = dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            )
            if (other != this && d < perceptionRadius) {
                if (type == 'align') steering.add(other.velocity)
                else if (type == 'cohesion') {
                    steering.add(other.position) // cohesion
                } else {
                    let diff = p5.Vector.sub(this.position, other.position)
                    diff.div(d)
                    steering.add(diff)
                }
                total++
            }
        }
        if (total > 0) {
            steering.div(total)
            if (type == 'cohesion') steering.sub(this.position) // cohesion
            steering.setMag(this.maxSpeed)
            steering.sub(this.velocity)
            steering.limit(this.maxForce)
        }

        return steering
    }

    flock(boids) {
        this.acceleration.mult(0)
        this.acceleration.add(this.separation(boids))
        this.acceleration.add(this.align(boids))
        this.acceleration.add(this.cohesion(boids))
    }

    optimised(points, point) {
        let tmp = []
        for (const p of points) {
            if (point !== p) tmp.push(p.userData)
        }
        this.flock(tmp)
    }
}

class QuadBoid {
    constructor() {
        this.position = createVector(random(width), random(height))
        this.velocity = p5.Vector.random2D()
        this.velocity.setMag(random(2, 4))
        this.acceleration = createVector()
        this.maxForce = 0.03
        this.maxSpeed = 4

        this.x = this.position.x
        this.y = this.position.y
        this.r = 50
    }

    update() {
        this.edges()
        this.position.add(this.velocity)
        this.velocity.add(this.acceleration)
        this.velocity.limit(this.maxSpeed)
    }

    show() {
        stroke(255)
        ellipse(this.position.x, this.position.y, 8)
    }

    edges() {
        if (this.position.x > width) {
            this.position.x = 0
        } else if (this.position.x < 0) {
            this.position.x = width
        }

        if (this.position.y > height) {
            this.position.y = 0
        } else if (this.position.x < 0) {
            this.position.y = height
        }
    }

    align(boids) {
        return this.average(boids, 'align')
    }

    cohesion(boids) {
        return this.average(boids, 'cohesion')
    }

    separation(boids) {
        return this.average(boids)
    }

    average(boids, type) {
        let perceptionRadius = this.r
        let steering = createVector()
        let total = 0

        for (let other of boids) {
            let d = dist(
                this.position.x,
                this.position.y,
                other.userData.position.x,
                other.userData.position.y
            )
            if (other.userData != this && d < perceptionRadius) {
                if (type == 'align') steering.add(other.userData.velocity)
                else if (type == 'cohesion') {
                    steering.add(other.userData.position) // cohesion
                } else {
                    let diff = p5.Vector.sub(
                        this.position,
                        other.userData.position
                    )
                    diff.div(d)
                    steering.add(diff)
                }
                total++
            }
        }
        if (total > 0) {
            steering.div(total)
            if (type == 'cohesion') steering.sub(this.position) // cohesion
            steering.setMag(this.maxSpeed)
            steering.sub(this.velocity)
            steering.limit(this.maxForce)
        }

        return steering
    }

    flock(boids) {
        this.acceleration.mult(0)
        this.acceleration.add(this.separation(boids))
        this.acceleration.add(this.align(boids))
        this.acceleration.add(this.cohesion(boids))
    }
}

class Particle {
    constructor(x, y, r, m, vx, vy) {
        this.pos = createVector(x, y)
        this.r = r
        this.m = m
        this.vel = createVector(vx, vy)
        this.acc = createVector()
    }

    update() {
        this.vel.add(this.acc)
        this.pos.add(this.vel)
    }

    show() {
        noStroke()
        fill(255)
        ellipse(this.pos.x, this.pos.y, this.r * 2)
    }
}
