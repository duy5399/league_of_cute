function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDouble(min, max, decimals = 2) {
    return (Math.random() * (max - min) + min).toFixed(decimals);
}

function magnitude(vector){
    return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]); // độ lớn vectorector
}

function sqrMagnitude(vector){
    return (vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]); // độ lớn vectorector
}

function normalized(vector){
    let num = magnitude(vector);
    if(num > 0.00001){
        return [vector[0]/num, vector[1]/num, vector[2]/num];
    }
    return [0,0,0];
}

function dot(lhs, rhs)
{
    return lhs[0] * rhs[0] + lhs[1] * rhs[1] + lhs[2] * rhs[2];
}

function cross(lhs, rhs)
{
    return [lhs[1] * rhs[2] - lhs[2] * rhs[1], lhs[2] * rhs[0] - lhs[0] * rhs[2], lhs[0] * rhs[1] - lhs[1] * rhs[0]];
}

function clamp(value, min, max)
{
    if (value < min)
    {
        value = min;
    }
    else if (value > max)
    {
        value = max;
    }
    return value;
}

function angle(from, to)
{
    let num = Math.sqrt(sqrMagnitude(from) * sqrMagnitude(to));
    if (num < 0.000000000000001)
    {
        return 0;
    }
    let num2 = clamp(dot(from, to) / num, -1, 1);
    return Math.acos(num2) * 57.29578;
}

function quaternionMul(rotation, point)
  {
      let vector  = [];
      let num = rotation[0] * 2;
      let num2 = rotation[1] * 2;
      let num3 = rotation[2] * 2;
      let num4 = rotation[0] * num;
      let num5 = rotation[1] * num2;
      let num6 = rotation[2] * num3;
      let num7 = rotation[0] * num2;
      let num8 = rotation[0] * num3;
      let num9 = rotation[1] * num3;
      let num10 = rotation[3] * num;
      let num11 = rotation[3] * num2;
      let num12 = rotation[3] * num3;
      vector[0] = (((1 - (num5 + num6)) * point[0]) + ((num7 - num12) * point[1])) + ((num8 + num11) * point[2]);
      vector[1] = (((num7 + num12) * point[0]) + ((1 - (num4 + num6)) * point[1])) + ((num9 - num10) * point[2]);
      vector[2] = (((num8 - num11) * point[0]) + ((num9 + num10) * point[1])) + ((1 - (num4 + num5)) * point[2]);
      return vector;
}

function distance2D(a, b){
    let num = a[0] - b[0];
    let num2 = a[1] - b[1];
    return Math.sqrt(num * num + num2 * num2);
}

function distanceTwoNode(nodeA, nodeB){
    let dx = nodeB[0] - nodeA[0];
    let dy = nodeB[1] - nodeA[1];
    let x = Math.abs(dx);
    let y = Math.abs(dy);
    if ((dy < 0) ^ ((nodeA[0] & 1) == 1))
        y = Math.max(0, y - (x / 2));
    else
        y = Math.max(0, y - (x + 1) / 2);
    return x + y;
}

function distance(a, b){
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
}

function moveTowards(current, target, maxDistanceDelta)
{
    let num = target[0] - current[0];
    let num2 = target[1] - current[1];
    let num3 = target[2]- current[2];
    let num4 = num * num + num2 * num2 + num3 * num3;
    if (num4 === 0 || (maxDistanceDelta >= 0 && num4 <= maxDistanceDelta * maxDistanceDelta))
    {
        return target;
    }
    let num5 = Math.sqrt(num4);
    return [current[0] + num / num5 * maxDistanceDelta, current[1] + num2 / num5 * maxDistanceDelta, current[2] + num3 / num5 * maxDistanceDelta];
}

function lookRotation(forward, upwards = [0,1,0])
{
    // the second argument, upwards, defaults to Vector3.up (0,1,0)
    //calc new ortagonal directions

    let newForward = normalized(forward);
    let newRight = normalized(cross(upwards, newForward));
    let newUp = normalized(cross(newForward, newRight));

    //fill matrix
    let mat = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    //mat.SetColumn(0, newRight);
    mat[0][0] = newRight[0];
    mat[1][0] = newRight[1];
    mat[2][0] = newRight[2];
    mat[3][0] = newRight[3];

    mat[0][1] = newUp[0];
    mat[1][1] = newUp[1];
    mat[2][1] = newUp[2];
    mat[3][1] = newUp[3];

    mat[0][2] = newForward[0];
    mat[1][2] = newForward[1];
    mat[2][2] = newForward[2];
    mat[3][2] = newForward[3];

    //calc quaternion
    let quat = [0, 0, 0, 1];
    quat[3] = Math.sqrt(1.0 + mat[0][0] + mat[1][1] + mat[2][2]) / 2.0;
    let q4 = quat[3] * 4;
    //quat[0] = (mat[2][1] - mat[1][2]) / q4;
    quat[1] = q4 === 0 ? 0 : (mat[0][2] - mat[2][0]) / q4;
    //quat[2] = (mat[1][0] - mat[0][1]) / q4;

    return quat;
}

//Kiểm tra va chạm 
function onTriggerEnter(obj1, obj2){
    //Kiểm tra trục X
    let box1Left = obj1.position[0] - obj1.boxColSize[0] / 2;
    let box1Right = obj1.position[0] + obj1.boxColSize[0] / 2;
    let box2Left = obj2.position[0] - obj2.boxColSize[0] / 2;
    let box2Right = obj2.position[0] + obj2.boxColSize[0] / 2;
    //Kiểm tra trục Y
    //Do center point tính từ dưới chân nhân vật nên height không chia 2
    let box1Top = obj1.position[1] + obj1.boxColSize[1];
    let box1Bottom = obj1.position[1];
    let box2Top = obj2.position[1] + obj2.boxColSize[1];
    let box2Bottom = obj2.position[1];
    //Kiểm tra trục Z
    let box1Front = obj1.position[2] + obj1.boxColSize[2] / 2;
    let box1Back = obj1.position[2] - obj1.boxColSize[2] / 2;
    let box2Front = obj2.position[2] + obj2.boxColSize[2] / 2;
    let box2Back = obj2.position[2] - obj2.boxColSize[2] / 2;

    //Nếu right của box1 > left của box2 và left của box1 <= right của box2 hoặc ngược lại
    const xCollision = (box1Right >= box2Left && box1Left <= box2Right) || (box2Right >= box1Left && box2Left <= box1Right);
    //Nếu Top của box1 > Bottom của box2 và Bottom của box1 <= Top của box2 hoặc ngược lại
    const yCollision = (box1Top >= box2Bottom && box1Bottom <= box2Top) || (box2Top >= box1Bottom && box2Bottom <= box1Top);  
    //Nếu front của box1 > back của box2 và back của box1 <= front của box2 hoặc ngược lại
    const zCollision = (box1Front >= box2Back && box1Back <= box2Front) || (box2Front >= box1Back && box2Back <= box1Front);

    return xCollision && yCollision && zCollision;
}

module.exports  = { randomInt, randomDouble, magnitude, normalized, dot, cross, angle, quaternionMul, distance2D, distanceTwoNode, distance, moveTowards, lookRotation, onTriggerEnter }