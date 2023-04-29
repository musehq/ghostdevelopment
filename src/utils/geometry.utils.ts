import { Vector3 } from "three";


export function calculateDistance(center: Vector3, position: Vector3) {
    return Math.sqrt(
        Math.pow((center.x - position.x), 2) +
        Math.pow((center.y - position.y), 2)
    );
}