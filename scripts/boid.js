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

    align(boid) {
        return this.average(boid, 'align')
    }

    cohesion(boid) {
        return this.average(boids, 'cohesion')
    }

    separation(boid) {
        return this.average(boids)
    }

    average(boid, type) {
        let perceptionRadius = this.r
        let steering = createVector()

        let d = dist(
            this.position.x,
            this.position.y,
            boid.position.x,
            boid.position.y
        )

        return steering
    }

    flock(boids) {
        this.acceleration.mult(0)
        this.acceleration.add(this.separation(boids))
        this.acceleration.add(this.align(boids))
        this.acceleration.add(this.cohesion(boids))
    }

    calculate(points, withQT) {
        if (withQT) {
            let tmp = []
            for (const p of points) {
                tmp.push(p.userData)
            }
            this.flock(tmp)
        } else {
            this.flock(points)
        }
    }
}
