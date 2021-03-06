var Timer = require('../../Utilities/Timer');
var RotateSync = require('../../Inputs/RotateSync');

function WorldSprite (options) {
	this.gl = options.gl;
	this.shaderProgram = options.shaderProgram;
	this.texture = options.texture;

	this.rotation = 0;
	this.matrix = mat4.create();
	this.position = [0, 0, -2];
	this.spriteCoord = options.spriteCoord;
	this.translateScale = 0.05;

	initBuffers.call(this);
}

WorldSprite.prototype.update = function update() {
}
	
WorldSprite.prototype.render = function render() {
	mat4.identity(this.matrix);
    mat4.translate(this.matrix, [this.position[0], this.position[1], this.position[2]]);

    /* SCALED TO WINDOW */
    this.gl.uniform1i(this.shaderProgram.drawState, 0);

    /* SET TEXTURE */
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.uniform1i(this.shaderProgram.samplerUniform, 0);

    /* BIND TEXTURE COORDINATES */
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.textureBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

    /* BIND POSITION COORDINATES */
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.positionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

    /* SET UNIFORMS */
    this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.matrix);
    this.gl.uniform2f(this.shaderProgram.spriteCoord, this.spriteCoord[0] * this.translateScale, this.spriteCoord[1] * this.translateScale);
    this.gl.uniform1f(this.shaderProgram.resolution, innerHeight / innerWidth);
    this.gl.uniform1f(this.shaderProgram.spriteRot, this.rotation);

    /* DRAW */
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.positionBuffer.numItems);
}

function initBuffers() {
	var aspectRatio = innerHeight / innerWidth;

	this.positionBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
	this.positionVertices = [
		-2.5,  2.5 * aspectRatio, 0.0,
		 2.5,  2.5 * aspectRatio, 0.0,
		-2.5, -2.5 * aspectRatio, 0.0,
		 2.5, -2.5 * aspectRatio, 0.0
	];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positionVertices), this.gl.STATIC_DRAW);
    this.positionBuffer.itemSize = 3;
    this.positionBuffer.numItems = 4;

    this.textureBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
	this.textureVertices = [
		0.0, 0.0,
		1.0, 0.0,
		0.0, 1.0 * aspectRatio,
		1.0, 1.0 * aspectRatio
	];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.textureVertices), this.gl.STATIC_DRAW);
    this.textureBuffer.itemSize = 2;
    this.textureBuffer.numItems = 4;
}

module.exports = WorldSprite;