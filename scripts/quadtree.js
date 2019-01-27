class Point {
    constructor(x, y, userData) {
        this.x = x
        this.y = y
        this.userData = userData
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    contains(point) {
        return (
            point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h
        )
    }

    intersects(range) {
        return !(
            range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h
        )
    }
}

class Circle {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.r = r
        this.rSquared = this.r ** 2
    }

    contains(point) {
        let d = Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2)
        return d <= this.rSquared
    }

    intersects(range) {
        let xDist = Math.abs(range.x - this.x)
        let yDist = Math.abs(range.y - this.y)

        // radius of the circle
        let r = this.r

        let w = range.w
        let h = range.h

        let edges = Math.pow(xDist - w, 2) + Math.pow(yDist - h, 2)

        // no intersection
        if (xDist > r + w || yDist > r + h) return false

        // intersection within the circle
        if (xDist <= w || yDist <= h) return true

        // intersection on the edge of the circle
        return edges <= this.rSquared
    }
}

class QuadTree {
    constructor(boundary, n) {
        this.boundary = boundary
        this.capacity = n
        this.points = []
        this.divided = false
    }

    subdivide() {
        let x = this.boundary.x
        let y = this.boundary.y
        let w = this.boundary.w / 2
        let h = this.boundary.h / 2

        let ne = new Rectangle(x + w, y - h, w, h)
        let nw = new Rectangle(x - w, y - h, w, h)
        let se = new Rectangle(x + w, y + h, w, h)
        let sw = new Rectangle(x - w, y + h, w, h)

        this.northeast = new QuadTree(ne, this.capacity)
        this.northwest = new QuadTree(nw, this.capacity)
        this.southeast = new QuadTree(se, this.capacity)
        this.southwest = new QuadTree(sw, this.capacity)
        this.divided = true
    }

    insert(point) {
        if (!this.boundary.contains(point)) {
            return false
        }

        if (this.points.length < this.capacity) {
            this.points.push(point)
            return true
        } else {
            if (!this.divided) {
                this.subdivide()
            }

            if (
                this.northeast.insert(point) ||
                this.northwest.insert(point) ||
                this.southeast.insert(point) ||
                this.southwest.insert(point)
            ) {
                return true
            }
        }
    }

    query(range, found) {
        if (!found) found = []
        if (!range.intersects(this.boundary)) {
            // Empty array
            return found
        } else {
            for (const p of this.points) {
                if (range.contains(p)) {
                    found.push(p)
                    // stroke(66, 134, 244)
                    // noFill()
                    // ellipse(range.x, range.y, range.rSquared)
                }
            }
        }

        if (this.divided) {
            this.northwest.query(range, found)
            this.northeast.query(range, found)
            this.southwest.query(range, found)
            this.southeast.query(range, found)
        }

        return found
    }

    show() {
        stroke(255)
        noFill()
        rectMode(CENTER)
        rect(
            this.boundary.x,
            this.boundary.y,
            this.boundary.w * 2,
            this.boundary.h * 2
        )

        if (this.divided) {
            this.northwest.show()
            this.northeast.show()
            this.southwest.show()
            this.southeast.show()
        }

        // for (const p of this.points) {
        //     fill(66, 176, 244)
        //     ellipse(p.x, p.y, 4)
        // }
    }
}
